import { DifficultyConfig, getDifficultyConfig } from '../src/utils/difficultyConfig';

function calculateRealisticSnakeCount(diff: DifficultyConfig) {
  const total = diff.gridWidth * diff.gridHeight;
  const targetCells = total * diff.targetOccupancy;
  const avgLen = (diff.minLen + diff.maxLen) / 2;
  const expectedSnakes = Math.floor(targetCells / avgLen);
  return {
    total,
    targetCells: Math.round(targetCells),
    avgLen,
    expectedSnakes,
    configuredMin: diff.minSnakeCount,
    configuredMax: diff.maxSnakeCount,
  };
}

const lvls = [1, 5, 10, 15, 21, 25, 30, 40, 50, 75, 100, 250, 500, 1000];
for (const l of lvls) {
  const d = getDifficultyConfig(l);
  const r = calculateRealisticSnakeCount(d);
  console.log(`Lvl ${l}: Grid ${d.gridWidth}x${d.gridHeight}=${r.total} cells. Target=${r.targetCells} (${(d.targetOccupancy*100).toFixed(0)}%). AvgLen=${r.avgLen}. Fits ~${r.expectedSnakes} snakes. Config has [${r.configuredMin} - ${r.configuredMax}]`);
}
