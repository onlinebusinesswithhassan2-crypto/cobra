import fs from 'fs';
import { generateGuaranteedLevel } from '../src/utils/proceduralGenerator';
import { validateAndSolveLevel } from '../src/utils/levelValidator';
import { LevelConfig } from '../src/types';

// Chapter Themes & Level Names
const CHAPTER_NAMES = [
  'Novice Sanctuary',
  'Mystic Forest',
  'Crystal Caverns',
  'Volcanic Caldera',
  'Celestial Spire',
];

const LEVEL_NAME_PREFIXES = [
  // 1-20: Novice
  'First Slither', 'Green Meadow', 'Twisting Creek', 'Clover Patch', 'Sunlit Burrow',
  'Gentle Breeze', 'Mossy Stone', 'Quiet Pond', 'Pine Needles', 'Whispering Glade',
  'Stone Path', 'Coiled Stream', 'Birch Grove', 'Bramble Thicket', 'Hidden Hollow',
  'Fern Valley', 'River Bend', 'Dewdrop Trail', 'Verdant Maze', 'Sanctuary Gate',
  // 21-40: Mystic Forest
  'Emerald Shadow', 'Ancient Roots', 'Mushroom Canopy', 'Will-o-Wisp', 'Twisted Willow',
  'Enchanted Hollow', 'Foggy Crossing', 'Ivy Labyrinth', 'Mossy Archway', 'Twilight Glade',
  'Serpent Shrine', 'Moonlit Thicket', 'Runestone Passage', 'Bramble Knot', 'Faerie Ring',
  'Timber Twist', 'Deep Woods', 'Viper Crossing', 'Canopy Coil', 'Forest Heart',
  // 41-60: Crystal Caverns
  'Glittering Chasm', 'Amethyst Ridge', 'Stalactite Maze', 'Prism Pathway', 'Luminescent Depth',
  'Glowstone Hollow', 'Echo Chamber', 'Geode Matrix', 'Subterranean Twist', 'Quartz Corridor',
  'Sapphire Vault', 'Crystal Coil', 'Abyssal Chasm', 'Reflective Pool', 'Gemstone Knot',
  'Deep Spire', 'Glimmer Labyrinth', 'Diamond Reach', 'Jeweled Serpent', 'Cavern Core',
  // 61-80: Volcanic Caldera
  'Molten Crest', 'Ash Valley', 'Obsidian Trench', 'Basalt Labyrinth', 'Magma Current',
  'Smoldering Knot', 'Ember Ridge', 'Lava Nexus', 'Pumice Pathway', 'Cinder Core',
  'Firebrand Coil', 'Inferno Slither', 'Volcanic Rift', 'Blazing Tangle', 'Scorched Earth',
  'Pyroclast Maze', 'Ignited Pass', 'Charred Crypt', 'Dragon Breath', 'Caldera Peak',
  // 81-100: Celestial Spire
  'Skyward Ascent', 'Cloud Spire', 'Starlight Path', 'Astral Knot', 'Solar Flare',
  'Nebula Coil', 'Constellation Maze', 'Cosmic Serpent', 'Zenith Passage', 'Aether Stream',
  'Stardust Labyrinth', 'Eclipse Twist', 'Aurora Nexus', 'Supernova Coil', 'Infinity Gateway',
  'Vortex Spine', 'Celestial Grid', 'Mythic Ouroboros', 'Dragon Apex', 'Master of the 100 Snakes'
];

function getDifficulty(levelId: number) {
  if (levelId <= 5) {
    return { grid: 5, count: 3 + Math.floor(levelId / 3), minLen: 3, maxLen: 5 };
  } else if (levelId <= 10) {
    return { grid: 6, count: 4 + Math.floor((levelId - 5) / 3), minLen: 3, maxLen: 6 };
  } else if (levelId <= 20) {
    return { grid: 6, count: 5 + Math.floor((levelId - 10) / 4), minLen: 4, maxLen: 6 };
  } else if (levelId <= 35) {
    return { grid: 7, count: 6 + Math.floor((levelId - 20) / 4), minLen: 4, maxLen: 7 };
  } else if (levelId <= 50) {
    return { grid: 8, count: 7 + Math.floor((levelId - 35) / 4), minLen: 4, maxLen: 8 };
  } else if (levelId <= 65) {
    return { grid: 8, count: 8 + Math.floor((levelId - 50) / 4), minLen: 4, maxLen: 8 };
  } else if (levelId <= 80) {
    return { grid: 9, count: 10 + Math.floor((levelId - 65) / 4), minLen: 4, maxLen: 9 };
  } else if (levelId <= 90) {
    return { grid: 9, count: 11 + Math.floor((levelId - 80) / 3), minLen: 4, maxLen: 9 };
  } else {
    return { grid: 10, count: 13 + Math.floor((levelId - 90) / 3), minLen: 5, maxLen: 9 };
  }
}

console.log('Generating 100 perfectly solvable and verified levels...');

const levels: LevelConfig[] = [];

for (let i = 1; i <= 100; i++) {
  const diff = getDifficulty(i);
  const name = LEVEL_NAME_PREFIXES[i - 1] || `Sanctuary Stage #${i}`;
  
  let success = false;
  let currentTargetCount = diff.count;
  for (let retry = 0; retry < 100; retry++) {
    const lvl = generateGuaranteedLevel(i, name, diff.grid, diff.grid, currentTargetCount, diff.minLen, diff.maxLen);
    const sol = validateAndSolveLevel(lvl);
    if (sol.valid && lvl.snakes.length >= 3) {
      levels.push(lvl);
      success = true;
      break;
    }
    if (retry % 25 === 0 && currentTargetCount > 4) {
      currentTargetCount--;
    }
  }

  if (!success) {
    console.error(`Failed to generate level ${i}`);
    process.exit(1);
  }

  if (i % 10 === 0) {
    console.log(`✓ Generated & verified levels 1 to ${i}`);
  }
}

console.log('All 100 levels successfully generated and verified!');

// Write to levels.ts
const fileContent = `import { LevelConfig } from '../types';
import { generateGuaranteedLevel } from '../utils/proceduralGenerator';

export const TOTAL_GAME_LEVELS = 100;

export const CHAPTER_CONFIG = [
  { id: 1, name: 'Novice Sanctuary', range: [1, 20], color: '#10b981', icon: '🌱' },
  { id: 2, name: 'Mystic Forest', range: [21, 40], color: '#06b6d4', icon: '🌲' },
  { id: 3, name: 'Crystal Caverns', range: [41, 60], color: '#8b5cf6', icon: '💎' },
  { id: 4, name: 'Volcanic Caldera', range: [61, 80], color: '#f97316', icon: '🌋' },
  { id: 5, name: 'Celestial Spire', range: [81, 100], color: '#eab308', icon: '👑' },
];

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

export const LEVELS: LevelConfig[] = ${JSON.stringify(levels, null, 2)};

export function generateProceduralLevel(levelNum: number): LevelConfig {
  const grid = Math.min(11, 8 + Math.floor(levelNum / 5));
  const snakeCount = Math.min(18, 8 + Math.floor(levelNum / 3));
  return generateGuaranteedLevel(
    levelNum,
    \`Hardcore Labyrinth #\${levelNum}\`,
    grid,
    grid,
    snakeCount,
    5,
    Math.min(11, 6 + Math.floor(levelNum / 6))
  );
}
`;

fs.writeFileSync('./src/data/levels.ts', fileContent, 'utf-8');
console.log('levels.ts updated with all 100 levels!');
