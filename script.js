// Variabel untuk melacak bab yang sedang dipilih saat ini
let currentSelectedBab = "ALL";

// Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    setupBabSelectors();
    renderVocabularies(); // Tampilkan semua data saat pertama buka
});

// Otomatis mengisi opsi dropdown dan tombol pill dari Bab 1 sampai 25
// Otomatis mengisi opsi dropdown dan tombol pill dari Bab 1 sampai 25
function setupBabSelectors() {
    const selectDropdown = document.getElementById("babFilter");
    const buttonsContainer = document.getElementById("babButtons");

    // Kembalikan ke model scroll menyamping (horizontal) yang rapi
    buttonsContainer.style.cssText = "display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px; scrollbar-width: thin;";

    for (let i = 1; i <= 25; i++) {
        let babName = `Bab ${i}`;

        // 1. Tambah ke Dropdown
        let option = document.createElement("option");
        option.value = babName;
        option.textContent = babName;
        selectDropdown.appendChild(option);

        // 2. Tambah ke Tombol Pill Horizontal
        let btn = document.createElement("button");
        btn.textContent = babName;
        btn.className = "bab-btn";
        btn.dataset.bab = babName;
        buttonsContainer.appendChild(btn);

        // Event listener klik tombol
        btn.onclick = () => filterByBab(babName);
    }
}

// Ketika dropdown diubah
function onDropdownChange() {
    const selectedValue = document.getElementById("babFilter").value;
    filterByBab(selectedValue, false); // Update tanpa mengubah ulang nilai dropdown
}

// Ketika tombol pill diklik
function filterByBab(babName, updateDropdown = true) {
    currentSelectedBab = babName;

    // Sinkronkan nilai dropdown jika diklik dari tombol pill
    if (updateDropdown) {
        document.getElementById("babFilter").value = babName;
    }

    // Perbarui warna aktif pada tombol pill
    document.querySelectorAll(".bab-btn").forEach(btn => {
        if (btn.dataset.bab === babName) {
            btn.style.background = "#d9534f";
            btn.style.color = "white";
            btn.style.borderColor = "#d9534f";
        } else {
            btn.style.background = "#f8f9fa";
            btn.style.color = "#333";
            btn.style.borderColor = "#ccc";
        }
    });

    renderVocabularies();
}

// Fungsi gabungan untuk Filter Bab + Kotak Pencarian Teks
function filterAndRender() {
    renderVocabularies();
}

// Fungsi Render Kosakata & Real-time Search yang Rapi & Sesuai GitHub
function renderVocabularies() {
    const searchKeyword = document.getElementById("searchInput").value.toLowerCase();
    const vocabListContainer = document.getElementById("vocabList");

    // Pastikan variabel vocabData (dari vocab.js) tersedia
    if (typeof vocabData === 'undefined') {
        vocabListContainer.innerHTML = "<p style='text-align:center;'>Data kosakata belum dimuat.</p>";
        return;
    }

    // Filter berdasarkan Bab yang dipilih & Kata Kunci Pencarian
    let filtered = vocabData.filter(item => {
        let matchBab = true;
        if (currentSelectedBab !== "ALL") {
            // Ambil angka atau teks bab yang bersih untuk dicocokkan
            let selectedNum = String(currentSelectedBab).replace(/[^0-9]/g, "");
            let itemNum = item.bab ? String(item.bab).replace(/[^0-9]/g, "") : "";
            
            matchBab = (itemNum === selectedNum) || (String(item.bab).toLowerCase() === String(currentSelectedBab).toLowerCase());
        }

        // Filter Pencarian Teks (dengan pengaman data undefined/kosong)
        const jpMatch = item.jp && item.jp.toLowerCase().includes(searchKeyword);
        const romajiMatch = item.romaji && item.romaji !== "undefined" && item.romaji.toLowerCase().includes(searchKeyword);
        const artiMatch = item.arti && item.arti.toLowerCase().includes(searchKeyword);
        const kanjiMatch = item.kanji && item.kanji.toLowerCase().includes(searchKeyword);
        
        const matchSearch = jpMatch || romajiMatch || artiMatch || kanjiMatch;

        return matchBab && matchSearch;
    });

    // Render ke HTML dengan tata letak bersih (Nomor di kiri, Arti di bawah, Badge Bab di kanan)
    let html = "";
    filtered.forEach((item, index) => {
        let romajiDisplay = (item.romaji && item.romaji !== "undefined" && item.romaji.trim() !== "") ? `(${item.romaji})` : '';
        let kanjiDisplay = (item.kanji && item.kanji !== "undefined" && item.kanji.trim() !== "") ? item.kanji : '';

        html += `
            <div class="vocab-card">
                <div style="flex-grow: 1;">
                    <div class="jp">${item.jp || ''} ${romajiDisplay} ${kanjiDisplay}</div>
                    <div class="romaji";">${item.arti || ''}</div>
                </div>
                ${item.bab ? `<div class="badge">${String(item.bab).toLowerCase().includes('bab') ? item.bab : `Bab ${item.bab}`}</div>` : ''}
            </div>
        `;
    });

    if (filtered.length === 0) {
        html = "<p style='text-align:center; color: #888;'>Kosakata tidak ditemukan.</p>";
    }

    vocabListContainer.innerHTML = html;
}

// Fitur Dark Mode Toggle & LocalStorage
const darkModeToggle = document.getElementById("darkModeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if(darkModeToggle) darkModeToggle.textContent = "☀️";
}

if(darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            darkModeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            darkModeToggle.textContent = "🌙";
        }
    });
}

// Kontrol Sidebar Hamburger
const hamburgerBtn = document.getElementById("hamburgerBtn");
const appSidebar = document.getElementById("appSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");

function openSidebar() {
    appSidebar.classList.add("open");
    sidebarOverlay.classList.add("active");
}

function closeSidebar() {
    appSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
}

if(hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);
if(closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
if(sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

// Data Hiragana & Katakana
const kanaGroups = {
    "semua": [
        { romaji: "a", h: "あ", k: "ア" }, { romaji: "i", h: "い", k: "イ" }, { romaji: "u", h: "う", k: "ウ" }, { romaji: "e", h: "え", k: "エ" }, { romaji: "o", h: "お", k: "オ" },
        { romaji: "ka", h: "か", k: "カ" }, { romaji: "ki", h: "き", k: "キ" }, { romaji: "ku", h: "く", k: "ク" }, { romaji: "ke", h: "け", k: "ケ" }, { romaji: "ko", h: "こ", k: "コ" },
        { romaji: "sa", h: "さ", k: "サ" }, { romaji: "shi", h: "し", k: "シ" }, { romaji: "su", h: "す", k: "ス" }, { romaji: "se", h: "せ", k: "セ" }, { romaji: "so", h: "そ", k: "ソ" },
        { romaji: "ta", h: "た", k: "タ" }, { romaji: "chi", h: "ち", k: "チ" }, { romaji: "tsu", h: "つ", k: "ツ" }, { romaji: "te", h: "て", k: "テ" }, { romaji: "to", h: "と", k: "ト" },
        { romaji: "na", h: "な", k: "ナ" }, { romaji: "ni", h: "に", k: "ニ" }, { romaji: "nu", h: "ぬ", k: "ヌ" }, { romaji: "ne", h: "ね", k: "ネ" }, { romaji: "no", h: "の", k: "ノ" },
        { romaji: "ha", h: "は", k: "ハ" }, { romaji: "hi", h: "ひ", k: "ヒ" }, { romaji: "fu", h: "ふ", k: "フ" }, { romaji: "he", h: "へ", k: "ヘ" }, { romaji: "ho", h: "ほ", k: "ホ" },
        { romaji: "ma", h: "ま", k: "マ" }, { romaji: "mi", h: "み", k: "ミ" }, { romaji: "mu", h: "む", k: "ム" }, { romaji: "me", h: "め", k: "メ" }, { romaji: "mo", h: "も", k: "モ" },
        { romaji: "ya", h: "や", k: "ヤ" }, { romaji: "", h: "", k: "" }, { romaji: "yu", h: "ゆ", k: "ユ" }, { romaji: "", h: "", k: "" }, { romaji: "yo", h: "よ", k: "ヨ" },
        { romaji: "ra", h: "ら", k: "ラ" }, { romaji: "ri", h: "り", k: "リ" }, { romaji: "ru", h: "る", k: "ル" }, { romaji: "re", h: "れ", k: "レ" }, { romaji: "ro", h: "ろ", k: "ロ" },
        { romaji: "wa", h: "わ", k: "ワ" }, { romaji: "", h: "", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "wo", h: "を", k: "ヲ" }, { romaji: "n", h: "ん", k: "ン" }
    ],
    "hiragana": [
        { romaji: "a", h: "あ", k: "" }, { romaji: "i", h: "い", k: "" }, { romaji: "u", h: "う", k: "" }, { romaji: "e", h: "え", k: "" }, { romaji: "o", h: "お", k: "" },
        { romaji: "ka", h: "か", k: "" }, { romaji: "ki", h: "き", k: "" }, { romaji: "ku", h: "く", k: "" }, { romaji: "ke", h: "け", k: "" }, { romaji: "ko", h: "こ", k: "" },
        { romaji: "sa", h: "さ", k: "" }, { romaji: "shi", h: "し", k: "" }, { romaji: "su", h: "す", k: "" }, { romaji: "se", h: "せ", k: "" }, { romaji: "so", h: "そ", k: "" },
        { romaji: "ta", h: "た", k: "" }, { romaji: "chi", h: "ち", k: "" }, { romaji: "tsu", h: "つ", k: "" }, { romaji: "te", h: "て", k: "" }, { romaji: "to", h: "と", k: "" },
        { romaji: "na", h: "な", k: "" }, { romaji: "ni", h: "に", k: "" }, { romaji: "nu", h: "ぬ", k: "" }, { romaji: "ne", h: "ね", k: "" }, { romaji: "no", h: "の", k: "" },
        { romaji: "ha", h: "は", k: "" }, { romaji: "hi", h: "ひ", k: "" }, { romaji: "fu", h: "ふ", k: "" }, { romaji: "he", h: "へ", k: "" }, { romaji: "ho", h: "ほ", k: "" },
        { romaji: "ma", h: "ま", k: "" }, { romaji: "mi", h: "み", k: "" }, { romaji: "mu", h: "む", k: "" }, { romaji: "me", h: "め", k: "" }, { romaji: "mo", h: "も", k: "" },
        { romaji: "ya", h: "や", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "yu", h: "ゆ", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "yo", h: "よ", k: "" },
        { romaji: "ra", h: "ら", k: "" }, { romaji: "ri", h: "り", k: "" }, { romaji: "ru", h: "る", k: "" }, { romaji: "re", h: "れ", k: "" }, { romaji: "ro", h: "ろ", k: "" },
        { romaji: "wa", h: "わ", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "wo", h: "を", k: "" }, { romaji: "n", h: "ん", k: "" }
    ],
    "katakana": [
        { romaji: "a", h: "", k: "ア" }, { romaji: "i", h: "", k: "イ" }, { romaji: "u", h: "", k: "ウ" }, { romaji: "e", h: "", k: "エ" }, { romaji: "o", h: "", k: "オ" },
        { romaji: "ka", h: "", k: "カ" }, { romaji: "ki", h: "", k: "キ" }, { romaji: "ku", h: "", k: "ク" }, { romaji: "ke", h: "", k: "ケ" }, { romaji: "ko", h: "", k: "コ" },
        { romaji: "sa", h: "", k: "サ" }, { romaji: "shi", h: "", k: "シ" }, { romaji: "su", h: "", k: "ス" }, { romaji: "se", h: "", k: "セ" }, { romaji: "so", h: "", k: "ソ" },
        { romaji: "ta", h: "", k: "タ" }, { romaji: "chi", h: "", k: "チ" }, { romaji: "tsu", h: "", k: "ツ" }, { romaji: "te", h: "", k: "テ" }, { romaji: "to", h: "", k: "ト" },
        { romaji: "na", h: "", k: "ナ" }, { romaji: "ni", h: "", k: "ニ" }, { romaji: "nu", h: "", k: "ヌ" }, { romaji: "ne", h: "", k: "ネ" }, { romaji: "no", h: "", k: "ノ" },
        { romaji: "ha", h: "", k: "ハ" }, { romaji: "hi", h: "", k: "ヒ" }, { romaji: "fu", h: "", k: "フ" }, { romaji: "he", h: "", k: "ヘ" }, { romaji: "ho", h: "", k: "ホ" },
        { romaji: "ma", h: "", k: "マ" }, { romaji: "mi", h: "", k: "ミ" }, { romaji: "mu", h: "", k: "ム" }, { romaji: "me", h: "", k: "メ" }, { romaji: "mo", h: "", k: "モ" },
        { romaji: "ya", h: "", k: "ヤ" }, { romaji: "", h: "", k: "" }, { romaji: "yu", h: "", k: "ユ" }, { romaji: "", h: "", k: "" }, { romaji: "yo", h: "", k: "ヨ" },
        { romaji: "ra", h: "", k: "ラ" }, { romaji: "ri", h: "", k: "リ" }, { romaji: "ru", h: "", k: "ル" }, { romaji: "re", h: "", k: "レ" }, { romaji: "ro", h: "", k: "ロ" },
        { romaji: "wa", h: "", k: "ワ" }, { romaji: "", h: "", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "", h: "", k: "" }, { romaji: "wo", h: "", k: "ヲ" }, { romaji: "n", h: "", k: "ン" }
    ],
};

// Fungsi Ganti Menu (Kosakata vs Kana)
function switchMenu(type) {
    const vocabMainSection = document.getElementById("vocabMainSection");
    const kanaContainer = document.getElementById("kanaContainer");

    if (type === 'vocab') {
        if(vocabMainSection) vocabMainSection.style.display = "block";
        if(kanaContainer) kanaContainer.style.display = "none";
    } else {
        if(vocabMainSection) vocabMainSection.style.display = "none";
        if(kanaContainer) {
            kanaContainer.style.display = "block";
            renderKana();
        }
    }
}

// Fungsi Render Tabel Huruf (Kana)
function renderKana(group = "semua") {
    const container = document.getElementById("kanaContainer");
    const data = kanaGroups[group] || kanaGroups["semua"];

    let html = `
        <div style="text-align: center; margin-bottom: 15px;">
            <h2 style="color: #ff6b6b; margin-bottom: 5px;">Tabel Huruf Jepang</h2>
            <p style="font-size: 13px; color: #666; margin-bottom: 15px;">Pilih baris huruf untuk latihan</p>
            
            <!-- Tombol Filter Baris Huruf -->
            <div class="kana-filter-buttons" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; justify-content: center; flex-wrap: wrap;">
                <button onclick="renderKana('semua')" class="filter-btn ${group==='semua'?'active':''}" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ddd; background: ${group==='semua'?'#ff6b6b':'#f8f9fa'}; color: ${group==='semua'?'#fff':'#333'}; cursor: pointer; font-size: 13px;">Semua</button>
                <button onclick="renderKana('hiragana')" class="filter-btn ${group==='hiragana'?'active':''}" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ddd; background: ${group==='hiragana'?'#ff6b6b':'#f8f9fa'}; color: ${group==='hiragana'?'#fff':'#333'}; cursor: pointer; font-size: 13px;">Hiragana</button>
                <button onclick="renderKana('katakana')" class="filter-btn ${group==='katakana'?'active':''}" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ddd; background: ${group==='katakana'?'#ff6b6b':'#f8f9fa'}; color: ${group==='katakana'?'#fff':'#333'}; cursor: pointer; font-size: 13px;">Katakana</button>
            </div>
        </div>

        <!-- Grid Kotak-kotak Huruf (5 Kolom) -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
    `;

    data.forEach(item => {
        html += `
            <div class="kana-card" style="background: var(--card-bg, #ffffff); padding: 10px 5px; border-radius: 10px; text-align: center; border-top: 3px solid #ff6b6b; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="font-size: 18px; font-weight: bold; color: inherit; line-height: 1.2;">${item.h} <span style="font-size: 16px; color: #ff6b6b; font-weight: bold;">${item.k}</span></div>
                <div style="font-size: 11px; color: #777; margin-top: 4px; text-transform: uppercase; font-weight: 600;">${item.romaji}</div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}