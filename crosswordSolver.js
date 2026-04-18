const { parseInputs } = require('./parse');
const { findSlots, buildCoverageMap, createEmptyBoard } = require('./slots');
const { solveUnique } = require('./solve');
const { printSolvedBoard, printError } = require('./render');

// Orchestre toutes les étapes du solveur et affiche le résultat final.
function crosswordSolver(puzzle, words) {
  const parsed = parseInputs(puzzle, words);
  if (!parsed.ok) return printError();

  const { grid, wordList, rows, cols } = parsed;

  const slots = findSlots(grid, rows, cols);
  if (!slots.ok) return printError();

  const coverage = buildCoverageMap(rows, cols, slots.list, grid);
  if (!coverage.ok) return printError();

  const board = createEmptyBoard(grid, rows, cols);
  const result = solveUnique(slots.list, wordList, board);
  if (!result.ok) return printError();

  printSolvedBoard(result.board);
}

module.exports = { crosswordSolver };
