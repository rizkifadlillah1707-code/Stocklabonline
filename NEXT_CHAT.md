# StockLab Online — Handoff untuk Chat Berikutnya

Dokumen ini melengkapi README: gunakan README untuk setup/deploy umum, dan file ini untuk status kerja paling baru.

## Project dan akses

- Workspace: `/home/dac/stocklabonline`
- Aplikasi aktif: Vite memakai `src/`; `index.html` root adalah prototipe lama.
- GitHub remote: `https://github.com/rizkifadlillah1707-code/Stocklabonline.git`
- Branch: `main`
- Situs production: https://stocklab-online.pages.dev/
- Cloudflare Pages project: `stocklab-online`; deployment production branch yang digunakan sebelumnya `STOCKLAB`; ada juga preview alias `main.stocklab-online.pages.dev`.
- Firebase project: `projecttestingstocklab`; konfigurasi lokal berada di `.env` (ignored, jangan dibaca/cetak/commit atau meminta user mengirimkannya).

## Status Git terkini (redesign UI/UX)

- Cabang kerja: `desain-ui-ux` (dari `main`), **15 commit lokal, belum dipush, belum dideploy**.
- `main` = `origin/main` = `71e93e9` (tidak diubah oleh redesign).
- Tahap 9 (Web Awesome / `<dialog>`) sengaja dilewati. Tahap 10 (uji perangkat nyata) belum dilakukan: lihat checklist di bagian bawah.
- Hanya tampilan dan siklus hidup UI yang berubah. `game-engine.js`, `room-service.js`, `firebase.js`, dan rules tidak disentuh. `.env` tidak dibaca.
- `npm test` **25/25 lulus** (20 engine + 5 `lifecycle`), `npm run build` berhasil (CSS 21,9 kB, JS 398 kB).

## Arsitektur

- `src/index.html` — markup aplikasi.
- `src/tokens.css` — design token (terang + gelap); `src/styles.css` — aturan komponen. Keduanya dimuat lewat `<link>` di index.html.
- `src/lifecycle.js` — logika murni siklus hidup UI (Wake Lock, banner, Kembali, beforeunload), diuji di `tests/lifecycle.test.js`.
- `src/public/` — manifest, ikon, dan font self-host (root Vite adalah `src/`, bukan root repo).
- `src/main.js` — UI, room subscriptions, moderator dan peserta.
- `src/game-engine.js` — aturan/efek kartu dan transisi fase.
- `src/room-service.js` — Firebase Realtime Database access.
- `src/firebase.js` — inisialisasi Firebase dari `VITE_FIREBASE_*`.
- `firebase.database.rules.json` — rules yang dipasang melalui Firebase Console.
- `tests/game-engine.test.js` — tes deterministik engine (20 tes) dan `tests/lifecycle.test.js` (5 tes).
- `README.md` — instruksi setup lokal, Firebase, dan Cloudflare Pages.

## Perilaku / batasan penting

- Room 3–5 pemain; beberapa room dapat berjalan bersamaan.
- Firebase Spark Realtime Database membatasi 100 koneksi simultan seluruh project.
- Moderator browser adalah otoritas state dan harus tetap aktif selama permainan. Ini MVP untuk demo/kelas dengan moderator tepercaya, bukan backend anti-cheat.
- Engine tidak memiliki mekanik pailit/eliminasi. Pungutan/biaya tidak membuat saldo negatif; uang dipotong maksimal sampai 0. Utang kartu mengurangi skor akhir 13 per kartu.
- Harga saham memakai tangga harga positif; tidak ada path untuk harga 0. Crash menghapus holdings dan reset ke 5 saat melampaui dasar; Split menggandakan holdings dan reset ke 5 saat melewati puncak.
- Informasi kartu ekonomi privat dari Info Bursa dikirim ke pemain pemilih.
- Economy rules tertentu mungkin perlu diverifikasi dengan rulebook cetak, terutama definisi Merger/World Oil/Tax Amnesty dan kapan crash/split terjadi.

## Verifikasi sebelumnya

Jalankan dari root project:

- `npm test` — terakhir 25/25 pass.
- `npm run build` — terakhir berhasil.

Tes mencakup 5 action cards, 18 economy-card types, split/crash keempat sector tracks, Resesi, Stimulus, Restructuring, Tax Amnesty, World Oil + Merger, pinjaman, pungutan, serta satu simulasi enam ronde.

## Saran langkah berikutnya

1. Uji `desain-ui-ux` di perangkat nyata (checklist di DESIGN_SYSTEM.md bagian 12.3). Hal yang **belum diverifikasi di perangkat**: keyboard virtual, safe area/`dvh`, Wake Lock, Split View iPad, sambung ulang setelah layar terkunci, tombol Kembali, dan uji 3 perangkat serentak.
2. Layar lobby/game asli belum pernah diperiksa lewat tangkapan layar (tanpa `.env`); hanya halaman tiruan.
3. Putuskan A1 (merek koral vs warna harga turun) setelah melihat ▲/▼ di perangkat.
4. Jika lolos: gabungkan ke `main`, baru push dan deploy (Cloudflare Pages `stocklab-online`). Jangan deploy sebelum uji perangkat.

Jangan tulis API key, credential, token, isi `.env`, atau secret ke file handoff ini.
