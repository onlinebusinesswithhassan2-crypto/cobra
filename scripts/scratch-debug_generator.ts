import { getDifficultyConfig, createSeededRNG } from '../src/utils/difficultyConfig';
import { generateGuaranteedLevel } from '../src/utils/proceduralGenerator';

const lvl = 21;
const diff = getDifficultyConfig(lvl);
console.log('Diff config for lvl', lvl, diff);

const level = generateGuaranteedLevel(lvl, 'Test 21');
console.log('Generated level 21 snakes:', level.snakes.length);
console.log('Grid:', level.gridWidth, 'x', level.gridHeight);
level.snakes.forEach((s, idx) => {
  console.log(`Snake ${idx}: len=${s.cells.length}, dir=${s.direction}, head=(${s.cells[0].x},${s.cells[0].y})`);
});
