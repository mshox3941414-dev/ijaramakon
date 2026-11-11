import os
import tempfile
import unittest
from pathlib import Path

_temp = tempfile.TemporaryDirectory()
os.environ.pop("DATABASE_URL", None)
os.environ["DATA_DIR"] = _temp.name
import server

class LocationApiTests(unittest.TestCase):
    def setUp(self):
        self.client = server.app.test_client()
        self.base = dict(owner="test-owner", district="Urganch shahri",
                         mahalla="Test mahalla", type="Kvartira", rooms="3",
                         repair="Yangi remont", price="1200000",
                         phone="+998901234567", address="Test kocha")

    def create(self, **changes):
        return self.client.post("/api/listings", data={**self.base, **changes})

    def test_optional_location_preserves_legacy_behavior(self):
        response = self.create()
        self.assertEqual(response.status_code, 201, response.get_json())
        items = self.client.get("/api/listings?owner=test-owner").get_json()["listings"]
        item = next(x for x in items if x["id"] == response.get_json()["id"])
        self.assertIsNone(item["latitude"])
        self.assertIsNone(item["longitude"])

    def test_valid_location_roundtrip(self):
        response = self.create(latitude="41.55", longitude="60.62")
        self.assertEqual(response.status_code, 201, response.get_json())
        items = self.client.get("/api/listings?owner=test-owner").get_json()["listings"]
        item = next(x for x in items if x["id"] == response.get_json()["id"])
        self.assertAlmostEqual(item["latitude"], 41.55)
        self.assertAlmostEqual(item["longitude"], 60.62)

    def test_invalid_coordinates_rejected(self):
        for values in (dict(latitude="91", longitude="60"),
                       dict(latitude="41", longitude="181"),
                       dict(latitude="abc", longitude="60"),
                       dict(latitude="41", longitude=""),
                       dict(latitude="", longitude="60")):
            with self.subTest(values=values):
                response = self.create(**values)
                self.assertEqual(response.status_code, 400, response.get_json())

    def test_migration_is_idempotent(self):
        server.initialize()
        server.initialize()
        with server.connect() as db:
            columns = {row["name"] for row in db.execute("PRAGMA table_info(houses)")}
        self.assertTrue({"latitude", "longitude"}.issubset(columns))

class AdminApiTests(unittest.TestCase):
    def setUp(self):
        self.client = server.app.test_client()
        server.ADMIN_PASSWORD = "test-admin-secret"
        server.MODERATOR_PASSWORD = "test-moderator-secret"
        self.admin = {"X-Admin-Password": server.ADMIN_PASSWORD}
        self.moderator = {"X-Admin-Password": server.MODERATOR_PASSWORD}
        self.data = dict(owner="report-test", district="Urganch shahri",
                         mahalla="Test mahalla", type="Kvartira", rooms="2",
                         repair="Yaxshi", price="1000000",
                         phone="+998901234567", address="Test kocha")
        created = self.client.post("/api/listings", data=self.data)
        self.assertEqual(created.status_code, 201)
        self.listing_id = created.get_json()["id"]

    def test_admin_auth_and_roles(self):
        self.assertEqual(self.client.get("/api/admin/overview").status_code, 403)
        self.assertEqual(self.client.get("/api/admin/listings", headers=self.admin).get_json()["role"], "admin")
        self.assertEqual(self.client.get("/api/admin/listings", headers=self.moderator).get_json()["role"], "moderator")

    def test_moderator_cannot_edit_but_admin_can(self):
        url = "/api/admin/listings/" + str(self.listing_id)
        self.assertEqual(self.client.patch(url, headers=self.moderator, json={"price": 2000000}).status_code, 403)
        self.assertEqual(self.client.patch(url, headers=self.admin, json={"price": 2000000}).status_code, 200)
        overview = self.client.get("/api/admin/overview", headers=self.admin).get_json()
        self.assertTrue(any(a["action"] == "edit" and a["listing_id"] == self.listing_id for a in overview["audit"]))

    def test_report_and_resolve(self):
        url = "/api/admin/listings/" + str(self.listing_id) + "/approve"
        self.assertEqual(self.client.post(url, headers=self.moderator).status_code, 200)
        report = self.client.post("/api/listings/" + str(self.listing_id) + "/report",
                                  json={"reason": "E'lon ma'lumotlari noto'g'ri"})
        self.assertEqual(report.status_code, 201)
        reports = self.client.get("/api/admin/overview", headers=self.admin).get_json()["reports"]
        self.assertEqual(self.client.post("/api/admin/reports/" + str(reports[0]["id"]) + "/resolve",
                                          headers=self.moderator).status_code, 200)


if __name__ == "__main__":
    unittest.main()
