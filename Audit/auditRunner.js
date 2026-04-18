const { crosswordSolver } = require('../crosswordSolver');

function captureRun(puzzle, words) {
  const logs = [];
  const original = console.log;
  console.log = (...args) => logs.push(args.join(' '));
  try {
    crosswordSolver(puzzle, words);
  } catch (error) {
    logs.push(`THREW:${error.message}`);
  } finally {
    console.log = original;
  }
  return logs.join('\n');
}

const cases = [
  {
    name: 'Cas simple valide',
    puzzle: '2001\n0..0\n1000\n0..0',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'casa\ni..l\nanta\no..n',
  },
  {
    name: 'Grand cas été',
    puzzle: `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`,
    words: ['sun', 'sunglasses', 'suncream', 'swimming', 'bikini', 'beach', 'icecream', 'tan', 'deckchair', 'sand', 'seaside', 'sandals'],
    expected: `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`,
  },
  {
    name: 'Grand cas cuisine',
    puzzle: `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`,
    words: ['popcorn', 'fruit', 'flour', 'chicken', 'eggs', 'vegetables', 'pasta', 'pork', 'steak', 'cheese'],
    expected: `..p.f..v...
flour..eggs
..p.u..g...
..chicken..
..o.t..t...
pork..pasta
..n.s..b...
....t..l...
..cheese...
....a..s...
....k......`,
  },
  {
    name: 'Ordre inverse des mots',
    puzzle: `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`,
    words: ['sun', 'sunglasses', 'suncream', 'swimming', 'bikini', 'beach', 'icecream', 'tan', 'deckchair', 'sand', 'seaside', 'sandals'].reverse(),
    expected: `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`,
  },
  {
    name: 'Mismatch départs/mots',
    puzzle: '2001\n0..0\n2000\n0..0',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error',
  },
  {
    name: 'Départ > 2 incohérent',
    puzzle: '0001\n0..0\n3000\n0..0',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error',
  },
  {
    name: 'Répétition de mot',
    puzzle: '2001\n0..0\n1000\n0..0',
    words: ['casa', 'casa', 'ciao', 'anta'],
    expected: 'Error',
  },
  {
    name: 'Puzzle vide',
    puzzle: '',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error',
  },
  {
    name: 'Format puzzle invalide',
    puzzle: 123,
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error',
  },
  {
    name: 'Format words invalide',
    puzzle: '',
    words: 123,
    expected: 'Error',
  },
  {
    name: 'Plusieurs solutions',
    puzzle: '2000\n0...\n0...\n0...',
    words: ['abba', 'assa'],
    expected: 'Error',
  },
  {
    name: 'Aucune solution',
    puzzle: '2001\n0..0\n1000\n0..0',
    words: ['aaab', 'aaac', 'aaad', 'aaae'],
    expected: 'Error',
  },
];

let passed = 0;
for (const testCase of cases) {
  const actual = captureRun(testCase.puzzle, testCase.words);
  const ok = actual === testCase.expected;
  if (ok) passed++;
  console.log(`${ok ? 'OK' : 'KO'} | ${testCase.name}`);
  if (!ok) {
    console.log('--- attendu ---');
    console.log(testCase.expected);
    console.log('--- obtenu ---');
    console.log(actual);
  }
}

console.log(`\nRésultat: ${passed}/${cases.length} cas valides`);
if (passed !== cases.length) process.exitCode = 1;
