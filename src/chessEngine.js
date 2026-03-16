const files = 'abcdefgh';

function createInitialBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

  for (let i = 0; i < 8; i += 1) {
    board[0][i] = { type: back[i], color: 'b' };
    board[1][i] = { type: 'p', color: 'b' };
    board[6][i] = { type: 'p', color: 'w' };
    board[7][i] = { type: back[i], color: 'w' };
  }

  return board;
}

function parseSquare(square) {
  const file = files.indexOf(square[0]);
  const rank = 8 - Number(square[1]);
  return { file, rank };
}

function toSquare(file, rank) {
  return `${files[file]}${8 - rank}`;
}

function inBounds(file, rank) {
  return file >= 0 && file < 8 && rank >= 0 && rank < 8;
}

export function createGame() {
  return {
    turn: 'w',
    board: createInitialBoard()
  };
}

export function boardState(game) {
  return game.board;
}

function rayMoves(game, file, rank, piece, vectors) {
  const out = [];
  for (const [df, dr] of vectors) {
    let nf = file + df;
    let nr = rank + dr;
    while (inBounds(nf, nr)) {
      const target = game.board[nr][nf];
      if (!target) {
        out.push({ from: toSquare(file, rank), to: toSquare(nf, nr) });
      } else {
        if (target.color !== piece.color) {
          out.push({ from: toSquare(file, rank), to: toSquare(nf, nr) });
        }
        break;
      }
      nf += df;
      nr += dr;
    }
  }
  return out;
}

export function legalMoves(game, square) {
  const { file, rank } = parseSquare(square);
  const piece = game.board[rank][file];
  if (!piece || piece.color !== game.turn) return [];

  const moves = [];
  const pushIfValid = (nf, nr) => {
    if (!inBounds(nf, nr)) return;
    const target = game.board[nr][nf];
    if (!target || target.color !== piece.color) {
      moves.push({ from: square, to: toSquare(nf, nr) });
    }
  };

  if (piece.type === 'p') {
    const dir = piece.color === 'w' ? -1 : 1;
    const startRank = piece.color === 'w' ? 6 : 1;
    if (inBounds(file, rank + dir) && !game.board[rank + dir][file]) {
      moves.push({ from: square, to: toSquare(file, rank + dir) });
      if (rank === startRank && !game.board[rank + 2 * dir][file]) {
        moves.push({ from: square, to: toSquare(file, rank + 2 * dir) });
      }
    }
    for (const df of [-1, 1]) {
      const nf = file + df;
      const nr = rank + dir;
      if (!inBounds(nf, nr)) continue;
      const target = game.board[nr][nf];
      if (target && target.color !== piece.color) {
        moves.push({ from: square, to: toSquare(nf, nr) });
      }
    }
  } else if (piece.type === 'n') {
    for (const [df, dr] of [[1,2], [2,1], [-1,2], [-2,1], [1,-2], [2,-1], [-1,-2], [-2,-1]]) {
      pushIfValid(file + df, rank + dr);
    }
  } else if (piece.type === 'b') {
    moves.push(...rayMoves(game, file, rank, piece, [[1,1], [1,-1], [-1,1], [-1,-1]]));
  } else if (piece.type === 'r') {
    moves.push(...rayMoves(game, file, rank, piece, [[1,0], [-1,0], [0,1], [0,-1]]));
  } else if (piece.type === 'q') {
    moves.push(...rayMoves(game, file, rank, piece, [[1,1], [1,-1], [-1,1], [-1,-1], [1,0], [-1,0], [0,1], [0,-1]]));
  } else if (piece.type === 'k') {
    for (const [df, dr] of [[1,1], [1,0], [1,-1], [0,1], [0,-1], [-1,1], [-1,0], [-1,-1]]) {
      pushIfValid(file + df, rank + dr);
    }
  }

  return moves;
}

export function applyMove(game, move) {
  const options = legalMoves(game, move.from);
  const selected = options.find((m) => m.to === move.to);
  if (!selected) return null;

  const { file: ff, rank: fr } = parseSquare(move.from);
  const { file: tf, rank: tr } = parseSquare(move.to);
  game.board[tr][tf] = game.board[fr][ff];
  game.board[fr][ff] = null;
  game.turn = game.turn === 'w' ? 'b' : 'w';
  return selected;
}
