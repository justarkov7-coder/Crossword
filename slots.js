// Extrait tous les slots horizontaux/verticaux et vérifie la cohérence des départs.
function findSlots(grid, rows, cols) {
  const list = [];
  const startsCount = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '.') continue;

      const startsHorizontal = (c === 0 || grid[r][c - 1] === '.') && c + 1 < cols && grid[r][c + 1] !== '.';
      if (startsHorizontal) {
        const cells = [];
        let x = c;
        while (x < cols && grid[r][x] !== '.') {
          cells.push([r, x]);
          x++;
        }
        if (cells.length >= 2) {
          list.push(cells);
          startsCount[r][c]++;
        }
      }

      const startsVertical = (r === 0 || grid[r - 1][c] === '.') && r + 1 < rows && grid[r + 1][c] !== '.';
      if (startsVertical) {
        const cells = [];
        let y = r;
        while (y < rows && grid[y][c] !== '.') {
          cells.push([y, c]);
          y++;
        }
        if (cells.length >= 2) {
          list.push(cells);
          startsCount[r][c]++;
        }
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '.') continue;
      if (Number(grid[r][c]) !== startsCount[r][c]) return { ok: false };
    }
  }

  return { ok: true, list };
}

// Vérifie que chaque case ouverte de la grille est couverte par au moins un slot.
function buildCoverageMap(rows, cols, slots, grid) {
  const covered = Array.from({ length: rows }, () => Array(cols).fill(false));

  for (const slot of slots) {
    for (const [r, c] of slot) covered[r][c] = true;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '.' && !covered[r][c]) return { ok: false };
    }
  }

  return { ok: true };
}

// Crée le plateau initial avec '.' pour les blocs et '' pour les cases à remplir.
function createEmptyBoard(grid, rows, cols) {
  const board = Array.from({ length: rows }, () => Array(cols).fill('.'));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '.') board[r][c] = '';
    }
  }
  return board;
}

module.exports = { findSlots, buildCoverageMap, createEmptyBoard };
