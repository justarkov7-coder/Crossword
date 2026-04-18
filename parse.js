// Valide les entrées et transforme le puzzle texte en structure exploitable.
function parseInputs(puzzle, words) {
  if (typeof puzzle !== 'string' || !Array.isArray(words) || words.length === 0) return { ok: false };
  if (!words.every((word) => typeof word === 'string' && word.length > 0)) return { ok: false };

  const lines = puzzle.split('\n');
  if (lines.length === 0 || lines.some((line) => line.length === 0)) return { ok: false };

  const cols = lines[0].length;
  if (cols === 0 || lines.some((line) => line.length !== cols)) return { ok: false };

  const grid = [];
  let totalStarts = 0;

  for (let r = 0; r < lines.length; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cell = lines[r][c];
      if (cell !== '.' && (cell < '0' || cell > '9')) return { ok: false };
      row.push(cell);
      if (cell !== '.') totalStarts += Number(cell);
    }
    grid.push(row);
  }

  if (totalStarts !== words.length) return { ok: false };

  return {
    ok: true,
    grid,
    wordList: words.slice(),
    rows: lines.length,
    cols,
  };
}

module.exports = { parseInputs };
