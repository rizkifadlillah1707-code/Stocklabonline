import test from 'node:test';
import assert from 'node:assert/strict';
import { describePrice, parseEconomyEvents } from '../src/market-view.js';

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
