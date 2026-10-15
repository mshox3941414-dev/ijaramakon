
"use strict";

// IJARAMAKON — APP.JS
// GitHub Pages va Render API integratsiyasi

const API_URL = "https://ijaramakon.onrender.com";
// Agar Render manzilingiz boshqacha bo'lsa, almashtiring.

const districts = [
  "Urganch shahri", "Xiva shahri",
  "Bog'ot tumani", "Gurlan tumani",
  "Hazorasp tumani", "Xonqa tumani",
  "Xiva tumani", "Qo'shko'pir tumani",
  "Shovot tumani", "Tuproqqal'a tumani",
  "Urganch tumani", "Yangiariq tumani",
  "Yangibozor tumani"
];

// Mahallalar ro'yxati.
// Excel fayldagi to'liq ro'yxatni keyin qo'shamiz.
// Noto'g'ri mahalla nomlarini taxminan kiritmaymiz.
const mahallalar = {
  "Bog'ot tumani": [
    "Oltinqum", "Bo'ka", "Nurafshon",
    "Yangi qadam", "Mehnatguli", "G'alaba",
    "Ma'naviyat", "O'zgarish", "Nurli hayot",
    "To'pchi", "Yuksalish", "Paxtaobod"
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
const money = n => Number(n || 0).toLocaleString("uz-UZ");
const escapeHTML = value => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const clientId = (() => {
  let id = localStorage.getItem("im_client");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("im_client", id);
  }
  return id;
})();

let listings = [];
let adminPassword = "";
let toastTimer;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 3500);
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData) && options.body) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(API_URL + path, {
    ...options,
    headers
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server noto'g'ri javob qaytardi");
  }
  if (!response.ok) {
    throw new Error(data.error || "Server xatosi");
  }
  return data;
}

function populate(id, values, firstLabel) {
  const select = $(id);
  select.replaceChildren();
  if (firstLabel !== null) {
    select.add(new Option(firstLabel, ""));
  }
  values.forEach(v => select.add(new Option(v, v)));
}

function updateMahalla(prefix) {
  const district = $(prefix + "District").value;
  const values = mahallalar[district] || [];
  populate(
    prefix + "Mahalla",
    values,
    prefix === "search" ? "Barcha mahallalar" : "Mahallani tanlang"
  );
  // Ro'yxati hali kiritilmagan tumanlarda
  // foydalanuvchi mahalla nomini o'zi yozishi mumkin.
  const select = $(prefix + "Mahalla");
  if (district && !values.length) {
    select.add(new Option("Boshqa mahalla", "__other__"));
  }
}

function setupFilters() {
  ["search", "add"].forEach(prefix => {
    populate(prefix + "District", districts,
      prefix === "search" ? "Barcha hududlar" : "Tumanni tanlang");
    populate(prefix + "Type", houseTypes,
      prefix === "search" ? "Barcha uy turlari" : "Uy turini tanlang");
    populate(prefix + "Rooms", roomTypes,
      prefix === "search" ? "Barcha xonalar" : "Xonalar soni");
    populate(prefix + "Repair", repairTypes,
      prefix === "search" ? "Barcha ta'mir turlari" : "Ta'mir holati");
    $(prefix + "District").addEventListener("change",
      () => updateMahalla(prefix));
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
  try {
    return JSON.parse(localStorage.getItem("im_saved") || "[]");
  } catch {
    return [];
  }
}
function toggleSaved(id) {
  const ids = getSavedIds();
  const next = ids.includes(id)
    ? ids.filter(x => x !== id)
    : [...ids, id];
  localStorage.setItem("im_saved", JSON.stringify(next));
  renderHome();
  renderSearch();
  renderSaved();
  toast(ids.includes(id) ? "Saqlanganlardan olindi" : "E'lon saqlandi");
}

function statusLabel(status) {
  const labels = {
    pending: "⏳ Kutilmoqda",
    approved: "✅ Tasdiqlangan",
    rejected: "❌ Rad etilgan",
    rented: "🏠 Ijaraga berilgan"
  };
  return labels[status] || status;
}

function createCard(item, admin = false) {
  const card = document.createElement("article");
  card.className = "listing-card";
  const saved = getSavedIds().includes(item.id);
  const photo = item.photo_url
    ? `<img class="listing-photo" src="${escapeHTML(API_URL + item.photo_url)}" alt="Uy rasmi" loading="lazy">`
    : `<div class="listing-photo photo-placeholder">🏡</div>`;

  card.innerHTML = `
    ${photo}
    <div class="listing-body">
      <h3>${escapeHTML(item.type)}</h3>
      <p>📍 ${escapeHTML(item.district)}, ${escapeHTML(item.mahalla)}</p>
      <p>🚪 ${escapeHTML(item.rooms)} xona · ${escapeHTML(item.repair)}</p>
      <div class="listing-price">${money(item.price)} so'm/oy</div>
      <span class="status ${escapeHTML(item.status)}">${statusLabel(item.status)}</span>
      <div class="listing-actions">
        <button class="primary-btn view-btn">Batafsil</button>
        ${!admin ? `<button class="secondary-btn save-btn">${saved ? "❤️" : "🤍"}</button>` : ""}
      </div>
      ${admin ? `
      <div class="listing-actions">
        <button class="primary-btn approve-btn">Tasdiqlash</button>
        <button class="danger-btn reject-btn">Rad etish</button>
        <button class="secondary-btn rented-btn">Berildi</button>
        <button class="danger-btn delete-btn">O'chirish</button>
      </div>` : ""}
    </div>`;

  card.querySelector(".view-btn").onclick = () => showDetail(item);
  if (!admin) {
    card.querySelector(".save-btn").onclick = () => toggleSaved(item.id);
  } else {
    card.querySelector(".approve-btn").onclick = () => adminAction(item.id, "approve");
    card.querySelector(".reject-btn").onclick = () => adminAction(item.id, "reject");
    card.querySelector(".rented-btn").onclick = () => adminAction(item.id, "rented");
    card.querySelector(".delete-btn").onclick = () => {
      if (confirm("E'lon o'chirilsinmi?")) adminAction(item.id, "delete");
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
  items.forEach(item => target.appendChild(createCard(item, admin)));
}

function renderHome() {
  renderCards("latestListings",
    listings.filter(x => x.status === "approved").slice(0, 6));
}
function renderSearch() {
  const district = $("searchDistrict").value;
  const mahalla = $("searchMahalla").value;
  const type = $("searchType").value;
  const rooms = $("searchRooms").value;
  const repair = $("searchRepair").value;
  const max = Number($("searchMaxPrice").value || 0);
  const filtered = listings.filter(x =>
    x.status === "approved" &&
    (!district || x.district === district) &&
    (!mahalla || mahalla === "__other__" || x.mahalla === mahalla) &&
    (!type || x.type === type) &&
    (!rooms || x.rooms === rooms) &&
    (!repair || x.repair === repair) &&
    (!max || Number(x.price) <= max)
  );
  $("resultCount").textContent = filtered.length + " ta";
  renderCards("searchResults", filtered);
}
function renderSaved() {
  const ids = getSavedIds();
  renderCards("savedListings",
    listings.filter(x => ids.includes(x.id) && x.status === "approved"));
}
function renderProfileListings() {
  renderCards("myListings", listings.filter(x => x.owner === clientId));
}

function showDetail(item) {
  const content = $("detailContent");
  content.replaceChildren();
  const wrapper = document.createElement("div");
  const photo = item.photo_url
    ? `<img class="detail-photo" src="${escapeHTML(API_URL + item.photo_url)}" alt="Uy rasmi">`
    : `<div class="listing-photo photo-placeholder">🏡</div>`;
  wrapper.innerHTML = `
    ${photo}
    <h2>${escapeHTML(item.type)}</h2>
    <div class="listing-price">${money(item.price)} so'm/oy</div>
    <p><b>Hudud:</b> ${escapeHTML(item.district)}</p>
    <p><b>Mahalla:</b> ${escapeHTML(item.mahalla)}</p>
    <p><b>Manzil:</b> ${escapeHTML(item.address)}</p>
    <p><b>Xonalar:</b> ${escapeHTML(item.rooms)}</p>
    <p><b>Ta'mir:</b> ${escapeHTML(item.repair)}</p>
    <p><b>Telefon:</b> ${escapeHTML(item.phone)}</p>
    <p class="detail-description">${escapeHTML(item.description)}</p>
    <a class="primary-btn" style="display:inline-block;text-decoration:none"
       href="tel:${escapeHTML(item.phone)}">📞 Qo'ng'iroq qilish</a>
  `;
  content.appendChild(wrapper);
  $("detailModal").classList.remove("hidden");
}

async function loadListings() {
  try {
    const data = await api("/api/listings?owner=" + encodeURIComponent(clientId));
    listings = data.listings || [];
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
  const district = $("addDistrict").value;
  let mahalla = $("addMahalla").value;
  if (mahalla === "__other__") {
    mahalla = prompt("Mahalla nomini kiriting:")?.trim() || "";
  }
  if (!mahalla) return toast("Mahallani kiriting");

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
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  const image = $("addImage").files[0];
  if (image) {
    if (image.size > 5 * 1024 * 1024) {
      return toast("Rasm hajmi 5 MB dan oshmasin");
    }
    form.append("photo", image);
  }
  button.disabled = true;
  try {
    await api("/api/listings", { method: "POST", body: form });
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
  localStorage.setItem("im_profile", JSON.stringify(profile));
  toast("Profil saqlandi");
}

function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem("im_profile") || "{}");
    $("profileName").value = p.name || "";
    $("profilePhone").value = p.phone || "";
  } catch {}
}

async function loadAdmin() {
  try {
    const data = await api("/api/admin/listings", {
      headers: { "X-Admin-Password": adminPassword }
    });
    $("adminLogin").classList.add("hidden");
    $("adminContent").classList.remove("hidden");
    renderCards("pendingListings",
      data.listings.filter(x => x.status === "pending"), true);
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
    await api(`/api/admin/listings/${id}/${action}`, {
      method: "POST",
      headers: { "X-Admin-Password": adminPassword }
    });
    toast("Amal bajarildi");
    await loadAdmin();
    await loadListings();
  } catch (err) {
    toast(err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  loadProfile();

  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.page));
  });

  $("searchButton").onclick = renderSearch;
  $("resetSearch").onclick = () => {
    ["searchDistrict", "searchType", "searchRooms", "searchRepair",
     "searchMaxPrice"].forEach(id => $(id).value = "");
    updateMahalla("search");
    renderSearch();
  };
  $("listingForm").onsubmit = submitListing;
  $("profileForm").onsubmit = saveProfile;

  $("adminLoginButton").onclick = () => {
    adminPassword = $("adminPassword").value;
    if (adminPassword) loadAdmin();
  };
  $("adminRefresh").onclick = loadAdmin;
  $("adminLogout").onclick = () => {
    adminPassword = "";
    $("adminPassword").value = "";
    $("adminContent").classList.add("hidden");
    $("adminLogin").classList.remove("hidden");
  };

  $("closeDetail").onclick = () => $("detailModal").classList.add("hidden");
  $("detailModal").onclick = event => {
    if (event.target === $("detailModal")) {
      $("detailModal").classList.add("hidden");
    }
  };
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") $("detailModal").classList.add("hidden");
  });

  loadListings();
});
