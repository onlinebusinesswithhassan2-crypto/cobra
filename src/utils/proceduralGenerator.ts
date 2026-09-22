import { LevelConfig, SnakeData } from '../types';
import { DIR_VECTORS } from './gameLogic';
import { validateAndSolveLevel } from './levelValidator';
import { DifficultyConfig, getDifficultyConfig, createSeededRNG } from './difficultyConfig';

export const SNAKE_COLOR_PALETTE = [
  '#22c55e', // Vibrant Green
  '#f97316', // Bright Orange
  '#ec4899', // Sweet Pink
  '#3b82f6', // Electric Blue
  '#eab308', // Sunny Yellow
  '#8b5cf6', // Purple Lavender
  '#ef4444', // Crimson Red
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#a855f7', // Violet
  '#14b8a6', // Teal
  '#f59e0b', // Amber
];

const DIRS: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];

function rotateLeft(dir: { dx: number; dy: number }): { dx: number; dy: number } {
  if (dir.dx === 1) return { dx: 0, dy: -1 };
  if (dir.dx === -1) return { dx: 0, dy: 1 };
  if (dir.dy === 1) return { dx: 1, dy: 0 };
  return { dx: -1, dy: 0 };
}

function rotateRight(dir: { dx: number; dy: number }): { dx: number; dy: number } {
  if (dir.dx === 1) return { dx: 0, dy: 1 };
  if (dir.dx === -1) return { dx: 0, dy: -1 };
  if (dir.dy === 1) return { dx: -1, dy: 0 };
  return { dx: 1, dy: 0 };
}

export function getGridDimensionForLevel(levelNum: number): number {
  return getDifficultyConfig(levelNum).gridWidth;
}

// In-memory cache for generated levels
const levelCache = new Map<number, LevelConfig>();

/**
 * Generates an authentic, data-driven Snake Escape puzzle:
 * - Each snake has a head, body, directional arrow, 90° turns, U-bends, and distinct color.
 * - 100% Solvability guaranteed by reverse-escape construction and pre-show verification.
 * - Fully deterministic: Seeded with levelNum so players always see consistent levels.
 */
export function generateGuaranteedLevel(
  id: number,
  name: string,
  diffOrGrid?: DifficultyConfig | number,
  _gridHeight?: number,
  _requestedSnakeCount?: number,
  _minLen?: number,
  _maxLen?: number
): LevelConfig {
  if (levelCache.has(id)) {
    return levelCache.get(id)!;
  }

  const diff: DifficultyConfig =
    typeof diffOrGrid === 'object' && diffOrGrid !== null
      ? (diffOrGrid as DifficultyConfig)
      : getDifficultyConfig(id);

  const {
    gridWidth,
    gridHeight,
    minSnakeCount,
    maxSnakeCount,
    minLen,
    maxLen,
    turnProbability,
    uTurnProbability,
    targetOccupancy,
    maxRetries,
  } = diff;

  const totalCells = gridWidth * gridHeight;
  const targetFilled = Math.floor(totalCells * targetOccupancy);

  let bestLevel: LevelConfig | null = null;
  let bestOccupied = 0;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const rng = createSeededRNG(id * 7919 + attempt * 1013);
    const occupied = new Map<string, string>(); // "x,y" -> snakeId
    const snakes: SnakeData[] = [];

    // Track exit rays of already placed snakes: "x,y" -> Set<snakeId>
    const exitRayMap = new Map<string, Set<string>>();

    function addExitRay(sId: string, hx: number, hy: number, dir: 'up' | 'down' | 'left' | 'right') {
      const { dx, dy } = DIR_VECTORS[dir];
      let rx = hx + dx;
      let ry = hy + dy;
      while (rx >= 0 && rx < gridWidth && ry >= 0 && ry < gridHeight) {
        const k = `${rx},${ry}`;
        if (!exitRayMap.has(k)) exitRayMap.set(k, new Set());
        exitRayMap.get(k)!.add(sId);
        rx += dx;
        ry += dy;
      }
    }

    let snakeIndex = 0;
    let consecutiveFails = 0;

    // Phase 1: Place primary snakes using reverse-escape construction
    while (snakes.length < maxSnakeCount && occupied.size < targetFilled && consecutiveFails < 50) {
      const candidateList: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' }[] = [];
      const dirShuffled = [...DIRS].sort(() => rng() - 0.5);

      for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
          if (occupied.has(`${x},${y}`)) continue;

          for (const dir of dirShuffled) {
            const { dx, dy } = DIR_VECTORS[dir];
            let clearOfEarlierSnakes = true;
            let rx = x + dx;
            let ry = y + dy;

            while (rx >= 0 && rx < gridWidth && ry >= 0 && ry < gridHeight) {
              if (occupied.has(`${rx},${ry}`)) {
                clearOfEarlierSnakes = false;
                break;
              }
              rx += dx;
              ry += dy;
            }

            if (clearOfEarlierSnakes) {
              candidateList.push({ x, y, dir });
            }
          }
        }
      }

      if (candidateList.length === 0) {
        consecutiveFails++;
        continue;
      }

      candidateList.sort(() => rng() - 0.5);
      let placed = false;

      // Desired length for this snake
      const targetLen = Math.floor(minLen + rng() * (maxLen - minLen + 1));

      for (const cand of candidateList) {
        const { x: hx, y: hy, dir } = cand;
        const { dx, dy } = DIR_VECTORS[dir];

        // Snake's own exit ray must not be occupied by its own body
        const exitRay = new Set<string>();
        let rx = hx + dx;
        let ry = hy + dy;
        while (rx >= 0 && rx < gridWidth && ry >= 0 && ry < gridHeight) {
          exitRay.add(`${rx},${ry}`);
          rx += dx;
          ry += dy;
        }

        // Available neck positions (cannot be on exit ray, cannot be occupied)
        const neckOptions = [
          { x: hx - dx, y: hy - dy, dir: { dx: -dx, dy: -dy } }, // straight back
          { x: hx - dy, y: hy + dx, dir: { dx: -dy, dy: dx } }, // 90° turn
          { x: hx + dy, y: hy - dx, dir: { dx: dy, dy: -dx } }, // 90° turn
        ].filter(
          (p) =>
            p.x >= 0 &&
            p.x < gridWidth &&
            p.y >= 0 &&
            p.y < gridHeight &&
            !occupied.has(`${p.x},${p.y}`) &&
            !exitRay.has(`${p.x},${p.y}`)
        );

        if (neckOptions.length === 0) continue;

        const neck = neckOptions[Math.floor(rng() * neckOptions.length)];
        const cells: { x: number; y: number }[] = [{ x: hx, y: hy }, { x: neck.x, y: neck.y }];
        const currentCells = new Set<string>([`${hx},${hy}`, `${neck.x},${neck.y}`]);
        let curr = { x: neck.x, y: neck.y };
        let currentGrowthDir = neck.dir;
        let lastWasTurn = false;

        for (let seg = 2; seg < targetLen; seg++) {
          const straight = {
            x: curr.x + currentGrowthDir.dx,
            y: curr.y + currentGrowthDir.dy,
            dir: currentGrowthDir,
            type: 'straight' as const,
          };
          const leftDir = rotateLeft(currentGrowthDir);
          const turnL = {
            x: curr.x + leftDir.dx,
            y: curr.y + leftDir.dy,
            dir: leftDir,
            type: 'turn' as const,
          };
          const rightDir = rotateRight(currentGrowthDir);
          const turnR = {
            x: curr.x + rightDir.dx,
            y: curr.y + rightDir.dy,
            dir: rightDir,
            type: 'turn' as const,
          };

          const validOptions = [straight, turnL, turnR].filter(
            (p) =>
              p.x >= 0 &&
              p.x < gridWidth &&
              p.y >= 0 &&
              p.y < gridHeight &&
              !occupied.has(`${p.x},${p.y}`) &&
              !currentCells.has(`${p.x},${p.y}`) &&
              !exitRay.has(`${p.x},${p.y}`)
          );

          if (validOptions.length === 0) break;

          let chosen: typeof validOptions[0];
          const roll = rng();

          if (lastWasTurn && roll < uTurnProbability) {
            // Hairpin U-turn (two consecutive 90° turns)
            const uTurnChoice = validOptions.find((o) => o.type === 'turn');
            chosen = uTurnChoice || validOptions[0];
          } else if (roll < turnProbability) {
            const turnChoices = validOptions.filter((o) => o.type === 'turn');
            chosen =
              turnChoices.length > 0
                ? turnChoices[Math.floor(rng() * turnChoices.length)]
                : validOptions[0];
          } else {
            const straightChoice = validOptions.find((o) => o.type === 'straight');
            chosen = straightChoice || validOptions[Math.floor(rng() * validOptions.length)];
          }

          cells.push({ x: chosen.x, y: chosen.y });
          currentCells.add(`${chosen.x},${chosen.y}`);
          curr = { x: chosen.x, y: chosen.y };
          lastWasTurn = chosen.type === 'turn';
          currentGrowthDir = chosen.dir;
        }

        if (cells.length >= 2) {
          const sId = `s_${id}_${snakeIndex}`;
          cells.forEach((c) => occupied.set(`${c.x},${c.y}`, sId));
          addExitRay(sId, hx, hy, dir);

          const snakeColor = SNAKE_COLOR_PALETTE[snakeIndex % SNAKE_COLOR_PALETTE.length];
          snakes.push({
            id: sId,
            color: snakeColor,
            direction: dir,
            cells,
          });

          snakeIndex++;
          placed = true;
          consecutiveFails = 0;
          break;
        }
      }

      if (!placed) consecutiveFails++;
    }

    // Phase 2: For dense boards (Level 16+), expand tails into dead-end pockets
    if (diff.levelNum >= 16) {
      for (let t = 0; t < 3; t++) {
        for (let i = snakes.length - 1; i >= 0; i--) {
          const s = snakes[i];
          const tail = s.cells[s.cells.length - 1];
          const neighbors = [
            { x: tail.x + 1, y: tail.y },
            { x: tail.x - 1, y: tail.y },
            { x: tail.x, y: tail.y + 1 },
            { x: tail.x, y: tail.y - 1 },
          ].filter(
            (p) =>
              p.x >= 0 &&
              p.x < gridWidth &&
              p.y >= 0 &&
              p.y < gridHeight &&
              !occupied.has(`${p.x},${p.y}`)
          );

          for (const n of neighbors) {
            const k = `${n.x},${n.y}`;
            let blockedEarlier = false;
            const blockers = exitRayMap.get(k);
            if (blockers) {
              for (let j = 0; j < i; j++) {
                if (blockers.has(snakes[j].id)) {
                  blockedEarlier = true;
                  break;
                }
              }
            }

            if (!blockedEarlier) {
              s.cells.push(n);
              occupied.set(k, s.id);
              break;
            }
          }
        }
      }
    }

    const acceptableMin = Math.max(3, Math.floor(minSnakeCount * 0.75));
    if (snakes.length >= acceptableMin) {
      const candidateLevel: LevelConfig = {
        id,
        name,
        gridWidth,
        gridHeight,
        targetMoves: snakes.length,
        maxMoves: snakes.length + Math.max(3, Math.floor(snakes.length * 0.35)),
        snakes,
      };

      const val = validateAndSolveLevel(candidateLevel);
      if (val.valid) {
        if (snakes.length >= minSnakeCount && occupied.size >= targetFilled) {
          levelCache.set(id, candidateLevel);
          return candidateLevel;
        }
        if (occupied.size > bestOccupied) {
          bestOccupied = occupied.size;
          bestLevel = candidateLevel;
        }
      }
    }
  }

  if (bestLevel) {
    levelCache.set(id, bestLevel);
    return bestLevel;
  }

  // Fallback guaranteed solvable level
  const fallback: LevelConfig = {
    id,
    name,
    gridWidth: diff.gridWidth,
    gridHeight: diff.gridHeight,
    targetMoves: 4,
    maxMoves: 8,
    snakes: [
      {
        id: `s_${id}_0`,
        color: '#22c55e',
        direction: 'left',
        cells: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
      },
      {
        id: `s_${id}_1`,
        color: '#f97316',
        direction: 'right',
        cells: [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }],
      },
      {
        id: `s_${id}_2`,
        color: '#ec4899',
        direction: 'up',
        cells: [{ x: 2, y: 0 }, { x: 2, y: -1 }].filter((p) => p.y >= 0),
      },
    ],
  };

  levelCache.set(id, fallback);
  return fallback;
}
