# README_ORAL.md

## Pitch d'ouverture (30 secondes)
Bonjour, je vous présente mon projet **Crossword Solver**.
L'objectif est de remplir automatiquement une grille de mots croisés à partir d'une structure imposée et d'une liste de mots.
La contrainte principale est la suivante: le programme doit accepter uniquement une solution **unique**.
S'il n'y a aucune solution, plusieurs solutions, ou un format invalide, le programme répond strictement `Error`.

## Problème résolu
Ce projet répond à un besoin classique en game logic: valider rapidement qu'un template de grille est bien solvable.
Mon solveur ne place pas les mots au hasard.
Il applique une logique de contraintes avec backtracking pour garantir la cohérence des croisements.

## Architecture claire (modulaire)
J'ai volontairement choisi une architecture modulaire pour faciliter l'audit et la maintenance.

- `crosswordSolver.js`: orchestrateur principal.
- `parse.js`: parse et validations d'entrée.
- `slots.js`: extraction des slots horizontaux/verticaux + validations structurelles.
- `solve.js`: moteur de backtracking et détection d'unicité.
- `render.js`: affichage final (`grille` ou `Error`).

Message clé à dire:
> Chaque module a une responsabilité unique, ce qui rend le comportement traçable et vérifiable très rapidement.

## Explication algorithmique (simple et solide)
1. Je parse le puzzle en matrice 2D.
2. Je détecte les slots candidats (horizontal et vertical, longueur >= 2).
3. Je vérifie que les chiffres de départ correspondent exactement aux départs réellement trouvés.
4. Je lance un backtracking:
   - choix du slot le plus contraint,
   - test de compatibilité des mots (longueur + lettres croisées),
   - placement, récursion, rollback.
5. Je compte les solutions:
   - `0` => `Error`,
   - `1` => j'affiche la grille,
   - `>=2` => `Error`.

Phrase d'impact:
> Je ne cherche pas seulement une solution, je prouve qu'elle est unique.

## Démo orale recommandée (2-3 minutes)
### Étape 1: cas nominal
Lancer:
```bash
node -e "const { crosswordSolver } = require('./crosswordSolver'); crosswordSolver('2001\n0..0\n1000\n0..0', ['casa','alan','ciao','anta'])"
```
Dire:
> Ici on voit une grille correctement remplie, avec des croisements cohérents.

### Étape 2: cas erreur format
Lancer:
```bash
node -e "const { crosswordSolver } = require('./crosswordSolver'); crosswordSolver(123, ['casa'])"
```
Dire:
> Le solver rejette immédiatement les entrées invalides avec `Error`, sans comportement ambigu.

### Étape 3: audit complet
Lancer:
```bash
node Audit/auditRunner.js
```
Dire:
> Le runner reproduit tous les cas d'audit attendus, ce qui sécurise la conformité du projet.

## Arguments pour convaincre le jury
- Le code est **court, lisible, testable**.
- La logique est **déterministe**: même entrée, même sortie.
- La gestion d'erreur est **stricte** et centralisée.
- La séparation en modules simplifie la revue et réduit le risque de régression.
- Les cas d'audit sont automatisés et reproductibles.

## Réponses prêtes aux questions du jury
### Pourquoi backtracking ?
Parce que le problème est un CSP (Constraint Satisfaction Problem): on explore les placements possibles en coupant tôt les branches invalides.

### Pourquoi vérifier l'unicité ?
Parce que l'énoncé l'impose, et c'est ce qui distingue une grille valide d'une grille ambiguë.

### Pourquoi ce découpage modulaire ?
Pour isoler les responsabilités, faciliter les tests ciblés, et rendre l'audit plus rapide.

### Quelle est la robustesse ?
Le solver couvre les cas: invalide, impossible, ambigu, et solution unique, avec retour standardisé.

## Conclusion de fin d'oral (10 secondes)
Ce projet démontre une implémentation fiable d'un solveur de mots croisés avec contraintes.
Il est conçu pour être auditable, maintenable et conforme à l'énoncé sur toute la chaîne de validation.
