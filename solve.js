// Lance le backtracking et accepte uniquement une solution unique.
function solveUnique(slots, words, board) {
  const byLength = groupWordsByLength(words);
  const usedWordIndexes = Array(words.length).fill(false);
  let solutions = 0;
  let solvedBoard = null;

  // Explore récursivement les placements de mots compatibles.
  function backtrack(position) {
    if (solutions > 1) return;
    if (position === slots.length) {
      solutions++;
      if (solutions === 1) solvedBoard = cloneBoard(board);
      return;
    }

    const choice = chooseBestSlot(slots, board, words, usedWordIndexes, byLength, position);
    if (!choice) return;

    const { slotIndex, candidates } = choice;
    const currentSlot = slots[slotIndex];
    slots[slotIndex] = slots[position];
    slots[position] = currentSlot;

    for (const wordIndex of candidates) {
      if (usedWordIndexes[wordIndex]) continue;
      const changes = placeWord(currentSlot, words[wordIndex], board);
      if (!changes) continue;

      usedWordIndexes[wordIndex] = true;
      backtrack(position + 1);
      usedWordIndexes[wordIndex] = false;

      for (const [r, c] of changes) board[r][c] = '';
      if (solutions > 1) break;
    }

    slots[position] = slots[slotIndex];
    slots[slotIndex] = currentSlot;
  }

  backtrack(0);
  return solutions === 1 ? { ok: true, board: solvedBoard } : { ok: false };
}

// Regroupe les index de mots par longueur pour accélérer la recherche.
function groupWordsByLength(words) {
  const wordsByLength = new Map();
  for (let i = 0; i < words.length; i++) {
    const length = words[i].length;
    if (!wordsByLength.has(length)) wordsByLength.set(length, []);
    wordsByLength.get(length).push(i);
  }
  return wordsByLength;
}

// Choisit le prochain slot le plus contraint pour réduire l'arbre de recherche.
function chooseBestSlot(slots, board, words, usedWordIndexes, byLength, startAt) {
  let bestChoice = null;

  for (let i = startAt; i < slots.length; i++) {
    const slot = slots[i];
    const pool = byLength.get(slot.length) || [];
    const candidates = [];

    for (const wordIndex of pool) {
      if (usedWordIndexes[wordIndex]) continue;
      if (isCompatible(slot, words[wordIndex], board)) candidates.push(wordIndex);
    }

    if (candidates.length === 0) return null;
    if (!bestChoice || candidates.length < bestChoice.candidates.length) {
      bestChoice = { slotIndex: i, candidates };
      if (candidates.length === 1) break;
    }
  }

  return bestChoice;
}

// Vérifie qu'un mot peut s'insérer dans un slot sans conflit de lettres.
function isCompatible(slot, word, board) {
  if (slot.length !== word.length) return false;
  for (let i = 0; i < slot.length; i++) {
    const [r, c] = slot[i];
    const currentLetter = board[r][c];
    if (currentLetter !== '' && currentLetter !== word[i]) return false;
  }
  return true;
}

// Place un mot dans le slot et retourne les cases modifiées pour rollback.
function placeWord(slot, word, board) {
  if (!isCompatible(slot, word, board)) return null;
  const changes = [];

  for (let i = 0; i < slot.length; i++) {
    const [r, c] = slot[i];
    if (board[r][c] === '') {
      board[r][c] = word[i];
      changes.push([r, c]);
    }
  }

  return changes;
}

// Copie le plateau courant pour conserver la première solution trouvée.
function cloneBoard(board) {
  return board.map((row) => row.slice());
}

module.exports = { solveUnique };
