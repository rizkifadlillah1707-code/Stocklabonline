# StockLab Online — Handoff untuk Chat Berikutnya

Dokumen ini melengkapi README: gunakan README untuk setup/deploy umum, dan file ini untuk status kerja paling baru.

## Project dan akses

- Workspace: `/home/dac/stocklabonline`
- Aplikasi aktif: Vite memakai `src/` (root Vite adalah `src/`, bukan root repo); `index.html` di root adalah prototipe lama, jangan diubah.
- GitHub: `rizkifadlillah1707-code/Stocklabonline`. Remote `origin` memakai SSH, jadi `git push` biasa langsung bekerja. Remote `upstream` = repo `hanafin12/stocklabonline` (hanya baca).
- Situs production: https://stocklab-online.pages.dev/
- Cloudflare Pages project: `stocklab-online`; cabang production Pages: `STOCKLAB`; semua cabang lain menjadi preview (mis. `preview.stocklab-online.pages.dev`).
- Firebase project: `projecttestingstocklab`; konfigurasi lokal di `.env` (ignored; jangan dibaca/dicetak/di-commit atau meminta user mengirimkannya). Rules dipasang lewat Firebase Console dari `firebase.database.rules.json` (tidak berubah dalam pekerjaan ini); tidak ada `firebase.json`/CLI Firebase.

## Status terkini

- **Production** menjalankan deployment `739675e4` (commit `8c731d1`). Commit sesudahnya hanya mengubah dokumen.
- Titik rollback (Cloudflare Dashboard → Pages → stocklab-online → Deployments → Rollback): `5925df10` (redesain tanpa aturan hutang), lalu `a45fcd46` (versi sebelum redesain, commit `71e93e9`).
- `npm test` **37/37 lulus** (26 engine, 5 `lifecycle`, 6 `market-view`); `npm run build` berhasil.

## Yang sudah dikerjakan

1. **Redesain UI/UX** mengikuti `DESIGN_SYSTEM.md` (tahap 1–8, 7a–7f; tahap 9 dilewati): token terang/gelap, kontras WCAG AA, ukuran teks minimal 12 px, penanda non-warna (▲/▼/–, centang, "Giliran", status koneksi), tata letak ponsel/tablet, tombol ganti tema, font self-host, manifest dan ikon, banner sambung ulang, Wake Lock, riwayat tombol Kembali, form (numerik, error inline, "Memproses…", jeda kunci 8 detik).
2. **UX lanjutan**: toast per jenis, dashboard portofolio lipat di ponsel, konfirmasi "lewati giliran", skeleton, "Coba lagi", panah antar tab, "Tersalin ✓", keadaan kosong lobby.
3. **Aturan permainan** (disetujui user, mengubah `game-engine.js`): saldo boleh minus (Trading Fee, Extra Fee, Pajak Jalan tidak lagi berhenti di 0) dan ditutup lewat popup paket kartu utang; Merger sektor terakhir melingkar ke sektor pertama.
4. **Tampilan harga**: harga selalu yang terbaru; ringkasan "Harga saham sekarang" (`5 → 9 · ▲ +4`); label ✦ Split / ✖ Pailit; penanda menyebut harga sebelumnya (`▼ −1 dari 6`). Logika murni di `src/market-view.js`.

## Arsitektur

- `src/index.html` — markup aplikasi (termasuk `<dialog id="debt-dialog">`).
- `src/tokens.css` — design token terang + gelap; `src/styles.css` — aturan komponen (keduanya dimuat lewat `<link>`).
- `src/main.js` — UI, langganan realtime, moderator dan peserta.
- `src/game-engine.js` — aturan/efek kartu dan transisi fase.
- `src/market-view.js` — logika murni tampilan harga (pelacak harga, Split/Pailit, teks penanda).
- `src/lifecycle.js` — logika murni siklus hidup UI (Wake Lock, banner, Kembali, beforeunload).
- `src/room-service.js`, `src/firebase.js` — akses Firebase Realtime Database dan inisialisasi (tidak diubah).
- `src/public/` — manifest, ikon, dan font self-host beserta lisensi SIL OFL.
- `tests/game-engine.test.js`, `tests/lifecycle.test.js`, `tests/market-view.test.js`.
- `DESIGN_SYSTEM.md` — acuan desain; bagian 12 berisi hasil penerapan, status temuan A1–A13, dan checklist uji perangkat.

## Aturan permainan penting (sesuai kode saat ini)

- Room 3–5 pemain; setiap pemain mulai dengan 15 koin; 6 ronde (setiap sektor punya 6 kartu ekonomi).
- Moderator browser adalah otoritas state dan harus tetap aktif selama permainan. MVP untuk demo/kelas dengan moderator tepercaya, bukan backend anti-cheat. Firebase Spark membatasi 100 koneksi simultan.
- Tawaran rahasia menentukan urutan main (seri: urutan ronde sebelumnya). Tawaran dibayar ke Bank.
- Tangga harga (sudah dikonfirmasi benar): Tambang 2,3,5,6,8,9; Konsumer 1–8; Keuangan 1,3,4,5,6,7,9; Agrikultur 1,2,4,5,6,8,9. Harga awal 5.
- Crash (Pailit): turun melewati dasar tangga → semua saham pemain di sektor itu ditarik, harga kembali 5. Split: naik melewati puncak → saham yang **sudah dimiliki** ×2, harga kembali 5.
- Biaya (Trading Fee = 1 + jumlah saham sektor kartu; Extra Fee = 1 per lembar; Pajak Jalan = urutan bidding ronde itu, 1 sampai N koin) boleh membuat saldo minus. Hasil penjualan dalam aksi Trading Fee dihitung dulu sebelum menilai saldo.
- Saldo minus → popup paket kartu utang (10 koin per kartu, dilunasi 13 di skor akhir; maksimal 5 kartu per permainan; paket 1–3 kartu mulai dari yang cukup menutup kekurangan). Pemain bersaldo minus hanya bisa menawar 0. Bila kartu utang habis, saldo tetap minus dan mengurangi skor akhir. Pinjaman sukarela 1 kartu tetap ada di fase bidding.
- Skor akhir = koin + nilai saham − (13 × kartu utang).
- Reksa Dana: harga = rata-rata (dibulatkan ke bawah) dua sektor tetangga yang ditetapkan di awal; tidak ikut ditarik saat sektor asal Pailit.
- Akuisisi: ambil 1 saham target bila jumlah saham sektor itu ≥ milik target; target mendapat `floor(harga/2)` koin. Info Bursa: +2 koin dan mengintip kartu ekonomi teratas dua sektor (privat).
- Item yang belum dicocokkan dengan buku aturan cetak: definisi Merger/World Oil/Tax Amnesty, Dividen flat 1 koin per lembar, Info Bursa +2, kompensasi Akuisisi, dan Pailit tanpa kompensasi.

## Deploy

- Build: `npm run build` (hasil di `dist/`). Preview lokal: `npx vite preview --outDir /home/dac/stocklabonline/dist` (path absolut).
- Preview Cloudflare: `npx wrangler pages deploy dist --project-name stocklab-online --branch preview`
- **Production**: `npx wrangler pages deploy dist --project-name stocklab-online --branch STOCKLAB --commit-hash <hash> --commit-message "<pesan>"`
- Token login wrangler bisa kedaluwarsa (`npx wrangler login`); wrangler tidak dipasang di proyek (dijalankan lewat `npx`).
- Variabel `VITE_FIREBASE_*` dibaca dari `.env` lokal saat build; domain baru harus ada di Firebase Authentication → Authorized domains.

## Pengujian

- `npm test` untuk logika (engine, lifecycle, market-view).
- Uji alur 3–5 tab dilakukan dengan Playwright dari folder scratchpad (di luar repo, tanpa menambah dependensi proyek); skrip tidak disimpan di repo. Lulus untuk: buat/gabung room, 6 ronde penuh, kelima efek kartu (Info Bursa, Rumor, Trading Fee, Quickbuy, Akuisisi), fase jual sungguhan, Pailit/Split, banner offline/online, popup paket hutang, dan layar skor akhir, di preview dan production.
- Room uji yang tertinggal di Firebase (status playing, boleh dihapus lewat Console): `BRFNHC`, `KAT7GT`, `ZQGVNP`, `N3JZYQ`, `QJ9ZQ6`, `PZ4DHU`, `FBQ4LS`.

## Belum diverifikasi / saran langkah berikutnya

1. **Uji di perangkat nyata** (belum diverifikasi di perangkat): keyboard virtual, safe area/`dvh`, Wake Lock, iPad Split View, tombol Kembali di lobby/game, sambung ulang setelah layar terkunci 30 detik, dan 3 perangkat serentak. Checklist ada di `DESIGN_SYSTEM.md` bagian 12.3.
2. Popup paket hutang akibat **Extra Fee / Pajak Jalan** dan kasus **kartu utang habis** baru diuji di tingkat tes engine, belum di permainan nyata.
3. Putuskan **A1** (merek koral vs warna harga turun) setelah melihat ▲/▼ di perangkat; evaluasi apakah merek perlu dipindah ke warna netral (hanya token `--brand*`).
4. Cocokkan sisa aturan di atas dengan buku aturan cetak bila tersedia.

Jangan tulis API key, credential, token, isi `.env`, atau secret ke file handoff ini.
