/**
 * Data-Driven Progressive Difficulty Configuration for Snake Escape
 * Covers Levels 1 to 1000 and endless Infinity mode.
 */

export interface DifficultyConfig {
  levelNum: number;
  gridWidth: number;
  gridHeight: number;
  minSnakeCount: number;
  maxSnakeCount: number;
  minLen: number;
  maxLen: number;
  turnProbability: number;      // Probability of making a 90-degree turn
  uTurnProbability: number;     // Probability of making a hairpin U-turn
  targetOccupancy: number;      // Desired filled ratio (0.35 to 0.92)
  emptyCellPercentage: number;  // 100 - (targetOccupancy * 100)
  maxRetries: number;
}

/**
 * High-quality 32-bit deterministic Pseudo-Random Number Generator (Mulberry32).
 * Ensures that the exact same level number generates the exact same puzzle for all players.
 */
export function createSeededRNG(seed: number): () => number {
  let s = (seed ^ 0x6d2b79f5) | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns tailored data-driven difficulty configuration for any level from 1 to 1000+.
 */
export function getDifficultyConfig(levelNum: number): DifficultyConfig {
  const safeLvl = Math.max(1, levelNum);

  // TIER 1: EASY (Levels 1 - 5) - Novice Sanctuary
  if (safeLvl <= 5) {
    const grid = safeLvl <= 2 ? 5 : 6;
    const minSnakes = 3 + Math.floor((safeLvl - 1) * 0.5); // 3 to 5
    const maxSnakes = minSnakes + 1;
    const targetOccupancy = 0.32 + safeLvl * 0.03; // ~35% - 47%
    return {
      levelNum: safeLvl,
      gridWidth: grid,
      gridHeight: grid,
      minSnakeCount: minSnakes,
      maxSnakeCount: maxSnakes,
      minLen: 2,
      maxLen: 4,
      turnProbability: 0.15 + safeLvl * 0.03, // 0.18 - 0.30
      uTurnProbability: 0.05,
      targetOccupancy,
      emptyCellPercentage: Math.round((1 - targetOccupancy) * 100),
      maxRetries: 30,
    };
  }

  // TIER 2: NORMAL (Levels 6 - 15)
  if (safeLvl <= 15) {
    const progressRatio = (safeLvl - 6) / 9; // 0 to 1
    const gridW = Math.round(7 + progressRatio * 2); // 7 to 9
    const gridH = Math.round(7 + progressRatio * 2); // 7 to 9
    const minSnakes = Math.round(6 + progressRatio * 7); // 6 to 13
    const maxSnakes = minSnakes + 3;
    const targetOccupancy = 0.50 + progressRatio * 0.18; // ~50% to 68%
    return {
      levelNum: safeLvl,
      gridWidth: gridW,
      gridHeight: gridH,
      minSnakeCount: minSnakes,
      maxSnakeCount: maxSnakes,
      minLen: 3,
      maxLen: Math.round(4 + progressRatio * 2), // 4 to 6
      turnProbability: 0.35 + progressRatio * 0.20, // 0.35 to 0.55
      uTurnProbability: 0.10 + progressRatio * 0.10, // 0.10 to 0.20
      targetOccupancy,
      emptyCellPercentage: Math.round((1 - targetOccupancy) * 100),
      maxRetries: 40,
    };
  }

  // TIER 3: HARD (Levels 16 - 30) - Mystic Forest
  // TARGET BENCHMARK: Matches reference labyrinth screenshot for Levels 21–25!
  if (safeLvl <= 30) {
    const progressRatio = (safeLvl - 16) / 14; // 0 to 1
    // Grid sizes: 11x12 up to 12x14 (132 to 168 cells)
    const gridW = Math.min(12, Math.round(11 + progressRatio * 1));
    const gridH = Math.min(14, Math.round(12 + progressRatio * 2));
    // Snake counts: 20 up to 32 snakes!
    const minSnakes = Math.round(18 + progressRatio * 12); // 18 to 30
    const maxSnakes = minSnakes + 5;
    const targetOccupancy = 0.72 + progressRatio * 0.13; // 72% to 85%
    return {
      levelNum: safeLvl,
      gridWidth: gridW,
      gridHeight: gridH,
      minSnakeCount: minSnakes,
      maxSnakeCount: maxSnakes,
      minLen: 3,
      maxLen: Math.round(6 + progressRatio * 2), // 6 to 8
      turnProbability: 0.65 + progressRatio * 0.10, // 0.65 to 0.75
      uTurnProbability: 0.25 + progressRatio * 0.10, // 0.25 to 0.35
      targetOccupancy,
      emptyCellPercentage: Math.round((1 - targetOccupancy) * 100),
      maxRetries: 50,
    };
  }

  // TIER 4: VERY HARD (Levels 31 - 50) - Crystal Caverns
  if (safeLvl <= 50) {
    const progressRatio = (safeLvl - 31) / 19; // 0 to 1
    const gridW = Math.min(13, Math.round(12 + progressRatio * 1));
    const gridH = Math.min(15, Math.round(14 + progressRatio * 1));
    const minSnakes = Math.round(24 + progressRatio * 10); // 24 to 34
    const maxSnakes = minSnakes + 5;
    const targetOccupancy = 0.78 + progressRatio * 0.08; // 78% to 86%
    return {
      levelNum: safeLvl,
      gridWidth: gridW,
      gridHeight: gridH,
      minSnakeCount: minSnakes,
      maxSnakeCount: maxSnakes,
      minLen: 3,
      maxLen: 8,
      turnProbability: 0.72 + progressRatio * 0.05,
      uTurnProbability: 0.30 + progressRatio * 0.08,
      targetOccupancy,
      emptyCellPercentage: Math.round((1 - targetOccupancy) * 100),
      maxRetries: 60,
    };
  }

  // TIER 5: EXTREME (Levels 51 - 100) - Volcanic Caldera & Celestial Spire
  if (safeLvl <= 100) {
    const progressRatio = (safeLvl - 51) / 49; // 0 to 1
    const gridW = Math.min(14, Math.round(13 + progressRatio * 1));
    const gridH = Math.min(16, Math.round(15 + progressRatio * 1));
    const minSnakes = Math.round(30 + progressRatio * 12); // 30 to 42
    const maxSnakes = minSnakes + 6;
    const targetOccupancy = 0.82 + progressRatio * 0.07; // 82% to 89%
    return {
      levelNum: safeLvl,
      gridWidth: gridW,
      gridHeight: gridH,
      minSnakeCount: minSnakes,
      maxSnakeCount: maxSnakes,
      minLen: 3,
      maxLen: 9,
      turnProbability: 0.76,
      uTurnProbability: 0.36,
      targetOccupancy,
      emptyCellPercentage: Math.round((1 - targetOccupancy) * 100),
      maxRetries: 70,
    };
  }

  // TIER 6: GRAND MASTER EXPEDITION (Levels 101 - 1000)
  // Chapters 6 to 50: Obsidian Citadel up to Grand Master Zenith (Level 1000)
  if (safeLvl <= 1000) {
    const progressRatio = Math.min(1, (safeLvl - 101) / 899);
    const gridW = Math.min(16, Math.round(14 + progressRatio * 2));
    const gridH = Math.min(18, Math.round(15 + progressRatio * 3));
    const minSnakes = Math.round(36 + progressRatio * 18); // 36 to 54
    const maxSnakes = minSnakes + 8;
    const targetOccupancy = 0.84 + progressRatio * 0.07; // 84% to 91%
    return {
      levelNum: safeLvl,
      gridWidth: gridW,
      gridHeight: gridH,
      minSnakeCount: minSnakes,
      maxSnakeCount: maxSnakes,
      minLen: 3,
      maxLen: 10,
      turnProbability: 0.78,
      uTurnProbability: 0.38,
      targetOccupancy,
      emptyCellPercentage: Math.round((1 - targetOccupancy) * 100),
      maxRetries: 80,
    };
  }

  // TIER 7: INFINITY MASTER (Levels 1001+)
  const infIndex = safeLvl - 1001;
  const cycle = Math.floor(infIndex / 20);
  const gridW = 15 + (cycle % 3); // 15 to 17
  const gridH = 16 + (cycle % 3); // 16 to 18
  return {
    levelNum: safeLvl,
    gridWidth: gridW,
    gridHeight: gridH,
    minSnakeCount: 40,
    maxSnakeCount: 58,
    minLen: 3,
    maxLen: 10,
    turnProbability: 0.80,
    uTurnProbability: 0.40,
    targetOccupancy: 0.85,
    emptyCellPercentage: 15,
    maxRetries: 80,
  };
}
