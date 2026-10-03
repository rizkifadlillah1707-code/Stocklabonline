// Logika murni siklus hidup UI (tahap 7e): dipisah dari main.js agar bisa diuji tanpa browser.
const ACTIVE_PHASES = ['bidding', 'action', 'sell', 'economy', 'between'];

// Layar tetap menyala selama fase permainan berjalan; dilepas di lobby, saat selesai, dan di layar lain.
export function shouldHoldWakeLock({ screen, phase }) {
  return screen === 'game' && ACTIVE_PHASES.includes(phase);
}

// Peringatan sebelum menutup tab hanya untuk moderator, karena ia otoritas state permainan.
export function shouldWarnOnUnload({ isHost, screen, phase }) {
  if (!isHost) return false;
  return screen === 'lobby' || (screen === 'game' && phase !== 'complete');
}

export function bannerText({ connected, hasConnected }) {
  return hasConnected && !connected
    ? 'Koneksi terputus. Menyambungkan ulang… Aksi Anda belum terkirim ke room.'
    : '';
}

// Aksi tombol Kembali (Android) atau gestur geser (iOS): 'none' | 'confirm-lobby' | 'confirm-game' | 'leave-game'.
export function backAction({ screen, phase }) {
  if (screen === 'lobby') return 'confirm-lobby';
  if (screen === 'game') return phase === 'complete' ? 'leave-game' : 'confirm-game';
  return 'none';
}

export function backMessage(action, isHost) {
  if (action === 'confirm-lobby') {
    return isHost
      ? 'Keluar akan menutup room untuk semua pemain. Lanjutkan?'
      : 'Keluar dari room ini?';
  }
  if (action === 'confirm-game') {
    return isHost
      ? 'Permainan sedang berlangsung. Jika Anda pergi, moderator tidak lagi memproses aksi pemain sampai Anda masuk kembali lewat tautan room. Tinggalkan layar permainan?'
      : 'Permainan sedang berlangsung. Anda dapat masuk kembali lewat tautan room. Tinggalkan layar permainan?';
  }
  return '';
}

// Langkah riwayat peramban agar Kembali tidak langsung keluar dari aplikasi:
// beranda adalah dasar tumpukan; lobby dan game berada satu entri di atasnya.
export function historyStep({ target, current }) {
  const base = target === 'lobby' || target === 'game' ? 'room' : 'home';
  if (base === 'home') return current === 'room' ? 'back' : 'none';
  if (current === 'room') return 'replace';
  return 'push';
}
