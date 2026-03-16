import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyMove, legalMoves } from '../src/chessEngine.js';

test('initial legal moves for e2 pawn include e3 and e4', () => {
  const game = createGame();
  const moves = legalMoves(game, 'e2').map((m) => m.to).sort();
  assert.deepEqual(moves, ['e3', 'e4']);
});

test('applyMove updates board and rejects illegal move', () => {
  const game = createGame();
  const okMove = applyMove(game, { from: 'e2', to: 'e4' });
  assert.equal(okMove?.from, 'e2');

  const badMove = applyMove(game, { from: 'e2', to: 'e5' });
  assert.equal(badMove, null);
});
