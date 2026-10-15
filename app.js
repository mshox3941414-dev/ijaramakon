
"use strict";

// IJARAMAKON - APP.JS
// 1-QISM: XORAZM HUDUDLARI VA MAHALLALAR

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

const mahallalar = {
  "Bog'ot tumani": [
    "Barcha mahallalar",
    "Oltinqum", "Bo'ka", "Nurafshon",
    "Yangi qadam", "Mehnatguli", "G'alaba",
    "Ma'naviyat", "O'zgarish", "Nurli hayot",
    "To'pchi", "Yuksalish", "Paxtaobod",
    "Qipchoq", "Ashxabod", "Hunarmand",
    "Ko'na birlashuv", "Nayman",
    "Qalajiqqal'a", "Oq oltin", "Ustalar",
    "Yosh o'smir", "Namuna", "Sohibkor",
    "Madaniyat", "Tozabozor", "Oqtepa",
    "Bog'iston", "Nurli maskan", "Gulzor",
    "Hurriyat", "Gulshan", "Qorabog'",
    "Sahovat", "Ortiq Otajonov",
    "Dehqonobod", "Abu Rayxon Beruniy",
    "Uzumzor", "Qulonqorabog'", "Navro'z",
    "Bog'zor", "Navbahor", "Obod",
    "O'zbekiston"
  ],

  "Gurlan tumani": [
    "Barcha mahallalar",
    "Dehqon", "Do'simbiy", "Bo'zqal'a",
    "Qangli", "Chinobod", "Esabiy",
    "Do'stlik", "Sovunchi", "Chakkalar",
    "O'yilma", "Shang'i", "Eshimjiron",
    "Birlashgan", "Besh uy", "Bog'ishamol",
    "Oqqum", "Dehqonobod", "Nurafshon",
    "Baynalmilal", "Saxtiyon", "Taxtako'pir",
    "Navbir-yop", "Paxtachi", "Moyli",
    "Marbugat", "Boldoqli", "Olg'a",
    "Yormish", "Olchin", "Ziyokor",
    "Vatanparvar", "Nurli yo'l", "Navbahor",
    "Mevazor", "Do'stlik bog'i", "Gulshan",
    "Ishonch", "Nurobod", "Jaloyir",
    "Obod", "Nukus", "Qatariq",
    "Marifat", "Bog'iston", "Yangi bog'",
    "Yangi asr", "Shodlik", "Fidokor"
  ],

  "Qo'shko'pir tumani": [
    "Barcha mahallalar",
    "Ayronko'l", "Adolat", "Ittifoq",
    "O'rta qishloq", "Qadriyat", "Vaximchi",
    "Zarbdor", "Tagalak", "Paxtakor",
    "Dovud", "Arablar", "Bog'zor",
    "Xosiyon", "Kenagas", "Baratlar",
    "Ko'ktom", "Sherobod", "Shixmashhad",
    "Polvon", "Baxoriston", "Qorovul",
    "Oshok ka'la", "Xayrobod", "Amirqum",
    "Oltin voha", "Yoshlik", "Qoramon",
    "Ko'nazey", "Gulzor", "Durdona",
    "Burloq", "Shixobod", "Uyg'ur",
    "Mehnatobod", "Yovg'ir", "Xonobod",
    "Bekobod", "O'rtayop", "Ilgaldi",
    "Iqbol", "Taraqqiyot", "Madaniyat",
    "Chamanzor", "Yangilik", "Nezaxas",
    "Mesit", "Do'stlik"
  ],

  "Tuproqqal'a tumani": [
    "Barcha mahallalar",
    "Saidlar", "Hazorasp", "Navbahor",
    "Shexlar", "Sarimoy", "Pastom",
    "Yoshlik", "Yo'ldosh Ohunboboev",
    "Muhabbat", "Sayapir", "Sharlauk",
    "Nukus maskani", "Tuproqqal'a maskani",
    "Saxovat", "Obod", "Yakka chiqir",
    "Nurobod", "Yangi zamin"
  ],

  "Urganch tumani": [
    "Barcha mahallalar",
    "G'alaba", "Qo'ng'irot", "Xilol",
    "Munis Xorazmiy", "Adolat", "Qipchoq",
    "Mergan ovul", "Ko'xna ovul", "Jayxun",
    "Shermatlar", "Qiyot", "Rovot",
    "Kattabog'", "Oq yop", "Gulobod",
    "Killavut", "Qumravot", "Anjirchilar",
    "Hamid Olimjon", "Komiljon Otaniyazov",
    "Yuqoriovul", "Yuqorijirmiz",
    "Chakka ko'li", "Xojiboylar",
    "Oq oltin", "Miroblar", "Bog'dorchi",
    "Zargarlar", "Obod", "Beruniy",
    "Oq maktab", "Uyshun", "Ok ariklar",
    "Mevazor", "Arboblar", "Orzu",
    "Sholikorlar", "Qoramon", "Boqaylar",
    "Oyok bog'", "Arablar", "Bo'ston",
    "Shodlik", "Tandirchi", "Beshayvon",
    "Qaychili", "Shoxidonlar",
    "Bobodehqon", "Tadqiqotchilar",
    "Uchko'prik", "Turkmanlar", "Yoshlik",
    "Cho'lobod", "Yangiobod",
    "Yangi O'rtabog'", "O'rtado'rman"
  ],

  "Urganch shahri": [
    "Barcha mahallalar",
    "Feruz", "Al-Xorazmiy", "Gulshan",
    "Yangi obod", "Mash'al", "Mustaqillik",
    "Yangi hayot", "Gulzor", "Bobur",
    "Avesto", "Shodlik", "Ziyokorlar",
    "Yuqori bog'", "Navruz", "Ma'rifat",
    "Obi hayot", "Kamolot", "Xamjihatlik",
    "Binokor", "Ashhabad", "Bo'ston",
    "Istiqlol", "Toza bog'", "Navbahor",
    "Olma bog'", "Jingovuz", "Nurli xayot",
    "Yangi O'zbekiston", "Saxovat",
    "Jambul", "Ko'hna qal'a",
    "J.Manguberdi", "Islomobod",
    "Olimpiya", "Baynalminalchi",
    "Umid", "Gulchilar", "Besh mergan",
    "Do'stlik", "Temir yo'lchi"
  ],

  "Hazorasp tumani": [
    "Barcha mahallalar",
    "Muxomon", "Pichoqchi", "Kamolot",
    "Karvak", "Bo'ston", "Otaliq",
    "Amudaryo", "Paxlavon Maxmud",
    "Ovshar", "Yangibozor", "Shovot",
    "Oq maydon", "Qovunchi",
    "Temirchi maskani", "Kirtepa",
    "Sulaymon qal'asi", "G'.G'ulom",
    "Yangi xayot", "Istiqlol",
    "Aloqali ko'l", "Bogi eram",
    "Sanoat", "Gulzor", "Mustaqillik",
    "Zehnli", "Navro'z", "Yangiobod",
    "Bog'dor", "Ming otliqlar",
    "Juvarxos", "Ziyolilar",
    "Jaloladdin Manguberdi",
    "Yuqori Shovot", "Beshta",
    "Taraqqiyot", "Buyuk Simo",
    "Shoduxurram", "Ishchilar",
    "Al-Xorazmiy", "Munis Xorazmiy",
    "Buyuk ajdodlar", "Obod zamin",
    "Oybek nomli", "Barkamol avlod",
    "Bog'irog'lar", "Shukrona"
  ],

  "Xiva tumani": [
    "Barcha mahallalar",
    "Chanashik", "Qora qum", "Juryon",
    "Chinobod", "Pishkanik", "Oq yop",
    "Gulshan", "Istiqlol",
    "Kushchi kattabog'", "Gandimyon",
    "Shomoxulum", "Parchanxos",
    "Pana Maxsim", "Al Xorazmiy",
    "Go'ja guzari", "Polosulton",
    "Bo'ston", "Soyot", "Varangzon",
    "Pirnaxos", "Avaz Dunak",
    "Kattibosh", "Dashyoq", "Arvik",
    "Shayx Najmiddin Kubro",
    "Sho'r ko'l", "Qumyop", "Sapcha",
    "G'ovuk", "Parisha",
    "Atajon to'ra", "Serchalli"
  ],

  "Xiva shahri": [
    "Barcha mahallalar",
    "Sangar", "Lolazor", "Kalta minor",
    "Gulirayxon", "Angarik", "Gulshan-2",
    "Yangi hayot", "Qibla tozabog'",
    "Yangi Binokor", "Tozabog'",
    "Shixlar", "Guliston", "Qiyot",
    "Do'stlik", "Gazchi", "Qumyaska",
    "Yangi turmush", "Gilamchi",
    "Kaptarxona", "Ichon qa'la"
  ],

  "Xonqa tumani": [
    "Barcha mahallalar",
    "Do'rmon", "Navro'z", "Katta kuch",
    "Istiqlol", "Znaxos", "Shirin",
    "Yosh kuch", "Qoramozi", "Paxtakor",
    "Madaniyat", "Ilg'or", "Obod",
    "Guliston", "Oydin hayot",
    "Turkiston", "Durgadik", "Toma",
    "Nurobod", "Olchin", "Vatanparvar",
    "Muqaddas", "Paxtagul",
    "Madaniy er", "Nurafshon",
    "Yangilanish", "Yangi turmush",
    "Barkamollik", "Porlok", "Ehtirom",
    "Jannatmakon", "Do'stlik",
    "Mangulik", "Fidoyilar", "Ahillik",
    "Tayanch", "Moshto'g'ay",
    "Pahlavonlar", "Gulg'uncha",
    "Mustaqillik", "G'ayrat", "Bunyodkor"
  ],

  "Shovot tumani": [
    "Barcha mahallalar",
    "Katkal'a", "Komiljon ota", "Royat",
    "Monoq", "Chig'atoy", "Ipakchi",
    "Arbob", "Qangli", "Yangiyo'l",
    "Buyrachi", "Bo'ston", "Uzunko'l",
    "Eshon-qal'a", "Tuproqqal'a",
    "Archazor", "To'qmang'it",
    "Beshmargan", "Mevazor", "Arbek",
    "Madaniyat", "Idaliqal'a",
    "Qo'shko'pir", "Komiljon Otaniyozov",
    "Ogaxiy", "Oq-ko'l (Mahtumquli)",
    "Xitoy", "Navro'z", "Bog'bon",
    "Qiyot", "Ijtimoiyat", "Gulshan",
    "Paxtakor", "Maxtumquli",
    "Beshchiqir", "Guliston", "Zamondosh",
    "Yangi burloq", "Taraqqiyot",
    "Yangi O'zbekiston", "Shovot",
    "Qunduz", "Po'lat", "Oltinqal'a",
    "Istiqbol", "Qum-yop", "Bunyodkor",
    "Asavey", "Oq-oltin", "Do'stlik",
    "Yangiobod", "Turkiston",
    "Qirg'oq bo'yi"
  ],

  "Yangiariq tumani": [
    "Barcha mahallalar",
    "Savgan", "Achchikkuyi", "Chakir",
    "Jaloil", "Sherobod", "Qo'riqtom",
    "Chiqirchi", "Gulbog'", "Shixbog'i",
    "Yangier", "Turkiston", "Arboblar",
    "Ulug'bek", "Boyot", "Angiariq",
    "Vakillar", "Ostona", "Gulshanda",
    "Qo'ng'irot", "Shirsholi",
    "Egrisolma", "Karmish", "Soburzon",
    "Kattabog'", "Tagan", "Po'rsang",
    "Do'stlik", "Uyg'ur", "Xo'jalar",
    "Yangiariq", "Ogoxiy", "Tuzloq",
    "Sardorlar", "Urganch", "Yangiobod",
    "Oqmachit", "Qo'shloq"
  ],

  "Yangibozor tumani": [
    "Barcha mahallalar",
    "Xamid Olimjon", "Xalqobod",
    "Jayxun", "Istiqlol", "Navbaxor",
    "Oltinko'l", "Bog'olon", "Mang'itlar",
    "Ocha-qala", "Shoirlar",
    "Yuqori boshqir", "Shirinlar",
    "Iftixor", "Cho'bolonchi",
    "Ming Bog'olon", "Tozado'rman",
    "Bo'ston", "Yangi yop", "Xayvat",
    "Pahlavon Mahmud", "Qora-tepa",
    "Katli", "Qadriyat", "Guliston",
    "Navro'z", "Do'stlik", "Qiyot",
    "Barxayot", "Yangi obod"
  ]
};

// 1-QISM TUGADI
// 2-QISM SHU YERDAN DAVOM ETADI

/* =====================================
   IJARAMAKON - 2-QISM
   TANLASH OYNALARI VA NARX
===================================== */

// TANLASH VARIANTLARI
const options = {
  district: districts,

  houseType: [
    "Barcha uy turlari",
    "Hovli uy",
    "Kvartira"
  ],

  rooms: [
    "Farqi yo'q",
    "1 xona",
    "2 xona",
    "3 xona",
    "4 xona",
    "5 xona",
    "6 va undan ko'p"
  ],

  repair: [
    "Farqi yo'q",
    "Yangi remont",
    "Yaxshi holatda",
    "Oddiy holatda"
  ]
};

// OYNA SARLAVHALARI
const titles = {
  district: "🏛️ Xorazm hududlari",
  mahalla: "📍 Mahallani tanlang",
  houseType: "🏠 Uy turi",
  rooms: "🚪 Xonalar soni",
  repair: "🛠️ Remont holati"
};

// TUGMA BELGILARI
const icons = {
  district: "🏛️",
  mahalla: "📍",
  houseType: "🏠",
  rooms: "🚪",
  repair: "🛠️"
};

let activePicker = null;

// HTML ELEMENTINI OLISH
function getEl(id) {
  return document.getElementById(id);
}

// VARIANTLAR RO'YXATI
function getOptions(type) {
  if (type === "mahalla") {
    const district = getEl("district").value;

    return mahallalar[district] || [
      "Barcha mahallalar"
    ];
  }

  return options[type] || [];
}

// TANLASH OYNASINI OCHISH
function openPicker(type) {
  if (
    type === "mahalla" &&
    !getEl("district").value
  ) {
    alert("Avval tuman yoki shaharni tanlang!");
    return;
  }

  activePicker = type;

  getEl("modalTitle").textContent = titles[type];
  getEl("modalSearch").value = "";

  renderOptions(getOptions(type));

  getEl("pickerModal").hidden = false;
}

// TANLASH OYNASINI YOPISH
function closePicker() {
  getEl("pickerModal").hidden = true;
  activePicker = null;
}

// ASOSIY RO'YXATNI CHIQARISH
function renderOptions(items) {
  const list = getEl("modalList");
  list.innerHTML = "";

  if (!items.length) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "Ma'lumot topilmadi";
    list.appendChild(message);
    return;
  }

  items.forEach(name => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "option-item";

    const value = isDefault(name) ? "" : name;

    const selected =
      getEl(activePicker).value === value;

    if (selected) {
      item.classList.add("selected");
    }

    const title = document.createElement("span");
    title.textContent = name;

    const check = document.createElement("span");
    check.className = "check";
    check.textContent = selected ? "✓" : "○";

    item.append(title, check);

    item.onclick = () => {
      selectOption(activePicker, name);
    };

    list.appendChild(item);
  });
}

// BARCHA / FARQI YO'Q VARIANTLARI
function isDefault(name) {
  return [
    "Barcha hududlar",
    "Barcha mahallalar",
    "Barcha uy turlari",
    "Farqi yo'q"
  ].includes(name);
}

// TANLANGAN VARIANTNI SAQLASH
function selectOption(type, name) {
  const value = isDefault(name) ? "" : name;

  getEl(type).value = value;

  getEl(type + "Picker").textContent =
    icons[type] + " " + name;

  // TUMAN O'ZGARSA MAHALLANI TOZALASH
  if (type === "district") {
    getEl("mahalla").value = "";

    getEl("mahallaPicker").textContent =
      "📍 Barcha mahallalar";
  }

  closePicker();
}

// RO'YXAT ICHIDA QIDIRISH
function filterOptions() {
  if (!activePicker) return;

  const search = getEl("modalSearch")
    .value.toLocaleLowerCase("uz");

  const filtered = getOptions(activePicker)
    .filter(name =>
      name.toLocaleLowerCase("uz").includes(search)
    );

  renderOptions(filtered);
}

/* =====================================
   NARX TANLASH
===================================== */

// NARX OYNASINI OCHISH
function openPricePicker() {
  getEl("priceInput").value =
    getEl("maxPrice").value;

  getEl("priceModal").hidden = false;
}

// NARX OYNASINI YOPISH
function closePricePicker() {
  getEl("priceModal").hidden = true;
}

// NARXNI SAQLASH
function savePrice() {
  const price = getEl("priceInput").value.trim();
  const number = Number(price);

  if (
    price !== "" &&
    (!Number.isFinite(number) || number < 0)
  ) {
    alert("To'g'ri narx kiriting!");
    return;
  }

  getEl("maxPrice").value =
    number > 0 ? String(number) : "";

  getEl("pricePicker").textContent =
    number > 0
      ? "💰 " +
        number.toLocaleString("en-US") +
        " so'mgacha"
      : "💰 Narx tanlanmagan";

  closePricePicker();
}

// 2-QISM TUGADI
// 3-QISM SHU YERDAN DAVOM ETADI

/* =====================================
   IJARAMAKON - 3-QISM
   UYLARNI QIDIRISH VA NATIJALAR
===================================== */

// SINOV UCHUN UYLAR
// Bu haqiqiy e'lonlar bazasi emas.

const houses = [
  {
    district: "Tuproqqal'a tumani",
    mahalla: "Muhabbat",
    houseType: "Hovli uy",
    rooms: 3,
    repair: "Yaxshi holatda",
    price: 1500000
  },
  {
    district: "Urganch shahri",
    mahalla: "",
    houseType: "Kvartira",
    rooms: 2,
    repair: "Yangi remont",
    price: 2500000
  },
  {
    district: "Xiva shahri",
    mahalla: "",
    houseType: "Hovli uy",
    rooms: 4,
    repair: "Oddiy holatda",
    price: 1200000
  }
];

/* =====================================
   UYLARNI QIDIRISH
===================================== */

function searchHouses() {
  const district = getEl("district").value;
  const mahalla = getEl("mahalla").value;
  const houseType = getEl("houseType").value;
  const rooms = getEl("rooms").value;
  const repair = getEl("repair").value;
  const maxPrice = Number(getEl("maxPrice").value);

  const found = houses.filter(house => {

    // TUMAN BO'YICHA
    if (
      district &&
      house.district !== district
    ) {
      return false;
    }

    // MAHALLA BO'YICHA
    if (
      mahalla &&
      house.mahalla !== mahalla
    ) {
      return false;
    }

    // UY TURI BO'YICHA
    if (
      houseType &&
      house.houseType !== houseType
    ) {
      return false;
    }

    // REMONT HOLATI BO'YICHA
    if (
      repair &&
      house.repair !== repair
    ) {
      return false;
    }

    // XONALAR SONI BO'YICHA
    if (rooms) {

      if (rooms === "6 va undan ko'p") {
        if (house.rooms < 6) {
          return false;
        }
      } else {
        const roomCount = parseInt(rooms, 10);

        if (house.rooms !== roomCount) {
          return false;
        }
      }
    }

    // MAKSIMAL NARX BO'YICHA
    if (
      maxPrice > 0 &&
      house.price > maxPrice
    ) {
      return false;
    }

    return true;
  });

  // NATIJALAR OYNASI
  const results = getEl("results");
  results.innerHTML = "";

  const heading = document.createElement("h3");

  heading.textContent =
    "🏠 Topilgan uylar: " + found.length;

  results.appendChild(heading);

  // UY TOPILMAGANDA
  if (!found.length) {
    const empty = document.createElement("p");

    empty.className = "empty-message";

    empty.textContent =
      "Tanlangan shartlarga mos uy topilmadi.";

    results.appendChild(empty);
    return;
  }

  // TOPILGAN UYLARNI CHIQARISH
  found.forEach(house => {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = "🏠 " + house.houseType;

    card.appendChild(title);

    const details = [
      "📍 " + house.district +
        (house.mahalla
          ? ", " + house.mahalla
          : ""),

      "🚪 " + house.rooms + " xona",

      "🛠️ " + house.repair,

      "💰 " +
        house.price.toLocaleString("en-US") +
        " so'm / oy"
    ];

    details.forEach(line => {
      const p = document.createElement("p");
      p.textContent = line;
      card.appendChild(p);
    });

    results.appendChild(card);
  });
}

/* =====================================
   OYNALARNI TASHQARIDAN BOSIB YOPISH
===================================== */

getEl("pickerModal").addEventListener(
  "click",
  function(event) {
    if (event.target === this) {
      closePicker();
    }
  }
);

getEl("priceModal").addEventListener(
  "click",
  function(event) {
    if (event.target === this) {
      closePricePicker();
    }
  }
);

// IJARAMAKON APP.JS TUGADI

/* =====================================
   IJARAMAKON - BOSH MENYU
   E'LONLAR VA PROFIL
===================================== */

// SAHIFALAR ORASIDA O'TISH
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.hidden = page.id !== pageId;
  });

  window.scrollTo(0, 0);

  if (pageId === "addPage") {
    initAddForm();
  }

  if (pageId === "savedPage") {
    renderSavedHouses();
  }

  if (pageId === "profilePage") {
    loadProfile();
    renderMyHouses();
  }
}

// BRAUZERDA MA'LUMOTLARNI SAQLASH
function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    alert("Ma'lumotni saqlashda xatolik yuz berdi.");
    return false;
  }
}

// E'LON BERISH FORMASI
function initAddForm() {
  const districtSelect = getEl("addDistrict");
  const mahallaSelect = getEl("addMahalla");

  if (!districtSelect || !mahallaSelect) return;

  districtSelect.innerHTML =
    '<option value="">Tanlang</option>';

  districts
    .filter(name => name !== "Barcha hududlar")
    .forEach(name => {
      districtSelect.add(new Option(name, name));
    });

  districtSelect.onchange = () => {
    mahallaSelect.innerHTML =
      '<option value="">Tanlang</option>';

    const names = mahallalar[districtSelect.value] || [];

    names
      .filter(name => name !== "Barcha mahallalar")
      .forEach(name => {
        mahallaSelect.add(new Option(name, name));
      });
  };
}

// YANGI E'LON QO'SHISH
const addHouseForm = getEl("addHouseForm");

if (addHouseForm) {
  addHouseForm.addEventListener("submit", event => {
    event.preventDefault();

    const phone = getEl("addPhone").value.trim();

    const house = {
      id: Date.now(),
      district: getEl("addDistrict").value,
      mahalla: getEl("addMahalla").value,
      houseType: getEl("addHouseType").value,
      rooms: Number(getEl("addRooms").value),
      repair: getEl("addRepair").value,
      price: Number(getEl("addPrice").value),
      phone: phone,
      description: getEl("addDescription").value.trim(),
      status: "Kutilmoqda"
    };

    const myHouses = readLocal("ijaraMyHouses", []);
    myHouses.push(house);

    if (writeLocal("ijaraMyHouses", myHouses)) {
      getEl("addMessage").textContent =
        "✅ E'lon qurilmangizda saqlandi. " +
        "Telegram botga hali yuborilmadi.";

      addHouseForm.reset();
    }
  });
}

// PROFILNI SAQLASH
function saveProfile() {
  const profile = {
    name: getEl("profileName").value.trim(),
    phone: getEl("profilePhone").value.trim()
  };

  if (writeLocal("ijaraProfile", profile)) {
    getEl("profileMessage").textContent =
      "✅ Profil saqlandi!";
  }
}

// PROFILNI YUKLASH
function loadProfile() {
  const profile = readLocal("ijaraProfile", {
    name: "",
    phone: ""
  });

  getEl("profileName").value = profile.name || "";
  getEl("profilePhone").value = profile.phone || "";
}

// MENING E'LONLARIM
function renderMyHouses() {
  const container = getEl("myHouses");
  if (!container) return;

  const myHouses = readLocal("ijaraMyHouses", []);
  container.innerHTML = "";

  if (!myHouses.length) {
    container.textContent =
      "Hozircha e'lonlaringiz yo'q.";
    return;
  }

  myHouses.forEach(house => {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = "🏠 " + house.houseType;

    const address = document.createElement("p");
    address.textContent =
      "📍 " + house.district + ", " + house.mahalla;

    const price = document.createElement("p");
    price.textContent =
      "💰 " + house.price.toLocaleString("en-US") +
      " so'm / oy";

    const status = document.createElement("p");
    status.textContent = "📋 Holat: " + house.status;

    card.append(title, address, price, status);
    container.appendChild(card);
  });
}

// SAQLANGAN UYLAR
function renderSavedHouses() {
  const container = getEl("savedResults");
  if (!container) return;

  const saved = readLocal("ijaraSavedHouses", []);
  container.innerHTML = "";

  if (!saved.length) {
    container.textContent =
      "Hozircha saqlangan uylar yo'q.";
    return;
  }

  saved.forEach(house => {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = "🏠 " + house.houseType;

    const address = document.createElement("p");
    address.textContent =
      "📍 " + house.district;

    card.append(title, address);
    container.appendChild(card);
  });
}

// BOSHLANG'ICH SAHIFA
showPage("homePage");

// IJARAMAKON QO'SHIMCHA FUNKSIYALARI TUGADI

/* =====================================
   E'LON BERISH - CHIROYLI TANLASH
===================================== */

let activeAddPicker = null;

function openAddPicker(type) {
  if (
    type === "mahalla" &&
    !getEl("addDistrict").value
  ) {
    alert("Avval tuman yoki shaharni tanlang!");
    return;
  }

  activeAddPicker = type;

  const title =
    type === "district"
      ? "🏛️ Tuman yoki shahar"
      : "📍 Mahallani tanlang";

  getEl("modalTitle").textContent = title;
  getEl("modalSearch").value = "";

  renderAddOptions();

  getEl("pickerModal").hidden = false;
}

function renderAddOptions() {
  const list = getEl("modalList");
  list.innerHTML = "";

  const type = activeAddPicker;

  let items =
    type === "district"
      ? districts.filter(
          name => name !== "Barcha hududlar"
        )
      : (mahallalar[getEl("addDistrict").value] || [])
          .filter(
            name => name !== "Barcha mahallalar"
          );

  const search = getEl("modalSearch")
    .value.toLocaleLowerCase("uz");

  items = items.filter(name =>
    name.toLocaleLowerCase("uz").includes(search)
  );

  if (!items.length) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "Ma'lumot topilmadi";
    list.appendChild(message);
    return;
  }

  items.forEach(name => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "option-item";

    const selected =
      getEl("add" +
        (type === "district" ? "District" : "Mahalla")
        .slice(0)
      );

    const fieldId =
      type === "district"
        ? "addDistrict"
        : "addMahalla";

    const isSelected =
      getEl(fieldId).value === name;

    if (isSelected) {
      item.classList.add("selected");
    }

    const label = document.createElement("span");
    label.textContent = name;

    const check = document.createElement("span");
    check.className = "check";
    check.textContent = isSelected ? "✓" : "○";

    item.append(label, check);

    item.onclick = () => {
      getEl(fieldId).value = name;

      getEl(fieldId + "Picker").textContent =
        (type === "district" ? "🏛️ " : "📍 ") +
        name;

      if (type === "district") {
        getEl("addMahalla").value = "";
        getEl("addMahallaPicker").textContent =
          "📍 Mahallani tanlang";
      }

      closePicker();
      activeAddPicker = null;
    };

    list.appendChild(item);
  });
}

// QIDIRUV MAYDONINI IKKALA BO'LIMGA MOSLASH
const oldFilterOptions = filterOptions;

filterOptions = function() {
  if (activeAddPicker) {
    renderAddOptions();
  } else {
    oldFilterOptions();
  }
};

// OYNANI YOPISHNI MOSLASH
const oldClosePicker = closePicker;

closePicker = function() {
  oldClosePicker();
  activeAddPicker = null;
};

// E'LON FORMASIDAGI ESKI SELECT KODINI
// ISHLATMASLIK UCHUN initAddForm NI YANGILASH
initAddForm = function() {
  // Tuman va mahallalar endi
  // umumiy chiroyli oynadan tanlanadi.
};

/* IJARAMAKON - E'LON TANLASH TUZATISHI */

function openAddPicker(type) {
  if (type === "mahalla" &&
      !getEl("addDistrict").value) {
    alert("Avval tumanni tanlang!");
    return;
  }

  activeAddPicker = type;
  activePicker = null;

  getEl("modalTitle").textContent = titles[type];
  getEl("modalSearch").value = "";

  renderAddOptions();
  getEl("pickerModal").hidden = false;
}

function renderAddOptions() {
  const type = activeAddPicker;
  const list = getEl("modalList");
  list.innerHTML = "";

  let items = [];

  if (type === "district") {
    items = districts.filter(
      x => x !== "Barcha hududlar"
    );
  } else if (type === "mahalla") {
    items = (mahallalar[
      getEl("addDistrict").value
    ] || []).filter(
      x => x !== "Barcha mahallalar"
    );
  } else {
    items = (options[type] || []).filter(
      x => !isDefault(x)
    );
  }

  const search = getEl("modalSearch")
    .value.toLowerCase();

  items = items.filter(x =>
    x.toLowerCase().includes(search)
  );

  if (!items.length) {
    list.textContent = "Ma'lumot topilmadi";
    return;
  }

  const ids = {
    district: "addDistrict",
    mahalla: "addMahalla",
    houseType: "addHouseType",
    rooms: "addRooms",
    repair: "addRepair"
  };

  items.forEach(name => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-item";

    const field = getEl(ids[type]);

    if (field.value === name) {
      btn.classList.add("selected");
    }

    btn.textContent = name;

    btn.onclick = () => {
      field.value = name;

      getEl(ids[type] + "Picker").textContent =
        icons[type] + " " + name;

      if (type === "district") {
        getEl("addMahalla").value = "";
        getEl("addMahallaPicker").textContent =
          "📍 Mahallani tanlang";
      }

      closePicker();
    };

    list.appendChild(btn);
  });
}
