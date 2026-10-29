// DAFTAR KOSAKATA (Bisa ditambahin sebanyak mungkin di sini!)
const vocabData = [
    { jp: "おはよう (Ohayou)", arti: "Selamat Pagi (Casual)", bab: "Umum" },
    { jp: "ありがとう (Arigatou)", arti: "Terima Kasih (Casual)", bab: "Umum" },
    { jp: "頑張って (Ganbatte)", arti: "Semangat!", bab: "Umum" },
    { jp: "わたし (Watashi)", arti: "Saya / Aku", bab: "Bab 1" },
    { jp: "あなた (Anata)", arti: "Kamu / Anda", bab: "Bab 1" },
    { jp: "せんせい (Sensei)", arti: "Guru / Dosen", bab: "Bab 1" },
    { jp: "がくせい (Gakusei)", arti: "Mahasiswa / Pelajar", bab: "Bab 1" },
    { jp: "かいしゃいん (Kaishain)", arti: "Karyawan Perusahaan", bab: "Bab 1" }
    // Nanti tinggal lanjutin Bab 2, Bab 3, dst di bawah sini...
];

// FUNGSI MENAMPILKAN & MENYARING KOSAKATA
function renderVocab() {
    let searchKeyword = document.getElementById('searchInput').value.toLowerCase();
    let listContainer = document.getElementById('vocabList');
    
    listContainer.innerHTML = ""; // Kosongkan list sebelum diisi ulang

    let filteredData = vocabData.filter(item => {
        let textGabung = (item.jp + item.arti + item.bab).toLowerCase();
        return textGabung.includes(searchKeyword);
    });

    if (filteredData.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center; color:#888;'>Kosakata tidak ditemukan...</p>";
        return;
    }

    filteredData.forEach(item => {
        let card = document.createElement('div');
        card.className = 'vocab-card';
        card.innerHTML = `
            <div>
                <div class="jp">${item.jp}</div>
                <div class="romaji">${item.arti}</div>
            </div>
            <div class="badge">${item.bab}</div>
        `;
        listContainer.appendChild(card);
    });
}

// Jalankan saat pertama kali web dibuka
renderVocab();