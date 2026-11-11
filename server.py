import os
import re
import hmac
import hashlib
import secrets
import json
import urllib.request
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import psycopg
from psycopg.rows import dict_row
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from flask import Flask, request, jsonify, send_from_directory, Response, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename

try:
    import telebot
    from telebot import types
except ImportError:
    telebot = None

# IJARAMAKON — SERVER.PY

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": os.environ.get(
            "FRONTEND_ORIGIN",
            "https://mshox3941414-dev.github.io"
        ).split(",")
    }
})

TOKEN = os.environ.get("BOT_TOKEN", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
MODERATOR_PASSWORD = os.environ.get("MODERATOR_PASSWORD", "")
ADMIN_ID = int(os.environ.get("ADMIN_ID", "0"))

DATA_DIR = Path(os.environ.get("DATA_DIR", "./data"))
UPLOAD_DIR = DATA_DIR / "uploads"
DB_PATH = DATA_DIR / "ijaramakon.db"
DATABASE_URL = os.environ.get("DATABASE_URL", "")

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_IMAGE_SIZE = 5 * 1024 * 1024
app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024

db_lock = threading.RLock()


class PgConnection:
    def __init__(self):
        self.db = psycopg.connect(DATABASE_URL, row_factory=dict_row)

    def __enter__(self):
        return self

    def __exit__(self, kind, value, tb):
        if kind:
            self.db.rollback()
        else:
            self.db.commit()
        self.db.close()

    def execute(self, sql, params=()):
        return self.db.execute(sql.replace("?", "%s"), params)

    def commit(self):
        self.db.commit()


def connect():
    if DATABASE_URL:
        return PgConnection()
    db = sqlite3.connect(str(DB_PATH), timeout=30)
    db.row_factory = sqlite3.Row
    return db


def initialize():
    with db_lock, connect() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS houses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                owner TEXT NOT NULL,
                district TEXT NOT NULL,
                mahalla TEXT NOT NULL,
                type TEXT NOT NULL,
                rooms TEXT NOT NULL,
                repair TEXT NOT NULL,
                price INTEGER NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL,
                description TEXT DEFAULT '',
                photo_url TEXT DEFAULT '',
                status TEXT DEFAULT 'pending',
                created_at TEXT NOT NULL
            )
        """.replace("id INTEGER PRIMARY KEY AUTOINCREMENT", "id BIGSERIAL PRIMARY KEY") if DATABASE_URL else """
            CREATE TABLE IF NOT EXISTS houses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                owner TEXT NOT NULL, district TEXT NOT NULL, mahalla TEXT NOT NULL,
                type TEXT NOT NULL, rooms TEXT NOT NULL, repair TEXT NOT NULL,
                price INTEGER NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL,
                description TEXT DEFAULT '', photo_url TEXT DEFAULT '',
                status TEXT DEFAULT 'pending', created_at TEXT NOT NULL
            )
        """)
        # Idempotent migration: no destructive changes to existing listings.
        if DATABASE_URL:
            db.execute("ALTER TABLE houses ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION")
            db.execute("ALTER TABLE houses ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION")
        else:
            existing = {row["name"] for row in db.execute("PRAGMA table_info(houses)").fetchall()}
            for column in ("latitude", "longitude"):
                if column not in existing:
                    db.execute(f"ALTER TABLE houses ADD COLUMN {column} REAL")
        for table, fields in (
            ("admin_audit", "actor TEXT NOT NULL, action TEXT NOT NULL, listing_id INTEGER, detail TEXT DEFAULT '', created_at TEXT NOT NULL"),
            ("listing_reports", "listing_id INTEGER NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL, status TEXT DEFAULT 'open'")
        ):
            primary = "BIGSERIAL PRIMARY KEY" if DATABASE_URL else "INTEGER PRIMARY KEY AUTOINCREMENT"
            db.execute(f"CREATE TABLE IF NOT EXISTS {table} (id {primary}, {fields})")
        db.execute("CREATE TABLE IF NOT EXISTS admin_security (key TEXT PRIMARY KEY, value TEXT NOT NULL)")
        db.commit()


initialize()


def rows(sql, params=()):
    with db_lock, connect() as db:
        return [
            dict(row)
            for row in db.execute(sql, params).fetchall()
        ]


def execute(sql, params=()):
    with db_lock, connect() as db:
        cur = db.execute(sql, params)
        db.commit()
        return cur.lastrowid


def admin_role():
    supplied = request.headers.get("X-Admin-Password", "")
    override = rows("SELECT value FROM admin_security WHERE key = ?", ("password_hash",))
    if override:
        if supplied and check_password_hash(override[0]["value"], supplied):
            return "admin"
    elif ADMIN_PASSWORD and hmac.compare_digest(supplied, ADMIN_PASSWORD):
        return "admin"
    if MODERATOR_PASSWORD and hmac.compare_digest(supplied, MODERATOR_PASSWORD):
        return "moderator"
    return None


def is_admin():
    return admin_role() is not None


def log_admin(db, action, listing_id=None, detail=""):
    db.execute("INSERT INTO admin_audit (actor, action, listing_id, detail, created_at) VALUES (?, ?, ?, ?, ?)",
               (admin_role() or "system", action, listing_id, detail, datetime.now(timezone.utc).isoformat()))


def error(message, status=400):
    return jsonify({"error": message}), status


def clean(value, limit=200):
    return str(value or "").strip()[:limit]


def public_listing(item, owner=None, admin=False):
    result = dict(item)

    if not admin and result["status"] != "approved":
        if result["owner"] != owner:
            return None

    if not admin and result["owner"] != owner:
        result.pop("owner", None)

    return result


@app.get("/")
def home():
    return send_from_directory(str(Path(__file__).resolve().parent), "index.html")


@app.get("/style.css")
@app.get("/app.js")
@app.get("/mahallalar.js")
def frontend_assets():
    return send_from_directory(str(Path(__file__).resolve().parent), request.path.lstrip("/"))


@app.get("/api")
def api_home():
    return jsonify({"service": "IjaraMakon API", "status": "working"})


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.get("/api/listings")
def list_houses():
    owner = clean(request.args.get("owner"), 100)

    all_items = rows(
        "SELECT * FROM houses ORDER BY id DESC"
    )

    visible = [
        public_listing(item, owner)
        for item in all_items
    ]

    return jsonify({
        "listings": [
            item for item in visible
            if item is not None
        ]
    })


def save_photo(file):
    if not file or not file.filename:
        return ""

    extension = Path(
        secure_filename(file.filename)
    ).suffix.lower()

    if extension not in (".jpg", ".jpeg", ".png", ".webp"):
        raise ValueError(
            "Faqat JPG, PNG yoki WEBP rasm yuklang"
        )

    content = file.read(MAX_IMAGE_SIZE + 1)

    if len(content) > MAX_IMAGE_SIZE:
        raise ValueError(
            "Rasm hajmi 5 MB dan oshmasin"
        )

    import io
    from PIL import Image

    try:
        img = Image.open(io.BytesIO(content))
        img.verify()

        img = Image.open(io.BytesIO(content))
        img.load()

        if img.format not in ("JPEG", "PNG", "WEBP"):
            raise ValueError("Rasm formati noto'g'ri")

    except Exception:
        raise ValueError("Yaroqli rasm yuklang")

    img.thumbnail((1600, 1600))

    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")

    if img.mode == "RGBA":
        background = Image.new("RGB", img.size, "white")
        background.paste(
            img,
            mask=img.getchannel("A")
        )
        img = background

    filename = uuid4().hex + ".jpg"

    img.save(
        UPLOAD_DIR / filename,
        "JPEG",
        quality=85
    )

    return "/uploads/" + filename


@app.get("/api/listings/<int:listing_id>/photo")
def listing_photo(listing_id):
    if not DATABASE_URL:
        abort(404)
    with psycopg.connect(DATABASE_URL) as db:
        with db.cursor() as cur:
            cur.execute(
                """SELECT i.image_data, i.content_type
                   FROM house_images i
                   JOIN houses h ON h.id = i.listing_id
                   WHERE h.id = %s AND h.status = 'approved'""",
                (listing_id,)
            )
            record = cur.fetchone()
    if not record:
        abort(404)
    return Response(bytes(record[0]), mimetype=record[1],
                    headers={"Cache-Control": "public, max-age=3600",
                             "X-Content-Type-Options": "nosniff"})


@app.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(
        str(UPLOAD_DIR),
        filename
    )


@app.post("/api/listings")
def create_house():
    form = request.form

    required = [
        "owner",
        "district",
        "mahalla",
        "type",
        "rooms",
        "repair",
        "price",
        "phone",
        "address"
    ]

    for field in required:
        if not clean(form.get(field)):
            return error(
                field + " maydoni to'ldirilmagan"
            )

    try:
        price = int(form.get("price", "0"))
    except ValueError:
        return error("Narx noto'g'ri")

    if price <= 0 or price > 100000000000:
        return error("Narx noto'g'ri")

    phone = clean(form.get("phone"), 30)

    if not re.fullmatch(
        r"\+?[0-9 ()-]{9,20}",
        phone
    ):
        return error("Telefon raqami noto'g'ri")

    photo_url = ""

    try:
        if "photo" in request.files:
            photo_url = save_photo(
                request.files["photo"]
            )
    except ValueError as exc:
        return error(str(exc))

    lat_raw, lon_raw = form.get("latitude", ""), form.get("longitude", "")
    latitude = longitude = None
    if lat_raw or lon_raw:
        try:
            latitude, longitude = float(lat_raw), float(lon_raw)
            if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                return error("Xaritadagi koordinatalar noto'g'ri")
        except (TypeError, ValueError):
            return error("Xaritadagi koordinatalar noto'g'ri")

    values = (
        clean(form.get("owner"), 100),
        clean(form.get("district"), 100),
        clean(form.get("mahalla"), 100),
        clean(form.get("type"), 100),
        clean(form.get("rooms"), 20),
        clean(form.get("repair"), 100),
        price,
        phone,
        clean(form.get("address"), 200),
        clean(form.get("description"), 2000),
        photo_url,
        datetime.now(timezone.utc).isoformat(),
        latitude, longitude
    )

    with db_lock, connect() as db:
        cur = db.execute("""
            INSERT INTO houses
            (owner, district, mahalla, type, rooms, repair, price,
             phone, address, description, photo_url, status, created_at, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?) RETURNING id
        """, values)
        db.commit()
        listing_id = cur.fetchone()["id"] if DATABASE_URL else cur.fetchone()[0]

    return jsonify({"ok": True, "id": listing_id, "status": "pending"}), 201


@app.get("/api/admin/listings")
def admin_listings():
    if not is_admin():
        return error("Admin ruxsati talab qilinadi", 403)
    return jsonify({"listings": rows("SELECT * FROM houses ORDER BY id DESC"), "role": admin_role()})


@app.post("/api/admin/listings/<int:listing_id>/<action>")
def admin_listing_action(listing_id, action):
    if not is_admin():
        return error("Admin ruxsati talab qilinadi", 403)

    status_by_action = {
        "approve": "approved",
        "reject": "rejected",
        "rented": "rented",
    }
    if action not in status_by_action:
        return error("Noma'lum amal", 400)

    with db_lock, connect() as db:
        cur = db.execute(
            "UPDATE houses SET status = ? WHERE id = ?",
            (status_by_action[action], listing_id),
        )
        if cur.rowcount == 0:
            return error("E'lon topilmadi", 404)
        log_admin(db, action, listing_id)
        db.commit()

    return jsonify({"ok": True, "id": listing_id, "status": status_by_action[action]})


@app.get("/api/admin/overview")
def admin_overview():
    if not is_admin():
        return error("Admin ruxsati talab qilinadi", 403)
    items = rows("SELECT owner, status, created_at FROM houses")
    counts = {status: sum(item["status"] == status for item in items)
              for status in ("pending", "approved", "rejected", "rented")}
    result = {"total": len(items), "users": len({item["owner"] for item in items if item["owner"]}),
              "statuses": counts, "reports": rows("SELECT * FROM listing_reports ORDER BY id DESC")}
    if admin_role() == "admin":
        result["audit"] = rows("SELECT * FROM admin_audit ORDER BY id DESC LIMIT 100")
    return jsonify(result)


@app.post("/api/listings/<int:listing_id>/report")
def report_listing(listing_id):
    payload = request.get_json(silent=True) or {}
    reason = clean(payload.get("reason"), 500)
    if len(reason) < 10:
        return error("Shikoyat sababini kamida 10 belgi bilan yozing")
    with db_lock, connect() as db:
        if not db.execute("SELECT id FROM houses WHERE id = ? AND status = 'approved'", (listing_id,)).fetchone():
            return error("E'lon topilmadi", 404)
        db.execute("INSERT INTO listing_reports (listing_id, reason, created_at) VALUES (?, ?, ?)",
                   (listing_id, reason, datetime.now(timezone.utc).isoformat()))
        db.commit()
    return jsonify({"ok": True}), 201


@app.post("/api/admin/reports/<int:report_id>/resolve")
def resolve_report(report_id):
    if not is_admin():
        return error("Admin ruxsati talab qilinadi", 403)
    with db_lock, connect() as db:
        cur = db.execute("UPDATE listing_reports SET status = 'resolved' WHERE id = ?", (report_id,))
        if cur.rowcount == 0:
            return error("Shikoyat topilmadi", 404)
        log_admin(db, "resolve_report", None, str(report_id))
        db.commit()
    return jsonify({"ok": True})


@app.patch("/api/admin/listings/<int:listing_id>")
def edit_listing_admin(listing_id):
    if admin_role() != "admin":
        return error("Faqat bosh admin tahrirlay oladi", 403)
    payload = request.get_json(silent=True) or {}
    allowed = {"district": 100, "mahalla": 100, "type": 100, "rooms": 20,
               "repair": 100, "phone": 20, "address": 200, "description": 2000}
    changes = {}
    for key, limit in allowed.items():
        if key in payload:
            value = clean(payload[key], limit)
            if not value and key != "description":
                return error(key + " bo'sh bo'lmasin")
            changes[key] = value
    if "price" in payload:
        try:
            price = int(payload["price"])
            if not 0 < price <= 100000000000:
                raise ValueError()
        except (ValueError, TypeError):
            return error("Narx noto'g'ri")
        changes["price"] = price
    if not changes:
        return error("O'zgartirish yo'q")
    with db_lock, connect() as db:
        sql = "UPDATE houses SET " + ", ".join(key + " = ?" for key in changes) + " WHERE id = ?"
        cur = db.execute(sql, (*changes.values(), listing_id))
        if cur.rowcount == 0:
            return error("E'lon topilmadi", 404)
        log_admin(db, "edit", listing_id, ", ".join(changes.keys()))
        db.commit()
    return jsonify({"ok": True})


def security_value(db, key):
    item = db.execute("SELECT value FROM admin_security WHERE key = ?", (key,)).fetchone()
    return item["value"] if item else None


def set_security(db, key, value):
    db.execute("DELETE FROM admin_security WHERE key = ?", (key,))
    db.execute("INSERT INTO admin_security (key, value) VALUES (?, ?)", (key, value))


@app.post("/api/admin/password-reset/request")
def request_admin_password_reset():
    # A generic response prevents account enumeration and configuration disclosure.
    response = jsonify({"ok": True, "message": "Agar tiklash sozlangan bo'lsa, kod admin Telegramiga yuboriladi."})
    if not TOKEN or not ADMIN_ID:
        return response
    now = int(time.time())
    with db_lock, connect() as db:
        last = int(security_value(db, "reset_requested_at") or 0)
        if now - last < 120:
            return response
        code = f"{secrets.randbelow(1000000):06d}"
        set_security(db, "reset_code_hash", hashlib.sha256(code.encode()).hexdigest())
        set_security(db, "reset_expires_at", str(now + 600))
        set_security(db, "reset_requested_at", str(now))
        set_security(db, "reset_attempts", "0")
        db.commit()
    try:
        payload = json.dumps({"chat_id": ADMIN_ID, "text": "IjaraMakon admin parolini tiklash kodi: " + code + "\\nKod 10 daqiqa amal qiladi. Uni hech kimga bermang."}).encode()
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TOKEN}/sendMessage", data=payload,
            headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=8) as sent:
            if not json.load(sent).get("ok"):
                app.logger.warning("Telegram password recovery message failed")
    except Exception:
        app.logger.exception("Admin recovery Telegram delivery failed")
    return response


@app.post("/api/admin/password-reset/confirm")
def confirm_admin_password_reset():
    payload = request.get_json(silent=True) or {}
    code = str(payload.get("code", "")).strip()
    new_password = str(payload.get("password", ""))
    if not re.fullmatch(r"[0-9]{6}", code) or len(new_password) < 12 or len(new_password) > 128:
        return error("Kod 6 raqam, yangi parol esa kamida 12 belgi bo'lishi kerak")
    with db_lock, connect() as db:
        now = int(time.time())
        stored = security_value(db, "reset_code_hash")
        expires = int(security_value(db, "reset_expires_at") or 0)
        attempts = int(security_value(db, "reset_attempts") or 0)
        if not stored or now > expires or attempts >= 5:
            return error("Kod eskirgan. Yangisini so'rang", 403)
        set_security(db, "reset_attempts", str(attempts + 1))
        if not hmac.compare_digest(stored, hashlib.sha256(code.encode()).hexdigest()):
            db.commit()
            return error("Kod noto'g'ri", 403)
        set_security(db, "password_hash", generate_password_hash(new_password))
        db.execute("DELETE FROM admin_security WHERE key IN ('reset_code_hash', 'reset_expires_at', 'reset_attempts')")
        db.commit()
    return jsonify({"ok": True, "message": "Yangi admin paroli saqlandi"})
