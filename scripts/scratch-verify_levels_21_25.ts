import { getLevelConfig } from '../src/data/levels';
import { validateAndSolveLevel } from '../src/utils/levelValidator';

console.log('--- DETAILED BENCHMARK CHECK FOR LEVELS 21 TO 25 ---');
for (let lvl = 21; lvl <= 25; lvl++) {
  const level = getLevelConfig(lvl);
  const val = validateAndSolveLevel(level);
  const totalCells = level.gridWidth * level.gridHeight;
  const occupied = level.snakes.reduce((sum, s) => sum + s.cells.length, 0);

  let turns = 0;
  let uTurns = 0;
  for (const s of level.snakes) {
    for (let i = 0; i < s.cells.length - 2; i++) {
      const c1 = s.cells[i];
      const c2 = s.cells[i + 1];
      const c3 = s.cells[i + 2];
      const dx1 = c2.x - c1.x;
      const dy1 = c2.y - c1.y;
      const dx2 = c3.x - c2.x;
      const dy2 = c3.y - c2.y;
      if (dx1 !== dx2 || dy1 !== dy2) {
        turns++;
        if (dx1 === -dx2 && dy1 === -dy2) uTurns++;
      }
    }
  }

  console.log(`Level ${lvl}: "${level.name}"`);
  console.log(`  Grid: ${level.gridWidth}x${level.gridHeight} (${totalCells} cells)`);
  console.log(`  Snakes: ${level.snakes.length}`);
  console.log(`  Occupancy: ${occupied}/${totalCells} (${((occupied/totalCells)*100).toFixed(1)}%)`);
  console.log(`  90° Turns: ${turns}, Hairpin U-turns: ${uTurns}`);
  console.log(`  Valid: ${val.valid}, Solvable: ${val.valid && val.solution?.length === level.snakes.length}`);
  console.log(`  First 5 snakes to escape in solution: ${val.solution?.slice(0, 5).join(', ')}`);
  console.log(`  Last 3 snakes to escape in solution: ${val.solution?.slice(-3).join(', ')}`);
  console.log('');
}
