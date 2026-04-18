type Slide = {
  title: string;
  subtitle: string;
  bullets: string[];
  codeTitle: string;
  code: string;
};

const slides: Slide[] = [
  {
    title: '1. crosswordSolver',
    subtitle: 'Orchestrateur principal du pipeline.',
    bullets: [
      'Enchaîne parse, slots, solve, render.',
      'Stoppe immédiatement sur un contrôle invalide.',
      'Garantit une sortie unique: grille ou Error.'
    ],
    codeTitle: 'crosswordSolver.js',
    code: `function crosswordSolver(puzzle, words) {
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
}`
  },
  {
    title: '2. parseInputs',
    subtitle: 'Validation des entrées et normalisation.',
    bullets: [
      'Vérifie types et format de grille.',
      'Construit la matrice 2D.',
      'Vérifie somme des chiffres = nombre de mots.'
    ],
    codeTitle: 'parse.js',
    code: `function parseInputs(puzzle, words) {
  if (typeof puzzle !== 'string' || !Array.isArray(words) || words.length === 0) return { ok: false };
  if (!words.every((word) => typeof word === 'string' && word.length > 0)) return { ok: false };

  const lines = puzzle.split('\\n');
  if (lines.length === 0 || lines.some((line) => line.length === 0)) return { ok: false };

  const cols = lines[0].length;
  if (cols === 0 || lines.some((line) => line.length !== cols)) return { ok: false };

  // ... création grid + totalStarts
  if (totalStarts !== words.length) return { ok: false };
  return { ok: true, grid, wordList: words.slice(), rows: lines.length, cols };
}`
  },
  {
    title: '3. findSlots',
    subtitle: 'Détection des slots horizontaux et verticaux.',
    bullets: [
      'Repère chaque départ possible.',
      'Ne garde que les longueurs >= 2.',
      'Vérifie la cohérence avec les chiffres de départ.'
    ],
    codeTitle: 'slots.js / findSlots',
    code: `function findSlots(grid, rows, cols) {
  const list = [];
  const startsCount = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Détection départ horizontal et vertical
  // Remplissage de list et startsCount

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '.') continue;
      if (Number(grid[r][c]) !== startsCount[r][c]) return { ok: false };
    }
  }
  return { ok: true, list };
}`
  },
  {
    title: '4. buildCoverageMap',
    subtitle: 'Contrôle de couverture de la grille.',
    bullets: [
      'Marque les cases couvertes par les slots.',
      'Rejette les cases ouvertes orphelines.',
      'Élimine les structures invalides tôt.'
    ],
    codeTitle: 'slots.js / buildCoverageMap',
    code: `function buildCoverageMap(rows, cols, slots, grid) {
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
}`
  },
  {
    title: '5. createEmptyBoard',
    subtitle: 'Préparation du plateau de travail.',
    bullets: [
      'Conserve les blocs avec ".".',
      'Initialise les cases actives avec chaîne vide.',
      'Facilite le placement et le rollback.'
    ],
    codeTitle: 'slots.js / createEmptyBoard',
    code: `function createEmptyBoard(grid, rows, cols) {
  const board = Array.from({ length: rows }, () => Array(cols).fill('.'));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '.') board[r][c] = '';
    }
  }
  return board;
}`
  },
  {
    title: '6. solveUnique',
    subtitle: 'Backtracking avec contrainte d’unicité.',
    bullets: [
      'Lance la recherche récursive.',
      'Compte les solutions trouvées.',
      'Valide uniquement si une seule solution.'
    ],
    codeTitle: 'solve.js / solveUnique',
    code: `function solveUnique(slots, words, board) {
  const byLength = groupWordsByLength(words);
  const usedWordIndexes = Array(words.length).fill(false);
  let solutions = 0;
  let solvedBoard = null;

  function backtrack(position) {
    // Choix de slot, pose, récursion, rollback
  }

  backtrack(0);
  return solutions === 1 ? { ok: true, board: solvedBoard } : { ok: false };
}`
  },
  {
    title: '7. groupWordsByLength',
    subtitle: 'Indexe les mots par longueur.',
    bullets: [
      'Construit une Map longueur -> index des mots.',
      'Évite des comparaisons inutiles.',
      'Accélère la génération de candidats.'
    ],
    codeTitle: 'solve.js / groupWordsByLength',
    code: `function groupWordsByLength(words) {
  const wordsByLength = new Map();
  for (let i = 0; i < words.length; i++) {
    const length = words[i].length;
    if (!wordsByLength.has(length)) wordsByLength.set(length, []);
    wordsByLength.get(length).push(i);
  }
  return wordsByLength;
}`
  },
  {
    title: '8. chooseBestSlot',
    subtitle: 'Heuristique du slot le plus contraint.',
    bullets: [
      'Calcule les candidats pour chaque slot.',
      'Choisit celui avec le minimum de possibilités.',
      'Réduit fortement l’arbre de recherche.'
    ],
    codeTitle: 'solve.js / chooseBestSlot',
    code: `function chooseBestSlot(slots, board, words, usedWordIndexes, byLength, startAt) {
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
    if (!bestChoice || candidates.length < bestChoice.candidates.length) bestChoice = { slotIndex: i, candidates };
  }
  return bestChoice;
}`
  },
  {
    title: '9. isCompatible',
    subtitle: 'Validation des croisements lettre par lettre.',
    bullets: [
      'Refuse les longueurs non égales.',
      'Vérifie chaque intersection.',
      'Coupe tôt les branches invalides.'
    ],
    codeTitle: 'solve.js / isCompatible',
    code: `function isCompatible(slot, word, board) {
  if (slot.length !== word.length) return false;
  for (let i = 0; i < slot.length; i++) {
    const [r, c] = slot[i];
    const currentLetter = board[r][c];
    if (currentLetter !== '' && currentLetter !== word[i]) return false;
  }
  return true;
}`
  },
  {
    title: '10. placeWord',
    subtitle: 'Pose un mot et trace les changements.',
    bullets: [
      'Valide la compatibilité avant pose.',
      'Écrit seulement les cases vides.',
      'Retourne les cases modifiées pour rollback.'
    ],
    codeTitle: 'solve.js / placeWord',
    code: `function placeWord(slot, word, board) {
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
}`
  },
  {
    title: '11. cloneBoard',
    subtitle: 'Copie défensive de la première solution.',
    bullets: [
      'Évite la mutation ultérieure de la solution.',
      'Capture un instantané fiable du board.',
      'Permet un retour final cohérent.'
    ],
    codeTitle: 'solve.js / cloneBoard',
    code: `function cloneBoard(board) {
  return board.map((row) => row.slice());
}`
  },
  {
    title: '12. boardToString',
    subtitle: 'Formatte la grille en sortie texte.',
    bullets: [
      'Joint les cases par ligne.',
      'Joint les lignes par saut de ligne.',
      'Produit le format exact attendu par l’audit.'
    ],
    codeTitle: 'render.js / boardToString',
    code: `function boardToString(board) {
  return board.map((row) => row.join('')).join('\\n');
}`
  },
  {
    title: '13. printSolvedBoard',
    subtitle: 'Affiche la grille résolue.',
    bullets: [
      'Délègue le formatage à boardToString.',
      'Centralise l’affichage de réussite.',
      'Garde une sortie stable côté audit.'
    ],
    codeTitle: 'render.js / printSolvedBoard',
    code: `function printSolvedBoard(board) {
  console.log(boardToString(board));
}`
  },
  {
    title: '14. printError',
    subtitle: 'Affiche l’échec standardisé.',
    bullets: [
      'Une seule erreur possible: Error.',
      'Conforme à l’énoncé.',
      'Simplifie la vérification automatique.'
    ],
    codeTitle: 'render.js / printError',
    code: `function printError() {
  console.log('Error');
}`
  }
];

const detailedExplanations: string[] = [
  'Cette fonction est le chef d’orchestre du solveur. Elle exécute les validations dans un ordre strict pour éviter tout calcul inutile, puis n’affiche la grille que si la résolution retourne exactement une solution valide.',
  'Cette fonction transforme des entrées brutes en données fiables. Elle protège le solveur contre les formats invalides dès le début, ce qui évite les erreurs en cascade dans les étapes d’extraction et de résolution.',
  'Cette fonction calcule la topologie réelle de la grille en identifiant les segments où des mots peuvent exister. Elle compare ensuite la structure détectée avec les chiffres du puzzle pour garantir la cohérence du modèle avant backtracking.',
  'Cette fonction vérifie l’intégrité de couverture: chaque case ouverte doit appartenir à un slot détecté. Elle sert de garde-fou structurel pour empêcher de résoudre un puzzle partiellement non adressable.',
  'Cette fonction prépare un plateau mutable pour la recherche. Les points restent bloqués et les cases de travail commencent vides, ce qui permet d’écrire puis d’annuler facilement les lettres pendant la récursion.',
  'Cette fonction encapsule la stratégie de recherche complète. Elle initialise les structures d’aide, lance la récursion et impose la règle métier centrale: une seule solution est acceptée, zéro ou plusieurs provoquent Error.',
  'Cette fonction est une optimisation simple mais utile. En groupant les mots par longueur, elle réduit fortement le nombre de candidats testés à chaque étape de la recherche.',
  'Cette fonction applique l’heuristique du “minimum remaining values”. En choisissant le slot avec le moins de candidats, elle coupe rapidement les branches impossibles et accélère la convergence.',
  'Cette fonction est le validateur local des contraintes de croisement. Elle garantit qu’aucune lettre déjà posée n’est contredite par un nouveau mot candidat.',
  'Cette fonction réalise la pose effective d’un mot sur le plateau courant. Elle mémorise précisément les cases touchées pour permettre un rollback exact en cas d’échec d’une branche.',
  'Cette fonction capture une copie indépendante du board au moment où la première solution complète est trouvée. Cela évite que les modifications ultérieures du backtracking ne corrompent la solution stockée.',
  'Cette fonction convertit la représentation interne (tableau de lignes) en format texte attendu. Elle garantit un rendu stable et directement comparable par les tests et l’audit.',
  'Cette fonction centralise l’affichage du cas de succès. Elle évite la duplication de logique d’impression et maintient un point unique de sortie “grille résolue”.',
  'Cette fonction centralise le cas d’échec selon la spécification. Elle impose une réponse uniforme `Error`, indispensable pour la conformité de l’énoncé et des tests automatiques.'
];

const slideContainer = document.getElementById('slide');
const counter = document.getElementById('counter');
const prevButton = document.getElementById('prev') as HTMLButtonElement | null;
const nextButton = document.getElementById('next') as HTMLButtonElement | null;

if (!slideContainer || !counter || !prevButton || !nextButton) {
  throw new Error('UI introuvable: vérifie index.html');
}

const safeSlideContainer = slideContainer;
const safeCounter = counter;
const safePrevButton = prevButton;
const safeNextButton = nextButton;

let current = 0;

function renderSlide(): void {
  const item = slides[current];
  const detailedText = detailedExplanations[current];
  const bulletsHtml = item.bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join('');

  safeSlideContainer.innerHTML = `
    <div class="slide-head">
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.subtitle)}</p>
    </div>
    <div class="slide-grid">
      <article class="panel panel-text">
        <h3>Points clés</h3>
        <ul>${bulletsHtml}</ul>
        <div class="deep-box">
          <h4>Explication détaillée</h4>
          <p>${escapeHtml(detailedText)}</p>
        </div>
      </article>
      <article class="panel panel-code">
        <h3>${escapeHtml(item.codeTitle)}</h3>
        <pre><code>${highlightCode(item.code)}</code></pre>
      </article>
    </div>
  `;

  safeCounter.textContent = `Slide ${current + 1}/${slides.length}`;
  safePrevButton.disabled = current === 0;
  safeNextButton.disabled = current === slides.length - 1;
}

function nextSlide(): void {
  if (current < slides.length - 1) {
    current += 1;
    renderSlide();
  }
}

function prevSlide(): void {
  if (current > 0) {
    current -= 1;
    renderSlide();
  }
}

function escapeHtml(input: string): string {
  return input
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;');
}

function highlightCode(code: string): string {
  const tokenRegex = /(\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:function|const|let|if|return|for|while|new|null|true|false)\b|\b\d+\b|\b[a-zA-Z_]\w*(?=\s*\())/g;
  let output = '';
  let lastIndex = 0;

  for (const match of code.matchAll(tokenRegex)) {
    const value = match[0];
    const index = match.index ?? 0;
    output += escapeHtml(code.slice(lastIndex, index));

    if (value.startsWith('//')) {
      output += `<span class="tok-comment">${escapeHtml(value)}</span>`;
    } else if (value.startsWith('"') || value.startsWith('\'')) {
      output += `<span class="tok-string">${escapeHtml(value)}</span>`;
    } else if (/^\d+$/.test(value)) {
      output += `<span class="tok-num">${value}</span>`;
    } else if (/^(function|const|let|if|return|for|while|new|null|true|false)$/.test(value)) {
      output += `<span class="tok-key">${value}</span>`;
    } else {
      output += `<span class="tok-fn">${value}</span>`;
    }

    lastIndex = index + value.length;
  }

  output += escapeHtml(code.slice(lastIndex));
  return output;
}

safeNextButton.addEventListener('click', nextSlide);
safePrevButton.addEventListener('click', prevSlide);

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown') nextSlide();
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') prevSlide();
});

renderSlide();
