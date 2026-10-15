"use strict";

// IJARAMAKON — APP.JS
const API_URL = "https://ijaramakon.onrender.com";

const districts = [
  "Urganch shahri",
  "Xiva shahri",
  "Bog'ot tumani",
  "Gurlan tumani",
  "Hazorasp tumani",
  "Xonqa tumani",
  "Xiva tumani",
  "Qo'shko'pir tumani",
  "Shovot tumani",
  "Tuproqqal'a tumani",
  "Urganch tumani",
  "Yangiariq tumani",
  "Yangibozor tumani"
];

// Siz yuborgan ro'yxat: 13 ta hudud, 509 ta mahalla.
const mahallalar = {
  "Bog'ot tumani": [
    "Oltinqum", "Bo'ka", "Nurafshon", "Yangi qadam",
    "Mehnatguli", "G'alaba", "Ma'naviyat", "O'zgarish",
    "Nurli hayot", "To'pchi", "Yuksalish", "Paxtaobod",
    "Qipchoq", "Ashxabod", "Hunarmand", "Ko'na birlashuv",
    "Nayman", "Qalajiqqal'a", "Oq oltin", "Ustalar",
    "Yosh o'smir", "Namuna", "Sohibkor", "Madaniyat",
    "Tozabozor", "Oqtepa", "Bog'iston", "Nurli maskan",
    "Gulzor", "Hurriyat", "Gulshan", "Qorabog'",
    "Sahovat", "Ortiq Otajonov", "Dehqonobod",
    "Abu Rayxon Beruniy", "Uzumzor", "Qulonqorabog'",
    "Navro'z", "Bog'zor", "Navbahor", "Obod", "O'zbekiston"
  ],

  "Gurlan tumani": [
    "Dehqon", "Do'simbiy", "Bo'zqal'a", "Qangli",
    "Chinobod", "Esabiy", "Do'stlik", "Sovunchi",
    "Chakkalar", "O'yilma", "Shang'i", "Eshimjiron",
    "Birlashgan", "Besh uy", "Bog'ishamol", "Oqqum",
    "Dehqonobod", "Nurafshon", "Baynalmilal", "Saxtiyon",
    "Taxtako'pir", "Navbir-yop", "Paxtachi", "Moyli",
    "Marbugat", "Boldoqli", "Olg'a", "Yormish",
    "Olchin", "Ziyokor", "Vatanparvar", "Nurli yo'l",
    "Navbahor", "Mevazor", "Do'stlik bog'i", "Gulshan",
    "Ishonch", "Nurobod", "Jaloyir", "Obod",
    "Nukus", "Qatariq", "Marifat", "Bog'iston",
    "Yangi bog'", "Yangi asr", "Shodlik", "Fidokor"
  ],

  "Qo'shko'pir tumani": [
    "Ayronko'l", "Adolat", "Ittifoq", "O'rta qishloq",
    "Qadriyat", "Vaximchi", "Zarbdor", "Tagalak",
    "Paxtakor", "Dovud", "Arablar", "Bog'zor",
    "Xosiyon", "Kenagas", "Baratlar", "Ko'ktom",
    "Sherobod", "Shixmashhad", "Polvon", "Baxoriston",
    "Qorovul", "Oshok ka'la", "Xayrobod", "Amirqum",
    "Oltin voha", "Yoshlik", "Qoramon", "Ko'nazey",
    "Gulzor", "Durdona", "Burloq", "Shixobod",
    "Uyg'ur", "Mehnatobod", "Yovg'ir", "Xonobod",
    "Bekobod", "O'rtayop", "Ilgaldi", "Iqbol",
    "Taraqqiyot", "Madaniyat", "Chamanzor", "Yangilik",
    "Nezaxas", "Mesit", "Do'stlik"
  ],

  "Tuproqqal'a tumani": [
    "Saidlar", "Hazorasp", "Navbahor", "Shexlar",
    "Sarimoy", "Pastom", "Yoshlik", "Yo'ldosh Ohunboboev",
    "Muhabbat", "Sayapir", "Sharlauk", "Nukus maskani",
    "Tuproqqal'a maskani", "Saxovat", "Obod",
    "Yakka chiqir", "Nurobod", "Yangi zamin"
  ],

  "Urganch tumani": [
    "G'alaba", "Qo'ng'irot", "Xilol", "Munis Xorazmiy",
    "Adolat", "Qipchoq", "Mergan ovul", "Ko'xna ovul",
    "Jayxun", "Shermatlar", "Qiyot", "Rovot",
    "Kattabog'", "Oq yop", "Gulobod", "Killavut",
    "Qumravot", "Anjirchilar", "Hamid Olimjon",
    "Komiljon Otaniyazov", "Yuqoriovul", "Yuqorijirmiz",
    "Chakka ko'li", "Xojiboylar", "Oq oltin", "Miroblar",
    "Bog'dorchi", "Zargarlar", "Obod", "Beruniy",
    "Oq maktab", "Uyshun", "Ok ariklar", "Mevazor",
    "Arboblar", "Orzu", "Sholikorlar", "Qoramon",
    "Boqaylar", "Oyok bog'", "Arablar", "Bo'ston",
    "Shodlik", "Tandirchi", "Beshayvon", "Qaychili",
    "Shoxidonlar", "Bobodehqon", "Tadqiqotchilar",
    "Uchko'prik", "Turkmanlar", "Yoshlik", "Cho'lobod",
    "Yangiobod", "Yangi O'rtabog'", "O'rtado'rman"
  ],

  "Urganch shahri": [
    "Feruz", "Al-Xorazmiy", "Gulshan", "Yangi obod",
    "Mash'al", "Mustaqillik", "Yangi hayot", "Gulzor",
    "Bobur", "Avesto", "Shodlik", "Ziyokorlar",
    "Yuqori bog'", "Navruz", "Ma'rifat", "Obi hayot",
    "Kamolot", "Xamjihatlik", "Binokor", "Ashhabad",
    "Bo'ston", "Istiqlol", "Toza bog'", "Navbahor",
    "Olma bog'", "Jingovuz", "Nurli xayot",
    "Yangi O'zbekiston", "Saxovat", "Jambul",
    "Ko'hna qal'a", "J.Manguberdi", "Islomobod",
    "Olimpiya", "Baynalminalchi", "Umid",
    "Gulchilar", "Besh mergan", "Do'stlik", "Temir yo'lchi"
  ],

  "Hazorasp tumani": [
    "Muxomon", "Pichoqchi", "Kamolot", "Karvak",
    "Bo'ston", "Otaliq", "Amudaryo", "Paxlavon Maxmud",
    "Ovshar", "Yangibozor", "Shovot", "Oq maydon",
    "Qovunchi", "Temirchi maskani", "Kirtepa",
    "Sulaymon qal'asi", "G'.G'ulom", "Yangi xayot",
    "Istiqlol", "Aloqali ko'l", "Bogi eram", "Sanoat",
    "Gulzor", "Mustaqillik", "Zehnli", "Navro'z",
    "Yangiobod", "Bog'dor", "Ming otliqlar", "Juvarxos",
    "Ziyolilar", "Jaloladdin Manguberdi", "Yuqori Shovot",
    "Beshta", "Taraqqiyot", "Buyuk Simo", "Shoduxurram",
    "Ishchilar", "Al-Xorazmiy", "Munis Xorazmiy",
    "Buyuk ajdodlar", "Obod zamin", "Oybek nomli",
    "Barkamol avlod", "Bog'irog'lar", "Shukrona"
  ],

  "Xiva tumani": [
    "Chanashik", "Qora qum", "Juryon", "Chinobod",
    "Pishkanik", "Oq yop", "Gulshan", "Istiqlol",
    "Kushchi kattabog'", "Gandimyon", "Shomoxulum",
    "Parchanxos", "Pana Maxsim", "Al Xorazmiy",
    "Go'ja guzari", "Polosulton", "Bo'ston", "Soyot",
    "Varangzon", "Pirnaxos", "Avaz Dunak", "Kattibosh",
    "Dashyoq", "Arvik", "Shayx Najmiddin Kubro",
    "Sho'r ko'l", "Qumyop", "Sapcha", "G'ovuk",
    "Parisha", "Atajon to'ra", "Serchalli"
  ],

  "Xiva shahri": [
    "Sangar", "Lolazor", "Kalta minor", "Gulirayxon",
    "Angarik", "Gulshan-2", "Yangi hayot",
    "Qibla tozabog'", "Yangi Binokor", "Tozabog'",
    "Shixlar", "Guliston", "Qiyot", "Do'stlik",
    "Gazchi", "Qumyaska", "Yangi turmush",
    "Gilamchi", "Kaptarxona", "Ichon qa'la"
  ],

  "Xonqa tumani": [
    "Do'rmon", "Navro'z", "Katta kuch", "Istiqlol",
    "Znaxos", "Shirin", "Yosh kuch", "Qoramozi",
    "Paxtakor", "Madaniyat", "Ilg'or", "Obod",
    "Guliston", "Oydin hayot", "Turkiston", "Durgadik",
    "Toma", "Nurobod", "Olchin", "Vatanparvar",
    "Muqaddas", "Paxtagul", "Madaniy er", "Nurafshon",
    "Yangilanish", "Yangi turmush", "Barkamollik",
    "Porlok", "Ehtirom", "Jannatmakon", "Do'stlik",
    "Mangulik", "Fidoyilar", "Ahillik", "Tayanch",
    "Moshto'g'ay", "Pahlavonlar", "Gulg'uncha",
    "Mustaqillik", "G'ayrat", "Bunyodkor"
  ],

  "Shovot tumani": [
    "Katkal'a", "Komiljon ota", "Royat", "Monoq",
    "Chig'atoy", "Ipakchi", "Arbob", "Qangli",
    "Yangiyo'l", "Buyrachi", "Bo'ston", "Uzunko'l",
    "Eshon-qal'a", "Tuproqqal'a", "Archazor",
    "To'qmang'it", "Beshmargan", "Mevazor",
    "Arbek", "Madaniyat", "Idaliqal'a", "Qo'shko'pir",
    "Komiljon Otaniyozov", "Ogaxiy",
    "Oq-ko'l (Mahtumquli)", "Xitoy", "Navro'z",
    "Bog'bon", "Qiyot", "Ijtimoiyat", "Gulshan",
    "Paxtakor", "Maxtumquli", "Beshchiqir",
    "Guliston", "Zamondosh", "Yangi burloq",
    "Taraqqiyot", "Yangi O'zbekiston", "Shovot",
    "Qunduz", "Po'lat", "Oltinqal'a", "Istiqbol",
    "Qum-yop", "Bunyodkor", "Asavey", "Oq-oltin",
    "Do'stlik", "Yangiobod", "Turkiston", "Qirg'oq bo'yi"
  ],

  "Yangiariq tumani": [
    "Savgan", "Achchikkuyi", "Chakir", "Jaloil",
    "Sherobod", "Qo'riqtom", "Chiqirchi", "Gulbog'",
    "Shixbog'i", "Yangier", "Turkiston", "Arboblar",
    "Ulug'bek", "Boyot", "Angiariq", "Vakillar",
    "Ostona", "Gulshanda", "Qo'ng'irot", "Shirsholi",
    "Egrisolma", "Karmish", "Soburzon", "Kattabog'",
    "Tagan", "Po'rsang", "Do'stlik", "Uyg'ur",
    "Xo'jalar", "Yangiariq", "Ogoxiy", "Tuzloq",
    "Sardorlar", "Urganch", "Yangiobod",
    "Oqmachit", "Qo'shloq"
  ],

  "Yangibozor tumani": [
    "Xamid Olimjon", "Xalqobod", "Jayxun", "Istiqlol",
    "Navbaxor", "Oltinko'l", "Bog'olon", "Mang'itlar",
    "Ocha-qala", "Shoirlar", "Yuqori boshqir",
    "Shirinlar", "Iftixor", "Cho'bolonchi",
    "Ming Bog'olon", "Tozado'rman", "Bo'ston",
    "Yangi yop", "Xayvat", "Pahlavon Mahmud",
    "Qora-tepa", "Katli", "Qadriyat", "Guliston",
    "Navro'z", "Do'stlik", "Qiyot", "Barxayot", "Yangi obod"
  ]
};

const houseTypes = [
  "Yer uchastkali uy",
  "Ko'p qavatli uydagi kvartira",
  "Hovli uy"
];

const roomTypes = ["1", "2", "3", "4", "5", "6+"];

const repairTypes = [
  "Yevro remont",
  "O'rtacha ta'mir",
  "Oddiy ta'mir",
  "Ta'mirsiz"
];

const $ = id => document.getElementById(id);

const money = n =>
  Number(n || 0).toLocaleString("uz-UZ");

const escapeHTML = value => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

let toastTimer;
const memoryStore = new Map();

function readStorage(key, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return memoryStore.get(key) ?? fallback;
  }
}

function writeStorage(key, value) {
  memoryStore.set(key, value);
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    toast("Brauzer saqlashga ruxsat bermadi. Ma’lumot faqat shu sessiyada qoladi.");
    return false;
  }
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(readStorage(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function imageURL(value) {
  if (!value) return "";

  try {
    const url = new URL(value, API_URL + "/");
    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function phoneURL(value) {
  const phone = String(value || "").replace(/[ ()-]/g, "");
  return /^\+?\d{9,15}$/.test(phone) ? "tel:" + phone : "";
}

const clientId = (() => {
  let id = readStorage("im_client");

  if (!id) {
    id = globalThis.crypto?.randomUUID?.()
      || "im-" + Date.now().toString(36)
      + "-" + Math.random().toString(36).slice(2);

    writeStorage("im_client", id);
  }

  return id;
})();

let listings = [];
let adminPassword = "";

function toast(message) {
  const el = $("toast");
  if (!el) return;

  el.textContent = message;
  el.classList.remove("hidden");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => el.classList.add("hidden"),
    3500
  );
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch(API_URL + path, {
      ...options,
      headers,
      signal: controller.signal
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        "Server javobi noto‘g‘ri (HTTP " + response.status + ")"
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error || "Server xatosi: " + response.status
      );
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        "Server javobi kechikdi. Birozdan so‘ng qayta urinib ko‘ring."
      );
    }

    if (err instanceof TypeError) {
      throw new Error(
        "Serverga ulanib bo‘lmadi. Internet va Render holatini tekshiring."
      );
    }

    throw err;
  } finally {
    clearTimeout(timer);
  }
}
function populate(id, values, firstLabel) {
  const select = $(id);
  select.replaceChildren();

  if (firstLabel !== null) {
    select.add(new Option(firstLabel, ""));
  }

  values.forEach(value => select.add(new Option(value, value)));
}

function updateMahalla(prefix) {
  const district = $(prefix + "District").value;
  const values = mahallalar[district] || [];

  populate(
    prefix + "Mahalla",
    values,
    prefix === "search"
      ? "Barcha mahallalar"
      : "Mahallani tanlang"
  );

  $(prefix + "Mahalla").disabled = !district;
}

function setupFilters() {
  ["search", "add"].forEach(prefix => {
    populate(
      prefix + "District",
      districts,
      prefix === "search" ? "Barcha hududlar" : "Tumanni tanlang"
    );

    populate(
      prefix + "Type",
      houseTypes,
      prefix === "search" ? "Barcha uy turlari" : "Uy turini tanlang"
    );

    populate(
      prefix + "Rooms",
      roomTypes,
      prefix === "search" ? "Barcha xonalar" : "Xonalar soni"
    );

    populate(
      prefix + "Repair",
      repairTypes,
      prefix === "search" ? "Barcha ta'mir turlari" : "Ta'mir holati"
    );

    $(prefix + "District").addEventListener(
      "change",
      () => updateMahalla(prefix)
    );

    updateMahalla(prefix);
  });
}

function navigate(page) {
  document.querySelectorAll(".page").forEach(el => {
    el.classList.toggle("active", el.id === page);
  });

  document.querySelectorAll(".nav-btn").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "search") renderSearch();
  if (page === "saved") renderSaved();
  if (page === "profile") renderProfileListings();
  if (page === "admin" && adminPassword) loadAdmin();
}

function getSavedIds() {
  const ids = readJSON("im_saved", []);
  return Array.isArray(ids)
    ? [...new Set(ids.map(String))]
    : [];
}

function toggleSaved(id) {
  id = String(id);
  const ids = getSavedIds();

  const next = ids.includes(id)
    ? ids.filter(value => value !== id)
    : [...ids, id];

  writeStorage("im_saved", JSON.stringify(next));

  renderHome();
  renderSearch();
  renderSaved();

  toast(
    ids.includes(id)
      ? "Saqlanganlardan olindi"
      : "E'lon saqlandi"
  );
}

function statusLabel(status) {
  const labels = {
    pending: "⏳ Kutilmoqda",
    approved: "✅ Tasdiqlangan",
    rejected: "❌ Rad etilgan",
    rented: "🏠 Ijaraga berilgan"
  };

  return labels[status] || "Holati noma’lum";
}

function createCard(item, admin = false) {
  const card = document.createElement("article");
  card.className = "listing-card";

  const saved = getSavedIds().includes(String(item.id));

  const photo = imageURL(item.photo_url)
    ? `<img class="listing-photo"
         src="${escapeHTML(imageURL(item.photo_url))}"
         alt="Uy rasmi" loading="lazy">`
    : `<div class="listing-photo photo-placeholder">🏡</div>`;

  card.innerHTML = `
    ${photo}
    <div class="listing-body">
      <h3>${escapeHTML(item.type)}</h3>
      <p>
        📍 ${escapeHTML(item.district)},
        ${escapeHTML(item.mahalla)}
      </p>
      <p>
        🚪 ${escapeHTML(item.rooms)} xona ·
        ${escapeHTML(item.repair)}
      </p>
      <div class="listing-price">
        ${money(item.price)} so'm/oy
      </div>
      <span class="status ${escapeHTML(item.status)}">
        ${statusLabel(item.status)}
      </span>

      <div class="listing-actions">
        <button class="primary-btn view-btn">Batafsil</button>
        ${!admin ? `
          <button class="secondary-btn save-btn">
            ${saved ? "❤️ Saqlangan" : "🤍 Saqlash"}
          </button>
        ` : ""}
      </div>

      ${admin ? `
        <div class="listing-actions">
          <button class="primary-btn approve-btn">Tasdiqlash</button>
          <button class="danger-btn reject-btn">Rad etish</button>
          <button class="secondary-btn rented-btn">Berildi</button>
          <button class="danger-btn delete-btn">O'chirish</button>
        </div>
      ` : ""}
    </div>
  `;

  card.querySelector(".view-btn").onclick = () => showDetail(item);

  if (!admin) {
    card.querySelector(".save-btn").onclick =
      () => toggleSaved(item.id);
  } else {
    card.querySelector(".approve-btn").onclick =
      () => adminAction(item.id, "approve");

    card.querySelector(".reject-btn").onclick =
      () => adminAction(item.id, "reject");

    card.querySelector(".rented-btn").onclick =
      () => adminAction(item.id, "rented");

    card.querySelector(".delete-btn").onclick = () => {
      if (confirm("E'lon o'chirilsinmi?")) {
        adminAction(item.id, "delete");
      }
    };
  }

  return card;
}

function renderCards(id, items, admin = false) {
  const target = $(id);
  target.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-message";
    empty.textContent = "Hozircha e'lonlar topilmadi";
    target.appendChild(empty);
    return;
  }

  items.forEach(item => {
    target.appendChild(createCard(item, admin));
  });
}

function renderHome() {
  renderCards(
    "latestListings",
    listings.filter(item => item.status === "approved").slice(0, 6)
  );
}

function renderSearch() {
  const district = $("searchDistrict").value;
  const mahalla = $("searchMahalla").value;
  const type = $("searchType").value;
  const rooms = $("searchRooms").value;
  const repair = $("searchRepair").value;
  const max = Number($("searchMaxPrice").value || 0);

  const filtered = listings.filter(item =>
    item.status === "approved" &&
    (!district || item.district === district) &&
    (!mahalla || item.mahalla === mahalla) &&
    (!type || item.type === type) &&
    (
      !rooms ||
      (
        rooms === "6+"
          ? parseInt(item.rooms, 10) >= 6
          : String(item.rooms) === rooms
      )
    ) &&
    (!repair || item.repair === repair) &&
    (!max || Number(item.price) <= max)
  );

  $("resultCount").textContent = filtered.length + " ta";
  renderCards("searchResults", filtered);
}

function renderSaved() {
  const ids = getSavedIds();

  renderCards(
    "savedListings",
    listings.filter(item =>
      ids.includes(String(item.id)) &&
      item.status === "approved"
    )
  );
}

function renderProfileListings() {
  renderCards(
    "myListings",
    listings.filter(item => item.owner === clientId)
  );
}

function showDetail(item) {
  const content = $("detailContent");
  content.replaceChildren();

  const wrapper = document.createElement("div");

  const photo = imageURL(item.photo_url)
    ? `<img class="detail-photo"
         src="${escapeHTML(imageURL(item.photo_url))}"
         alt="Uy rasmi">`
    : `<div class="listing-photo photo-placeholder">🏡</div>`;

  wrapper.innerHTML = `
    ${photo}
    <h2>${escapeHTML(item.type)}</h2>
    <div class="listing-price">
      ${money(item.price)} so'm/oy
    </div>
    <p><b>Hudud:</b> ${escapeHTML(item.district)}</p>
    <p><b>Mahalla:</b> ${escapeHTML(item.mahalla)}</p>
    <p><b>Manzil:</b> ${escapeHTML(item.address)}</p>
    <p><b>Xonalar:</b> ${escapeHTML(item.rooms)}</p>
    <p><b>Ta'mir:</b> ${escapeHTML(item.repair)}</p>
    <p><b>Telefon:</b> ${escapeHTML(item.phone)}</p>
    <p class="detail-description">
      ${escapeHTML(item.description)}
    </p>
    <a class="primary-btn"
       style="display:inline-block;text-decoration:none"
       href="${escapeHTML(phoneURL(item.phone))}">
      📞 Qo'ng'iroq qilish
    </a>
  `;

  content.appendChild(wrapper);

  const link = wrapper.querySelector("a");
  if (link && !phoneURL(item.phone)) link.remove();

  $("detailModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("closeDetail").focus();
}

async function loadListings() {
  try {
    const data = await api(
      "/api/listings?owner=" + encodeURIComponent(clientId)
    );

    if (!Array.isArray(data.listings)) {
      throw new Error("E’lonlar formati noto‘g‘ri");
    }

    listings = data.listings;

    renderHome();
    renderSearch();
    renderSaved();
    renderProfileListings();
  } catch (err) {
    toast("Serverga ulanishda xatolik: " + err.message);
  }
}

async function submitListing(event) {
  event.preventDefault();

  const button = event.target.querySelector('[type="submit"]');
  if (button.disabled) return;

  const district = $("addDistrict").value;
  const mahalla = $("addMahalla").value;

  if (!event.target.reportValidity()) return;

  if (!district || !mahallalar[district]?.includes(mahalla)) {
    return toast("Tuman va mahallani tanlang");
  }

  const price = Number($("addPrice").value);

  if (
    !Number.isSafeInteger(price) ||
    price <= 0 ||
    price > 100000000000
  ) {
    return toast("Narxni to‘g‘ri kiriting");
  }

  if (!phoneURL($("addPhone").value)) {
    return toast("Telefon raqamini to‘g‘ri kiriting");
  }

  const form = new FormData();

  const fields = {
    district,
    mahalla,
    type: $("addType").value,
    rooms: $("addRooms").value,
    repair: $("addRepair").value,
    price: $("addPrice").value,
    phone: $("addPhone").value.trim(),
    address: $("addAddress").value.trim(),
    description: $("addDescription").value.trim(),
    owner: clientId
  };

  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, value);
  });

  const image = $("addImage").files[0];

  if (image) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(image.type)) {
      return toast("Faqat JPG, PNG yoki WEBP rasm tanlang");
    }

    if (image.size > 5 * 1024 * 1024) {
      return toast("Rasm hajmi 5 MB dan oshmasin");
    }

    form.append("photo", image);
  }

  button.disabled = true;

  try {
    await api("/api/listings", {
      method: "POST",
      body: form
    });

    toast("E'lon adminga yuborildi!");
    event.target.reset();
    updateMahalla("add");

    await loadListings();
    navigate("profile");
  } catch (err) {
    toast(err.message);
  } finally {
    button.disabled = false;
  }
}

function saveProfile(event) {
  event.preventDefault();

  const profile = {
    name: $("profileName").value.trim(),
    phone: $("profilePhone").value.trim()
  };

  if (writeStorage("im_profile", JSON.stringify(profile))) {
    toast("Profil saqlandi");
  }
}

function loadProfile() {
  try {
    const profile = readJSON("im_profile", {}) || {};
    $("profileName").value = profile.name || "";
    $("profilePhone").value = profile.phone || "";
  } catch {}
}

async function loadAdmin() {
  try {
    const data = await api("/api/admin/listings", {
      headers: {
        "X-Admin-Password": adminPassword
      }
    });

    if (!Array.isArray(data.listings)) {
      throw new Error("Admin javobi noto‘g‘ri");
    }

    $("adminLogin").classList.add("hidden");
    $("adminContent").classList.remove("hidden");

    renderCards(
      "pendingListings",
      data.listings.filter(item => item.status === "pending"),
      true
    );

    renderCards("adminListings", data.listings, true);
  } catch (err) {
    adminPassword = "";
    $("adminContent").classList.add("hidden");
    $("adminLogin").classList.remove("hidden");
    toast(err.message);
  }
}

async function adminAction(id, action) {
  try {
    await api(
      `/api/admin/listings/${encodeURIComponent(id)}/${action}`,
      {
        method: "POST",
        headers: {
          "X-Admin-Password": adminPassword
        }
      }
    );

    toast("Amal bajarildi");
    await loadAdmin();
    await loadListings();
  } catch (err) {
    toast(err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  navigate("home");
  loadProfile();

  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener(
      "click",
      () => navigate(button.dataset.page)
    );
  });

  [
    "searchMahalla",
    "searchType",
    "searchRooms",
    "searchRepair"
  ].forEach(id => {
    $(id).addEventListener("change", renderSearch);
  });

  $("searchDistrict").addEventListener("change", renderSearch);
  $("searchMaxPrice").addEventListener("input", renderSearch);

  $("searchButton").onclick = renderSearch;

  $("resetSearch").onclick = () => {
    [
      "searchDistrict",
      "searchType",
      "searchRooms",
      "searchRepair",
      "searchMaxPrice"
    ].forEach(id => {
      $(id).value = "";
    });

    updateMahalla("search");
    renderSearch();
  };

  $("listingForm").onsubmit = submitListing;
  $("profileForm").onsubmit = saveProfile;

  $("adminLoginButton").onclick = () => {
    adminPassword = $("adminPassword").value;

    if (adminPassword) {
      loadAdmin();
    } else {
      toast("Admin parolini kiriting");
    }
  };

  $("adminPassword").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      $("adminLoginButton").click();
    }
  });

  $("adminRefresh").onclick = loadAdmin;

  $("adminLogout").onclick = () => {
    adminPassword = "";
    $("adminPassword").value = "";
    $("adminContent").classList.add("hidden");
    $("adminLogin").classList.remove("hidden");
  };

  const closeDetail = () => {
    $("detailModal").classList.add("hidden");
    document.body.style.overflow = "";
  };

  $("closeDetail").onclick = closeDetail;

  $("detailModal").onclick = event => {
    if (event.target === $("detailModal")) closeDetail();
  };

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeDetail();
  });

  loadListings();
});