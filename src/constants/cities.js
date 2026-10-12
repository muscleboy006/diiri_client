// Shaharlar ro'yxati (o'zbek lotin alifbosida)
// O'zbekiston shaharlari + dunyo davlatlarining poytaxtlari va mashhur shaharlar

// ───────── O'zbekiston ─────────
export const UZ_CITIES = [
  "Toshkent", "Toshkent viloyati", "Samarqand", "Buxoro", "Andijon",
  "Namangan", "Farg'ona", "Qo'qon", "Marg'ilon", "Qarshi", "Termiz",
  "Navoiy", "Jizzax", "Guliston", "Urganch", "Xiva", "Nukus",
  "Angren", "Chirchiq", "Olmaliq", "Bekobod", "Shahrisabz", "Denov", "Zarafshon",
  // qo'shimcha
  "Nurafshon", "Yangiyo'l", "Ohangaron", "Piskent", "Parkent",
  "Kattaqo'rg'on", "Urgut", "G'ijduvon", "Kogon", "Qorako'l", "Romitan", "Vobkent",
  "Kitob", "G'uzor", "Muborak", "Koson", "Yakkabog'",
  "Sherobod", "Boysun", "Qumqo'rg'on",
  "Xonqa", "Shovot", "Bog'ot", "Hazorasp",
  "Qo'ng'irot", "Mo'ynoq", "To'rtko'l", "Beruniy", "Xo'jayli", "Chimboy",
  "Uchquduq", "Nurota", "Zomin", "Do'stlik", "G'allaorol", "Paxtakor",
  "Yangiyer", "Shirin", "Sirdaryo",
  "Asaka", "Shahrixon", "Xonobod", "Qo'rg'ontepa", "Marhamat", "Paxtaobod",
  "Chust", "Pop", "Uchqo'rg'on", "Kosonsoy", "Chortoq", "To'raqo'rg'on",
  "Quvasoy", "Rishton", "Beshariq", "Oltiariq", "Quva", "Uchko'prik",
];

// ───────── Boshqa davlatlar ─────────
export const WORLD_CITIES = [
  // — Rossiya —
  "Moskva", "Sankt-Peterburg", "Novosibirsk", "Yekaterinburg", "Qozon",
  "Nijniy Novgorod", "Samara", "Chelyabinsk", "Omsk", "Rostov-na-Donu", "Ufa",
  "Krasnoyarsk", "Voronej", "Perm", "Volgograd", "Krasnodar", "Saratov",
  "Tyumen", "Barnaul", "Irkutsk", "Xabarovsk", "Vladivostok", "Orenburg",
  "Kemerovo", "Tomsk", "Surgut", "Sochi", "Kaliningrad", "Astraxan", "Tula",
  "Yaroslavl", "Ryazan", "Ulyanovsk", "Penza", "Lipetsk", "Tver", "Murmansk",
  "Yakutsk", "Grozniy", "Arxangelsk",

  // — Qozog'iston —
  "Ostona", "Olmaota", "Chimkent", "Qarag'anda", "Oqto'be", "Oqtov",
  "Turkiston", "Taraz", "Pavlodar", "Semey", "Atirau", "Oral", "Qostanay",
  "Ko'kshetov", "Petropavl", "O'skemen", "Qizilo'rda", "Taldiqo'rg'on",

  // — Qirg'iziston —
  "Bishkek", "O'sh", "Jalolobod", "To'qmoq",

  // — Tojikiston —
  "Dushanbe", "Xo'jand", "Panjikent", "Kulob", "Istaravshan", "Bo'xtar",

  // — Turkmaniston —
  "Ashxobod", "Turkmanobod", "Dashog'uz", "Mari", "Turkmanboshi",

  // — Afg'oniston —
  "Kobul", "Mozori Sharif", "Hirot", "Qandahor",

  // — Kavkaz —
  "Boku", "Gandja", "Sumqayit", "Tbilisi", "Batumi", "Kutaisi", "Yerevan", "Gyumri",

  // — Sharqiy Yevropa —
  "Minsk", "Gomel", "Brest", "Grodno", "Kiyev", "Xarkov", "Odessa", "Dnepr",
  "Lvov", "Zaporojye", "Kishinyov", "Beltsi",
  "Varshava", "Krakov", "Gdansk", "Vrotslav", "Lodz", "Poznan",
  "Praga", "Brno", "Bratislava", "Budapesht", "Buxarest", "Klyuj",
  "Sofiya", "Plovdiv", "Varna",

  // — Boltiqbo'yi —
  "Tallin", "Riga", "Vilnyus",

  // — Janubiy Yevropa —
  "Rim", "Milan", "Neapol", "Turin", "Florensiya", "Venetsiya", "Boloniya",
  "Madrid", "Barselona", "Valensiya", "Sevilya", "Malaga",
  "Lissabon", "Porto", "Afina", "Salonika",
  "Belgrad", "Novi-Sad", "Zagreb", "Split", "Lyublyana", "Sarayevo", "Skopye",
  "Podgorica", "Tirana", "Pristina", "Valetta", "Nikosiya",
  "Andorra-la-Velya", "San-Marino", "Vatikan", "Monako",

  // — G'arbiy Yevropa —
  "Parij", "Marsel", "Lion", "Nitstsa", "Tuluza", "Kann",
  "Berlin", "Myunxen", "Gamburg", "Frankfurt", "Kyoln", "Dyusseldorf",
  "Shtutgart", "Drezden", "Leyptsig",
  "Vena", "Zalsburg", "Syurix", "Jeneva", "Bazel", "Bern", "Vaduts",
  "Bryussel", "Antverpen", "Amsterdam", "Rotterdam", "Lyuksemburg",
  "London", "Manchester", "Birmingem", "Liverpul", "Edinburg", "Glazgo", "Dublin",

  // — Shimoliy Yevropa —
  "Stokgolm", "Gyoteborg", "Oslo", "Bergen", "Xelsinki", "Kopengagen", "Reykyavik",

  // — Turkiya —
  "Anqara", "Istanbul", "Izmir", "Bursa", "Antaliya", "Adana", "Konya",
  "Gaziantep", "Trabzon", "Kayseri", "Mersin", "Bodrum", "Alanya", "Erzurum",

  // — Yaqin Sharq —
  "Dubay", "Abu-Dabi", "Sharja", "Riyod", "Makka", "Madina", "Jidda", "Dammam",
  "Doha", "Ko'vayt", "Manama", "Maskat", "Ammon", "Aqaba", "Quddus",
  "Tel-Aviv", "Xayfa", "Bayrut", "Damashq", "Halab", "Bag'dod", "Basra",
  "Erbil", "Mosul", "Najaf", "Karbala", "San'o",
  "Tehron", "Mashhad", "Isfahon", "Sheroz", "Tabriz", "Qum",

  // — Janubiy Osiyo —
  "Islomobod", "Karochi", "Lohur", "Peshovar", "Faysalobod",
  "Nyu-Dehli", "Dehli", "Mumbay", "Kalkutta", "Bangalor", "Chennay",
  "Xaydarobod", "Ahmadobod", "Agra", "Jaypur",
  "Dakka", "Chittagong", "Katmandu", "Timpu", "Kolombo", "Male",

  // — Sharqiy Osiyo —
  "Pekin", "Shanxay", "Guanchjou", "Shenchjen", "Urumchi", "Gonkong", "Makao",
  "Chengdu", "Chuntsin", "Xanchjou", "Tyantszin", "Uxan", "Sian", "Harbin", "Nankin",
  "Taybey", "Ulonbator", "Pxenyan",
  "Tokio", "Osaka", "Kioto", "Yokogama", "Nagoya", "Sapporo",
  "Seul", "Pusan", "Inchxon",

  // — Janubi-Sharqiy Osiyo —
  "Bangkok", "Pxuket", "Chiangmay", "Xanoy", "Xoshimin", "Vyentyan", "Pnompen",
  "Naypyido", "Yangon", "Kuala-Lumpur", "Singapur", "Jakarta", "Surabaya", "Denpasar",
  "Manila", "Bandar-Seri-Begavan", "Dili",

  // — Shimoliy Amerika —
  "Vashington", "Nyu-York", "Los-Anjeles", "Chikago", "Mayami", "San-Fransisko",
  "Xyuston", "Las-Vegas", "Boston", "Sietl", "Dallas", "Atlanta", "Filadelfiya", "Detroyt",
  "Ottava", "Toronto", "Vankuver", "Monreal", "Kalgari",
  "Mexiko", "Gvadalaxara", "Monterrey", "Kankun",

  // — Markaziy Amerika va Karib dengizi —
  "Gvatemala", "Belmopan", "San-Salvador", "Tegusigalpa", "Managua", "San-Xose",
  "Panama", "Gavana", "Kingston", "Port-o-Prens", "Santo-Domingo", "Nassau",
  "Bridjtaun", "Port-of-Speyn", "Sent-Jons", "Rozo", "Kastri", "Kingstaun",
  "Sent-Jorjes", "Basster",

  // — Janubiy Amerika —
  "Braziliya", "San-Paulu", "Rio-de-Janeyro", "Buenos-Ayres", "Kordoba",
  "Santyago", "Valparaiso", "Lima", "Kusko", "Bogota", "Medelin", "Karakas",
  "Kito", "La-Pas", "Sukre", "Asunson", "Montevideo", "Jorjtaun", "Paramaribo",

  // — Afrika —
  "Qohira", "Aleksandriya", "Tripoli", "Tunis", "Jazoir", "Oran", "Rabot",
  "Kasablanka", "Marrakesh", "Tanja", "Nuakshot", "Dakar", "Banjul", "Bisau",
  "Konakri", "Fritaun", "Monroviya", "Yamusukro", "Akkra", "Lome", "Porto-Novo",
  "Abuja", "Lagos", "Niamey", "Uagadugu", "Bamako", "Ndjamena", "Xartum", "Juba",
  "Asmara", "Jibuti", "Addis-Abeba", "Mogadisho", "Nayrobi", "Mombasa", "Kampala",
  "Kigali", "Gitega", "Dodoma", "Dar-es-Salom", "Lusaka", "Lilongve", "Xarare",
  "Maputo", "Vindxuk", "Gaborone", "Pretoriya", "Keyptaun", "Yoxannesburg", "Durban",
  "Maseru", "Mbabane", "Antananarivu", "Port-Lui", "Moroni", "Viktoriya", "Praya",
  "Luanda", "Kinshasa", "Brazzavil", "Yaunde", "Bangi", "Malabo", "Librevil", "San-Tome",

  // — Avstraliya va Okeaniya —
  "Kanberra", "Sidney", "Melburn", "Brisben", "Perth", "Vellington", "Okland",
  "Suva", "Port-Moresbi", "Xoniara", "Port-Vila", "Apia", "Nukualofa",
  "Tarava", "Majuro", "Palikir", "Yaren", "Funafuti", "Ngerulmud",
];

export const CITIES = [...UZ_CITIES, ...WORLD_CITIES];

// Qidiruv uchun: kichik harf + barcha apostroflarni olib tashlash
// ("Qo'qon" ham "qoqon" deb topiladi)
export const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[’ʻʼ`‘´']/g, "")
    .trim();

const INDEX = CITIES.map((name) => ({ name, key: normalize(name) }));

// Birinchi bo'lib boshidan mos kelganlar, keyin ichidan mos kelganlar
export function searchCities(query, limit = 8) {
  const q = normalize(query);
  if (!q) return CITIES.slice(0, limit);

  const starts = [];
  const contains = [];
  for (const c of INDEX) {
    if (c.key.startsWith(q)) starts.push(c.name);
    else if (c.key.includes(q)) contains.push(c.name);
  }
  return [...starts, ...contains].slice(0, limit);
}