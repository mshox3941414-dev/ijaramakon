
import os
import json
import sqlite3
import secrets
import uuid
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)

BASE = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("DATA_DIR", str(BASE / "data")))
DATA_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "ijaramakon.db"

ADMIN_KEY = os.environ.get("ADMIN_KEY", "")
ALLOWED_ORIGINS = [
    x.strip()
    for x in os.environ.get(
        "ALLOWED_ORIGINS",
        "https://mshox3941414-dev.github.io"
    ).split(",")
    if x.strip()
]

CORS(
    app,
    resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
    allow_headers=["Content-Type", "X-Admin-Key"]
)

app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}


def connect():
    db = sqlite3.connect(DB_PATH, timeout=20)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    with connect() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS listings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id TEXT NOT NULL,
                district TEXT NOT NULL,
                mahalla TEXT NOT NULL,
                type TEXT NOT NULL,
                rooms TEXT NOT NULL,
                repair TEXT NOT NULL,
                price INTEGER NOT NULL,
                phone TEXT NOT NULL,
                description TEXT,
                photos TEXT NOT NULL DEFAULT '[]',
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)


init_db()


def is_admin():
    supplied = request.headers.get("X-Admin-Key", "")
    return bool(
        ADMIN_KEY
        and supplied
        and secrets.compare_digest(supplied, ADMIN_KEY)
    )


def require_admin():
    if not is_admin():
        return jsonify(error="Admin ruxsati yo'q"), 403
    return None


def serialize(row, public=False):
    item = dict(row)
    item["photos"] = json.loads(item["photos"] or "[]")

    if public:
        item.pop("client_id", None)

    return item


def save_image(file):
    if not file or not file.filename:
        return None

    filename = secure_filename(file.filename)
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Rasm formati noto'g'ri")

    content = file.read()

    if len(content) > 3 * 1024 * 1024:
        raise ValueError("Rasm 3 MB dan katta")

    signatures = {
        "jpg": content.startswith(b"\xff\xd8\xff"),
        "jpeg": content.startswith(b"\xff\xd8\xff"),
        "png": content.startswith(b"\x89PNG\r\n\x1a\n"),
        "webp": content[:4] == b"RIFF" and content[8:12] == b"WEBP"
    }

    if not signatures.get(ext, False):
        raise ValueError("Rasm fayli noto'g'ri")

    new_name = uuid.uuid4().hex + "." + ext
    path = UPLOAD_DIR / new_name
    path.write_bytes(content)

    return "/uploads/" + new_name


@app.get("/")
def home():
    return jsonify(
        name="IjaraMakon API",
        status="working"
    )


@app.get("/api/listings")
def get_listings():
    with connect() as db:
        rows = db.execute("""
            SELECT * FROM listings
            WHERE status = 'approved'
            ORDER BY id DESC
        """).fetchall()

    return jsonify(
        listings=[serialize(row, True) for row in rows]
    )


@app.post("/api/listings")
def add_listing():
    fields = [
        "client_id", "district", "mahalla",
        "type", "rooms", "repair",
        "price", "phone"
    ]

    values = {
        key: request.form.get(key, "").strip()
        for key in fields
    }

    if any(not value for value in values.values()):
        return jsonify(error="Barcha maydonlarni to'ldiring"), 400

    try:
        price = int(values["price"])
    except ValueError:
        return jsonify(error="Narx noto'g'ri"), 400

    if price <= 0:
        return jsonify(error="Narx musbat bo'lishi kerak"), 400

    phone = values["phone"]

    if not (
        len(phone) == 13
        and phone.startswith("+998")
        and phone[1:].isdigit()
    ):
        return jsonify(error="Telefon raqami noto'g'ri"), 400

    files = [
        f for f in request.files.getlist("photos")
        if f.filename
    ]

    if len(files) > 5:
        return jsonify(error="5 tagacha rasm yuklang"), 400

    photos = []

    try:
        for file in files:
            url = save_image(file)
            if url:
                photos.append(url)
    except ValueError as exc:
        for url in photos:
            (UPLOAD_DIR / url.split("/")[-1]).unlink(missing_ok=True)
        return jsonify(error=str(exc)), 400

    description = request.form.get("description", "").strip()[:1000]

    with connect() as db:
        cursor = db.execute("""
            INSERT INTO listings (
                client_id, district, mahalla,
                type, rooms, repair, price,
                phone, description, photos, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        """, (
            values["client_id"],
            values["district"],
            values["mahalla"],
            values["type"],
            values["rooms"],
            values["repair"],
            price,
            phone,
            description,
            json.dumps(photos)
        ))

        listing_id = cursor.lastrowid

    return jsonify(
        success=True,
        id=listing_id,
        status="pending"
    ), 201


@app.get("/uploads/<path:filename>")
def get_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.get("/api/admin/listings")
def admin_listings():
    denied = require_admin()
    if denied:
        return denied

    with connect() as db:
        rows = db.execute("""
            SELECT * FROM listings ORDER BY id DESC
        """).fetchall()

    return jsonify(
        listings=[serialize(row) for row in rows]
    )


@app.post("/api/admin/bulk")
def admin_bulk():
    denied = require_admin()
    if denied:
        return denied

    data = request.get_json(silent=True) or {}
    ids = data.get("ids", [])
    action = data.get("action", "")

    if not isinstance(ids, list) or len(ids) > 500:
        return jsonify(error="Tanlangan e'lonlar noto'g'ri"), 400

    try:
        ids = list(set(int(x) for x in ids if int(x) > 0))
    except (TypeError, ValueError):
        return jsonify(error="ID noto'g'ri"), 400

    if not ids:
        return jsonify(error="E'lon tanlanmagan"), 400

    statuses = {
        "approve": "approved",
        "reject": "rejected"
    }

    if action not in ("approve", "reject", "delete"):
        return jsonify(error="Amal noto'g'ri"), 400

    placeholders = ",".join("?" for _ in ids)

    with connect() as db:
        if action == "delete":
            rows = db.execute(
                f"SELECT photos FROM listings WHERE id IN ({placeholders})",
                ids
            ).fetchall()

            db.execute(
                f"DELETE FROM listings WHERE id IN ({placeholders})",
                ids
            )
        else:
            db.execute(
                f"UPDATE listings SET status = ? WHERE id IN ({placeholders})",
                [statuses[action], *ids]
            )
            rows = []

    if action == "delete":
        for row in rows:
            for url in json.loads(row["photos"] or "[]"):
                (UPLOAD_DIR / url.split("/")[-1]).unlink(missing_ok=True)

    return jsonify(success=True, count=len(ids))


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "10000"))
    )
