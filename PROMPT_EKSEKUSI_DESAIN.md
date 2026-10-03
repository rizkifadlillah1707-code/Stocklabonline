# Prompt Eksekusi — Redesign UI/UX StockLab Online

Cara pakai: buka sesi baru asisten pengodean di folder proyek, lalu tempel **seluruh isi blok di bawah** atau cukup ketik:

> Baca PROMPT_EKSEKUSI_DESAIN.md lalu jalankan isinya.

---

```text
PERAN
Kamu adalah front-end engineer yang menerapkan redesign UI/UX pada StockLab Online
(simulasi pasar modal multipemain, vanilla JS + Vite + Firebase Realtime Database).
Pemain utama memakai ponsel Android dan iPad. Bahasa antarmuka: Indonesia.

SUMBER KEBENARAN
- DESIGN_SYSTEM.md di root proyek adalah acuan utama. Baca SELURUHNYA sebelum mulai:
  bagian 2 (audit), 4 (token), 5 (komponen), 6 (pola UX), 7 (aksesibilitas),
  8 (rencana tahap 1-10), 9 (Android dan iPad, tahap 7a-7f).
- Baca juga README.md, NEXT_CHAT.md, src/index.html, src/styles.css, src/main.js.
- Jika instruksi di prompt ini bertentangan dengan DESIGN_SYSTEM.md, ikuti
  DESIGN_SYSTEM.md dan beri tahu aku soal pertentangannya.
- Jangan membuat asumsi tentang berkas yang belum kamu baca.

TUJUAN
Menerapkan rencana tahap di DESIGN_SYSTEM.md secara bertahap: token desain, perbaikan
kontras dan tipografi, penanda status non-warna, tata letak ponsel/tablet, dark mode,
perbaikan form, dan optimasi Android/iPad. Identitas visual dipertahankan (koral,
DM Sans, IBM Plex Mono, kartu putih berborder halus).

BATASAN KERAS
1. JANGAN mengubah logika permainan: src/game-engine.js, src/room-service.js,
   src/firebase.js, firebase.database.rules.json. Perubahan di src/main.js hanya
   untuk tampilan, atribut, dan siklus hidup UI (tahap 7e). Jika menurutmu ada yang
   perlu diubah di berkas terlarang, BERHENTI dan tanyakan dulu.
2. JANGAN membaca, mencetak, atau meminta isi .env. Jangan menyentuh kredensial.
3. JANGAN git push, deploy, atau mengubah konfigurasi Cloudflare/Firebase.
   Commit lokal diizinkan sesuai aturan di bawah.
4. JANGAN menambah dependensi (npm) tanpa izin. Rencana ini tidak membutuhkannya
   (tahap 9 opsional, lewati kecuali aku minta).
5. JANGAN menambahkan user-scalable=no atau maximum-scale di viewport.
6. JANGAN menurunkan font input di bawah 16px (iOS akan memperbesar halaman).
7. JANGAN menghapus perilaku aksesibilitas yang sudah ada (aria-live, role, fokus
   terlihat, prefers-reduced-motion).
8. Tampilan desktop tidak boleh rusak. Ubah hanya yang disebut di dokumen.
9. Gaya kode mengikuti berkas sekitar: CSS satu baris per aturan seperti
   styles.css sekarang, komentar seperlunya dalam bahasa Indonesia, nama kelas
   bahasa Inggris seperti yang sudah ada.
10. index.html di root adalah prototipe lama: jangan diubah.

ALUR KERJA
A. Persiapan (sekali di awal)
   1. Jalankan git status dan pastikan bersih. Buat cabang baru dari main bernama
      desain-ui-ux. Jangan bekerja langsung di main.
   2. Jalankan npm test dan npm run build, catat hasil awal (harus 19/19 lulus).
      Jika sudah gagal sebelum perubahan, laporkan dan berhenti.
   3. Ringkas rencanamu dalam maksimal 10 poin: urutan tahap, berkas yang tersentuh,
      dan risiko terbesar. Tunggu persetujuanku sebelum mengubah berkas.

B. Untuk SETIAP tahap (urutan di bagian "URUTAN TAHAP")
   1. Tulis dulu 3-6 poin rencana tahap itu.
   2. Kerjakan HANYA tahap itu. Jangan menggabungkan tahap.
   3. Verifikasi: npm test dan npm run build harus lulus. Untuk perubahan tampilan,
      jalankan aplikasi (npm run dev) dan periksa. Jika bisa memakai browser
      headless (Playwright atau sejenisnya), ambil tangkapan layar pada lebar 360,
      744, 1024 dan 1280 px. Jika tidak bisa, katakan terus terang dan beri daftar
      langkah uji manual. Jangan mengklaim "sudah diuji" untuk hal yang tidak
      benar-benar dijalankan.
   4. Untuk tahap yang mengubah warna/teks, hitung ulang kontras pasangan yang
      diubah (rumus WCAG 2.2) dan tampilkan angkanya. Target: teks >= 4,5:1,
      teks besar dan komponen UI >= 3:1.
   5. Laporkan: berkas berubah, apa yang berubah, hasil tes/build, hasil kontras,
      hal yang belum bisa diverifikasi, dan temuan baru di luar rencana.
   6. BERHENTI dan tunggu "lanjut" dariku. Setelah aku setuju, buat satu commit
      lokal untuk tahap itu.
   Format commit: bahasa Indonesia, ringkas, diawali nomor tahap, misalnya
   "Tahap 3: pisahkan token merek dan warna pasar, perbaiki kontras".
   Tulis pesan commit tanpa baris atribusi tambahan.

C. Aturan umum selama bekerja
   - Satu perubahan, satu tujuan. Jangan merapikan hal di luar tahap.
   - Jika menemukan bug di luar lingkup (termasuk di game-engine), catat di bagian
     "Temuan" laporan, jangan diperbaiki diam-diam.
   - Jika spesifikasi di dokumen tidak jelas atau bertentangan dengan kode, tanyakan
     dengan menawarkan maksimal 2-3 pilihan dan satu rekomendasi.
   - Jika sebuah tahap melebihi sekitar 300 baris perubahan, pecah menjadi dua dan
     minta persetujuan di tengah.

URUTAN TAHAP
Ikuti tabel di DESIGN_SYSTEM.md bagian 8 dan 9.4:

 1. Buat src/tokens.css (terang saja), pindahkan nilai warna/radius/spasi ke variabel.
    Impor sebelum styles.css. Tampilan TIDAK boleh berubah.
    Cek: tangkapan layar sebelum/sesudah harus identik.
 2. Ganti semua hex hardcode di styles.css dengan token. Satukan tujuh variasi merah
    muda menjadi --surface-sunken dan --brand-soft. Perubahan visual harus minimal.
 3. Pisahkan --brand, --up, --down, --flat, --danger. Terapkan nilai baru
    (--brand #c22233, --faint dan --muted yang dinaikkan). Perbaiki kontras temuan
    A1-A5 di DESIGN_SYSTEM.md. Laporkan tabel kontras sebelum/sesudah.
 4. Skala tipografi: tidak ada font di bawah 12px (0.75rem). Tambahkan kelas .num
    (font-variant-numeric: tabular-nums) pada harga, saldo, jumlah saham, skor, dan
    sel angka tabel (temuan A6, A8). Ubah main.js hanya untuk menambah kelas.
 5. Penanda non-warna: tanda ▲/▼/– pada harga di strip pasar, ikon centang dan
    aria-pressed pada kartu aksi terpilih, teks "Giliran", teks status koneksi
    "Terhubung/Menghubungkan.../Terputus" (temuan A7). Format angka lewat
    Intl.NumberFormat('id-ID') jika belum.
 6. Tata letak ponsel: strip pasar tanpa potongan menggantung (2+3 kolom atau
    scroll-snap), urutan di ponsel sesuai bagian 6 (sidebar tidak lagi memakan satu
    layar penuh sebelum aksi), kolom nama tabel sticky, toast aman di bawah
    (temuan A12, A13).
 7. Dark mode: token gelap lewat prefers-color-scheme plus atribut data-theme
    opsional dan tombol ganti tema di topbar. Simpan pilihan di localStorage dengan
    try/catch, default mengikuti sistem. Periksa semua layar di kedua tema.
 7a. Meta viewport (viewport-fit=cover), color-scheme, dua theme-color, meta apple/
     mobile web app, manifest + ikon di public/ (huruf "S" putih pada koral #c22233).
 7b. 100dvh dengan cadangan 100vh, padding safe-area, aturan @media (hover: hover)
     and (pointer: fine) untuk hover, status :active, touch-action: manipulation.
 7c. Atribut keyboard (inputmode, pattern, enterkeyhint, autocapitalize,
     autocomplete), penggeseran kolom tawaran saat keyboard muncul lewat
     window.visualViewport, label tetap terlihat, pesan error role="alert".
 7d. Breakpoint tablet (640-1023 px potret, lanskap >= 768 px), container query
     untuk Split View, lebar baca maksimal. Tanpa scroll horizontal di 320-1376 px.
 7e. visibilitychange/pageshow dengan banner "Menyambungkan ulang...", Wake Lock pada
     fase aktif, beforeunload hanya moderator, history.pushState per layar.
     RISIKO TINGGI: sebelum menulis kode, jelaskan rencana 5-8 poin dan dampaknya
     ke sinkronisasi state, lalu tunggu persetujuan. Tambahkan tes untuk logika
     murni yang bisa diuji tanpa browser.
 7f. Performa perangkat murah: sederhanakan gradient/bayangan di <= 640px, animasi
     hanya transform/opacity, pembaruan DOM bertarget (bukan innerHTML seluruh
     panel) untuk bagian yang sering diperbarui, self-host font di public/fonts
     (lisensi SIL OFL disertakan). Ukur ukuran bundle sebelum/sesudah.
 8. Form: pastikan semua perilaku bagian 5.5 (batas saldo/tawaran terlihat, status
    "Memproses..." dan cegah klik ganda). Jika sudah dikerjakan di 7c, laporkan
    bagian mana yang tersisa.
 9. OPSIONAL, lewati kecuali aku minta: Web Awesome atau <dialog> untuk dialog/toast.
10. Uji akhir: lihat bagian "PENUTUP".

JIKA TIDAK BISA DIVERIFIKASI
Beberapa hal tidak bisa kamu uji dari terminal (keyboard virtual, safe area di
perangkat nyata, Wake Lock, Split View iPad, pemulihan koneksi). Untuk itu:
- Jangan menyatakannya berhasil. Tulis "belum diverifikasi di perangkat".
- Berikan langkah uji manual yang singkat dan spesifik (perangkat, langkah, hasil
  yang diharapkan).

PENUTUP (setelah semua tahap disetujui)
1. Jalankan npm test dan npm run build, laporkan hasil akhir.
2. Berikan tabel temuan A1-A13 di DESIGN_SYSTEM.md dengan status: selesai /
   sebagian / belum / tidak berlaku, plus alasan.
3. Berikan checklist uji perangkat akhir (Android Chrome, Safari iPad, Split View,
   3 perangkat serentak) dan kriteria lulus dari DESIGN_SYSTEM.md bagian 9.5.
4. Perbarui DESIGN_SYSTEM.md bila ada nilai token yang berubah dari usulan awal, dan
   perbarui NEXT_CHAT.md dengan status terbaru (cabang, commit, apa yang belum
   dideploy). Jangan push atau deploy. Tanyakan padaku langkah berikutnya.

FORMAT LAPORAN TIAP TAHAP (pendek)
- Tahap: <nomor dan nama>
- Berubah: <berkas, 1 baris per berkas>
- Verifikasi: npm test <n/n>, build <ok/gagal>, tangkapan layar <ada/tidak>
- Kontras: <tabel pasangan, bila relevan>
- Belum diverifikasi: <daftar>
- Temuan di luar lingkup: <daftar atau "tidak ada">
- Menunggu: persetujuan untuk commit dan lanjut ke tahap berikutnya

MULAI SEKARANG dari langkah A (Persiapan). Jangan mengubah berkas sebelum aku
menyetujui rencanamu.
```

---

## Catatan untuk pemilik proyek

- **Berhenti per tahap** disengaja: tahap 3, 5, 7, dan 7e mengubah perilaku yang terlihat pemain, jadi layak dicek dulu.
- Jika ingin lebih cepat, ganti baris "BERHENTI dan tunggu 'lanjut'" menjadi persetujuan per kelompok: {1–2}, {3–5}, {6–7}, {7a–7d}, {7e}, {7f–8}.
- Jika ingin menjalankan sebagian saja, tambahkan di awal prompt: `Kerjakan hanya tahap 1 sampai 3.`
- Prompt per-topik (Android/iPad) yang berdiri sendiri ada di DESIGN_SYSTEM.md bagian 9.6.
- Cabang `desain-ui-ux` dipakai agar `main` tetap utuh. Production Cloudflare tidak terpengaruh sampai Anda sendiri melakukan push dan deploy.
