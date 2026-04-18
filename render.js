// Convertit le plateau en chaîne multi-lignes pour l'affichage final.
function boardToString(board) {
  return board.map((row) => row.join('')).join('\n');
}

// Affiche la grille résolue dans le format attendu par l'audit.
function printSolvedBoard(board) {
  console.log(boardToString(board));
}

// Affiche le message d'erreur standard demandé par l'énoncé.
function printError() {
  console.log('Error');
}

module.exports = { boardToString, printSolvedBoard, printError };
