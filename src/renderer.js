import { boardState, createGame, legalMoves, applyMove } from './chessEngine.js';

const boardEl = document.getElementById('board');
const game = createGame();
let selected = null;

function squareName(file, rank) {
  return `${'abcdefgh'[file]}${8 - rank}`;
}

function clearMarkers() {
  for (const square of boardEl.children) {
    square.classList.remove('selected', 'target');
  }
}

function draw() {
  boardEl.innerHTML = '';
  const board = boardState(game);

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const square = document.createElement('button');
      square.className = `square ${(file + rank) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.square = squareName(file, rank);
      square.type = 'button';

      const piece = board[rank][file];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece ${piece.color}`;
        pieceEl.title = `${piece.color}${piece.type}`;
        square.appendChild(pieceEl);
      }

      square.addEventListener('click', () => handleSquare(square.dataset.square));
      boardEl.appendChild(square);
    }
  }
}

function markMoves(square) {
  clearMarkers();
  const from = boardEl.querySelector(`[data-square="${square}"]`);
  if (from) from.classList.add('selected');

  for (const move of legalMoves(game, square)) {
    boardEl.querySelector(`[data-square="${move.to}"]`)?.classList.add('target');
  }
}

function handleSquare(square) {
  if (!selected) {
    const moves = legalMoves(game, square);
    if (!moves.length) return;
    selected = square;
    markMoves(square);
    return;
  }

  const moved = applyMove(game, { from: selected, to: square });
  selected = null;
  draw();
  if (!moved) return;
  clearMarkers();
}

draw();
