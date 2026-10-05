import test from 'node:test';
import assert from 'node:assert/strict';
import { createPriceTracker, describePrice, parseEconomyEvents, updatePriceTracker } from '../src/market-view.js';

test('a price move shows the latest price with the signed difference', () => {
  const up = describePrice({ price: 9, from: 5 });
  assert.deepEqual([up.trend, up.mark, up.short], ['up', '▲', '+4']);
  assert.equal(up.summary, '5 → 9 · ▲ +4');
  const down = describePrice({ price: 3, from: 6 });
  assert.deepEqual([down.trend, down.mark, down.short], ['down', '▼', '−3']);
  assert.equal(down.summary, '6 → 3 · ▼ −3');
});

test('an unchanged or never-seen price is flat', () => {
  assert.equal(describePrice({ price: 5, from: 5 }).trend, 'flat');
  assert.equal(describePrice({ price: 5 }).summary, '5 · – tidak berubah');
});

test('split and pailit are labelled instead of a misleading arrow', () => {
  const split = describePrice({ price: 5, from: 9, event: 'split' });
  assert.deepEqual([split.trend, split.mark, split.short], ['up', '✦', 'Split']);
  assert.match(split.summary, /^9 → 5 · ✦ Split: saham ×2, harga reset ke 5$/);
  const pailit = describePrice({ price: 5, from: 1, event: 'pailit' });
  assert.deepEqual([pailit.trend, pailit.mark, pailit.short], ['down', '✖', 'Pailit']);
  assert.match(pailit.summary, /saham kembali ke Bank/);
  assert.match(describePrice({ price: 5, event: 'split' }).summary, /^5 · ✦ Split/);
});

test('economy log lines are mapped to split and pailit per sector', () => {
  const events = parseEconomyEvents([
    'Tambang: Naik (+1).',
    'Konsumer: Stock Split — saham berlipat ganda; harga reset ke 5.',
    'Keuangan: Stock Crash — seluruh saham kembali ke Bank; harga reset ke 5.'
  ]);
  assert.deepEqual(events, { Konsumer: 'split', Keuangan: 'pailit' });
  assert.deepEqual(parseEconomyEvents(), {});
});

test('price tracker keeps only the latest economy: unchanged sectors turn flat, old labels do not carry over', () => {
  const tracker = createPriceTracker();
  const at = (prices, extra) => Object.entries(prices).map(([name, price]) => ({ id: name.toLowerCase(), name, price }));
  updatePriceTracker(tracker, at({ Tambang: 3, Konsumer: 4 }), { phase: 'sell', round: 5, economyLog: [] });
  updatePriceTracker(tracker, at({ Tambang: 5, Konsumer: 5 }), { phase: 'between', round: 5, economyLog: ['Tambang: Stock Crash — seluruh saham kembali ke Bank; harga reset ke 5.'] });
  assert.equal(tracker.event.tambang, 'pailit');
  assert.equal(tracker.from.konsumer, 4);
  // ronde 6: Tambang dan Konsumer tidak bergerak di ekonomi ini
  updatePriceTracker(tracker, at({ Tambang: 5, Konsumer: 5 }), { phase: 'sell', round: 6, economyLog: [] });
  assert.equal(tracker.event.tambang, 'pailit', 'label bertahan sampai ekonomi berikutnya');
  updatePriceTracker(tracker, at({ Tambang: 5, Konsumer: 5 }), { phase: 'complete', round: 6, economyLog: [] });
  assert.equal(tracker.event.tambang, null);
  assert.equal(describePrice({ price: 5, from: tracker.from.tambang, event: tracker.event.tambang }).trend, 'flat');
  assert.equal(describePrice({ price: 5, from: tracker.from.konsumer, event: tracker.event.konsumer }).summary, '5 · – tidak berubah');
});

test('after a reload a settled economy still shows split and pailit from the log', () => {
  const tracker = createPriceTracker();
  updatePriceTracker(tracker, [{ id: 'konsumer', name: 'Konsumer', price: 5 }], { phase: 'between', round: 3, economyLog: ['Konsumer: Stock Split — saham berlipat ganda; harga reset ke 5.'] });
  assert.equal(tracker.event.konsumer, 'split');
});
