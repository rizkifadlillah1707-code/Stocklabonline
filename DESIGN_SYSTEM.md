# StockLab Online — Acuan Desain UI/UX

Dokumen ini adalah acuan perubahan tampilan dan pengalaman pengguna. Cakupannya: audit kondisi sekarang, prinsip desain, design token, aturan komponen, urutan pengerjaan, dan daftar referensi. Berkas yang terdampak: `src/styles.css`, `src/index.html`, dan string markup di `src/main.js`.

Tidak ada logika permainan yang berubah (`game-engine.js`, `room-service.js`).

---

## 1. Konteks produk

| Aspek | Keterangan |
|---|---|
| Jenis | Simulasi pasar modal multipemain untuk edukasi, 3–5 pemain per room |
| Perangkat utama | **Ponsel**. Setiap pemain bermain dari perangkat masing-masing. Moderator bisa memakai laptop. |
| Durasi sesi | Panjang (beberapa ronde), sering di ruang kelas atau di rumah malam hari |
| Bahasa | Indonesia |
| Tumpukan teknologi | Vanilla JS + Vite, satu berkas CSS, markup dibuat lewat string HTML |
| Batasan | Tidak ada framework UI. Perubahan harus berupa CSS dan token, bukan penulisan ulang komponen. |

Layar yang ada: **Beranda** (buat/gabung room), **Lobby**, **Game** (strip pasar, panel fase, sidebar portofolio, dashboard portofolio, alat moderator), **Error**, dan **Toast**.

---

## 2. Audit kondisi sekarang

Angka kontras dihitung dengan rumus WCAG 2.2 dari nilai di `src/styles.css`. Batas minimum: **4,5:1** untuk teks biasa, **3:1** untuk teks besar dan komponen UI.

| # | Temuan | Bukti | Dampak | Prioritas |
|---|---|---|---|---|
| A1 | **Warna merek sama dengan warna "harga turun" dan "error".** `--brand` (#e63946) dipakai untuk tombol utama, kode room, `.market-price.down`, dan `.connection-status.offline`. | styles.css baris `--brand`, `.market-price.down` | Pemain bisa mengira tombol atau kode room adalah sinyal rugi. Merah tidak lagi berarti apa-apa. | Tinggi |
| A2 | **`--faint` (#aa9690) terlalu pudar.** Kontras 2,66:1 di atas `--bg` dan 2,81:1 di atas putih. Dipakai untuk eyebrow, label sidebar, statistik pemain, dan nol di tabel. | Perhitungan kontras | Gagal AA. Sulit dibaca di bawah sinar matahari atau layar redup. | Tinggi |
| A3 | `#9b8580` (`.feature-row`) 3,28:1 dan placeholder `#baa9a4` 2,26:1. | Perhitungan kontras | Gagal AA | Sedang |
| A4 | **Teks putih pada tombol utama** (#fff di atas #e63946) hanya 4,17:1. `--brand` sebagai teks merah di atas putih juga 4,17:1. | Perhitungan kontras | Gagal AA untuk teks normal. `--brand-dark` (#c22233) mencapai 5,88:1. | Sedang |
| A5 | `--green` (#26875e) di atas putih 4,46:1 | Perhitungan kontras | Mepet di bawah 4,5. Perlu sedikit digelapkan. | Rendah |
| A6 | **Ukuran font sangat kecil**: `.59rem`, `.6rem`, `.61rem`, `.64rem`, `.69rem`. Banyak yang bergaya mono dan huruf kapital. | styles.css | Sekitar 9–10 px, sulit dibaca di ponsel | Tinggi |
| A7 | **Status naik/turun hanya dibedakan warna** (`.up` hijau, `.down` merah). | `.market-price.up/.down` | Tidak terbaca oleh pemain buta warna merah-hijau | Tinggi |
| A8 | **Angka tidak rata.** Harga, saldo, dan tabel portofolio memakai font mono, tetapi tanpa `tabular-nums`. | `.market-price`, `.portfolio-table td` | Lebar angka bergeser saat berubah, tampilan "bergetar" | Sedang |
| A9 | **Tidak ada dark mode** | Tidak ada `prefers-color-scheme` | Sesi panjang di malam hari melelahkan mata | Sedang |
| A10 | **Warna hardcode tersebar**: `#fff4f1`, `#fff2ef`, `#fff5f3`, `#fff8f6`, `#fde4e2`, `#fff1ee`, `#ffe8e5` (tujuh variasi merah muda). | styles.css | Sulit dijaga konsisten, tidak bisa di-tema-kan | Sedang |
| A11 | Font di prototipe lama (`index.html` root) memakai Space Grotesk, sedangkan aplikasi aktif memakai DM Sans. | `index.html` vs `src/index.html` | Hanya tidak konsisten, tidak berdampak ke pengguna | Rendah |
| A12 | **Toast di kanan bawah** (`right: 18px; bottom: 18px`) | `.toast-region` | Di ponsel tertutup keyboard dan area jempol. Tidak ada safe-area. | Rendah |
| A13 | Strip pasar `repeat(5, minmax(100px, 1fr))` di ponsel memaksa scroll horizontal | `.market-strip` | Harga lima sektor tidak terlihat sekaligus | Sedang |

Yang sudah baik dan perlu **dipertahankan**:

- Tinggi tombol dan input minimal 44–48 px, sesuai target sentuh.
- Fokus terlihat (`outline: 3px`), `prefers-reduced-motion` sudah dihormati.
- Hierarki tipografi jelas: judul besar, label mono, isi sans.
- Alur masuk tanpa akun: "Gratis dimainkan · Tidak perlu membuat akun".
- Peran `aria-live`, `role="alert"`, dan `role="tablist"` sudah dipasang.

---

## 3. Prinsip desain

1. **Warna harus bermakna.** Merah dan hijau hanya untuk data pasar (turun/naik) dan status. Merek memakai warna lain.
2. **Angka adalah isi utama.** Harga, saldo, dan ranking harus yang paling mudah dibaca: besar, rata, dan kontras tinggi.
3. **Ponsel dulu, laptop menyusul.** Rancang di lebar 360 px, lalu perluas.
4. **Jangan hanya mengandalkan warna.** Setiap status warna punya pendamping: ikon, tanda ▲/▼/–, atau label.
5. **Satu sumber kebenaran.** Semua warna, ukuran, dan radius diambil dari token, bukan angka hex di dalam aturan komponen.
6. **Tenang di sesi panjang.** Dark mode, animasi hemat, dan tidak ada elemen berkedip.

---

## 4. Design token

Letakkan di berkas baru `src/tokens.css`, impor sebelum `styles.css`. Nilai di bawah adalah **usulan awal**. Kontras tiap pasangan perlu dicek ulang dengan pemeriksa kontras setelah dipasang (lihat bagian Referensi).

### 4.1 Warna

Pemisahan peran: **merek**, **permukaan**, **teks**, **data pasar**, **status**.

| Token | Light | Dark | Peran |
|---|---|---|---|
| `--bg` | `#fff7f6` | `#16100f` | Latar halaman |
| `--surface` | `#ffffff` | `#211917` | Kartu, panel |
| `--surface-sunken` | `#fff1ee` | `#2a201e` | Panel di dalam kartu (menggantikan 7 variasi merah muda) |
| `--line` | `#ead9d6` | `#3b2f2c` | Border |
| `--ink` | `#23130f` | `#f6ebe8` | Teks utama |
| `--muted` | `#6b5a54` | `#c9b8b3` | Teks sekunder (target ≥ 5:1) |
| `--faint` | `#7d6b65` | `#a8958f` | Label tersier (target ≥ 4,5:1, **bukan** lagi #aa9690) |
| `--brand` | `#c22233` | `#ef6b78` | Tombol utama, kode room, tautan |
| `--brand-strong` | `#a31b2a` | `#f58b95` | Hover |
| `--brand-soft` | `#fde4e2` | `#3a1f23` | Latar chip dan avatar |
| `--on-brand` | `#ffffff` | `#1b0a0d` | Teks di atas `--brand` |
| `--up` | `#1e7a52` | `#4cc28a` | Harga naik, untung |
| `--down` | `#c4302b` | `#ff7a73` | Harga turun, rugi |
| `--flat` | `#6b5a54` | `#c9b8b3` | Harga tidak berubah |
| `--info` | `#2b6cb0` | `#7db4ee` | Informasi netral |
| `--warning` | `#9a5b00` | `#f0b45a` | Peringatan |
| `--danger` | `#b52636` | `#ff8a94` | Error sistem |

Catatan keputusan:

- **Merek tetap koral** (`--brand`) supaya identitas tidak berubah drastis. Nilainya digelapkan dari `#e63946` ke `#c22233` agar tombol lolos AA (5,88:1 dengan teks putih).
- `--down` dan `--danger` sengaja dua token. `--down` hanya untuk data pasar. `--danger` untuk error sistem. Keduanya boleh bernilai mirip, tetapi **tidak boleh sama dengan `--brand`**.
- Jika setelah uji coba merek koral dan `--down` masih terlihat terlalu dekat, pilihan lain adalah memindahkan merek ke warna netral (misalnya indigo atau amber). Hanya `--brand*` yang berubah, komponen lain tidak.
- Skala 12 langkah dari Radix Colors bisa dipakai sebagai sumber nilai (red, grass, amber, blue, tomato untuk dark). Lihat Referensi.

### 4.2 Tipografi

| Token | Nilai | Pemakaian |
|---|---|---|
| `--font-sans` | `'DM Sans', system-ui, sans-serif` | Teks umum |
| `--font-mono` | `'IBM Plex Mono', ui-monospace, monospace` | Angka, kode room, label data |
| `--text-xs` | `0.75rem` (12 px) | **Batas minimum.** Label dan catatan kecil |
| `--text-sm` | `0.875rem` | Teks bantu, sel tabel |
| `--text-base` | `1rem` | Isi |
| `--text-lg` | `1.125rem` | Judul kartu |
| `--text-xl` | `1.375rem` | Judul panel fase |
| `--text-2xl` | `clamp(1.75rem, 4vw, 2.5rem)` | Judul layar game |
| `--text-hero` | `clamp(2.5rem, 5.6vw, 4.8rem)` | Hero beranda |
| `--text-price` | `1.5rem` | Harga di strip pasar |

Aturan:

- **Tidak ada teks di bawah 12 px.** Ganti semua `.59rem`–`.69rem`.
- Semua angka (harga, saldo, jumlah saham, skor) memakai `font-variant-numeric: tabular-nums`. Letakkan sebagai kelas `.num`.
- Huruf kapital dengan `letter-spacing` hanya untuk eyebrow dan label pendek, bukan untuk kalimat.

### 4.3 Spasi, bentuk, bayangan

| Token | Nilai |
|---|---|
| `--space-1…6` | `4, 8, 12, 16, 24, 32 px` |
| `--radius-sm` | `8px` (input, tombol, chip kotak) |
| `--radius-md` | `12px` (kartu kecil, tile) |
| `--radius-lg` | `16px` (panel besar) |
| `--radius-pill` | `999px` |
| `--shadow-card` | `0 12px 36px rgb(72 31 22 / .08)` light, `none` + border di dark |
| `--tap-min` | `44px` (tinggi minimum semua kontrol sentuh) |
| `--focus-ring` | `3px solid` warna `--brand` dengan offset 2 px |

### 4.4 Gerak

- Durasi: `120ms` (hover), `200ms` (muncul/hilang), `0.01ms` jika `prefers-reduced-motion`.
- Perubahan harga boleh memberi sorotan singkat (latar `--up`/`--down` pudar dalam 600 ms). Tidak boleh berkedip berulang.

---

## 5. Aturan komponen

### 5.1 Strip pasar (`.market-tile`)

- Tampilkan **nama sektor, harga, dan perubahan** sekaligus: `▲ +10` / `▼ −10` / `– 0`.
- Warna dari `--up`, `--down`, `--flat`. Selalu disertai tanda ▲/▼/–.
- Di ponsel: grid 2 kolom + 1 baris tambahan, atau kartu geser dengan **scroll-snap** dan indikator, bukan potongan yang menggantung.
- Angka memakai `.num` dan `--text-price`.

### 5.2 Tombol

| Varian | Latar | Teks | Pemakaian |
|---|---|---|---|
| Primary | `--brand` | `--on-brand` | Satu aksi utama per layar |
| Secondary | `--surface` + border `--line` | `--ink` | Aksi sekunder |
| Quiet | transparan | `--brand` | Aksi tersier, tautan |
| Danger | `--danger` | `--on-brand` | Hapus/keluar, bila ada |

- Tinggi minimum `--tap-min`. Jarak antar tombol sentuh minimal 8 px.
- Status `disabled` tetap terbaca (jangan hanya `opacity: .5`). Beri alasan lewat teks bantu bila perlu.
- Tombol aksi yang menunggu respons Firebase menampilkan status "Memproses…" dan mencegah klik ganda.

### 5.3 Kartu aksi (`.action-card`) dan pratinjau (`.pool-chip`)

- Kartu terpilih tidak hanya berganti warna border. Tambahkan **ikon centang** dan `aria-pressed="true"`.
- Chip efek memakai `--brand-soft` untuk netral. Efek naik/turun memakai `--up`/`--down` dengan tanda +/−.

### 5.4 Panel pemain (`.game-player`) dan tabel portofolio

- Giliran sekarang: border `--brand` + label teks "Giliran" (bukan hanya latar).
- Status koneksi: titik berwarna **disertai** teks "Terhubung / Terputus".
- Tabel: kolom pertama (nama) menempel (`position: sticky; left: 0`) saat tabel bergulir di ponsel. Baris "saya" diberi tanda di samping warna latar.
- Nol di tabel: `--faint` yang sudah dinaikkan kontrasnya (bukan `#aa9690`).

### 5.5 Form dan tawaran (`.bid-form`)

- `inputmode="numeric"` dan `pattern="[0-9]*"` untuk kolom tawaran, supaya papan angka muncul di ponsel.
- Label tetap terlihat (bukan hanya placeholder). Placeholder minimal 4,5:1.
- Pesan error di bawah kolom, `role="alert"`, bukan hanya border merah.
- Tampilkan batas (saldo, minimum tawaran) di dekat kolom.

### 5.6 Toast

- Ponsel: di bagian bawah, lebar penuh dikurangi gutter, dengan `padding-bottom: env(safe-area-inset-bottom)`.
- Desktop: kanan bawah seperti sekarang.
- Jenis: info, sukses, peringatan, error. Setiap jenis punya ikon sendiri dan durasi: error 8 detik atau sampai ditutup, lainnya 4 detik.

### 5.7 Status koneksi di topbar

- Ganti teks mono kecil menjadi chip dengan titik + label: `● Terhubung`, `● Menghubungkan…`, `● Terputus`.
- Saat terputus, tampilkan banner di bawah topbar. Pemain perlu tahu bahwa tawarannya belum terkirim.

### 5.8 Layar kosong, memuat, dan error

- Lobby sebelum ada pemain lain: ilustrasi teks singkat "Menunggu pemain. Bagikan kode **ABC123**".
- Memuat: kerangka (skeleton) pada panel fase, bukan layar kosong.
- Error: ikon + judul + tindakan jelas (tombol "Coba lagi" dan "Kembali ke awal").

---

## 6. Pola UX per layar

### Beranda
- Dua tab (Buat/Gabung) sudah baik. Tambahkan `aria-controls` dan navigasi panah kiri/kanan antar tab.
- Kolom kode room: huruf besar otomatis, `autocapitalize="characters"`, `autocomplete="off"`, panjang tetap.
- Satu tombol utama di ponsel, selalu terlihat tanpa menggulir di layar 360×640.

### Lobby
- Kode room dan tombol salin adalah elemen utama. Setelah disalin, tombol berubah jadi "Tersalin ✓" selama 2 detik (selain toast).
- Daftar pemain menampilkan status koneksi (teks + titik) dan label "Moderator".
- Tombol "Mulai permainan" menampilkan syarat: "Minimal 3 pemain (sekarang 2)" ketika belum terpenuhi.

### Game
- Urutan di ponsel dari atas: **fase + giliran → strip pasar → panel aksi → pesan → portofolio saya → semua pemain**. Sidebar portofolio tidak lagi dipaksa ke atas penuh (`.game-sidebar { order: -1 }` saat ini memakan satu layar penuh sebelum aksi).
- Panel fase hanya menampilkan **satu keputusan pada satu waktu** dengan tombol utama di bawah.
- Hitung mundur atau indikator "menunggu X pemain" memakai teks, bukan hanya animasi.
- Dashboard portofolio dilipat (`<details>`) secara default di ponsel.

### Alat moderator
- Dikelompokkan dan diberi label "Khusus moderator". Aksi berisiko (lewati giliran pemain terputus) memakai dialog konfirmasi singkat.

---

## 7. Aksesibilitas (ringkasan target)

- Kontras teks ≥ 4,5:1, teks besar dan komponen UI ≥ 3:1 (WCAG 2.2 AA).
- Target sentuh ≥ 44×44 px (Apple HIG) / 48 dp (Material); WCAG 2.2 minimum 24×24 px.
- Status tidak hanya dengan warna (ikon/tanda/teks).
- Fokus keyboard terlihat dan urutannya mengikuti tampilan.
- Pengumuman perubahan penting (giliran, hasil ronde, error) lewat `aria-live`.
- `prefers-reduced-motion` dan `prefers-color-scheme` dihormati.
- Zoom teks sampai 200% tidak memotong konten. Tidak ada `user-scalable=no`.

---

## 8. Rencana pengerjaan

Urutan dibuat agar tiap tahap bisa di-commit dan diuji sendiri.

| Tahap | Pekerjaan | Berkas | Risiko |
|---|---|---|---|
| 1 | Buat `tokens.css` (terang saja). Pindahkan nilai warna/radius/spasi ke variabel. Tampilan **belum** berubah. | `tokens.css`, `styles.css` | Rendah |
| 2 | Ganti semua hex hardcode dengan token. Satukan tujuh variasi merah muda jadi `--surface-sunken` dan `--brand-soft`. | `styles.css` | Rendah |
| 3 | Pisahkan `--brand`, `--up`, `--down`, `--danger`. Perbaiki kontras (A2–A5). | `tokens.css`, `styles.css` | Sedang |
| 4 | Skala tipografi: hapus font < 12 px, tambahkan `.num` dan `tabular-nums` (A6, A8). | `styles.css`, `main.js` | Sedang |
| 5 | Penanda ▲/▼/– pada harga, centang pada kartu terpilih, teks pada status koneksi (A7). | `main.js`, `styles.css` | Sedang |
| 6 | Perbaikan tata letak ponsel: strip pasar, urutan sidebar, tabel sticky, toast (A12, A13). | `styles.css`, `main.js` | Sedang |
| 7 | Dark mode lewat `prefers-color-scheme` + `data-theme` opsional dan tombol ganti tema. | `tokens.css`, `index.html` | Sedang |
| 8 | Form: `inputmode`, label, pesan error, status "Memproses…". | `index.html`, `main.js` | Rendah |
| 9 | (Opsional) Dialog dan toast memakai Web Awesome / `<dialog>` native. | `main.js` | Sedang |
| 10 | Uji manual di 360×640, 390×844, 768, 1280 (light dan dark), plus uji simulasi buta warna di DevTools. | — | — |

Cek selesai tiap tahap: `npm test` (20 tes engine + 5 tes lifecycle) dan `npm run build` harus tetap lulus. Belum ada tes UI/browser, jadi tahap 5–7 perlu diuji manual dengan dua perangkat atau lebih.

### Yang sengaja tidak dilakukan
- Tidak memakai MUI, shadcn, atau Chakra (berbasis React, butuh penulisan ulang total).
- Tidak memakai Tailwind/DaisyUI sekarang: semua markup di `main.js` harus diubah.
- Tidak mengganti font atau tata letak dasar. Identitas yang sekarang dipertahankan.

---

## 9. Optimasi Android dan iPad

### 9.1 Kondisi sekarang

Dari `src/index.html` dan `src/styles.css`:

- Meta viewport hanya `width=device-width, initial-scale=1.0`. Tidak ada `viewport-fit=cover`, jadi `env(safe-area-inset-*)` bernilai 0 dan konten bisa tertutup poni atau bar gestur.
- `theme-color` hanya satu nilai (`#fff7f6`). Tidak mengikuti dark mode.
- Tidak ada `color-scheme`, manifest PWA, ikon layar utama, atau `apple-mobile-web-app-*`.
- Tinggi layar memakai `100vh` (`.screen`, `body`). Di Chrome Android dan Safari iPad, `100vh` lebih tinggi daripada area terlihat saat bar alamat muncul.
- Tidak ada aturan khusus untuk layar sentuh: hover tetap aktif dan menempel setelah disentuh (`.button:hover { transform }`, `.action-card:hover`).
- Tidak ada penanganan keyboard virtual. Kolom tawaran bisa tertutup keyboard.
- Breakpoint hanya 850 px dan 640 px. Layar iPad (768, 820, 834, 1024 px) jatuh di antara dua tata letak: tablet potret memakai satu kolom yang terlalu lebar, tablet lanskap memakai tata letak desktop.
- Kolom input memakai `font: inherit` (~16 px). Ini aman: iOS Safari memperbesar halaman otomatis kalau font input di bawah 16 px, jadi **jangan diturunkan**.
- Koneksi realtime Firebase terputus saat tab di latar belakang, terutama di iOS. Pemain yang berpindah aplikasi lalu kembali perlu pemulihan yang jelas.

### 9.2 Target perangkat dan lebar uji

| Kelompok | Contoh | Lebar CSS (px) | Catatan |
|---|---|---|---|
| Android kecil | Galaxy A series, Redmi | 360–393 | Target utama pemain, layar paling sempit |
| Android besar | Pixel, Galaxy S | 412–430 | Bar gestur atau tombol navigasi di bawah |
| Android lipat | Galaxy Z Fold | 280–344 (tertutup), 673+ (terbuka) | Lebar berubah saat dilipat, hindari lebar tetap |
| iPad mini | iPad mini | 744 (potret), 1133 (lanskap) | Tablet kecil |
| iPad / Air | iPad 10, iPad Air | 810–820 (potret), 1080–1180 (lanskap) | Perangkat moderator di kelas |
| iPad Pro | 11" dan 13" | 834–1032 (potret), 1194–1376 (lanskap) | Mendukung Split View dan Slide Over |
| Tablet Android | Galaxy Tab | 800–1280 | Mirip iPad |

Uji juga **iPad Split View** (lebar 320–507 px) dan **Slide Over**: aplikasi harus tetap terpakai di lebar ponsel di dalam layar tablet.

### 9.3 Spesifikasi perubahan

**A. Meta dan tampilan sistem** (`src/index.html`)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="color-scheme" content="light dark" />
<meta name="theme-color" content="#fff7f6" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#16100f" media="(prefers-color-scheme: dark)" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="StockLab" />
<meta name="format-detection" content="telephone=no" />
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

- **Jangan** menambahkan `user-scalable=no` atau `maximum-scale=1` (melanggar aksesibilitas).
- `manifest.webmanifest`: `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `orientation: "any"`, `theme_color`, `background_color`, dan ikon 192, 512, serta versi *maskable*. Letakkan di folder `public/` (belum ada).
- Service worker **tidak wajib** untuk MVP. Aplikasi ini bergantung pada koneksi realtime, jadi mode offline tidak ada gunanya. Cukup manifest agar bisa dipasang ke layar utama.

**B. Tinggi layar dan safe area** (`src/styles.css`)

- Ganti `100vh` dengan `100dvh`, dengan cadangan: `min-height: 100vh; min-height: 100dvh;`.
- Pakai safe area di topbar, footer, toast, dan tombol aksi yang menempel di bawah:

```css
.app-shell { padding-inline: max(14px, env(safe-area-inset-left)) max(14px, env(safe-area-inset-right)); }
.site-footer { padding-bottom: calc(24px + env(safe-area-inset-bottom)); }
.toast-region { bottom: max(18px, env(safe-area-inset-bottom)); }
```

- Mode lanskap di ponsel (tinggi < 500 px): kurangi `padding` vertikal `.screen` dan tinggi topbar supaya panel fase terlihat.

**C. Input sentuh**

```css
@media (hover: none) and (pointer: coarse) {
  .button:hover, .action-card:hover { transform: none; }   /* hover tidak menempel */
}
@media (hover: hover) and (pointer: fine) {
  /* pindahkan aturan :hover yang sekarang ke sini */
}
button, .tab, .action-card { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
```

- `touch-action: manipulation` menghilangkan jeda 300 ms dan zoom ketuk ganda pada tombol. Beri gantinya status `:active` yang terlihat (mis. latar `--surface-sunken`) karena `:hover` tidak ada.
- Target sentuh minimal `--tap-min` (44 px), jarak antar target minimal 8 px. Di iPad yang dipakai moderator, tombol di alat moderator tidak boleh berdempetan.
- Matikan seleksi teks tidak sengaja pada kartu dan tombol (`user-select: none`), tetapi **tetap izinkan** menyalin kode room dan tautan.

**D. Keyboard virtual**

- Kolom tawaran: `inputmode="numeric"`, `pattern="[0-9]*"`, `enterkeyhint="send"`. Kolom kode room: `autocapitalize="characters"`, `autocorrect="off"`, `spellcheck="false"`, `enterkeyhint="go"`. Kolom nama: `autocomplete="nickname"`.
- Saat kolom tawaran fokus: `scrollIntoView({ block: 'center' })` setelah keyboard muncul. Gunakan `window.visualViewport` (ukuran dan event `resize`) untuk menggeser tombol kirim di atas keyboard.
- Tombol kirim di tata letak ponsel dibuat lebar penuh dan di bawah kolom (sudah ada di breakpoint 640 px, pertahankan).
- Font input **minimal 16 px** agar iOS tidak memperbesar halaman.

**E. Tata letak tablet** (`src/styles.css`)

Tambahkan breakpoint tengah di antara 640 dan 1024 px, dan satu aturan orientasi:

| Lebar | Tata letak game |
|---|---|
| < 640 px | Satu kolom (seperti sekarang), strip pasar 2 + 3 kolom atau scroll-snap |
| 640–1023 px, potret | Strip pasar 5 kolom penuh (cukup lebar). Panel fase satu kolom, **maksimal 720 px** dan di tengah. Portofolio di bawah dalam 2 kolom. |
| 768–1180 px, lanskap | Dua kolom: panel fase + strip pasar di kiri, portofolio di sidebar kanan (seperti desktop) |
| ≥ 1024 px | Tata letak desktop sekarang |

- Pakai `@media (min-width: 640px) and (max-width: 1023px)` dan `@media (orientation: landscape) and (min-width: 768px)`.
- Batasi lebar baca teks panjang (`max-width: 60ch`) supaya tidak terlalu lebar di iPad.
- Ukuran font dasar boleh naik sedikit di tablet (`font-size: clamp(16px, 1.1vw + 12px, 18px)` pada `html`) bila jarak pandang lebih jauh.
- Tabel portofolio di iPad tidak perlu scroll horizontal. Tampilkan penuh dengan sel lebih lega.
- Support Split View: gunakan `container queries` (`container-type: inline-size`) untuk `.phase-panel` dan `.dashboard-panel` agar tata letak mengikuti lebar wadah, bukan lebar layar.

**F. Siklus hidup aplikasi (kembali dari latar belakang)**

- Dengarkan `document.visibilitychange` dan `pageshow`. Saat kembali `visible`, periksa koneksi Firebase, ambil ulang state room, dan tampilkan banner "Menyambungkan ulang…" sampai selesai.
- Pasang `navigator.wakeLock.request('screen')` pada fase aktif agar layar tidak mati di tengah ronde. Terima saja kalau gagal (tidak semua peramban mendukung). Lepaskan di lobby dan saat game selesai.
- Peringatan `beforeunload` hanya untuk **moderator** (karena ia otoritas, lihat README), tidak untuk pemain.
- Tombol Kembali Android dan gestur geser iOS: gunakan `history.pushState` per layar (beranda → lobby → game) supaya Kembali tidak langsung keluar dari aplikasi. Saat game berlangsung, tanya konfirmasi sebelum meninggalkan room.

**G. Rendering dan performa di perangkat murah**

- Android kelas bawah: hindari `backdrop-filter` dan bayangan besar bertumpuk. Sekarang `body` memakai dua `radial-gradient` besar dan panel memakai `box-shadow: 0 15px 45px`. Ganti dengan latar solid di `@media (max-width: 640px)` dan bayangan lebih ringan.
- Animasi hanya `transform` dan `opacity`.
- Font: tambahkan `font-display: swap` (sudah ada lewat `display=swap`) dan muat hanya bobot yang dipakai (400, 600, 700). Pertimbangkan self-host di `public/fonts` agar tidak tergantung Google Fonts.
- Hindari render ulang seluruh dashboard setiap pembaruan realtime. Perbarui hanya sel yang berubah (`textContent`), bukan mengganti `innerHTML` seluruh panel. Ini juga menjaga fokus dan posisi scroll tetap.

**H. Aksesibilitas khas perangkat**

- Dukung **TalkBack** (Android) dan **VoiceOver** (iOS/iPadOS): label tombol yang jelas, urutan fokus logis, `aria-live` untuk giliran dan hasil ronde.
- Dukung **Dynamic Type / ukuran font sistem**: pakai `rem`, jangan `px` pada font teks, dan jangan mengunci tinggi elemen.
- Dukung **keyboard fisik** di iPad (Magic Keyboard): Tab, Enter, Esc untuk dialog, panah untuk tab beranda.
- Dukung **Apple Pencil/mouse** di iPad: `pointer: fine` memakai aturan hover yang sama dengan desktop.
- Dukung **Mode Gelap** dan **Kurangi Gerakan** dari pengaturan sistem (sudah di bagian 4 dan 7).

### 9.4 Tahap tambahan

Sisipkan setelah tahap 7 pada rencana di bagian 8:

| Tahap | Pekerjaan | Berkas | Risiko |
|---|---|---|---|
| 7a | Meta viewport, `color-scheme`, `theme-color` ganda, manifest, ikon (9.3.A) | `index.html`, `public/` | Rendah |
| 7b | `100dvh`, safe area, dan aturan `hover: none` (9.3.B–C) | `styles.css` | Rendah |
| 7c | Atribut keyboard dan penggeseran kolom saat keyboard muncul (9.3.D) | `index.html`, `main.js` | Sedang |
| 7d | Breakpoint tablet, orientasi, container query (9.3.E) | `styles.css` | Sedang |
| 7e | `visibilitychange`, wake lock, riwayat Kembali (9.3.F) | `main.js` | **Tinggi** (menyentuh alur realtime, uji dengan dua perangkat) |
| 7f | Pengurangan beban render untuk perangkat murah (9.3.G) | `styles.css`, `main.js` | Sedang |

### 9.5 Cara menguji

| Cara | Yang diperiksa |
|---|---|
| Chrome DevTools, mode perangkat (Pixel 7, Galaxy S20 Ultra, Galaxy Z Fold 5, iPad Mini, iPad Air, iPad Pro) | Tata letak, breakpoint, orientasi |
| DevTools, throttling CPU 4× dan jaringan "Fast 3G" | Performa di perangkat murah, perilaku saat koneksi putus |
| Chrome Android lewat `chrome://inspect` dengan kabel USB | Perilaku nyata: bar alamat, keyboard, gestur Kembali |
| Safari Mac, menu Develop → perangkat iOS/iPadOS | Safe area, `100dvh`, keyboard, zoom otomatis input |
| Uji manual, 3 perangkat serentak (moderator iPad + 2 ponsel Android) | Realtime, sambung ulang, giliran |
| Uji layar terkunci / pindah aplikasi 30 detik lalu kembali | Pemulihan koneksi (9.3.F) |
| iPad Split View 1/3 dan 1/2 | Tata letak menyesuaikan lebar wadah |
| Lighthouse (kategori Mobile) | Skor aksesibilitas dan performa, ukuran target sentuh |

Kriteria lulus: tidak ada scroll horizontal di semua lebar 320–1376 px, tidak ada konten tertutup poni, bar gestur, atau keyboard, tidak ada zoom otomatis di input, dan pemain yang kembali dari latar belakang pulih dalam 5 detik.

### 9.6 Prompt siap pakai

Salin salah satu blok di bawah ke asisten pengodean dari folder proyek. Setiap prompt berdiri sendiri dan mengacu ke dokumen ini.

**Prompt 1 — Dasar Android dan iPad (tahap 7a–7b)**

```text
Baca DESIGN_SYSTEM.md bagian 9 (Optimasi Android dan iPad), lalu kerjakan tahap 7a dan 7b.

Lingkup:
- src/index.html: tambahkan viewport-fit=cover, color-scheme, dua theme-color
  (light/dark), meta apple-mobile-web-app-*, link manifest dan apple-touch-icon.
- Buat public/manifest.webmanifest dan ikon 192/512/maskable/apple-touch-icon
  (180). Ikon cukup huruf "S" putih pada latar koral #c22233 seperti .brand-mark.
- src/styles.css: ganti 100vh dengan 100dvh (pertahankan 100vh sebagai cadangan),
  tambahkan padding safe-area pada .app-shell, .site-footer, .toast-region.
- Pindahkan semua aturan :hover ke @media (hover: hover) and (pointer: fine); beri
  status :active untuk layar sentuh; tambahkan touch-action: manipulation.

Batasan:
- JANGAN menambahkan user-scalable=no atau maximum-scale.
- JANGAN mengubah game-engine.js, room-service.js, atau firebase.js.
- Jangan ubah tampilan di desktop.

Selesai bila: npm test (19 tes) dan npm run build lulus, dan jelaskan cara saya
memverifikasi di DevTools (Pixel 7, iPad Air) dan di perangkat asli.
Berikan ringkasan berkas yang berubah. Jangan commit sebelum saya setuju.
```

**Prompt 2 — Keyboard virtual dan form (tahap 7c)**

```text
Baca DESIGN_SYSTEM.md bagian 5.5 dan 9.3.D, lalu kerjakan tahap 7c.

Lingkup (src/index.html dan src/main.js):
- Kolom tawaran: inputmode="numeric", pattern="[0-9]*", enterkeyhint="send".
- Kolom kode room: autocapitalize="characters", autocorrect="off",
  spellcheck="false", enterkeyhint="go", dan ubah ke huruf besar saat mengetik.
- Kolom nama: autocomplete="nickname".
- Saat kolom tawaran fokus di ponsel, gunakan window.visualViewport agar kolom dan
  tombol kirim tetap terlihat di atas keyboard (scrollIntoView block:center setelah
  event resize visualViewport). Bersihkan listener saat panel diganti.
- Pastikan font input minimal 16px agar iOS Safari tidak memperbesar halaman.
- Label tetap terlihat, pesan error muncul di bawah kolom dengan role="alert".

Batasan: jangan ubah aturan bidding atau format data yang dikirim ke room-service.
Tampilkan diff ringkas, jalankan npm test dan npm run build, lalu beri daftar
langkah uji manual di Android Chrome dan Safari iPad.
```

**Prompt 3 — Tata letak tablet dan Split View (tahap 7d)**

```text
Baca DESIGN_SYSTEM.md bagian 9.3.E, lalu kerjakan tahap 7d di src/styles.css.

Tugas:
- Tambahkan breakpoint 640–1023 px (potret) dan aturan orientasi lanskap >= 768 px
  sesuai tabel di dokumen.
- Strip pasar harus menampilkan 5 sektor tanpa scroll horizontal di >= 640 px.
- Batasi lebar panel fase 720 px di tablet potret, teks panjang max-width 60ch.
- Gunakan container query (container-type: inline-size) untuk .phase-panel,
  .dashboard-panel, dan .game-sidebar agar tata letak mengikuti lebar wadah di
  iPad Split View (lebar 320-507 px).
- Tabel portofolio tidak scroll horizontal di iPad.

Uji lebar: 360, 412, 744, 820, 834, 1024, 1180, 1376 px, dan 320-507 px untuk
Split View. Tidak boleh ada scroll horizontal pada semuanya.
Tangkap layar tiap lebar pakai Playwright atau DevTools bila tersedia, dan
sertakan hasilnya. Jangan ubah tampilan di lebar < 640 px kecuali ada bug.
```

**Prompt 4 — Siklus hidup dan sambung ulang (tahap 7e)**

```text
Baca DESIGN_SYSTEM.md bagian 9.3.F, README.md (catatan MVP), dan NEXT_CHAT.md.
Kerjakan tahap 7e. Ini menyentuh alur realtime, jadi bekerja hati-hati.

Tugas di src/main.js (dan src/room-service.js hanya bila benar-benar perlu):
1. visibilitychange dan pageshow: saat kembali visible, periksa koneksi, ambil ulang
   state room, tampilkan banner "Menyambungkan ulang..." sampai selesai atau gagal.
2. Screen Wake Lock aktif selama fase permainan, dilepas di lobby dan saat selesai.
   Tangani penolakan dan ketidakdukungan tanpa error. Minta ulang setelah
   visibilitychange karena lock dilepas otomatis.
3. beforeunload hanya untuk moderator.
4. history.pushState per layar (beranda, lobby, game) agar tombol Kembali Android
   dan gestur iOS tidak langsung keluar; saat game berlangsung minta konfirmasi.

Sebelum mengubah apa pun: jelaskan rencana dalam 5-8 poin dan risiko terhadap
sinkronisasi state. Jangan ubah aturan permainan. Tambahkan tes untuk logika murni
yang bisa diuji, dan beri skenario uji manual 3 perangkat (moderator + 2 pemain),
termasuk menutup layar 30 detik lalu membuka lagi.
```

**Prompt 5 — Performa perangkat murah (tahap 7f)**

```text
Baca DESIGN_SYSTEM.md bagian 9.3.G, lalu kerjakan tahap 7f.

Tugas:
- Di @media (max-width: 640px), ganti dua radial-gradient pada body dan bayangan
  besar (.join-card, .phase-panel, dll.) dengan latar solid dan bayangan ringan.
- Pastikan animasi hanya memakai transform dan opacity.
- Audit src/main.js: cari tempat yang mengganti innerHTML seluruh panel pada tiap
  pembaruan realtime (strip pasar, panel pemain, dashboard portofolio). Ubah yang
  paling sering dipanggil menjadi pembaruan bertarget (textContent / toggle kelas)
  tanpa mengubah perilaku, agar fokus input dan posisi scroll tidak hilang.
- Self-host font DM Sans (400/600/700) dan IBM Plex Mono (400/600/700) di
  public/fonts dengan @font-face + font-display: swap, lalu hapus link Google Fonts.
  Periksa lisensi (keduanya SIL OFL) dan sertakan berkas lisensinya.

Ukur sebelum dan sesudah: ukuran bundle dari npm run build, dan jelaskan cara
membandingkan di DevTools Performance dengan CPU throttling 4x. Jalankan npm test.
```

**Prompt 6 — Audit menyeluruh di perangkat (tanpa mengubah kode)**

```text
Baca DESIGN_SYSTEM.md bagian 9. Lakukan audit READ-ONLY (jangan ubah berkas)
terhadap src/index.html, src/styles.css, dan src/main.js untuk kesiapan di Android
(Chrome) dan iPad (Safari, termasuk Split View).

Keluaran: tabel temuan dengan kolom: no, berkas:baris, masalah, perangkat
terdampak, dampak ke pemain, usulan perbaikan, prioritas (tinggi/sedang/rendah).
Periksa khususnya: 100vh, safe area, hover pada layar sentuh, ukuran target
sentuh < 44px, font < 16px pada input, scroll horizontal pada lebar 320-1376 px,
keyboard virtual yang menutup kolom, penanganan tab di latar belakang, dan
render ulang berlebihan. Tandai mana yang sudah benar. Jangan membuat asumsi
tentang berkas yang tidak dibaca.
```

---

## 10. Referensi

### Sistem desain dan token
| Sumber | Dipakai untuk | Tautan |
|---|---|---|
| Radix Colors | Skala warna 12 langkah, pasangan light/dark yang teruji kontras | https://www.radix-ui.com/colors |
| Open Props | Contoh penamaan token CSS (spasi, radius, bayangan, easing), tanpa framework | https://open-props.style |
| Web Awesome (Shoelace) | Dialog, tabs, toast sebagai web component untuk vanilla JS | https://webawesome.com |
| Pico.css | Contoh gaya minimal berbasis HTML semantik | https://picocss.com |
| Material Design 3 | Pola token warna (surface, on-surface), ukuran target, elevasi | https://m3.material.io |
| Apple HIG | Target sentuh 44 pt, safe area, tipografi dinamis | https://developer.apple.com/design/human-interface-guidelines |

### Aksesibilitas
| Topik | Tautan |
|---|---|
| WCAG 2.2 (spesifikasi) | https://www.w3.org/TR/WCAG22/ |
| Kontras minimum (1.4.3) | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html |
| Kontras komponen non-teks (1.4.11) | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html |
| Penggunaan warna (1.4.1) | https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html |
| Ukuran target (2.5.8) | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| Pemeriksa kontras | https://webaim.org/resources/contrastchecker/ |

### CSS dan web
| Topik | Tautan |
|---|---|
| `font-variant-numeric: tabular-nums` | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric |
| `prefers-color-scheme` | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme |
| `prefers-reduced-motion` | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion |
| `env(safe-area-inset-*)` | https://developer.mozilla.org/en-US/docs/Web/CSS/env |
| `scroll-snap` | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap |
| Elemen `<dialog>` | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog |
| Satuan viewport dinamis (`dvh`) | https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths |
| `VisualViewport` (keyboard virtual) | https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport |
| Screen Wake Lock API | https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API |
| Page Visibility API | https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API |
| Container queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries |
| Web App Manifest | https://developer.mozilla.org/en-US/docs/Web/Manifest |
| `touch-action` | https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action |
| Web di iOS/iPadOS (Safari) | https://webkit.org/blog/ |
| Android: desain responsif dan layar lipat | https://developer.android.com/guide/topics/large-screens |
| `inputmode` | https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode |

### Inspirasi pola UX (untuk dilihat, bukan disalin)
| Produk | Yang bisa dipelajari |
|---|---|
| Kahoot, Jackbox Games | Alur gabung dengan kode room dari ponsel, lobby yang menampilkan pemain bergabung, satu keputusan per layar |
| Stockbit, Bibit, Ajaib (aplikasi saham Indonesia) | Kebiasaan pengguna lokal: hijau naik, merah turun, format angka Indonesia, kepadatan data di layar kecil |
| Robinhood, Google Finance | Penyajian perubahan harga (tanda, warna, ukuran), kartu ringkas, dark mode |
| Monopoly GO, Catan Universe | Ringkasan aset semua pemain, penanda giliran, riwayat aksi |

Tautan produk komersial sengaja tidak dicantumkan karena tampilannya berubah. Cari nama produknya untuk tangkapan layar terbaru.

---

## 11. Catatan penerapan

- **Format angka:** pakai `Intl.NumberFormat('id-ID')` untuk pemisah ribuan agar konsisten dengan kebiasaan pemain.
- **Tema:** simpan pilihan tema di `localStorage` dengan `try/catch` (bisa gagal di mode privat). Default mengikuti sistem.
- **Pengujian visual:** sebelum dan sesudah tiap tahap, ambil tangkapan layar 4 ukuran layar × 2 tema untuk perbandingan.
- **Pembaruan dokumen:** kalau nilai token berubah, perbarui tabel di bagian 4 agar dokumen ini tetap menjadi sumber acuan.

---

## 12. Hasil penerapan

### 12.1 Perbedaan dari usulan awal
- Token tambahan di `src/tokens.css` di luar tabel 4.1: `--surface-glass*`, `--line-soft`, `--line-strong`, `--brand-ink`, `--brand-line*`, `--up-ink/line/dot`, `--danger-ink`, `--glow-warm/cool`, `--shadow-card-lite`, `--shadow-toast`, `--shadow-tab`. Nilai gelapnya ada di tokens.css.
- `--radius-pill` bernilai `99px` (bukan `999px`); hasil visual sama.
- `--subtle` dan `--placeholder` dihapus; keduanya memakai `--faint` (#7d6b65).
- Warna selain `--brand`, `--faint`, `--muted`, `--up`, `--down`, `--flat`, `--danger` mengikuti tabel 4.1 tanpa perubahan.
- Folder `public/` berada di `src/public/` karena root Vite adalah `src/`.
- Font DM Sans (variabel 400–700) dan IBM Plex Mono (400/500/600/700) di-host sendiri, subset Latin; lisensi SIL OFL ada di `src/public/fonts/`.
- Tahap 9 dilewati.

### 12.2 Status temuan A1–A13

| # | Status | Keterangan |
|---|---|---|
| A1 | Sebagian | Token `--brand` dan `--down` terpisah, error memakai `--danger`. Namun #c22233 dan #c4302b hampir sama (jarak RGB 16/441); pembeda utama kini tanda ▲/▼. Evaluasi di perangkat. |
| A2 | Selesai | `--faint` #7d6b65: 4,58–5,04:1 |
| A3 | Selesai | Placeholder dan `.feature-row` memakai `--faint` (≥4,78:1) |
| A4 | Selesai | Tombol dan teks merek 5,88:1 |
| A5 | Selesai | `--up` #1e7a52: 5,30:1 |
| A6 | Selesai | Tidak ada teks di bawah 12 px (dipindai di Chromium, 360/744/1280 px) |
| A7 | Selesai | ▲/▼/– beserta `aria-label`. Arah dihitung di perangkat dari harga terakhir yang dilihat; setelah muat ulang tampil "– 0" sampai harga berubah. |
| A8 | Selesai | Kelas `.num` (`tabular-nums`) pada harga, tabel, tawaran, skor |
| A9 | Selesai | `prefers-color-scheme` + `data-theme` + tombol ganti tema (disimpan di localStorage) |
| A10 | Selesai | 0 hex hardcode tersisa di styles.css dan main.js |
| A11 | Tidak berlaku | Prototipe root tidak diubah (batasan) |
| A12 | Selesai | Toast di bawah, lebar penuh di ponsel, safe-area. Belum diverifikasi di perangkat. |
| A13 | Selesai | Strip pasar 2+3 kolom di ponsel, 5 kolom di ≥640 px |

Item UX lanjutan (sudah dikerjakan setelah tahap 8): dashboard `<details>` terlipat di ponsel (pilihan pemain bertahan antar pembaruan), konfirmasi sebelum "Lewati giliran pemain offline" dengan label "Khusus moderator", toast per jenis (info/sukses/peringatan/error; error 8 detik dan bisa ditutup, lainnya 4 detik), tombol "Tersalin ✓" 2 detik, skeleton saat saldo privat dimuat, tombol "Coba lagi" (muat ulang halaman) di layar error, panah/Home/End antar tab beranda dengan `aria-controls`, teks "Minimal 3 pemain (sekarang N)", dan keadaan kosong lobby "Menunggu pemain. Bagikan kode …". Tombol "Salin tautan" tidak lagi terbungkus dua baris. Belum diverifikasi di perangkat; hanya diuji di Chromium (tab/toast) dan lewat tangkapan layar tiruan.

### 12.3 Checklist uji perangkat (belum diverifikasi di perangkat)
Kriteria lulus (9.5): tidak ada scroll horizontal di 320–1376 px, tidak ada konten tertutup poni/bar gestur/keyboard, tidak ada zoom otomatis di input, pemain pulih dalam 5 detik setelah kembali dari latar belakang.

| Perangkat | Langkah | Hasil yang diharapkan |
|---|---|---|
| Android Chrome | Ketuk kolom tawaran | Keyboard angka; kolom dan tombol "Kunci tawaran" tetap terlihat; halaman tidak membesar |
| Android Chrome | Putar ke lanskap | Topbar dan padding lebih ringkas; panel fase terlihat |
| Android Chrome | Tombol Kembali di lobby dan game | Muncul konfirmasi; tidak langsung keluar aplikasi |
| Android Chrome | Kunci layar 30 detik, buka lagi | Banner "Menyambungkan ulang…" lalu hilang; state sama; pulih ≤5 detik |
| Safari iPad | Ketuk kolom tawaran dan kode room | Tidak ada zoom otomatis; keyboard tidak menutup tombol kirim |
| Safari iPad | Potret (820/834) dan lanskap (1180) | Potret satu kolom maks 720 px; lanskap dua kolom; tanpa scroll horizontal |
| Safari iPad | Split View 1/3 dan 1/2 | Tata letak mengikuti lebar jendela; tabel tetap terbaca |
| Safari iPad | Pasang ke Layar Utama | Ikon "S" koral, nama StockLab, tanpa bar alamat |
| Semua | Fase aktif 2 menit tanpa menyentuh layar | Layar tidak mati (Wake Lock); di lobby layar boleh mati |
| Semua | Ganti tema, muat ulang | Pilihan tersimpan; tanpa pilihan, mengikuti sistem |
| 3 perangkat (iPad moderator + 2 Android) | Main 1 ronde penuh | Tawaran, aksi, jual, ekonomi sinkron; ▲/▼ sesuai; moderator menutup tab → peringatan muncul |
