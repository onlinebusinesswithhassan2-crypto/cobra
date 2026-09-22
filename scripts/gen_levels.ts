import { generateGuaranteedLevel } from '../src/utils/proceduralGenerator';
import { validateAndSolveLevel } from '../src/utils/levelValidator';
import fs from 'fs';

const levelMeta = [
  { id: 1, name: 'Intro Labyrinth', grid: 7, count: 6, minLen: 4, maxLen: 7 },
  { id: 2, name: 'Serpent Weave', grid: 8, count: 7, minLen: 4, maxLen: 8 },
  { id: 3, name: 'The Great Coil', grid: 8, count: 8, minLen: 4, maxLen: 8 },
  { id: 4, name: 'Anaconda Alley', grid: 9, count: 9, minLen: 5, maxLen: 9 },
  { id: 5, name: "HARDCORE: Medusa's Maze", grid: 9, count: 10, minLen: 5, maxLen: 9 },
  { id: 6, name: 'HARDCORE: Gordian Coil', grid: 10, count: 11, minLen: 5, maxLen: 10 },
  { id: 7, name: 'HARDCORE: Ouroboros Circuit', grid: 10, count: 12, minLen: 5, maxLen: 10 },
  { id: 8, name: "HARDCORE: Dragon's Den", grid: 10, count: 13, minLen: 5, maxLen: 10 },
  { id: 9, name: "HARDCORE: Leviathan's Nest", grid: 11, count: 14, minLen: 5, maxLen: 10 },
  { id: 10, name: 'HARDCORE: Titan Matrix', grid: 11, count: 15, minLen: 5, maxLen: 10 },
  { id: 11, name: 'HARDCORE: Grand Labyrinth Master', grid: 12, count: 16, minLen: 5, maxLen: 11 },
  { id: 12, name: 'HARDCORE: Infinite Serpent Nexus', grid: 12, count: 18, minLen: 5, maxLen: 11 },
];

const generatedLevels = levelMeta.map((meta) => {
  const lvl = generateGuaranteedLevel(
    meta.id,
    meta.name,
    meta.grid,
    meta.grid,
    meta.count,
    meta.minLen,
    meta.maxLen
  );
  const val = validateAndSolveLevel(lvl);
  if (!val.valid) {
    console.error(`Level ${meta.id} failed validation:`, val.errors);
  } else {
    console.log(`Level ${meta.id} (${lvl.name}) OK - ${lvl.snakes.length} snakes in ${lvl.gridWidth}x${lvl.gridHeight} grid.`);
  }
  return lvl;
});

const fileContent = `import { LevelConfig } from '../types';
import { generateGuaranteedLevel } from '../utils/proceduralGenerator';

export const COLOR_PALETTE = {
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#8b5cf6',
  violet: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  brown: '#854d0e',
  darkBlue: '#1e3a8a',
  deepTeal: '#0f766e',
};

export const LEVELS: LevelConfig[] = ${JSON.stringify(generatedLevels, null, 2)};

export function generateProceduralLevel(levelNum: number): LevelConfig {
  const grid = Math.min(12, 8 + Math.floor(levelNum / 3));
  const snakeCount = Math.min(18, 7 + Math.floor(levelNum / 2));
  return generateGuaranteedLevel(
    levelNum,
    \`Hardcore Labyrinth #\${levelNum}\`,
    grid,
    grid,
    snakeCount,
    5,
    Math.min(11, 6 + Math.floor(levelNum / 4))
  );
}
`;

fs.writeFileSync('./src/data/levels.ts', fileContent, 'utf-8');
console.log('Successfully written updated levels to src/data/levels.ts');
