
"use strict";

/* IJARAMAKON — APP.JS */

// Render server ishga tushgach manzilni kiriting.
// Misol: https://ijaramakon-api.onrender.com
const API_URL = "";

const districts = [
  "Barcha hududlar",
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


const houseTypes = [
  "Yer uchastkali uy",
  "Ko'p qavatli uydagi kvartira"
];

const repairs = [
  "Ta'mirsiz",
  "Oddiy ta'mir",
  "Yaxshi ta'mir",
  "Yevro remont"
];

const rooms = [
  "1", "2", "3", "4", "5", "6", "7+"
];

const $ = id => document.getElementById(id);

let listings = [];
let adminListings = [];
let selectedIds = new Set();
let adminKey = "";
let toastTimer;

const savedIds = new Set(
  JSON.parse(localStorage.getItem("ijaraSaved") || "[]")
);

const clientId = getClientId();

function getClientId() {
  let id = localStorage.getItem("ijaraClientId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ijaraClientId", id);
  }

  return id;
}

function saveFavorites() {
  localStorage.setItem(
    "ijaraSaved",
    JSON.stringify([...savedIds])
  );
}

function showToast(message) {
  const el = $("toast");
  if (!el) return;

  el.textContent = message;
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    el.textContent = "";
  }, 3500);
}

function apiPath(path) {
  if (!API_URL) {
    throw new Error("Server hali ulanmagan");
  }

  return API_URL.replace(/\/$/, "") + path;
}

async function api(path, options = {}, isAdmin = false) {
  const headers = {
    ...(options.headers || {})
  };

  if (isAdmin && adminKey) {
    headers["X-Admin-Key"] = adminKey;
  }

  const response = await fetch(apiPath(path), {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Server xatosi");
  }

  return data;
}

function option(select, value, text) {
  const el = document.createElement("option");
  el.value = value;
  el.textContent = text;
  select.appendChild(el);
}

function fillSelect(id, values, firstText = "") {
  const el = $(id);
  if (!el) return;

  el.innerHTML = "";

  if (firstText) option(el, "", firstText);

  values.forEach(value => option(el, value, value));
}

function updateMahallas(prefix) {
  const district = $(prefix + "District").value;
  const select = $(prefix + "Mahalla");

  select.innerHTML = "";
  option(select, "", "Barcha mahallalar");

  (mahallalar[district] || []).forEach(name => {
    if (name !== "Barcha mahallalar") {
      option(select, name, name);
    }
  });
}

function initializeSelects() {
  ["search", "add"].forEach(prefix => {
    fillSelect(
      prefix + "District",
      districts.slice(1),
      prefix === "search"
        ? "Barcha hududlar"
        : "Tumanni tanlang"
    );

    fillSelect(
      prefix + "Type",
      houseTypes,
      prefix === "search"
        ? "Barcha uy turlari"
        : "Uy turini tanlang"
    );

    fillSelect(
      prefix + "Rooms",
      rooms,
      prefix === "search"
        ? "Barcha xonalar"
        : "Xonalar sonini tanlang"
    );

    fillSelect(
      prefix + "Repair",
      repairs,
      prefix === "search"
        ? "Barcha remontlar"
        : "Remontni tanlang"
    );

    $(prefix + "District").addEventListener(
      "change",
      () => updateMahallas(prefix)
    );

    updateMahallas(prefix);
  });
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(el => {
    el.hidden = el.id !== page;
  });

  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.page === page
    );
  });

  window.scrollTo(0, 0);

  if (page === "saved") renderSaved();
  if (page === "profile") renderProfile();
  if (page === "admin" && adminKey) loadAdmin();
  if (page === "search") renderListings("results", listings);
}

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(
    Number(price) || 0
  ) + " so'm";
}

function safeText(value) {
  return String(value ?? "");
}

function createText(tag, text, className = "") {
  const el = document.createElement(tag);
  el.textContent = safeText(text);
  if (className) el.className = className;
  return el;
}

function makeButton(text, callback, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", callback);
  return button;
}

function photoUrl(photo) {
  if (!photo || typeof photo !== "string") return "";

  if (photo.startsWith("https://")) return photo;

  if (photo.startsWith("/uploads/") && API_URL) {
    return API_URL.replace(/\/$/, "") + photo;
  }

  return "";
}

function showPhoto(url) {
  if (!url) return;

  $("bigPhoto").src = url;
  $("photoDialog").showModal();
}

function normalizeListing(item) {
  return {
    id: item.id,
    district: item.district || "",
    mahalla: item.mahalla || "",
    type: item.type || "",
    rooms: item.rooms || "",
    repair: item.repair || "",
    price: item.price || 0,
    phone: item.phone || "",
    description: item.description || "",
    status: item.status || "pending",
    photos: Array.isArray(item.photos)
      ? item.photos
      : []
  };
}

function createListingCard(raw, admin = false) {
  const item = normalizeListing(raw);

  const card = document.createElement("article");
  card.className = "listing-card";

  const imageBox = document.createElement("div");
  imageBox.className = "listing-image";

  const firstPhoto = photoUrl(item.photos[0]);

  if (firstPhoto) {
    const img = document.createElement("img");
    img.src = firstPhoto;
    img.alt = "Ijara uy rasmi";
    img.loading = "lazy";
    img.addEventListener("click", () => showPhoto(firstPhoto));
    imageBox.appendChild(img);
  } else {
    imageBox.appendChild(
      createText("div", "🏠 Rasm mavjud emas", "no-photo")
    );
  }

  if (!admin) {
    const heart = makeButton(
      savedIds.has(item.id) ? "♥" : "♡",
      () => {
        if (savedIds.has(item.id)) {
          savedIds.delete(item.id);
        } else {
          savedIds.add(item.id);
        }

        saveFavorites();
        renderAll();
        showToast("Saqlangan e'lonlar yangilandi");
      },
      "save-btn" + (savedIds.has(item.id) ? " saved" : "")
    );

    heart.setAttribute("aria-label", "E'lonni saqlash");
    imageBox.appendChild(heart);
  }

  if (admin) {
    const selectBox = document.createElement("label");
    selectBox.className = "admin-select";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = selectedIds.has(item.id);

    check.addEventListener("change", () => {
      if (check.checked) selectedIds.add(item.id);
      else selectedIds.delete(item.id);
      updateSelectedCount();
    });

    selectBox.appendChild(check);
    selectBox.append(" Tanlash");
    imageBox.appendChild(selectBox);
  }

  card.appendChild(imageBox);

  const body = document.createElement("div");
  body.className = "listing-body";

  body.appendChild(
    createText(
      "h3",
      `${item.rooms} xonali — ${item.type}`
    )
  );

  body.appendChild(
    createText("div", formatPrice(item.price), "price")
  );

  body.appendChild(
    createText(
      "p",
      `📍 ${item.district}, ${item.mahalla}`,
      "location"
    )
  );

  body.appendChild(
    createText(
      "p",
      `🏠 ${item.type} · 🛠 ${item.repair}`,
      "details"
    )
  );

  if (item.description) {
    body.appendChild(
      createText("p", item.description, "description")
    );
  }

  const status = createText(
    "span",
    item.status === "approved"
      ? "Tasdiqlangan"
      : item.status === "rejected"
      ? "Rad etilgan"
      : "Tekshirilmoqda",
    "status " + item.status
  );

  body.appendChild(status);

  const actions = document.createElement("div");
  actions.className = "listing-actions";

  const phone = String(item.phone).replace(/[^\d+]/g, "");

  if (phone) {
    const call = document.createElement("a");
    call.href = "tel:" + phone;
    call.textContent = "📞 Qo'ng'iroq";
    actions.appendChild(call);
  }

  if (item.photos.length > 1) {
    actions.appendChild(
      makeButton("🖼 Rasmlar", () => {
        let index = 0;
        const urls = item.photos.map(photoUrl).filter(Boolean);

        if (!urls.length) return;

        showPhoto(urls[index]);

        $("bigPhoto").onclick = () => {
          index = (index + 1) % urls.length;
          $("bigPhoto").src = urls[index];
        };
      })
    );
  }

  body.appendChild(actions);
  card.appendChild(body);

  return card;
}

function renderListings(containerId, items, admin = false) {
  const container = $(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!items.length) {
    container.appendChild(
      createText("p", "Hozircha e'lonlar mavjud emas.")
    );
    return;
  }

  items.forEach(item => {
    container.appendChild(createListingCard(item, admin));
  });
}

function renderSaved() {
  renderListings(
    "savedResults",
    listings.filter(item => savedIds.has(item.id))
  );
}

function renderAll() {
  renderListings("homeListings", listings.slice(0, 12));
  renderListings("results", listings);
  renderSaved();
}

function searchHouses() {
  const district = $("searchDistrict").value;
  const mahalla = $("searchMahalla").value;
  const type = $("searchType").value;
  const room = $("searchRooms").value;
  const repair = $("searchRepair").value;
  const price = Number($("searchPrice").value) || 0;

  const filtered = listings.filter(item => {
    if (district && item.district !== district) return false;
    if (mahalla && item.mahalla !== mahalla) return false;
    if (type && item.type !== type) return false;
    if (room && String(item.rooms) !== room) return false;
    if (repair && item.repair !== repair) return false;
    if (price && Number(item.price) > price) return false;
    return true;
  });

  renderListings("results", filtered);
  showToast(`${filtered.length} ta e'lon topildi`);
}

async function loadListings() {
  if (!API_URL) {
    renderAll();
    showToast("Server ulanmaguncha e'lonlar yuklanmaydi");
    return;
  }

  try {
    const data = await api("/api/listings");
    listings = Array.isArray(data)
      ? data.map(normalizeListing)
      : (data.listings || []).map(normalizeListing);

    renderAll();
  } catch (error) {
    showToast(error.message);
  }
}

async function submitListing(event) {
  event.preventDefault();

  if (!API_URL) {
    showToast("Avval serverni ulash kerak");
    return;
  }

  const phone = $("addPhone").value.trim();

  if (!/^\+998\d{9}$/.test(phone)) {
    showToast("Telefonni +998901234567 shaklida kiriting");
    return;
  }

  const files = [...$("addPhotos").files];

  if (files.length > 5) {
    showToast("5 tagacha rasm tanlang");
    return;
  }

  for (const file of files) {
    if (file.size > 3 * 1024 * 1024) {
      showToast("Har bir rasm 3 MB dan kichik bo'lsin");
      return;
    }
  }

  const form = new FormData();

  const fields = {
    district: $("addDistrict").value,
    mahalla: $("addMahalla").value,
    type: $("addType").value,
    rooms: $("addRooms").value,
    repair: $("addRepair").value,
    price: $("addPrice").value,
    phone,
    description: $("addDescription").value,
    client_id: clientId
  };

  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, value);
  });

  files.forEach(file => form.append("photos", file));

  try {
    await api("/api/listings", {
      method: "POST",
      body: form
    });

    $("addForm").reset();
    updateMahallas("add");
    $("addMessage").textContent =
      "E'lon yuborildi. Admin tasdiqlashini kuting.";

    showToast("E'lon muvaffaqiyatli yuborildi");
    showPage("home");
    await loadListings();
  } catch (error) {
    showToast(error.message);
  }
}

function renderProfile() {
  const profile = JSON.parse(
    localStorage.getItem("ijaraProfile") || "{}"
  );

  $("profileName").value = profile.name || "";
  $("profilePhone").value = profile.phone || "";

  const mine = listings.filter(
    item => item.client_id === clientId
  );

  renderListings("myListings", mine);
}

function saveProfile() {
  const profile = {
    name: $("profileName").value.trim(),
    phone: $("profilePhone").value.trim()
  };

  localStorage.setItem(
    "ijaraProfile",
    JSON.stringify(profile)
  );

  $("profileMessage").textContent = "Profil saqlandi";
  showToast("Profil saqlandi");
}

function updateSelectedCount() {
  $("selectedCount").textContent =
    `${selectedIds.size} ta tanlandi`;
}

function renderStats(items) {
  const stats = $("stats");
  stats.innerHTML = "";

  const values = [
    ["Jami", items.length],
    ["Kutilmoqda", items.filter(x => x.status === "pending").length],
    ["Tasdiqlangan", items.filter(x => x.status === "approved").length],
    ["Rad etilgan", items.filter(x => x.status === "rejected").length]
  ];

  values.forEach(([name, count]) => {
    const box = document.createElement("div");
    box.className = "stat";

    box.appendChild(createText("strong", count));
    box.appendChild(createText("span", name));

    stats.appendChild(box);
  });
}

async function loadAdmin() {
  try {
    const data = await api("/api/admin/listings", {}, true);

    adminListings = Array.isArray(data)
      ? data
      : data.listings || [];

    selectedIds.clear();
    updateSelectedCount();

    $("adminLogin").hidden = true;
    $("adminDashboard").hidden = false;

    renderStats(adminListings);
    filterAdmin();
  } catch (error) {
    $("adminLogin").hidden = false;
    $("adminDashboard").hidden = true;
    $("adminMessage").textContent = error.message;
  }
}

function filterAdmin() {
  const filter = $("adminFilter").value;

  const items = adminListings.filter(
    item => filter === "all" || item.status === filter
  );

  renderListings("adminListings", items, true);
}

async function bulkAction(action) {
  if (!selectedIds.size) {
    showToast("Avval e'lonlarni tanlang");
    return;
  }

  if (action === "delete" &&
      !confirm("Tanlangan e'lonlar o'chirilsinmi?")) {
    return;
  }

  try {
    await api("/api/admin/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ids: [...selectedIds],
        action
      })
    }, true);

    showToast("Amal bajarildi");
    await loadAdmin();
    await loadListings();
  } catch (error) {
    showToast(error.message);
  }
}

function initializeEvents() {
  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.page);
    });
  });

  $("searchButton").addEventListener("click", searchHouses);
  $("addForm").addEventListener("submit", submitListing);
  $("saveProfile").addEventListener("click", saveProfile);

  $("closePhoto").addEventListener("click", () => {
    $("photoDialog").close();
    $("bigPhoto").onclick = null;
  });

  $("adminEnter").addEventListener("click", () => {
    adminKey = $("adminKey").value.trim();

    if (!adminKey) {
      showToast("Admin kalitini kiriting");
      return;
    }

    loadAdmin();
  });

  $("adminLogout").addEventListener("click", () => {
    adminKey = "";
    $("adminKey").value = "";
    $("adminLogin").hidden = false;
    $("adminDashboard").hidden = true;
  });

  $("adminRefresh").addEventListener("click", loadAdmin);
  $("adminFilter").addEventListener("change", filterAdmin);

  $("selectAll").addEventListener("change", event => {
    selectedIds.clear();

    if (event.target.checked) {
      adminListings.forEach(item => selectedIds.add(item.id));
    }

    updateSelectedCount();
    filterAdmin();
  });

  $("bulkApprove").addEventListener(
    "click", () => bulkAction("approve")
  );

  $("bulkReject").addEventListener(
    "click", () => bulkAction("reject")
  );

  $("bulkDelete").addEventListener(
    "click", () => bulkAction("delete")
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSelects();
  initializeEvents();
  showPage("home");
  loadListings();
});
