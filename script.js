// Variabel untuk melacak bab yang sedang dipilih saat ini
let currentSelectedBab = "ALL";

// Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    setupBabSelectors();
    renderVocabularies(); // Tampilkan semua data saat pertama buka
});

// Otomatis mengisi opsi dropdown dan tombol pill dari Bab 1 sampai 25
function setupBabSelectors() {
    const selectDropdown = document.getElementById("babFilter");
    const buttonsContainer = document.getElementById("babButtons");

    for (let i = 1; i <= 25; i++) {
        let babName = `Bab ${i}`;

        // 1. Tambah ke Dropdown
        let option = document.createElement("option");
        option.value = babName;
        option.textContent = babName;
        selectDropdown.appendChild(option);

        // 2. Tambah ke Tombol Pill horizontal
        let btn = document.createElement("button");
        btn.textContent = babName;
        btn.className = "bab-btn";
        btn.dataset.bab = babName;
        btn.style.cssText = "padding: 6px 14px; border-radius: 20px; border: 1px solid #ccc; background: #f8f9fa; color: #333; cursor: pointer; white-space: nowrap; font-size: 13px;";
        btn.onclick = () => filterByBab(babName);
        buttonsContainer.appendChild(btn);
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

// Fungsi utama untuk merender daftar kosakata ke HTML
// Fungsi utama untuk merender daftar kosakata ke HTML
function renderVocabularies() {
    const searchKeyword = document.getElementById("searchInput").value.toLowerCase();
    const container = document.getElementById("vocabList");
    
    if (typeof vocabData === "undefined") {
        container.innerHTML = "<p style='text-align:center; color:red;'>Data vocab.js belum dimuat atau kosong!</p>";
        return;
    }

    // 1. Filter berdasarkan Bab yang dipilih
    let filtered = vocabData;
    if (currentSelectedBab !== "ALL") {
        filtered = vocabData.filter(item => item.bab === currentSelectedBab);
    }

    // 2. Filter tambahan berdasarkan kata kunci pencarian (Search Input)
    if (searchKeyword.trim() !== "") {
        filtered = filtered.filter(item => {
            return (
                item.jp.toLowerCase().includes(searchKeyword) ||
                item.romaji.toLowerCase().includes(searchKeyword) ||
                item.arti.toLowerCase().includes(searchKeyword) ||
                (item.kanji && item.kanji.toLowerCase().includes(searchKeyword))
            );
        });
    }

    // 3. Tampilkan hasilnya ke HTML
    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p style='text-align: center; color: #888; margin-top: 20px;'>Kosakata tidak ditemukan.</p>";
        return;
    }

    // Gunakan indeks atau properti nomor dari data
    filtered.forEach((item, index) => {
        let kanjiText = item.kanji ? ` ${item.kanji}` : "";
        let romajiText = (item.romaji && item.romaji !== "undefined") ? `${item.romaji} — ` : "";
        
        let nomorUrut = item.no ? `${item.no}.` : `${index + 1}.`;

        let cardHTML = `
            <div class="vocab-card">
                <div class="vocab-number">${nomorUrut}</div>
                <div style="flex-grow: 1;">
                    <div class="jp">${item.jp}${kanjiText}</div>
                    <div class="romaji">${romajiText}<strong>${item.arti}</strong></div>
                </div>
                <div class="badge">${item.bab}</div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}