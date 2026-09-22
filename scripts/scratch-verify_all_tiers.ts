import { getLevelConfig } from '../src/data/levels';
import { validateAndSolveLevel } from '../src/utils/levelValidator';
import { getDifficultyConfig } from '../src/utils/difficultyConfig';

const testLevels = [
  1, 2, 3, 5,       // Tier 1: Easy (Tutorial / gentle intro)
  8, 12, 15,        // Tier 2: Normal
  21, 23, 25, 30,   // Tier 3: Hard (Labyrinth Benchmark - media_1789982363018.jpg)
  35, 45, 50,       // Tier 4: Very Hard
  60, 80, 100,      // Tier 5: Extreme
  200, 500, 1000,   // Tier 6: Grand Master Expedition (to 1,000!)
  1001, 1025        // Tier 7: Infinity Master
];

console.log('='.repeat(95));
console.log('🐍 SNAKE ESCAPE - 1,000 LEVEL PROGRESSIVE DIFFICULTY VALIDATION SUITE 🐍');
console.log('='.repeat(95));

let allPassed = true;

for (const lvlNum of testLevels) {
  const diff = getDifficultyConfig(lvlNum);
  const t0 = performance.now();
  const level = getLevelConfig(lvlNum);
  const tGen = (performance.now() - t0).toFixed(1);

  const tSolveStart = performance.now();
  const solution = validateAndSolveLevel(level);
  const tSolve = (performance.now() - tSolveStart).toFixed(1);

  const totalCells = level.gridWidth * level.gridHeight;
  const occupiedCells = level.snakes.reduce((sum, s) => sum + s.cells.length, 0);
  const densityPct = ((occupiedCells / totalCells) * 100).toFixed(1);

  let totalTurns = 0;
  for (const s of level.snakes) {
    for (let i = 0; i < s.cells.length - 2; i++) {
      const c1 = s.cells[i];
      const c2 = s.cells[i + 1];
      const c3 = s.cells[i + 2];
      const dx1 = c2.x - c1.x;
      const dy1 = c2.y - c1.y;
      const dx2 = c3.x - c2.x;
      const dy2 = c3.y - c2.y;
      if (dx1 !== dx2 || dy1 !== dy2) totalTurns++;
    }
  }

  const passed = solution.valid && solution.solution?.length === level.snakes.length;
  if (!passed) allPassed = false;

  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(
    `Level ${String(lvlNum).padStart(4)}: ${level.name.padEnd(28)} | ` +
    `Grid: ${String(level.gridWidth).padStart(2)}x${String(level.gridHeight).padStart(2)} | ` +
    `Snakes: ${String(level.snakes.length).padStart(2)} | ` +
    `Density: ${String(densityPct).padStart(5)}% | ` +
    `Turns: ${String(totalTurns).padStart(2)} | ` +
    `Gen: ${tGen.padStart(5)}ms | ` +
    `Solve: ${tSolve.padStart(4)}ms | ` +
    `${status}`
  );

  if (!passed) {
    console.error(`  --> FAILED DETAILS: Valid=${solution.valid}, Errors=${solution.errors.join(', ')}`);
  }

}

console.log('='.repeat(95));
if (allPassed) {
  console.log('🎉 ALL TEST LEVELS ACROSS ALL 7 TIERS (1 TO 1000+) ARE 100% SOLVABLE & VERIFIED! 🎉');
} else {
  console.log('❌ SOME LEVELS FAILED VERIFICATION!');
}
console.log('='.repeat(95));
