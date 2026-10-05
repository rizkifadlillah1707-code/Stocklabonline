// Tampilan perubahan harga (logika murni, bisa diuji tanpa browser).
const numberFormat = new Intl.NumberFormat('id-ID');
const format = (value) => numberFormat.format(value);

// Peristiwa di luar tangga harga, dibaca dari log ekonomi engine:
// melewati puncak = Split (saham berlipat ganda), melewati dasar = Pailit/Crash (saham kembali ke Bank); keduanya mereset harga ke 5.
export function parseEconomyEvents(log = []) {
  const events = {};
  for (const line of log) {
    const match = String(line).match(/^(.+?): Stock (Split|Crash)/);
    if (match) events[match[1]] = match[2] === 'Split' ? 'split' : 'pailit';
  }
  return events;
}

// from: harga sebelum perubahan terakhir (undefined bila belum pernah terlihat berubah).
export function describePrice({ price, from, event }) {
  if (event === 'split') {
    return { trend: 'up', mark: '✦', short: 'Split', aria: 'Split: saham berlipat ganda, harga kembali ke 5', summary: `${from == null ? '' : `${format(from)} → `}${format(price)} · ✦ Split: saham ×2, harga reset ke 5` };
  }
  if (event === 'pailit') {
    return { trend: 'down', mark: '✖', short: 'Pailit', aria: 'Pailit: saham kembali ke Bank, harga kembali ke 5', summary: `${from == null ? '' : `${format(from)} → `}${format(price)} · ✖ Pailit: saham kembali ke Bank, harga reset ke 5` };
  }
  const delta = from == null ? 0 : price - from;
  const trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const mark = delta > 0 ? '▲' : delta < 0 ? '▼' : '–';
  const amount = delta > 0 ? `+${format(delta)}` : delta < 0 ? `−${format(-delta)}` : '0';
  const aria = delta > 0 ? `naik ${format(delta)}` : delta < 0 ? `turun ${format(-delta)}` : 'tidak berubah';
  const summary = delta === 0 ? `${format(price)} · – tidak berubah` : `${format(from)} → ${format(price)} · ${mark} ${amount}`;
  return { trend, mark, short: amount, aria, summary };
}

// Pelacak harga per perangkat. Engine tidak menyimpan riwayat harga, jadi "dari" dihitung dari harga terakhir yang dilihat.
// Pada setiap hasil ekonomi baru, sektor yang tidak bergerak di ekonomi itu dianggap datar (label ronde lama tidak terbawa).
export function createPriceTracker() {
  return { last: {}, from: {}, event: {}, seen: '' };
}

export function updatePriceTracker(tracker, items, { phase, round, economyLog }) {
  const settled = phase === 'between' || phase === 'complete';
  const newEconomy = settled && tracker.seen !== String(round);
  const events = newEconomy ? parseEconomyEvents(economyLog) : {};
  for (const item of items) {
    const changed = item.id in tracker.last && tracker.last[item.id] !== item.price;
    if (changed) {
      tracker.from[item.id] = tracker.last[item.id];
      tracker.event[item.id] = null;
    } else if (newEconomy) {
      tracker.from[item.id] = item.price;
      tracker.event[item.id] = null;
    }
    if (events[item.name]) tracker.event[item.id] = events[item.name];
    tracker.last[item.id] = item.price;
  }
  if (newEconomy) tracker.seen = String(round);
  return tracker;
}
