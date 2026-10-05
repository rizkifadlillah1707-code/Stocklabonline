# StockLab Online — Panduan Pengembang

Panduan ini untuk orang yang akan memasang, menjalankan, mengubah, atau men-deploy aplikasi. Untuk cara bermain, lihat [README.md](README.md). Status kerja paling baru ada di [NEXT_CHAT.md](NEXT_CHAT.md), dan acuan desain di [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Gambaran teknis

StockLab Online adalah MVP multiplayer: moderator membuat room, peserta bergabung memakai kode atau tautan, lalu setiap orang mengirim tawaran dan memilih aksi dari perangkat masing-masing.

- **Front-end:** Vanilla JS + Vite, satu berkas CSS, markup dibuat lewat string HTML. Tanpa framework UI.
- **Realtime:** Firebase Authentication (anonim) + Realtime Database.
- **Hosting:** Cloudflare Pages (aplikasi statis).

> **Catatan MVP:** moderator harus tetap membuka tab selama permainan karena ia menjadi otoritas yang memvalidasi dan menerapkan aksi. Deck ekonomi, saldo, tawaran yang belum dibuka, dan state otoritatif hanya dapat dibaca moderator atau pemain yang berhak. Batas lima pemain divalidasi aplikasi, belum ditegakkan secara atomik oleh Firebase Rules. Ini bukan backend anti-cheat setingkat server khusus.

## Struktur

- `src/index.html` — markup aplikasi aktif (termasuk dialog paket hutang).
- `src/tokens.css` — design token (tema terang dan gelap).
- `src/styles.css` — aturan komponen dan tata letak responsif. Keduanya dimuat lewat `<link>` di index.html.
- `src/main.js` — layar room, langganan realtime, kontrol moderator dan peserta.
- `src/game-engine.js` — aturan fase, tawaran, kartu aksi, ekonomi, utang, dan skor.
- `src/market-view.js` — logika murni tampilan harga (pelacak harga, label Split/Pailit).
- `src/lifecycle.js` — logika murni siklus hidup UI (Wake Lock, banner sambung ulang, tombol Kembali, `beforeunload`).
- `src/firebase.js` — inisialisasi Firebase dari environment variables.
- `src/room-service.js` — akses room, state, tawaran privat, dan perintah.
- `src/public/` — manifest, ikon, dan font self-host (lisensi SIL OFL disertakan). Root Vite adalah `src/`, jadi folder `public` ada di sini.
- `firebase.database.rules.json` — security rules Realtime Database.
- `tests/` — tes engine, lifecycle, dan market-view.
- `index.html` (root) — prototipe lokal lama; **bukan** entry point build. Jangan diubah.

## Menjalankan secara lokal

### 1. Buat Firebase project gratis

1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project.
2. Pada **Authentication → Sign-in method**, aktifkan **Anonymous**.
3. Pada **Realtime Database**, buat database (region yang dekat dengan pemain disarankan).
4. Buka tab **Rules** pada Realtime Database, ganti rules dengan isi `firebase.database.rules.json`, lalu tekan **Publish**. Jangan memakai Test mode atau rules terbuka.
5. Dari **Project settings → General → Your apps**, daftarkan aplikasi Web dan salin `apiKey`, `authDomain`, `projectId`, dan `appId`. Salin juga URL Realtime Database, biasanya `https://<project-id>-default-rtdb.<region>.firebasedatabase.app`.

### 2. Isi konfigurasi dan jalankan

1. Salin `.env.example` menjadi `.env` di folder root.
2. Isi nilai dari Firebase Console: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID`, dan `VITE_FIREBASE_APP_ID`.
3. `npm install`
4. `npm run dev` lalu buka URL lokal yang ditampilkan.
5. Uji dengan beberapa browser atau perangkat (minimal 3, maksimal 5 pemain). Setiap konteks browser terpisah mendapat identitas anonim sendiri.

Firebase Web API key memang terlihat di bundle browser dan bukan password. Keamanan data bergantung pada Authentication dan Realtime Database Rules, bukan menyembunyikan API key. Jangan menaruh service-account key di `.env` front-end, dan jangan meng-commit `.env` (sudah ada di `.gitignore`).

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan dengan muat ulang otomatis |
| `npm run build` | Membuat bundel statis ke `dist/` |
| `npm run preview` | Menyajikan hasil build secara lokal (jika memakai `--outDir`, gunakan **path absolut**, karena root Vite adalah `src/`) |
| `npm test` | Menjalankan tes (`node --test`): engine, lifecycle, dan market-view |

## Deploy ke Cloudflare Pages

Alamat gratis berupa subdomain `nama-proyek.pages.dev`. Domain kustom perlu dibeli sendiri.

### Lewat Git (build otomatis oleh Cloudflare)

1. Push folder project ke repository GitHub. Pastikan `.env` tidak ikut ter-commit.
2. Di Cloudflare Dashboard buka **Workers & Pages → Create → Pages → Connect to Git** dan pilih repository.
3. Atur build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** kosong (default). `vite.config.js` sudah mengarahkan Vite ke `src/` dan menulis hasil build ke `dist/`.
4. Di **Settings → Environment variables**, tambahkan kelima variabel `VITE_FIREBASE_*` untuk **Production** (dan Preview bila perlu). Nilainya sama dengan `.env` lokal.
5. Jalankan deployment. URL: `https://<nama-proyek>.pages.dev`.
6. Di Firebase Console, **Authentication → Settings → Authorized domains**, tambahkan hostname `<nama-proyek>.pages.dev` (tanpa `https://`). Tambahkan juga hostname preview bila akan diuji.

Jika variabel lingkungan berubah di Cloudflare, lakukan deployment baru agar variabel `VITE_*` masuk ke hasil build.

### Lewat Wrangler (unggah langsung dari komputer)

Proyek production saat ini memakai cara ini. Build membaca `.env` lokal, lalu `dist/` diunggah.

```bash
npm run build
# Preview (cabang selain cabang production Pages):
npx wrangler pages deploy dist --project-name stocklab-online --branch preview
# Production (cabang production Pages bernama STOCKLAB):
npx wrangler pages deploy dist --project-name stocklab-online --branch STOCKLAB --commit-hash <hash> --commit-message "<pesan>"
```

- Wrangler dijalankan lewat `npx`, tidak ditambahkan ke dependensi proyek.
- Jika muncul pesan butuh `CLOUDFLARE_API_TOKEN`, login ulang dengan `npx wrangler login`.
- Rollback: Cloudflare Dashboard → Pages → stocklab-online → Deployments → pilih deployment lama → **Rollback**.
- Setelah deploy, bandingkan nama berkas JS di `dist/assets/` dengan yang disajikan situs untuk memastikan versi yang sama.

## Aturan permainan di kode (ringkas)

Rincian ada di `src/game-engine.js`; panduan pemain ada di [README.md](README.md).

- Room 3–5 pemain, 15 koin awal, 6 ronde (tiap sektor punya 6 kartu ekonomi), harga awal 5.
- Tangga harga: Tambang 2,3,5,6,8,9; Konsumer 1–8; Keuangan 1,3,4,5,6,7,9; Agrikultur 1,2,4,5,6,8,9. Turun melewati dasar = Pailit (saham ditarik, harga 5). Naik melewati puncak = Split (saham yang sudah dimiliki ×2, harga 5).
- Biaya (Trading Fee, Extra Fee, Pajak Jalan) boleh membuat saldo minus; saldo minus ditutup paket kartu utang (10 koin per kartu, skor akhir −13 per kartu, maksimal 5 kartu per permainan). Pemain bersaldo minus hanya bisa menawar 0.
- Perintah pemain (`loan`, `debt`, `action`, `sell`) dikirim ke `rooms/{room}/commands/{uid}` dan diproses oleh browser moderator. Moderator dengan versi aplikasi lama menolak perintah baru, jadi setelah deploy semua sesi aktif perlu dimuat ulang.
- Skor akhir = koin + nilai saham − (13 × kartu utang).
- Beberapa rincian belum dicocokkan dengan buku aturan cetak: definisi Merger/World Oil/Tax Amnesty, dividen flat 1 koin per lembar, bonus Info Bursa +2, kompensasi Akuisisi, dan Pailit tanpa kompensasi.

## Pengujian

- `npm test` mencakup 5 efek kartu aksi, 18 jenis kartu ekonomi, Split/Pailit pada keempat tangga harga, Resesi, Stimulus, Restrukturisasi, Tax Amnesty, World Oil, Merger, pinjaman dan paket hutang, biaya yang membuat saldo minus, satu simulasi enam ronde, serta logika murni siklus hidup dan tampilan harga.
- Belum ada tes UI/browser di repo. Uji alur banyak tab (moderator + pemain) dilakukan manual atau dengan skrip Playwright sementara di luar repo.
- Hal yang hanya bisa diverifikasi di perangkat nyata (belum diverifikasi): keyboard virtual, safe area dan `dvh`, Wake Lock, iPad Split View, tombol Kembali, dan sambung ulang setelah layar terkunci. Checklist ada di `DESIGN_SYSTEM.md` bagian 12.3.

## Batasan Firebase

Firebase Spark (gratis) punya kuota dan batas 100 koneksi simultan untuk seluruh project. Untuk kelas kecil atau demo biasanya cukup; pantau halaman **Usage and billing** di Firebase Console dan jangan mengaktifkan layanan berbayar tanpa memahami batasnya. Data room tidak dibersihkan otomatis; hapus room lama lewat Console bila perlu.

## Konvensi

- CSS satu baris per aturan, komentar seperlunya dalam bahasa Indonesia, nama kelas bahasa Inggris.
- Semua warna, ukuran, dan radius diambil dari token di `tokens.css`; hindari hex di dalam aturan komponen.
- Tidak ada teks di bawah 12 px; font input minimal 16 px (mencegah zoom otomatis di iOS); jangan memakai `user-scalable=no`.
- Jangan membaca, mencetak, atau meng-commit `.env`, API key, token, atau rahasia lain.
