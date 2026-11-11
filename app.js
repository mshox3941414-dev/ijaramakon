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
let currentAdminRole = null;

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

const isApartment = type => ["kvartira", "ko'p qavatli uydagi kvartira"].includes(String(type || "").toLowerCase());
const formatListingDate = value => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uz-UZ", {day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Tashkent"}).format(date);
};
const listingCalendarIcon = '<svg class="premium-ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>';
const listingFlagIcon = '<svg class="premium-ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4m0 1c3-3 6 2 9 0s5-1 5-1v11c-3 0-5-1-8 1s-4-2-6 0"/></svg>';
function updateFloorVisibility(prefix) {
  const selected = isApartment($(prefix+"Type").value);
  const wrapper = $(prefix+"FloorField"), floor = $(prefix+"Floor");
  if (!wrapper || !floor) return;
  wrapper.classList.toggle("hidden", !selected);
  floor.disabled = !selected;
  floor.required = prefix === "add" && selected;
  if (!selected) floor.value = "";
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

    const floor = $(prefix + "Floor");
    for (let n=1;n<=50;n++) {
      const option=document.createElement("option");
      option.value=String(n);
      option.textContent=n+"-qavat";
      floor.appendChild(option);
    }
    $(prefix+"Type").addEventListener("change", () => {
      updateFloorVisibility(prefix);
      if (prefix==="search") renderSearch();
    });
    updateFloorVisibility(prefix);
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

  if (page === "add" && addMap) requestAnimationFrame(() => setTimeout(() => addMap.invalidateSize({pan:false}), 180));
  if (page === "search" && searchMap) requestAnimationFrame(() => setTimeout(() => searchMap.invalidateSize({pan:false}), 180));
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

const listingIcon = name => {
 const p = {
 pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
 door:'<path d="M5 21V3h14v18M3 21h18"/><path d="M14 12h.01"/>',
 eye:'<path d="M2 12s3.7-6.5 10-6.5S22 12 22 12s-3.7 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 heart:'<path d="M20.8 8.6c0 4.4-8.8 10.4-8.8 10.4S3.2 13 3.2 8.6a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8z"/>',
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>',
 phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19 19 0 0 1-17.7-17.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.9a2 2 0 0 1-.6 1.8L7.2 10a16 16 0 0 0 6.8 6.8l1.6-1.8a2 2 0 0 1 1.8-.6l2.9.5a2 2 0 0 1 1.7 2z"/>'
 };
 return '<svg class="listing-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p[name] || p.home) + '</svg>';
};

function createCard(item, admin = false) {
  const card = document.createElement("article");
  card.className = "listing-card";

  const saved = getSavedIds().includes(String(item.id));

  const photo = imageURL(item.photo_url)
    ? `<img class="listing-photo"
         src="${escapeHTML(imageURL(item.photo_url))}"
         alt="Uy rasmi" loading="lazy">`
    : `<div class="listing-photo photo-placeholder">${listingIcon("home")}</div>`;

  card.innerHTML = `
    ${photo}
    ${!admin ? `<button type="button" class="save-btn heart-save ${saved ? "is-saved" : ""}" aria-label="${saved ? "Saqlanganlardan olib tashlash" : "Saqlanganlarga qo'shish"}" aria-pressed="${saved}" title="${saved ? "Saqlangan" : "Saqlash"}">${listingIcon("heart")}</button>` : ""}
    <div class="listing-body">
      <h3>${escapeHTML(item.type)}</h3>
      <p>
        ${listingIcon("pin")} <span data-no-translate>${escapeHTML(item.district)},
        ${escapeHTML(item.mahalla)}</span>
      </p>
      <p>
        ${listingIcon("door")} ${escapeHTML(item.rooms)} xona ·
        ${escapeHTML(item.repair)}
      </p>
      <div class="listing-price">
        ${money(item.price)} so'm/oy
      </div>
      <div class="listing-views">${listingIcon("eye")} <span data-view-count="${item.id}">${(Number(item.view_count || 0) * 10).toLocaleString("uz-UZ")}</span> faollik balli</div>
      ${formatListingDate(item.created_at) ? `<div class="listing-posted-date">${listingCalendarIcon} ${escapeHTML(formatListingDate(item.created_at))}</div>` : ""}
      <span class="status ${escapeHTML(item.status)}">
        ${statusLabel(item.status)}
      </span>

      <div class="listing-actions">
        <button class="primary-btn view-btn"><span>Batafsil</span><svg class="premium-ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
        ${!admin ? `
          <button class="secondary-btn report-btn">${listingFlagIcon} <span>Shikoyat</span></button>
        ` : ""}
      </div>

      ${admin ? `
        <div class="listing-actions">
          ${currentAdminRole === "admin" ? '<button class="secondary-btn edit-btn">Tahrirlash</button>' : ""}
          <button class="primary-btn approve-btn">Tasdiqlash</button>
          <button class="danger-btn reject-btn">Rad etish</button>
          <button class="secondary-btn rented-btn">Berildi</button>
        </div>
      ` : ""}
    </div>
  `;

  card.querySelector(".view-btn").onclick = () => showDetail(item);

  if (!admin) {
    card.querySelector(".report-btn").onclick = () => reportListing(item.id);
    card.querySelector(".save-btn").onclick =
      () => toggleSaved(item.id);
  } else {
    if (currentAdminRole === "admin") card.querySelector(".edit-btn").onclick = () => editAdminListing(item);
    card.querySelector(".approve-btn").onclick =
      () => adminAction(item.id, "approve");

    card.querySelector(".reject-btn").onclick =
      () => adminAction(item.id, "reject");

    card.querySelector(".rented-btn").onclick =
      () => adminAction(item.id, "rented");

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
  const floor = $("searchFloor").value;
  const max = Number($("searchMaxPrice").value || 0);

  let filtered = listings.filter(item =>
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
    (!floor || (isApartment(item.type) && String(item.floor ?? "") === floor)) &&
    (!max || Number(item.price) <= max)
  );

  if (nearbyLocation) {
    const validDistance = item => item.latitude != null && item.longitude != null &&
      Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude));
    filtered = filtered.filter(validDistance).sort((a,b) =>
      distanceKm(nearbyLocation.lat,nearbyLocation.lng,Number(a.latitude),Number(a.longitude)) -
      distanceKm(nearbyLocation.lat,nearbyLocation.lng,Number(b.latitude),Number(b.longitude))
    );
  }
    $("resultCount").textContent = filtered.length + " ta";
  renderCards("searchResults", filtered);
  renderMapListings(filtered);
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

async function showDetail(item) {
  const content = $("detailContent");
  content.replaceChildren();

  const wrapper = document.createElement("div");

  const photos = (Array.isArray(item.photos) && item.photos.length ? item.photos : [item.photo_url]).map(imageURL).filter(Boolean);
  const photo = photos.length
    ? `<div class="detail-gallery"><div class="gallery-stage"><img class="detail-photo" id="galleryMainPhoto" src="${escapeHTML(photos[0])}" alt="Uy rasmi"><button class="gallery-arrow gallery-prev" type="button" aria-label="Oldingi rasm">‹</button><button class="gallery-arrow gallery-next" type="button" aria-label="Keyingi rasm">›</button><span class="gallery-count">1 / ${photos.length}</span></div><div class="gallery-thumbs">${photos.map((src,i)=>`<button class="gallery-thumb ${i===0?"active":""}" type="button" data-index="${i}" aria-label="${i+1}-rasm"><img src="${escapeHTML(src)}" alt="Uy rasmi ${i+1}" loading="lazy"></button>`).join("")}</div></div>`
    : `<div class="listing-photo photo-placeholder">${listingIcon("home")}</div>`;
  const hasCoordinates = item.latitude != null && item.longitude != null &&
    Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)) &&
    Math.abs(Number(item.latitude)) <= 90 && Math.abs(Number(item.longitude)) <= 180;
  const locationName = [item.district, item.mahalla].filter(Boolean).join(", ");
  const smsMessage = `Assalomu alaykum! IjaraMakon saytida ${item.district}, ${item.mahalla} hududidagi ${item.type} e'loningizni ko'rdim. Uy hali ijaraga berilmaganmi?`;
  wrapper.className = "listing-detail-layout";
  wrapper.innerHTML = `
    <div class="detail-gallery-column">
      ${photo}
    </div>
    <div class="detail-information-column">
      <div class="detail-heading"><span class="detail-chip">Ijara</span><span class="detail-chip">${escapeHTML(item.type)}</span></div>
      <h2><span>${escapeHTML(item.type)}</span> — <span data-no-translate>${escapeHTML(item.mahalla)}</span></h2>
      <div class="detail-main-price">${money(item.price)} so'm <span>/ oy</span></div>
      <p class="listing-views">${listingIcon("eye")} <span id="detailViewCount">${(Number(item.view_count || 0) * 10).toLocaleString("uz-UZ")}</span> faollik balli</p>
      <div class="detail-contact">
        <button type="button" class="primary-btn detail-contact-action" data-action="call"><svg class="premium-ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.2 3.5 5.4 2.7a2 2 0 0 0-2.3 1.1c-1.1 2.6-.2 6.8 3.8 10.8s8.2 4.9 10.8 3.8a2 2 0 0 0 1.1-2.3l-.8-2.8a2 2 0 0 0-2.2-1.4l-2.8.5a14 14 0 0 1-5.4-5.4l.5-2.8a2 2 0 0 0-1.9-2.7Z"/></svg> Qo'ng'iroq qilish</button>
        <button type="button" class="detail-sms-btn detail-contact-action" data-action="sms">✉ SMS yozish</button>
        <span class="detail-phone" id="verifiedContactPhone">${escapeHTML(item.phone || "")}</span>
      </div>
      <h3>Uy haqida ma'lumot</h3>
      <dl class="detail-facts">
        <div><dt>Uy turi</dt><dd>${escapeHTML(item.type)}</dd></div>
        <div><dt>Xonalar soni</dt><dd>${escapeHTML(item.rooms)}</dd></div>
        ${isApartment(item.type) && item.floor ? `<div><dt>Kvartira qavati</dt><dd>${escapeHTML(item.floor)}-qavat</dd></div>` : ""}
        <div><dt>Ta'mir holati</dt><dd>${escapeHTML(item.repair)}</dd></div>
        <div><dt>Manzil</dt><dd data-no-translate>${escapeHTML(item.address)}</dd></div>
      </dl>
      ${item.description ? `<p class="detail-description">${escapeHTML(item.description)}</p>` : ""}
      ${formatListingDate(item.created_at) ? `<p class="detail-posted-date">${listingCalendarIcon} ${escapeHTML(formatListingDate(item.created_at))}</p>` : ""}
      <h3>Joylashuv</h3>
      <p class="detail-location-name">${listingIcon("pin")} ${escapeHTML(locationName)}</p>
      ${hasCoordinates ? '<div id="detailLocationMap" class="detail-location-map" role="region" aria-label="Uy joylashuvi xaritasi"></div>' : '<div class="detail-location-empty">Bu e\'lon uchun xaritada aniq joylashuv belgilanmagan.</div>'}
    </div>
  `;

  content.appendChild(wrapper);
  if (photos.length) {
    let index = 0;
    const main = wrapper.querySelector("#galleryMainPhoto");
    const thumbs = [...wrapper.querySelectorAll(".gallery-thumb")];
    const show = next => {
      index = (next + photos.length) % photos.length;
      main.src = photos[index];
      wrapper.querySelector(".gallery-count").textContent = `${index+1} / ${photos.length}`;
      thumbs.forEach((btn,i)=>btn.classList.toggle("active", i===index));
      thumbs[index]?.scrollIntoView({block:"nearest",inline:"nearest"});
    };
    wrapper.querySelector(".gallery-prev").onclick = () => show(index-1);
    wrapper.querySelector(".gallery-next").onclick = () => show(index+1);
    thumbs.forEach((btn,i)=>btn.onclick=()=>show(i));
    if (photos.length === 1) wrapper.querySelectorAll(".gallery-arrow").forEach(btn=>btn.hidden=true);
  }

  // Native phone/SMS links must open directly from the user's tap in Telegram WebView.
  const publicNumber = String(item.phone || "").replace(/[^+0-9]/g, "");
  const validPublicNumber = phoneURL(publicNumber) ? publicNumber : "";
  wrapper.querySelectorAll(".detail-contact-action").forEach(button => {
    const isSms = button.dataset.action === "sms";
    const number = validPublicNumber;
    if (!number) {
      button.onclick = () => toast("Telefon raqami mavjud emas");
      return;
    }
    const url = isSms
      ? "sms:" + number + "?body=" + encodeURIComponent(smsMessage)
      : phoneURL(number);
    const link = document.createElement("a");
    link.href = url;
    link.className = button.className;
    link.textContent = button.textContent;
    link.setAttribute("role", "button");
    button.replaceWith(link);
  });
  $("verifiedContactPhone").textContent = validPublicNumber;

  $("detailModal").classList.remove("hidden");
  if (hasCoordinates && typeof L !== "undefined") {
    const lat = Number(item.latitude), lng = Number(item.longitude);
    const map = L.map(wrapper.querySelector("#detailLocationMap"), {scrollWheelZoom:false})
      .setView([lat,lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:'&copy; OpenStreetMap contributors', maxZoom:19
    }).addTo(map);
    L.marker([lat,lng]).addTo(map).bindPopup(escapeHTML(locationName));
    setTimeout(()=>map.invalidateSize(), 100);
    const close = $("closeDetail");
    close.addEventListener("click", ()=>map.remove(), {once:true});
  }
  document.body.style.overflow = "hidden";
  $("closeDetail").focus();
  if (item.status === "approved") {
    try {
      // One count per listing per browser tab session; no personal identifiers sent.
      const key = "im-viewed-" + item.id;
      if (!sessionStorage.getItem(key)) {
        const result = await api("/api/listings/" + encodeURIComponent(item.id) + "/view", {method:"POST"});
        sessionStorage.setItem(key, "1");
        item.view_count = result.view_count;
        const counter = $("detailViewCount");
        if (counter) counter.textContent = (Number(result.view_count) * 10).toLocaleString("uz-UZ");
        document.querySelectorAll('[data-view-count="' + item.id + '"]').forEach(el => {
          el.textContent = (Number(result.view_count) * 10).toLocaleString("uz-UZ");
        });
      }
    } catch (error) { console.warn("View counter unavailable", error); }
  }
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
    floor: isApartment($("addType").value) ? $("addFloor").value : "",
    price: $("addPrice").value,
    phone: $("addPhone").value.trim(),
    address: $("addAddress").value.trim(),
    description: $("addDescription").value.trim(),
    owner: clientId,
    latitude: selectedLocation?.lat ?? "",
    longitude: selectedLocation?.lng ?? ""
  };

  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, value);
  });

  const images = Array.from($("addImage").files);
  if (images.length > 10) return toast("Ko‘pi bilan 10 ta rasm tanlang");

  for (const image of images) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type))
      return toast("Faqat JPG, PNG yoki WEBP rasm tanlang");
    if (image.size > 5 * 1024 * 1024)
      return toast("Har bir rasm 5 MB dan oshmasin");
    form.append("photos", image);
  }

  button.disabled = true;

  try {
    await api("/api/listings", {
      method: "POST",
      body: form
    });

    toast("E'lon adminga yuborildi!");
    event.target.reset();
    selectedLocation = null;
    if (addMarker && addMap) { addMap.removeLayer(addMarker); addMarker = null; }
    $("locationStatus").textContent = "Joylashuv belgilanmagan";
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

    currentAdminRole = data.role;
    $("adminLogin").classList.add("hidden");
    $("adminContent").classList.remove("hidden");

    renderCards(
      "pendingListings",
      data.listings.filter(item => item.status === "pending"),
      true
    );

    await loadAdminOverview();
    const counts = Object.fromEntries(["pending","approved","rejected","rented"].map(status =>
      [status,data.listings.filter(item => item.status === status).length]));
    $("adminStats").textContent = "Jami: " + data.listings.length +
      " | Kutilmoqda: " + counts.pending + " | Tasdiqlangan: " + counts.approved +
      " | Rad etilgan: " + counts.rejected + " | Ijaraga berilgan: " + counts.rented;
    const statusFilter = $("adminStatusFilter").value;
    renderCards("adminListings", data.listings.filter(item =>
      !statusFilter || item.status === statusFilter), true);
  } catch (err) {
    adminPassword = "";
    currentAdminRole = null;
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

const TOUR_STEPS = [
  ["[data-page='home'].nav-btn", "Bosh sahifa", "Bu yerda yangi ijara e'lonlari va sayt yangiliklarini ko'rasiz."],
  ["[data-page='search'].nav-btn", "Uy qidirish", "Tuman, mahalla, narx va xona soni bo'yicha uy topasiz."],
  ["[data-page='add'].nav-btn", "E'lon berish", "Uyingizni ijaraga berish uchun rasm va ma'lumotlarni joylaysiz."],
  ["[data-page='saved'].nav-btn", "Saqlangan", "Yoqtirgan uylaringizni keyinroq qayta ko'rish uchun saqlaysiz."],
  ["[data-page='profile'].nav-btn", "Mening profilim", "Shaxsiy ma'lumotlaringizni boshqarasiz."],
  ["#settingsToggle", "Yordam va sozlamalar", "Yana tushuntirish kerak bo‘lsa, shu uch chiziqli menyuga kiring va «Saytdan foydalanishni o‘rganish» tugmasini bosing. Bu yerda aloqa raqami va «Biz haqimizda» bo‘limi ham bor."]
];
function setupGuidedTour() {
  const layer = document.getElementById("tourLayer");
  if (!layer) return;
  const spot = document.getElementById("tourSpot"), tip = document.getElementById("tourTip");
  let index = 0;
  const close = () => { layer.classList.add("hidden"); layer.setAttribute("aria-hidden","true"); writeStorage("im-tour-v1","done"); };
  const show = () => {
    const [selector,title,description] = TOUR_STEPS[index];
    const target = document.querySelector(selector);
    if (!target) { close(); return; }
    const rect = target.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const x = Math.max(0, rect.left - 5), y = Math.max(0, rect.top - 5);
    const right = Math.min(vw, rect.right + 5), bottom = Math.min(vh, rect.bottom + 5);
    spot.style.left = x + "px"; spot.style.top = y + "px";
    spot.style.width = (right - x) + "px"; spot.style.height = (bottom - y) + "px";
    const positions = {
      "top": [0, 0, vw, y],
      "left": [0, y, x, bottom-y],
      "right": [right, y, vw-right, bottom-y],
      "bottom": [0, bottom, vw, vh-bottom]
    };
    Object.entries(positions).forEach(([name, values]) => {
      const el = layer.querySelector(".tour-blur-" + name);
      if (!el) return;
      el.style.left = values[0] + "px"; el.style.top = values[1] + "px";
      el.style.width = Math.max(0,values[2]) + "px"; el.style.height = Math.max(0,values[3]) + "px";
    });
    // Fill the four square corners of the spotlight with blurred overlay,
    // leaving an actually rounded clear window (not just a rounded border).
    const radius = Math.min(22, (right-x)/2, (bottom-y)/2);
    const corners = {
      tl: [x, y], tr: [right-radius, y],
      bl: [x, bottom-radius], br: [right-radius, bottom-radius]
    };
    Object.entries(corners).forEach(([name, coords]) => {
      const el = layer.querySelector(".tour-corner-" + name);
      if (!el) return;
      el.style.left = coords[0] + "px"; el.style.top = coords[1] + "px";
      el.style.width = radius + "px"; el.style.height = radius + "px";
    });
    document.getElementById("tourTitle").textContent = title;
    document.getElementById("tourText").textContent = description;
    document.getElementById("tourNext").textContent = index === TOUR_STEPS.length - 1 ? "Tushunarli ✓" : "Keyingisi →";
    const tipHeight = tip.offsetHeight || 160;
    const below = bottom + 24 + tipHeight < vh;
    const preferredTop = below ? bottom + 22 : y - tipHeight - 22;
    tip.style.top = Math.max(12,Math.min(vh-tipHeight-12,preferredTop)) + "px";
    tip.style.left = Math.max(12,Math.min(vw-tip.offsetWidth-12,x)) + "px";
  };
  const start=()=>{ index=0; layer.classList.remove("hidden");layer.setAttribute("aria-hidden","false");requestAnimationFrame(show); };
  document.getElementById("tourNext").onclick=()=>{ if (++index>=TOUR_STEPS.length) close(); else show(); };

  document.getElementById("restartTour")?.addEventListener("click",()=>{document.getElementById("settingsClose")?.click();start();});
  document.getElementById("headerTour")?.addEventListener("click",start);
  window.addEventListener("resize",()=>{if(!layer.classList.contains("hidden"))show();});
  if (readStorage("im-tour-v1")!=="done") requestAnimationFrame(() => requestAnimationFrame(start));
}

document.addEventListener("DOMContentLoaded", () => {
  setupGuidedTour();
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

  $("searchFloor").addEventListener("change", renderSearch);
  $("searchDistrict").addEventListener("change", renderSearch);
  $("searchMaxPrice").addEventListener("input", renderSearch);

  $("searchButton").onclick = renderSearch;

  $("resetSearch").onclick = () => {
    [
      "searchDistrict",
      "searchType",
      "searchRooms",
      "searchRepair",
      "searchFloor",
      "searchMaxPrice"
    ].forEach(id => {
      $(id).value = "";
    });

    updateMahalla("search");
    updateFloorVisibility("search");
    renderSearch();
  };

  $("listingForm").onsubmit = submitListing;
  $("profileForm").onsubmit = saveProfile;

  $("adminForgotPassword").onclick = () => $("adminResetPanel").classList.toggle("hidden");
  $("adminSendResetCode").onclick = async () => {
    try {
      const response = await api("/api/admin/password-reset/request", {method:"POST"});
      toast(response.message);
    } catch (err) { toast(err.message); }
  };
  $("adminConfirmReset").onclick = async () => {
    const code = $("adminResetCode").value.trim();
    const password = $("adminNewPassword").value;
    try {
      const response = await api("/api/admin/password-reset/confirm", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({code,password})
      });
      $("adminPassword").value = password;
      $("adminResetCode").value = "";
      $("adminNewPassword").value = "";
      $("adminResetPanel").classList.add("hidden");
      toast(response.message);
    } catch(err) { toast(err.message); }
  };
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
  $("adminStatusFilter").onchange = loadAdmin;

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
// IJARAMAKON — OQ-KO'K TANLASH OYNALARINI TIKLASH
(() => {
  function initPickers() {
    if (document.getElementById("imPickerRestore")) return;

    const style = document.createElement("style");
    style.textContent = `
      .im-original-select {
        position:absolute!important;
        width:1px!important;
        height:1px!important;
        opacity:0!important;
        pointer-events:none!important;
        margin:0!important;
        padding:0!important;
        overflow:hidden!important;
      }

      .im-picker-button {
        width:100%;
        min-height:48px;
        border:1px solid #e4eaf3;
        background:#f8faff;
        border-radius:12px;
        padding:12px 14px;
        font:inherit;
        font-size:15px;
        color:#172b4d;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        text-align:left;
        cursor:pointer;
      }

      .im-picker-button:focus-visible {
        outline:2px solid #1677ff;
        outline-offset:2px;
      }

      .im-picker-button:disabled {
        opacity:.6;
        cursor:default;
      }

      .im-picker-arrow {
        font-size:23px;
        color:#1677ff;
      }

      #imPickerRestore[hidden] {
        display:none!important;
      }

      #imPickerRestore {
        position:fixed;
        inset:0;
        z-index:10000;
        background:rgba(0,0,0,.45);
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding:12px;
      }

      #imPickerRestore .im-picker-box {
        width:100%;
        max-width:650px;
        max-height:85vh;
        max-height:85dvh;
        display:flex;
        flex-direction:column;
        background:#fff;
        color:#172b4d;
        border-radius:22px;
        padding:18px;
        box-shadow:0 12px 45px #0003;
        font-family:Arial,sans-serif;
      }

      #imPickerRestore .im-picker-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:14px;
      }

      #imPickerRestore h3 {
        margin:0;
        font-size:18px;
        color:#172b4d;
      }

      #imPickerRestore .im-picker-close {
        width:36px;
        height:36px;
        flex-shrink:0;
        border:0;
        border-radius:50%;
        background:#eef3fb;
        color:#172b4d;
        font-size:20px;
        cursor:pointer;
      }

      #imPickerRestore input {
        width:100%;
        flex-shrink:0;
        min-height:48px;
        margin:0 0 12px;
        padding:12px 14px;
        border:1px solid #e4eaf3;
        border-radius:12px;
        background:#f8faff;
        color:#172b4d;
        font:inherit;
        font-size:16px;
        box-sizing:border-box;
      }

      #imPickerRestore .im-picker-list {
        overflow-y:auto;
        overscroll-behavior:contain;
        min-height:0;
        display:grid;
        gap:7px;
        padding:2px;
      }

      #imPickerRestore .im-picker-option {
        width:100%;
        min-height:48px;
        margin:0;
        padding:13px 14px;
        border:1px solid #e4eaf3;
        border-radius:12px;
        background:#f8faff;
        color:#172b4d;
        font:inherit;
        font-size:15px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        text-align:left;
        cursor:pointer;
      }

      #imPickerRestore .im-picker-option.selected {
        background:#eaf2ff;
        border-color:#1677ff;
        color:#075dcc;
      }

      #imPickerRestore .im-picker-check {
        color:#1677ff;
        font-size:20px;
      }

      #imPickerRestore .im-picker-empty {
        text-align:center;
        padding:20px;
        color:#748399;
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.id = "imPickerRestore";
    modal.hidden = true;

    modal.innerHTML = `
      <div class="im-picker-box"
           role="dialog"
           aria-modal="true"
           aria-labelledby="imPickerTitle">

        <div class="im-picker-head">
          <h3 id="imPickerTitle"></h3>
          <button class="im-picker-close"
                  type="button"
                  aria-label="Yopish">✕</button>
        </div>

        <input type="search"
               placeholder="Qidirish..."
               aria-label="Ro'yxatdan qidirish">

        <div class="im-picker-list"></div>
      </div>
    `;

    document.body.appendChild(modal);

    const title = modal.querySelector("h3");
    const query = modal.querySelector("input");
    const list = modal.querySelector(".im-picker-list");
    const closeButton = modal.querySelector(".im-picker-close");

    const bindings = [];
    let active = null;
    let oldOverflow = "";

    // Consistent, stroke-based icons instead of platform-dependent emoji.
    const pickerPaths = {
      District: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5M9 21v-8h6v8"/>',
      Mahalla: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
      Type: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
      Rooms: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18M15 12h.01"/>',
      Repair: '<path d="m14.7 6.3 3 3M4 20l8.7-8.7a5 5 0 0 0 6.6-6.6l-3.2 3.2-3-3L16.3 1.7a5 5 0 0 0-6.6 6.6L1 17l3 3Z"/>',
      Floor: '<path d="M4 21h16M7 21v-5h5v-5h5V6h4"/>'
    };
    const fieldInfo = {
      Floor: "Kvartira qavati",
      District: "Tuman yoki shahar",
      Mahalla: "Mahallani tanlang",
      Type: "Uy turi",
      Rooms: "Xonalar soni",
      Repair: "Ta'mir holati"
    };
    function pickerIcon(name) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.7");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.setAttribute("class", "im-premium-field-icon");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = pickerPaths[name];
      return svg;
    }

    const uiText = text => window.ijaraTranslate ? window.ijaraTranslate(text) : text;
    const optionText = option => {
      if (!option) return "";
      const source = option.value && !option.value.match(/^\d+$/) ? option.value : option.textContent;
      return uiText(source) !== source ? uiText(source) : option.textContent;
    };
    function sync(binding) {
      const option = binding.select.selectedOptions[0];

      binding.label.textContent = optionText(option) || uiText(binding.title);

      binding.button.disabled = binding.select.disabled;
    }

    function close() {
      if (modal.hidden) return;

      modal.hidden = true;
      document.body.style.overflow = oldOverflow;

      const previous = active;
      active = null;
      previous?.button.focus();
    }

    function render() {
      if (!active) return;

      list.replaceChildren();

      const term = query.value.trim().toLocaleLowerCase("uz");

      Array.from(active.select.options).forEach(option => {
        if (option.disabled || option.hidden) return;

        if (
          !optionText(option)
            .toLocaleLowerCase("uz")
            .includes(term)
        ) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "im-picker-option";

        const selected =
          active.select.value === option.value;

        button.classList.toggle("selected", selected);

        const label = document.createElement("span");
        label.textContent = optionText(option);

        const check = document.createElement("span");
        check.className = "im-picker-check";
        check.textContent = selected ? "✓" : "○";

        button.append(label, check);

        button.onclick = () => {
          const select = active.select;
          select.value = option.value;

          select.dispatchEvent(
            new Event("change", { bubbles: true })
          );

          bindings.forEach(sync);
          close();
        };

        list.appendChild(button);
      });

      if (!list.children.length) {
        const empty = document.createElement("p");
        empty.className = "im-picker-empty";
        empty.textContent = uiText("Ma’lumot topilmadi");
        list.appendChild(empty);
      }
    }

    function open(binding) {
      if (binding.select.disabled) return;

      active = binding;
      title.textContent = uiText(binding.title);
      query.value = "";
      query.placeholder = uiText("Qidirish...");
      query.setAttribute("aria-label",uiText("Ro\'yxatdan qidirish"));

      render();

      oldOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      modal.hidden = false;
      closeButton.focus();
    }

    ["search", "add"].forEach(prefix => {
      Object.entries(fieldInfo).forEach(([suffix, info]) => {
        const select =
          document.getElementById(prefix + suffix);

        if (!select || select.tagName !== "SELECT") return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "im-picker-button";
        button.setAttribute("aria-haspopup", "dialog");
        button.setAttribute("aria-label", info);

        const label = document.createElement("span");
        const arrow = document.createElement("span");

        arrow.className = "im-picker-arrow";
        arrow.textContent = "›";

        button.append(pickerIcon(suffix), label, arrow);
        select.insertAdjacentElement("afterend", button);

        select.classList.add("im-original-select");
        select.tabIndex = -1;

        const binding = {
          select,
          button,
          label,
          title: info
        };

        bindings.push(binding);
        sync(binding);

        button.onclick = () => open(binding);

        select.addEventListener("change", () => {
          bindings.forEach(sync);
        });

        select.addEventListener("invalid", event => {
          event.preventDefault();
          if (modal.hidden) open(binding);
        });

        new MutationObserver(() => sync(binding))
          .observe(select, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["disabled", "selected"]
          });
      });
    });

    document.addEventListener("ijara:languagechange",()=>{bindings.forEach(sync);if(active){title.textContent=uiText(active.title);query.placeholder=uiText("Qidirish...");render();}});
    query.oninput = render;
    closeButton.onclick = close;

    modal.addEventListener("click", event => {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", event => {
      if (modal.hidden) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }

      if (event.key === "Tab") {
        const items = Array.from(
          modal.querySelectorAll("button,input")
        );

        const first = items[0];
        const last = items[items.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("reset", () => {
      setTimeout(() => bindings.forEach(sync), 0);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initPickers
    );
  } else {
    initPickers();
  }
})();
/* Optional maps: only listings with user-supplied coordinates are pinned. */
let selectedLocation = null;
let nearbyLocation = null;
function distanceKm(lat1,lon1,lat2,lon2) {
  const r = Math.PI / 180, dLat=(lat2-lat1)*r, dLon=(lon2-lon1)*r;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*r)*Math.cos(lat2*r)*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
let addMap, addMarker, searchMap, searchMarkers;
function mapReady() { return typeof L !== "undefined"; }
function makeMap(id) {
  const map = L.map(id).setView([41.55, 60.62], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  return map;
}
function setSelectedLocation(lat, lng) {
  selectedLocation = {lat, lng};
  if (!addMarker) addMarker = L.marker([lat,lng]).addTo(addMap);
  else addMarker.setLatLng([lat,lng]);
  addMap.setView([lat,lng], Math.max(addMap.getZoom(), 14));
  $("locationStatus").textContent = "📍 Tanlangan nuqta: " + lat.toFixed(5) + ", " + lng.toFixed(5);
}
function renderMapListings(items) {
  if (!searchMap || !searchMarkers) return;
  searchMarkers.clearLayers();
  const bounds = [];
  items.forEach(item => {
    const lat = Number(item.latitude), lng = Number(item.longitude);
    if (item.latitude == null || item.longitude == null || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const marker = L.marker([lat,lng]).addTo(searchMarkers);
    const title = document.createElement("div");
    title.textContent = (item.type || "Uy") + " · " + money(item.price) + " so'm/oy";
    marker.bindPopup(title);
    marker.on("click", () => showDetail(item));
    bounds.push([lat,lng]);
  });
  if (bounds.length) searchMap.fitBounds(bounds, {padding:[25,25],maxZoom:13});
}
function initLocationMaps() {
  $("pickLocation").onclick = () => {
    if (!mapReady()) return toast("Xarita yuklanmadi. Internetni tekshiring.");
    $("addMapWrap").classList.remove("hidden");
    if (!addMap) {
      addMap = makeMap("addMap");
      addMap.on("click", e => setSelectedLocation(e.latlng.lat,e.latlng.lng));
    }
    requestAnimationFrame(() => setTimeout(() => addMap.invalidateSize({pan:false}), 180));
  };
  $("useMyLocation").onclick = () => {
    if (!navigator.geolocation) return toast("GPS brauzerda mavjud emas");
    if (!mapReady()) return toast("Xarita yuklanmadi");
    navigator.geolocation.getCurrentPosition(pos => {
      $("pickLocation").click();
      setSelectedLocation(pos.coords.latitude,pos.coords.longitude);
    }, () => toast("GPS ruxsati berilmadi yoki joylashuv topilmadi"), {enableHighAccuracy:false,timeout:12000});
  };
  $("clearLocation").onclick = () => {
    selectedLocation = null;
    if (addMarker && addMap) {addMap.removeLayer(addMarker);addMarker=null;}
    $("locationStatus").textContent = "Joylashuv belgilanmagan";
  };
  $("toggleMap").onclick = () => {
    if (!mapReady()) return toast("Xarita yuklanmadi. Internetni tekshiring.");
    const wrap = $("searchMapWrap");
    wrap.classList.toggle("hidden");
    if (!wrap.classList.contains("hidden")) {
      if (!searchMap) {searchMap=makeMap("searchMap");searchMarkers=L.layerGroup().addTo(searchMap);}
      requestAnimationFrame(() => setTimeout(() => {searchMap.invalidateSize({pan:false});renderSearch();},180));
    }
  };
  $("clearNearMe").onclick = () => {
    nearbyLocation = null;
    $("clearNearMe").classList.add("hidden");
    renderSearch();
  };
  $("nearMe").onclick = () => {
    if (!navigator.geolocation) return toast("GPS brauzerda mavjud emas");
    navigator.geolocation.getCurrentPosition(pos => {
      nearbyLocation = {lat:pos.coords.latitude,lng:pos.coords.longitude};
      $("clearNearMe").classList.remove("hidden");
      renderSearch();
      if ($("searchMapWrap").classList.contains("hidden")) $("toggleMap").click();
      if (searchMap) { setTimeout(() => searchMap.setView([pos.coords.latitude,pos.coords.longitude],12), 120); }
    }, () => toast("GPS ruxsati berilmadi"),{timeout:12000});
  };
}
window.addEventListener("resize", () => { if(addMap) addMap.invalidateSize({pan:false}); if(searchMap) searchMap.invalidateSize({pan:false}); });
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",initLocationMaps);
else initLocationMaps();

async function reportListing(id) {
  const reason = prompt("Shikoyat sababini yozing (kamida 10 belgi):");
  if (reason === null) return;
  try {
    await api("/api/listings/" + encodeURIComponent(id) + "/report", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({reason})
    });
    toast("Shikoyat qabul qilindi");
  } catch (err) { toast(err.message); }
}

async function editAdminListing(item) {
  const fields = ["district","mahalla","type","rooms","repair","price","phone","address","description"];
  const changes = {};
  for (const key of fields) {
    const value = prompt(key + ":", String(item[key] ?? ""));
    if (value === null) return;
    if (value !== String(item[key] ?? "")) changes[key] = value;
  }
  if (!Object.keys(changes).length) return;
  try {
    await api("/api/admin/listings/" + encodeURIComponent(item.id), {
      method: "PATCH", headers: {"Content-Type": "application/json","X-Admin-Password":adminPassword},
      body: JSON.stringify(changes)
    });
    toast("E'lon yangilandi");
    await loadAdmin();
    await loadListings();
  } catch (err) { toast(err.message); }
}

async function loadAdminOverview() {
  const data = await api("/api/admin/overview", {headers:{"X-Admin-Password":adminPassword}});
  const reports = $("adminReports");
  reports.replaceChildren();
  if (!data.reports.length) reports.textContent = "Shikoyatlar yo'q";
  data.reports.forEach(item => {
    const row = document.createElement("div");
    row.className = "button-row";
    const label = document.createElement("span");
    label.textContent = "#" + item.listing_id + " — " + item.reason + " (" + item.status + ")";
    row.appendChild(label);
    if (item.status === "open") {
      const btn = document.createElement("button");
      btn.className = "secondary-btn";
      btn.textContent = "Ko'rib chiqildi";
      btn.onclick = async () => {
        try {
          await api("/api/admin/reports/" + item.id + "/resolve", {method:"POST",headers:{"X-Admin-Password":adminPassword}});
          await loadAdmin();
        } catch(err) {toast(err.message);}
      };
      row.appendChild(btn);
    }
    reports.appendChild(row);
  });
  const audit = $("adminAudit");
  audit.replaceChildren();
  if (!data.audit) audit.textContent = "Harakatlar tarixi faqat bosh adminga ko'rinadi";
  else if (!data.audit.length) audit.textContent = "Hali harakatlar yo'q";
  else data.audit.forEach(item => {
    const row = document.createElement("p");
    row.textContent = item.created_at + " — " + item.actor + " — " + item.action + " #" + (item.listing_id ?? "");
    audit.appendChild(row);
  });
}

/* Appearance settings: three layouts + day/night/auto, stored locally. */
(function initAppearanceSettings() {
  const allowedModes = ["light","dark","auto"];
  const allowedDesigns = ["modern","minimal","classic"];
  const read = (key,fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const save = (key,value) => { try { localStorage.setItem(key,value); } catch {} };
  let mode = read("im-color-mode","light");
  let design = read("im-design","modern");
  if (!allowedModes.includes(mode)) mode="light";
  if (!allowedDesigns.includes(design)) design="modern";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  function apply() {
    const actual = mode === "auto" ? (prefersDark.matches ? "dark":"light") : mode;
    document.documentElement.dataset.mode = actual;
    document.documentElement.dataset.design = design;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",actual==="dark"?"#101b2d":"#ffffff");
    document.querySelectorAll("[data-color-mode]").forEach(b => { const active=b.dataset.colorMode===mode; b.classList.toggle("selected",active); b.setAttribute("aria-pressed",String(active)); });
    document.querySelectorAll("[data-design]").forEach(b => { const active=b.dataset.design===design; b.classList.toggle("selected",active); b.setAttribute("aria-pressed",String(active)); });
  }
  function setup() {
    const panel=document.getElementById("appearancePanel"),backdrop=document.getElementById("settingsBackdrop"),toggle=document.getElementById("settingsToggle"),close=document.getElementById("settingsClose");
    if(!panel||!toggle||!backdrop||!close) return;
    let previousFocus=null;
    const setOpen=open => {
      if(open) previousFocus=document.activeElement;
      panel.classList.toggle("open",open);
      panel.setAttribute("aria-hidden",String(!open));
      backdrop.classList.toggle("hidden",!open);
      toggle.setAttribute("aria-expanded",String(open));
      document.body.classList.toggle("settings-open",open);
      if(open) close.focus(); else if(previousFocus) previousFocus.focus();
    };
    toggle.addEventListener("click",()=>setOpen(!panel.classList.contains("open")));
    close.addEventListener("click",()=>setOpen(false));
    backdrop.addEventListener("click",()=>setOpen(false));
    document.addEventListener("keydown",event=>{
      if(event.key==="Escape" && panel.classList.contains("open")) setOpen(false);
      if(event.key==="Tab" && panel.classList.contains("open")){
        const controls=[...panel.querySelectorAll("button")];
        if(event.shiftKey && document.activeElement===controls[0]){event.preventDefault();controls[controls.length-1].focus();}
        else if(!event.shiftKey && document.activeElement===controls[controls.length-1]){event.preventDefault();controls[0].focus();}
      }
    });
    panel.querySelectorAll("[data-color-mode]").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.colorMode;save("im-color-mode",mode);apply();}));
    panel.querySelectorAll("[data-design]").forEach(b=>b.addEventListener("click",()=>{design=b.dataset.design;save("im-design",design);apply();}));
    apply();
  }
  if(prefersDark.addEventListener) prefersDark.addEventListener("change",()=>{if(mode==="auto")apply();});
  else if(prefersDark.addListener) prefersDark.addListener(()=>{if(mode==="auto")apply();});
  apply();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})();

/* Simple sign-in: native Telegram contact consent, with a guided browser fallback. */
let loginChallenge = "";
let loginAttempt = 0;
let loginPreviousFocus = null;
let loginInertElements = [];
function phoneLoginMessage(message) { $("phoneLoginMessage").textContent = message; }
function nativePhoneLoginAvailable() {
  const tg = window.Telegram?.WebApp;
  return Boolean(tg?.initData && typeof tg.requestContact === "function" && tg.isVersionAtLeast?.("6.9"));
}
function showPhoneCodeLogin() {
  loginAttempt++;
  $("phoneLoginNative").classList.add("hidden");
  $("phoneLoginBrowser").classList.remove("hidden");
  $("phoneLoginStep1").classList.remove("hidden");
  $("phoneLoginStep2").classList.add("hidden");
  $("phoneLoginStart").disabled = false;
  $("phoneLoginVerify").disabled = false;
  phoneLoginMessage("");
  $("phoneLoginPhone").focus();
}
function openPhoneLogin() {
  const dialog = $("phoneLoginModal");
  if (!dialog || !dialog.classList.contains("hidden")) return;
  loginPreviousFocus = document.activeElement;
  document.body.appendChild(dialog);
  loginInertElements = [...document.body.children].filter(el => el !== dialog && !el.inert && !["SCRIPT","STYLE"].includes(el.tagName));
  loginInertElements.forEach(el => { el.inert = true; });
  document.body.classList.add("phone-login-open");
  dialog.classList.remove("hidden");
  if (nativePhoneLoginAvailable()) {
    $("phoneLoginNative").classList.remove("hidden");
    $("phoneLoginBrowser").classList.add("hidden");
    $("phoneLoginQuick").disabled = false;
    phoneLoginMessage("");
    $("phoneLoginQuick").focus();
  } else showPhoneCodeLogin();
}
function closePhoneLogin() {
  loginAttempt++;
  $("phoneLoginModal")?.classList.add("hidden");
  document.body.classList.remove("phone-login-open");
  loginInertElements.forEach(el => { el.inert = false; });
  loginInertElements = [];
  loginPreviousFocus?.focus();
}
function finishPhoneLogin(data) {
  writeStorage("im_auth_token", data.token);
  $("phoneLoginCode").value = "";
  loginChallenge = "";
  closePhoneLogin();
  $("phoneLoginStatus").textContent = "✓ Tasdiqlangan: " + data.phone;
  toast("Kirdingiz! Endi qo‘ng‘iroq qilish yoki SMS yozish mumkin.");
}
async function waitForTelegramContact(attempt) {
  try {
    for (let i = 0; i < 20 && attempt === loginAttempt; i++) {
      const data = await api("/api/auth/telegram/miniapp", {
        method: "POST", body: JSON.stringify({init_data: window.Telegram.WebApp.initData})
      });
      if (attempt !== loginAttempt) return;
      if (data.authenticated && data.token) { finishPhoneLogin(data); return; }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    if (attempt === loginAttempt) phoneLoginMessage("Tasdiq hali kelmadi. Qayta urinib ko‘ring yoki «Kod bilan kirish»ni tanlang.");
  } catch (e) {
    if (attempt === loginAttempt) phoneLoginMessage(e.message);
  } finally {
    if (attempt === loginAttempt) $("phoneLoginQuick").disabled = false;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  $("openPhoneLogin")?.addEventListener("click", openPhoneLogin);
  $("closePhoneLogin")?.addEventListener("click", closePhoneLogin);
  $("phoneLoginUseCode").addEventListener("click", showPhoneCodeLogin);
  $("phoneLoginBack").addEventListener("click", showPhoneCodeLogin);
  $("phoneLoginQuick").addEventListener("click", () => {
    const attempt = ++loginAttempt;
    $("phoneLoginQuick").disabled = true;
    phoneLoginMessage("Telegram oynasida raqamingizni ulashishga ruxsat bering.");
    try {
      // Invoke synchronously in the click gesture so Telegram can show its consent dialog.
      window.Telegram.WebApp.requestContact(sent => {
        if (attempt !== loginAttempt) return;
        if (!sent) {
          $("phoneLoginQuick").disabled = false;
          phoneLoginMessage("Raqam ulashilmadi. Kirish uchun qayta bosing va ruxsat bering.");
          return;
        }
        phoneLoginMessage("Raqamingiz tekshirilmoqda…");
        waitForTelegramContact(attempt);
      });
    } catch (e) {
      $("phoneLoginQuick").disabled = false;
      phoneLoginMessage("Bu Telegram versiyasida «Kod bilan kirish» tugmasidan foydalaning.");
    }
  });
  $("phoneLoginStart").addEventListener("click", async () => {
    const phone = $("phoneLoginPhone").value.trim();
    if (!/^(?:\+?998)?\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
      phoneLoginMessage("Telefon raqamingizni kiriting. Masalan: +998901234567");
      return;
    }
    const attempt = ++loginAttempt;
    $("phoneLoginStart").disabled = true;
    phoneLoginMessage("Tayyorlanmoqda…");
    try {
      const data = await api("/api/auth/telegram/start", {method:"POST",body:JSON.stringify({phone})});
      if (attempt !== loginAttempt) return;
      loginChallenge = data.challenge;
      $("phoneLoginStep1").classList.add("hidden");
      $("phoneLoginStep2").classList.remove("hidden");
      $("phoneLoginBot").href = data.bot_url;
      phoneLoginMessage("");
      $("phoneLoginBot").focus();
    } catch (e) { if (attempt === loginAttempt) phoneLoginMessage(e.message); }
    finally { if (attempt === loginAttempt) $("phoneLoginStart").disabled = false; }
  });
  $("phoneLoginBot").addEventListener("click", event => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initData && typeof tg.openTelegramLink === "function") {
      try { tg.openTelegramLink(event.currentTarget.href); event.preventDefault(); } catch (_) {}
    }
  });
  $("phoneLoginVerify").addEventListener("click", async () => {
    const code = $("phoneLoginCode").value.trim();
    if (!/^\d{6}$/.test(code)) { phoneLoginMessage("Bot yuborgan 6 raqamli kodni kiriting."); return; }
    const attempt = ++loginAttempt;
    $("phoneLoginVerify").disabled = true;
    phoneLoginMessage("Tekshirilmoqda…");
    try {
      const data = await api("/api/auth/telegram/verify", {method:"POST",body:JSON.stringify({challenge:loginChallenge,code})});
      if (attempt === loginAttempt) finishPhoneLogin(data);
    } catch (e) { if (attempt === loginAttempt) phoneLoginMessage(e.message); }
    finally { if (attempt === loginAttempt) $("phoneLoginVerify").disabled = false; }
  });
  $("phoneLoginPhone").addEventListener("keydown", e => { if(e.key === "Enter") { e.preventDefault(); $("phoneLoginStart").click(); } });
  $("phoneLoginCode").addEventListener("keydown", e => { if(e.key === "Enter") { e.preventDefault(); $("phoneLoginVerify").click(); } });
  $("phoneLoginModal").addEventListener("keydown", e => {
    if(e.key === "Escape") { e.stopPropagation(); closePhoneLogin(); }
    if(e.key !== "Tab") return;
    const controls = [...e.currentTarget.querySelectorAll("button, input, a[href]")].filter(el => !el.disabled && el.getClientRects().length);
    const first=controls[0], last=controls[controls.length-1];
    if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  });
  $("phoneLogout")?.addEventListener("click", async () => {
    loginAttempt++;
    const token=readStorage("im_auth_token");
    if(token) try {await api("/api/auth/logout",{method:"POST",headers:{Authorization:"Bearer "+token}});} catch(e){}
    localStorage.removeItem("im_auth_token");
    $("phoneLoginStatus").textContent="Mehmon sifatida ko‘rish mumkin. Bog‘lanish uchun kiring.";
    toast("Akkauntdan chiqildi");
  });
  const token=readStorage("im_auth_token");
  if(token) api("/api/auth/me",{headers:{Authorization:"Bearer "+token}})
    .then(data=>{
      if(data.authenticated) $("phoneLoginStatus").textContent="✓ Tasdiqlangan: "+data.phone;
      else localStorage.removeItem("im_auth_token");
    }).catch(()=>{});
});

/* Keep the custom image picker in sync without changing upload handling. */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("addImage");
  const status = document.getElementById("addImageFileStatus");
  if (!input || !status) return;
  const update = () => {
    const count = input.files?.length || 0;
    status.textContent = count ? count === 1 ? input.files[0].name : count + " та расм танланди" : "Расм танланмаган";
  };
  input.addEventListener("change", update);
  document.getElementById("listingForm")?.addEventListener("reset", () => queueMicrotask(update));
  update();
});
