
import os
import re
import hmac
import sqlite3
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from flask import Flask, request, jsonify, send_from_directory
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
ADMIN_ID = int(os.environ.get("ADMIN_ID", "0"))

DATA_DIR = Path(os.environ.get("DATA_DIR", "./data"))
UPLOAD_DIR = DATA_DIR / "uploads"
DB_PATH = DATA_DIR / "ijaramakon.db"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_IMAGE_SIZE = 5 * 1024 * 1024
app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024

db_lock = threading.RLock()

def connect():
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
        """)
        db.commit()

initialize()

def rows(sql, params=()):
    with db_lock, connect() as db:
        return [dict(row) for row in db.execute(sql, params).fetchall()]

def execute(sql, params=()):
    with db_lock, connect() as db:
        cur = db.execute(sql, params)
        db.commit()
        return cur.lastrowid

def is_admin():
    supplied = request.headers.get("X-Admin-Password", "")
    return bool(
        ADMIN_PASSWORD and
        hmac.compare_digest(supplied, ADMIN_PASSWORD)
    )

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
    return jsonify({
        "service": "IjaraMakon API",
        "status": "working"
    })

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
        "listings": [item for item in visible if item is not None]
    })

def save_photo(file):
    if not file or not file.filename:
        return ""
    extension = Path(secure_filename(file.filename)).suffix.lower()
    if extension not in (".jpg", ".jpeg", ".png", ".webp"):
        raise ValueError("Faqat JPG, PNG yoki WEBP rasm yuklang")

    content = file.read(MAX_IMAGE_SIZE + 1)
    if len(content) > MAX_IMAGE_SIZE:
        raise ValueError("Rasm hajmi 5 MB dan oshmasin")

    # Fayl haqiqiy rasm ekanini tekshirish
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

    # Tasvirni qayta saqlash metama'lumotlarni ham olib tashlaydi
    img.thumbnail((1600, 1600))
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    if img.mode == "RGBA":
        background = Image.new("RGB", img.size, "white")
        background.paste(img, mask=img.getchannel("A"))
        img = background

    filename = uuid4().hex + ".jpg"
    img.save(UPLOAD_DIR / filename, "JPEG", quality=85)
    return "/uploads/" + filename

@app.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(str(UPLOAD_DIR), filename)

@app.post("/api/listings")
def create_house():
    form = request.form
    required = [
        "owner", "district", "mahalla", "type",
        "rooms", "repair", "price", "phone", "address"
    ]
    for field in required:
        if not clean(form.get(field)):
            return error(field + " maydoni to'ldirilmagan")

    try:
        price = int(form.get("price", "0"))
    except ValueError:
        return error("Narx noto'g'ri")
    if price <= 0 or price > 100000000000:
        return error("Narx noto'g'ri")

    phone = clean(form.get("phone"), 30)
    if not re.fullmatch(r"\+?[0-9 ()-]{9,20}", phone):
        return error("Telefon raqami noto'g'ri")

    photo_url = ""
    try:
        if "photo" in request.files:
            photo_url = save_photo(request.files["photo"])
    except ValueError as exc:
        return error(str(exc))

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
        datetime.now(timezone.utc).isoformat()
    )
    house_id = execute("""
        INSERT INTO houses
        (owner, district, mahalla, type, rooms, repair,
         price, phone, address, description, photo_url,
         created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, values)

    notify_admin(house_id)
    return jsonify({
        "ok": True,
        "id": house_id,
        "status": "pending"
    }), 201

@app.get("/api/admin/listings")
def admin_list():
    if not is_admin():
        return error("Admin paroli noto'g'ri", 401)
    return jsonify({
        "listings": rows("SELECT * FROM houses ORDER BY id DESC")
    })

def change_status(house_id, action):
    if action == "delete":
        execute("DELETE FROM houses WHERE id=?", (house_id,))
        return
    statuses = {
        "approve": "approved",
        "reject": "rejected",
        "rented": "rented"
    }
    if action not in statuses:
        raise ValueError("Noto'g'ri amal")
    execute(
        "UPDATE houses SET status=? WHERE id=?",
        (statuses[action], house_id)
    )

@app.post("/api/admin/listings/<int:house_id>/<action>")
def admin_change(house_id, action):
    if not is_admin():
        return error("Ruxsat yo'q", 401)
    if action not in ("approve", "reject", "rented", "delete"):
        return error("Noto'g'ri amal")
    existing = rows("SELECT id FROM houses WHERE id=?", (house_id,))
    if not existing:
        return error("E'lon topilmadi", 404)
    change_status(house_id, action)
    return jsonify({"ok": True})

# TELEGRAM BOT
bot = telebot.TeleBot(TOKEN) if TOKEN and telebot else None

def house_text(h):
    return (
        f"🏠 E'lon #{h['id']}\n"
        f"📍 {h['district']}, {h['mahalla']}\n"
        f"🏡 {h['type']}\n"
        f"🚪 {h['rooms']} xona\n"
        f"🔧 {h['repair']}\n"
        f"💰 {h['price']:,} so'm/oy\n"
        f"📌 {h['address']}\n"
        f"📞 {h['phone']}\n"
        f"📝 {h['description']}\n"
        f"Holati: {h['status']}"
    )

def admin_keyboard(house_id):
    kb = types.InlineKeyboardMarkup()
    kb.row(
        types.InlineKeyboardButton(
            "✅ Tasdiqlash", callback_data=f"approve_{house_id}"
        ),
        types.InlineKeyboardButton(
            "❌ Rad etish", callback_data=f"reject_{house_id}"
        )
    )
    kb.row(
        types.InlineKeyboardButton(
            "🏠 Ijaraga berildi", callback_data=f"rented_{house_id}"
        )
    )
    return kb

def notify_admin(house_id):
    if not bot or not ADMIN_ID:
        return
    house = rows("SELECT * FROM houses WHERE id=?", (house_id,))
    if not house:
        return
    h = house[0]
    try:
        if h["photo_url"]:
            with open(DATA_DIR / h["photo_url"].lstrip("/").replace(
                "uploads/", "uploads/", 1
            ), "rb") as photo:
                bot.send_photo(
                    ADMIN_ID, photo,
                    caption=house_text(h)[:1024],
                    reply_markup=admin_keyboard(house_id)
                )
        else:
            bot.send_message(
                ADMIN_ID, house_text(h),
                reply_markup=admin_keyboard(house_id)
            )
    except Exception as exc:
        app.logger.warning("Telegram xabari: %s", exc)

if bot:
    @bot.message_handler(commands=["start"])
    def start(message):
        bot.reply_to(
            message,
            "🏠 IjaraMakon botiga xush kelibsiz!\n"
            "E'lonlarni ko'rish: /houses\n"
            "Admin panel: /admin"
        )

    @bot.message_handler(commands=["houses"])
    def houses(message):
        items = rows("""
            SELECT * FROM houses
            WHERE status='approved'
            ORDER BY id DESC LIMIT 10
        """)
        if not items:
            bot.reply_to(message, "Hozircha e'lonlar mavjud emas.")
            return
        for item in items:
            bot.send_message(message.chat.id, house_text(item))

    @bot.message_handler(commands=["admin"])
    def admin(message):
        if message.from_user.id != ADMIN_ID:
            bot.reply_to(message, "⛔ Siz admin emassiz.")
            return
        items = rows("""
            SELECT * FROM houses
            WHERE status='pending'
            ORDER BY id DESC LIMIT 30
        """)
        if not items:
            bot.reply_to(message, "Kutilayotgan e'lonlar yo'q.")
            return
        for item in items:
            bot.send_message(
                message.chat.id,
                house_text(item),
                reply_markup=admin_keyboard(item["id"])
            )

    @bot.callback_query_handler(
        func=lambda call: bool(re.fullmatch(
            r"(approve|reject|rented)_\d+", call.data or ""
        ))
    )
    def callback(call):
        if call.from_user.id != ADMIN_ID:
            bot.answer_callback_query(
                call.id, "Siz admin emassiz", show_alert=True
            )
            return
        action, id_string = call.data.split("_")
        house_id = int(id_string)
        item = rows("SELECT id FROM houses WHERE id=?", (house_id,))
        if not item:
            bot.answer_callback_query(call.id, "E'lon topilmadi")
            return
        change_status(house_id, action)
        bot.answer_callback_query(call.id, "Amal bajarildi")
        try:
            bot.edit_message_reply_markup(
                call.message.chat.id,
                call.message.message_id,
                reply_markup=None
            )
        except Exception:
            pass

def run_bot():
    if not bot:
        return
    while True:
        try:
            bot.remove_webhook()
            bot.infinity_polling(
                timeout=25,
                long_polling_timeout=25,
                skip_pending=True
            )
        except Exception as exc:
            app.logger.error("Bot xatosi: %s", exc)
            time.sleep(10)

if bot and os.environ.get("RUN_BOT", "false").lower() == "true":
    threading.Thread(target=run_bot, daemon=True).start()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port)
