import test from 'node:test';
import assert from 'node:assert/strict';
import { backAction, backMessage, bannerText, historyStep, shouldHoldWakeLock, shouldWarnOnUnload } from '../src/lifecycle.js';

test('wake lock is held only while a game phase is active', () => {
  for (const phase of ['bidding', 'action', 'sell', 'economy', 'between']) assert.equal(shouldHoldWakeLock({ screen: 'game', phase }), true);
  assert.equal(shouldHoldWakeLock({ screen: 'game', phase: 'complete' }), false);
  assert.equal(shouldHoldWakeLock({ screen: 'lobby', phase: 'bidding' }), false);
  assert.equal(shouldHoldWakeLock({ screen: 'home', phase: undefined }), false);
  assert.equal(shouldHoldWakeLock({ screen: 'error', phase: 'action' }), false);
});

test('unload warning is shown to the moderator only, and not after the game ends', () => {
  assert.equal(shouldWarnOnUnload({ isHost: false, screen: 'game', phase: 'action' }), false);
  assert.equal(shouldWarnOnUnload({ isHost: true, screen: 'game', phase: 'action' }), true);
  assert.equal(shouldWarnOnUnload({ isHost: true, screen: 'lobby' }), true);
  assert.equal(shouldWarnOnUnload({ isHost: true, screen: 'game', phase: 'complete' }), false);
  assert.equal(shouldWarnOnUnload({ isHost: true, screen: 'home' }), false);
});

test('reconnect banner appears only after a connection was lost', () => {
  assert.equal(bannerText({ connected: false, hasConnected: false }), '');
  assert.equal(bannerText({ connected: true, hasConnected: true }), '');
  assert.match(bannerText({ connected: false, hasConnected: true }), /Menyambungkan ulang/);
});

test('back navigation asks for confirmation in lobby and running games', () => {
  assert.equal(backAction({ screen: 'home' }), 'none');
  assert.equal(backAction({ screen: 'error' }), 'none');
  assert.equal(backAction({ screen: 'lobby' }), 'confirm-lobby');
  assert.equal(backAction({ screen: 'game', phase: 'sell' }), 'confirm-game');
  assert.equal(backAction({ screen: 'game', phase: 'complete' }), 'leave-game');
  assert.match(backMessage('confirm-lobby', true), /menutup room/);
  assert.doesNotMatch(backMessage('confirm-lobby', false), /menutup room/);
  assert.match(backMessage('confirm-game', true), /moderator tidak lagi memproses/);
  assert.equal(backMessage('none', true), '');
});

test('history keeps one room entry above the home entry', () => {
  assert.equal(historyStep({ target: 'lobby', current: 'home' }), 'push');
  assert.equal(historyStep({ target: 'game', current: 'room' }), 'replace');
  assert.equal(historyStep({ target: 'game', current: 'room' }), 'replace');
  assert.equal(historyStep({ target: 'home', current: 'room' }), 'back');
  assert.equal(historyStep({ target: 'home', current: 'home' }), 'none');
  assert.equal(historyStep({ target: 'error', current: 'room' }), 'back');
});
