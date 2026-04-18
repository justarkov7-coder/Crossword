# Crossword Solver

Solveur de mots croisés en JavaScript basé sur:
- extraction de slots (horizontaux/verticaux),
- validations strictes,
- backtracking avec détection d'unicité.

## Fichiers
- `crosswordSolver.js`: orchestrateur principal `crosswordSolver(puzzle, words)`.
- `parse.js`: parsing + validation des entrées.
- `slots.js`: extraction des slots + validation structurelle.
- `solve.js`: backtracking + unicité.
- `render.js`: affichage final et `Error`.
- `AGENTS.md`: logique algorithmique et règles de style imposées.

## Architecture détaillée
Le projet est découpé en modules courts, chacun avec une responsabilité unique.

### 1) Orchestrateur
- `crosswordSolver.js` enchaîne les étapes dans l'ordre métier:
  1. parse des entrées,
  2. extraction/validation des slots,
  3. construction du board de travail,
  4. résolution par backtracking,
  5. rendu final (`grille` ou `Error`).

### 2) Module parse
- `parse.js` transforme le puzzle texte en matrice 2D.
- Il valide:
  - types d'entrée (`string`, `array<string>`),
  - format rectangulaire,
  - alphabet autorisé (`.` ou `0-9`),
  - contrainte `somme(chiffres) === words.length`.

### 3) Module slots
- `slots.js` détecte tous les slots horizontaux et verticaux (longueur >= 2).
- Il vérifie que chaque chiffre de départ correspond au nombre réel de départs détectés.
- Il vérifie que toute case ouverte de la grille est couverte par au moins un slot.
- Il crée le board initial:
  - `.` pour les cases bloquées,
  - `''` pour les cases à remplir.

### 4) Module solve
- `solve.js` applique un backtracking simple avec heuristique:
  - choix du slot avec le moins de candidats,
  - test de compatibilité (longueur + lettres croisées),
  - pose du mot, récursion, rollback.
- Le solveur compte les solutions:
  - `0` => erreur,
  - `1` => solution unique conservée,
  - `>= 2` => ambigu, erreur.

### 5) Module render
- `render.js` convertit le board en texte final.
- Il centralise les sorties console pour garder un comportement uniforme.

## Règles du puzzle
Chaque caractère de la grille est:
- `.`: case vide hors mot (bloquée),
- `0-9`: case de mot, et valeur = nombre de mots qui commencent sur cette case,
- `\n`: séparation des lignes.

## Algorithme
1. Parser la grille en matrice 2D et valider:
   - format rectangulaire,
   - caractères autorisés,
   - mots valides,
   - somme des chiffres = nombre de mots.
2. Détecter les slots:
   - un slot horizontal commence si la case de gauche est bloquée (ou bord) et la case de droite est libre,
   - un slot vertical commence si la case du haut est bloquée (ou bord) et la case du bas est libre,
   - seuls les slots de longueur >= 2 sont retenus.
3. Vérifier la cohérence structurelle:
   - pour chaque case chiffrée, le nombre réel de départs détectés doit correspondre au chiffre,
   - chaque case non bloquée doit appartenir à au moins un slot.
4. Résoudre par backtracking:
   - choisir le prochain slot avec le moins de candidats (heuristique),
   - placer un mot compatible (longueur + croisements),
   - revenir en arrière en cas d'échec.
5. Compter les solutions:
   - 0 solution => `Error`,
   - 1 solution => afficher la grille résolue,
   - >= 2 solutions => `Error`.

## Wireframe algorithmique
```text
+-----------------------------------------------------+
| Entrée: puzzle (string), words (array<string>)      |
+------------------------------+----------------------+
                               |
                               v
                 +-----------------------------+
                 | Parse + validations format   |
                 +-------------+---------------+
                               |
                     invalide? | oui
                               v
                          +---------+
                          | Error   |
                          +---------+
                               ^
                               | non
                               |
                 +-----------------------------+
                 | Extraction des slots         |
                 | H/V + compte des départs     |
                 +-------------+---------------+
                               |
                     incohérent?| oui
                               v
                          +---------+
                          | Error   |
                          +---------+
                               ^
                               | non
                               |
                 +-----------------------------+
                 | Backtracking                |
                 | - choisir slot le + contraint|
                 | - tester mots compatibles    |
                 | - poser / annuler            |
                 +-------------+---------------+
                               |
                               v
                 +-----------------------------+
                 | Nombre de solutions ?        |
                 +------+------+----------------+
                        |      |
                      0 ou >=2 | 1
                        |      |
                        v      v
                    +---------+  +----------------+
                    | Error   |  | Afficher grille|
                    +---------+  +----------------+
```

## Wireframe détaillé (modules + données)
```text
  [Utilisateur]
       |
       v
crosswordSolver(puzzle, words)  (crosswordSolver.js)
       |
       +--> parseInputs(...)  (parse.js)
       |       Entrées: puzzle brut + words
       |       Sortie : { ok, grid, rows, cols, wordList }
       |       Echec  : ok=false -> printError()
       |
       +--> findSlots(grid, rows, cols)  (slots.js)
       |       Sortie : { ok, list: Slot[] }
       |       Echec  : chiffre départ incohérent -> printError()
       |
       +--> buildCoverageMap(rows, cols, slots, grid)  (slots.js)
       |       Vérifie que toutes les cases ouvertes sont couvertes
       |       Echec  : ok=false -> printError()
       |
       +--> createEmptyBoard(grid, rows, cols)  (slots.js)
       |       Sortie : board de travail ('.' ou '')
       |
       +--> solveUnique(slots, wordList, board)  (solve.js)
       |       Boucle récursive:
       |         1) choisirBestSlot(...)
       |         2) tester candidats compatibles
       |         3) placeWord(...)
       |         4) backtrack(...)
       |         5) rollback des cases modifiées
       |       Sortie : { ok, board } ou { ok:false }
       |
       +--> printSolvedBoard(board) / printError()  (render.js)
               Sortie console finale attendue par l'audit
```

## Utilisation
```js
const { crosswordSolver } = require('./crosswordSolver');

const puzzle = `2001
0..0
1000
0..0`;
const words = ['casa', 'alan', 'ciao', 'anta'];

crosswordSolver(puzzle, words);
```

Sortie attendue:
```text
casa
i..l
anta
o..n
```

## Notes de validation
Le solveur affiche uniquement:
- la grille résolue si unique,
- `Error` dans tous les autres cas (invalide, impossible, ambigu).

## Lancer les tests
```bash
node test
```
