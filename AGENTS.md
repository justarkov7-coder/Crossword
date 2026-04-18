# AGENTS.md - Crossword Solver

## Objectif
Implémenter un solveur de mots croisés fiable, minimaliste et lisible.

## Logique algorithmique obligatoire
Utiliser strictement cette stratégie:
1. Parser la grille texte en matrice 2D.
2. Détecter les **slots** (segments de cases à remplir) horizontaux et verticaux.
3. Associer les mots aux slots avec **backtracking**.
4. Vérifier les contraintes à chaque tentative:
   - longueur exacte slot/mot,
   - cohérence des croisements (même lettre à l'intersection),
   - chaque mot utilisé une seule fois.
5. Continuer jusqu'à:
   - 0 solution => `Error`,
   - 1 solution unique => afficher la grille résolue,
   - 2+ solutions => `Error` (ambigu).

## Validations obligatoires
Avant et pendant la résolution:
- Format puzzle valide (rectangulaire, seulement chiffres, points, sauts de ligne).
- Liste de mots valide (tableau non vide de chaînes non vides).
- Nombre total de départs (somme des chiffres) = nombre de mots.
- Chaque case slot est couverte et remplie dans la solution finale.

## Style de code imposé
- Code le plus court possible **sans sacrifier la clarté**.
- Fonctions courtes et parlantes.
- Variables et constantes explicites (`grid`, `slots`, `usedWords`, `isCompatible`, etc.).
- Commentaires rares, courts, utiles, en français.
- Pas de complexité inutile, pas d'abstraction prématurée.

## Discipline de livraison
- Garder un diff minimal.
- Vérifier avec des cas:
  - solution unique,
  - aucune solution,
  - plusieurs solutions,
  - format invalide.
- Ne jamais déclarer succès sans vérification.
