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

- **Preview Cloudflare** (bukan production): https://desain-ui-ux.stocklab-online.pages.dev, dideploy dengan `wrangler pages deploy dist --project-name stocklab-online --branch preview`. Production `stocklab-online.pages.dev` belum berubah. Hostname preview sudah berfungsi dengan Firebase Auth.
- Uji otomatis 3 tab (Playwright; moderator 1024×768 + 2 pemain 390×844) pada preview: buat/gabung room, mulai, 2 ronde penuh (tawaran, aksi, jual, ekonomi), banner offline-online berhasil tanpa galat konsol selain WebSocket yang sengaja diputus. Room uji `BRFNHC` tertinggal di Firebase (status playing).
- Uji 5 tab (moderator + 4 pemain, jendela Chromium terlihat via WSLg) hingga ronde 6 dan layar skor akhir lulus tanpa galat; kelima efek kartu (Info Bursa, Rumor, Trading Fee, Quickbuy, Akuisisi), fase jual sungguhan, dan Pailit/Split tampil benar. Preview dan production sudah memuat commit `d0d5194`. Deploy: `npm run build && npx wrangler pages deploy dist --project-name stocklab-online --branch <desain-ui-ux|STOCKLAB>` (token login wrangler bisa kedaluwarsa: `npx wrangler login`).
- **PRODUCTION sudah memakai redesain**: deployment `5925df10` (commit `d0d5194`, cabang Pages `STOCKLAB`) di https://stocklab-online.pages.dev. Rollback: deployment sebelumnya `a45fcd46` (commit `71e93e9`) lewat Cloudflare Dashboard → Pages → stocklab-online → Deployments → Rollback. Cabang `desain-ui-ux` sudah digabung ke `main` (fast-forward) dan dipush; `main` = `desain-ui-ux` di GitHub. Production diuji 5 tab penuh (6 ronde, 5 efek kartu, fase jual, skor akhir) tanpa galat; room uji `QJ9ZQ6` tertinggal di Firebase.
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
- Engine tidak memiliki eliminasi pemain. Biaya (Trading Fee, Extra Fee, Pajak Jalan) boleh membuat saldo minus; pemain lalu memilih paket kartu utang lewat popup (10 koin per kartu, dilunasi 13 di skor akhir, maksimal 5 kartu per permainan). Pemain bersaldo minus hanya bisa menawar 0. Saldo yang tetap minus (kartu utang habis) mengurangi skor akhir. Pajak Jalan = urutan bidding ronde itu (1 sampai N koin). Merger sektor terakhir mengikuti sektor pertama (melingkar). Crash/Split mengikuti aturan: turun melewati dasar tangga = semua saham pemain ditarik; naik melewati puncak = saham yang sudah dimiliki ×2; harga kembali ke 5.
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
