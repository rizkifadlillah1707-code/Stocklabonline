# StockLab Online

Simulasi pasar modal untuk 3–5 orang. Satu orang menjadi **moderator** yang membuat ruang permainan, yang lain bergabung dari ponsel atau tablet masing-masing. Kalian membeli dan menjual saham, mengatur strategi, dan melihat siapa yang paling kaya setelah 6 ronde.

**Main sekarang: https://stocklab-online.pages.dev**

Gratis, tanpa akun, tanpa memasang aplikasi. Cukup buka tautannya di browser.

> Ini permainan edukasi, bukan rekomendasi investasi. Harga dan kartu di dalamnya hanya simulasi.

## Yang perlu disiapkan

- 3 sampai 5 pemain, masing-masing dengan ponsel, tablet, atau laptop yang tersambung internet.
- Browser terbaru (Chrome, Safari, Edge, atau Firefox).
- Satu pemain yang ditunjuk sebagai moderator. Moderator juga ikut bermain.

## Mulai bermain dalam 1 menit

**Moderator**
1. Buka tautan di atas, isi **nama**, lalu tekan **Buat room baru**.
2. Bagikan **kode 6 huruf** atau tombol **Salin tautan** ke teman-teman.
3. Tunggu sampai semua nama muncul di daftar (minimal 3, maksimal 5), lalu tekan **Mulai permainan**.

**Pemain lain**
1. Buka tautan dari moderator. Kode room akan terisi otomatis. Kalau tidak, pilih tab **Gabung room** dan ketik kodenya.
2. Isi **nama** (maksimal 20 karakter), lalu tekan **Gabung ke room**.
3. Tunggu moderator memulai.

Setelah permainan dimulai, pemain baru tidak bisa masuk lagi.

## Cara bermain singkat

Setiap pemain mulai dengan **15 koin**. Ada empat saham (Tambang, Konsumer, Keuangan, Agrikultur) dan satu Reksa Dana. Harga awal semuanya **5**. Tujuannya: akhir ronde ke-6, punya **koin + nilai saham** paling besar.

Setiap ronde berjalan dalam 4 fase:

| Fase | Apa yang terjadi |
|---|---|
| 1. Tawaran | Semua pemain menawar sejumlah koin **secara rahasia**. Tawaran tertinggi main duluan. Koin yang ditawarkan dibayar ke Bank. |
| 2. Aksi | Bergiliran, tiap pemain mengambil satu kartu: **simpan jadi saham**, atau **aktifkan efeknya**. |
| 3. Jual | Bergiliran, jual satu jenis saham dalam jumlah berapa pun pada harga saat ini, atau lewati. |
| 4. Ekonomi | Moderator membuka kartu ekonomi. Harga setiap sektor naik atau turun. |

Setelah ronde ke-6 selesai, permainan berakhir dan skor dihitung:

> **Skor = koin + nilai semua saham − utang**

Nilai saham = jumlah lembar × harga saat itu. Setiap kartu utang mengurangi skor 13.

### Membaca papan harga

- Angka besar di kotak sektor adalah **harga sekarang**.
- Di bawahnya ada perubahan terakhir, misalnya `▲ +4 dari 5` (naik 4, sebelumnya 5) atau `▼ −1 dari 6` (turun 1, sebelumnya 6). Tanda `–` berarti tidak berubah.
- Harga bergerak pada **tangga** yang berbeda per sektor, jadi satu langkah bisa berselisih lebih dari 1 poin.
- Tulisan **✦ Split** berarti harga melewati puncak tangga. **✖ Pailit** berarti harga jatuh melewati dasar tangga (lihat di bawah).

<details>
<summary><b>Kartu Aksi (fase 2)</b></summary>

Ronde ini ada 2 kartu per pemain, dan semuanya sudah terlihat sejak fase tawaran supaya bisa dipakai menyusun strategi. Setiap kartu bisa disimpan sebagai saham sektor kartu itu, atau diaktifkan:

| Efek | Fungsi |
|---|---|
| **Info Bursa** | Dapat 2 koin dan mengintip kartu ekonomi teratas dari 2 sektor pilihan Anda. Hanya Anda yang melihatnya. |
| **Rumor** | Menggeser harga satu langkah ke atas atau bawah, boleh dua kali (dua sektor atau arah berbeda). |
| **Quickbuy** | Langsung menyimpan sampai 2 kartu tambahan dari tengah sebagai saham. Giliran berikutnya Anda dilewati satu kali. |
| **Trading Fee** | Bayar biaya (1 koin + jumlah saham sektor kartu itu yang Anda punya), lalu boleh menjual satu jenis saham saat itu juga. |
| **Akuisisi** | Mengambil 1 saham pemain lain, hanya jika jumlah saham Anda di sektor itu **sama atau lebih banyak** darinya. Ia mendapat kompensasi setengah harga (dibulatkan ke bawah). Tidak berlaku untuk Reksa Dana. |

</details>

<details>
<summary><b>Kartu Ekonomi (fase 4)</b></summary>

Moderator membuka satu kartu per sektor. Pergerakan dihitung dalam **langkah** di tangga harga sektor itu.

| Kartu | Efek |
|---|---|
| Naik / Melaju / Boom | Naik 1 / 2 / 3 langkah |
| Anjlok / Terjun / Crash | Turun 1 / 2 / 3 langkah |
| Sideways | Tidak bergerak |
| Dividen | Setiap pemain mendapat 1 koin per lembar saham sektor itu |
| Extra Fee | Setiap pemain membayar 1 koin per lembar saham sektor itu |
| Penerbitan Saham Baru | Harga turun 1 langkah, dan pemegang saham sektor itu mendapat 1 lembar tambahan |
| Pajak Jalan | Semua pemain membayar sesuai urutan main ronde itu (urutan 1 bayar 1 koin, urutan 2 bayar 2 koin, dan seterusnya) |
| Tax Amnesty | Sektor ini naik 1 langkah, dan sektor lain yang naik pada ronde itu mendapat bonus 1 langkah |
| World Oil Regulation | Tambang naik 1 langkah |
| Restrukturisasi Ekonomi | **Semua harga kembali ke 5** dan efek kartu lain ronde itu dibatalkan |
| Resesi | Harga di atas 5 turun 1 langkah |
| Stimulus Ekonomi | Harga di bawah 5 naik 1 langkah |
| Merger | Mengikuti pergerakan dasar sektor di sebelah kanannya (sektor terakhir mengikuti yang pertama) |
| Buyback | Naik 1 langkah, lalu Bank membeli semua saham sektor itu dengan harga terbaru dan harga kembali ke 5 |

</details>

<details>
<summary><b>Pailit dan Split</b></summary>

- **Pailit:** harga turun melewati dasar tangga. **Semua saham** sektor itu milik semua pemain ditarik kembali ke Bank dan harga kembali ke 5.
- **Split:** harga naik melewati puncak tangga. Saham sektor itu yang **sudah Anda miliki** berlipat dua, lalu harga kembali ke 5.

</details>

<details>
<summary><b>Koin habis, saldo minus, dan utang</b></summary>

- Di fase tawaran, Anda boleh **meminjam 10 koin** dari Bank dengan satu kartu utang. Di akhir permainan, setiap kartu utang mengurangi skor 13. Total hanya ada 5 kartu utang untuk seluruh permainan.
- Biaya dari Trading Fee, Extra Fee, atau Pajak Jalan bisa membuat saldo **minus**. Saat itu muncul jendela **pilih paket hutang** (1, 2, atau 3 kartu utang, masing-masing memberi 10 koin) untuk menutup kekurangannya. Jendela ini tidak bisa ditutup sebelum memilih.
- Kalau kartu utang sudah habis, saldo tetap minus dan langsung mengurangi skor akhir.
- Saat saldo minus, tawaran Anda hanya bisa 0.

</details>

<details>
<summary><b>Reksa Dana</b></summary>

Harga Reksa Dana adalah rata-rata dari harga dua sektor tertentu (dibulatkan ke bawah), jadi naik-turunnya mengikuti keduanya. Reksa Dana tidak ikut hangus saat salah satu sektor asalnya Pailit.

</details>

## Tugas moderator

- Menekan **Buka tawaran** setelah semua pemain mengunci tawaran.
- Menekan **Buka Kartu Ekonomi** di akhir tiap ronde, lalu **Mulai ronde berikutnya**.
- Kalau ada pemain yang terputus saat gilirannya, muncul tombol **Lewati giliran pemain offline**.
- **Tetap buka tab moderator selama permainan.** Moderator yang memproses semua aksi pemain. Kalau tab ditutup atau komputer tidur, permainan berhenti sampai moderator kembali.

## Kalau ada masalah

| Masalah | Yang bisa dicoba |
|---|---|
| Muncul tulisan "Koneksi terputus. Menyambungkan ulang…" | Tunggu beberapa detik. Kalau tidak pulih, periksa internet lalu muat ulang halaman. |
| Tertutup atau tidak sengaja keluar saat bermain | Buka lagi **tautan room yang sama** di **perangkat dan browser yang sama**, dengan nama yang sama. Anda akan masuk kembali ke permainan. |
| "Permainan sudah dimulai" | Room tidak menerima pemain baru setelah mulai. Minta moderator membuat room baru. |
| "Room sudah penuh" | Satu room maksimal 5 pemain. |
| "Room tidak ditemukan" | Periksa kode (6 karakter). Room mungkin sudah ditutup moderator. |
| Tombol tidak bereaksi | Tombol terkunci sebentar setelah ditekan supaya tidak terkirim dua kali. Tunggu beberapa detik. |
| Tampilan masih versi lama | Muat ulang paksa (Ctrl+Shift+R di komputer). Kalau dipasang ke layar utama, tutup dan buka lagi aplikasinya. |
| Salah satu pemain tidak bisa masuk kembali | Jangan memakai mode penyamaran dan jangan menghapus data browser di tengah permainan. Identitas pemain tersimpan di browser. |

Tips: gunakan tombol **◐** di kanan atas untuk ganti tema terang atau gelap. Di ponsel, Anda bisa memilih **Tambahkan ke Layar Utama** dari menu browser supaya terbuka seperti aplikasi.

## Privasi

- Tidak perlu akun. Yang tersimpan hanya **nama panggilan** yang Anda ketik dan data permainan selama room aktif.
- Tawaran Anda **rahasia**: pemain lain baru melihatnya setelah moderator membuka tawaran.
- Jangan membagikan kode room ke orang di luar permainan.

## Untuk pengembang

Cara memasang, menjalankan, menguji, dan men-deploy aplikasi ada di **[DEVELOPER.md](DEVELOPER.md)**.
