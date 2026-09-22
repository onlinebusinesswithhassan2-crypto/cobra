import { getDifficultyConfig, createSeededRNG } from '../src/utils/difficultyConfig';
import { DIR_VECTORS } from '../src/utils/gameLogic';

const id = 21;
const diff = getDifficultyConfig(id);
const { gridWidth, gridHeight, minSnakeCount, maxSnakeCount, minLen, maxLen, turnProbability, uTurnProbability, targetOccupancy } = diff;

const totalCells = gridWidth * gridHeight;
const targetFilled = Math.floor(totalCells * targetOccupancy);

const rng = createSeededRNG(id * 7919);
const occupied = new Map<string, string>();
const snakes: any[] = [];
const exitRayMap = new Map<string, Set<string>>();

const DIRS: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];

function rotateLeft(dir: { dx: number; dy: number }) {
  if (dir.dx === 1) return { dx: 0, dy: -1 };
  if (dir.dx === -1) return { dx: 0, dy: 1 };
  if (dir.dy === 1) return { dx: 1, dy: 0 };
  return { dx: -1, dy: 0 };
}
function rotateRight(dir: { dx: number; dy: number }) {
  if (dir.dx === 1) return { dx: 0, dy: 1 };
  if (dir.dx === -1) return { dx: 0, dy: -1 };
  if (dir.dy === 1) return { dx: 1, dy: 0 };
  return { dx: 1, dy: 0 };
}

let consecutiveFails = 0;
while (snakes.length < maxSnakeCount && occupied.size < targetFilled && consecutiveFails < 50) {
  const candidateList: any[] = [];
  const dirShuffled = [...DIRS].sort(() => rng() - 0.5);

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (occupied.has(`${x},${y}`)) continue;
      for (const dir of dirShuffled) {
        const { dx, dy } = DIR_VECTORS[dir];
        let clear = true;
        let rx = x + dx;
        let ry = y + dy;
        while (rx >= 0 && rx < gridWidth && ry >= 0 && ry < gridHeight) {
          if (occupied.has(`${rx},${ry}`)) {
            clear = false;
            break;
          }
          rx += dx;
          ry += dy;
        }
        if (clear) candidateList.push({ x, y, dir });
      }
    }
  }

  if (candidateList.length === 0) {
    consecutiveFails++;
    // console.log(`Attempt failed: candidateList is 0. Placed so far: ${snakes.length}, occupied: ${occupied.size}/${totalCells}`);
    continue;
  }

  candidateList.sort(() => rng() - 0.5);
  let placed = false;
  const targetLen = Math.floor(minLen + rng() * (maxLen - minLen + 1));

  for (const cand of candidateList) {
    const { x: hx, y: hy, dir } = cand;
    const { dx, dy } = DIR_VECTORS[dir];

    const exitRay = new Set<string>();
    let rx = hx + dx;
    let ry = hy + dy;
    while (rx >= 0 && rx < gridWidth && ry >= 0 && ry < gridHeight) {
      exitRay.add(`${rx},${ry}`);
      rx += dx;
      ry += dy;
    }

    const neckOptions = [
      { x: hx - dx, y: hy - dy, dir: { dx: -dx, dy: -dy } },
      { x: hx - dy, y: hy + dx, dir: { dx: -dy, dy: dx } },
      { x: hx + dy, y: hy - dx, dir: { dx: dy, dy: -dx } },
    ].filter(p =>
      p.x >= 0 && p.x < gridWidth && p.y >= 0 && p.y < gridHeight &&
      !occupied.has(`${p.x},${p.y}`) && !exitRay.has(`${p.x},${p.y}`)
    );

    if (neckOptions.length === 0) continue;

    const neck = neckOptions[Math.floor(rng() * neckOptions.length)];
    const cells = [{ x: hx, y: hy }, { x: neck.x, y: neck.y }];
    const currentCells = new Set([`${hx},${hy}`, `${neck.x},${neck.y}`]);
    let curr = { x: neck.x, y: neck.y };
    let currentGrowthDir = neck.dir;

    for (let seg = 2; seg < targetLen; seg++) {
      const straight = { x: curr.x + currentGrowthDir.dx, y: curr.y + currentGrowthDir.dy, dir: currentGrowthDir, type: 'straight' };
      const leftDir = rotateLeft(currentGrowthDir);
      const turnL = { x: curr.x + leftDir.dx, y: curr.y + leftDir.dy, dir: leftDir, type: 'turn' };
      const rightDir = rotateRight(currentGrowthDir);
      const turnR = { x: curr.x + rightDir.dx, y: curr.y + rightDir.dy, dir: rightDir, type: 'turn' };

      const validOptions = [straight, turnL, turnR].filter(p =>
        p.x >= 0 && p.x < gridWidth && p.y >= 0 && p.y < gridHeight &&
        !occupied.has(`${p.x},${p.y}`) &&
        !currentCells.has(`${p.x},${p.y}`) &&
        !exitRay.has(`${p.x},${p.y}`)
      );

      if (validOptions.length === 0) break;
      const next = validOptions[Math.floor(rng() * validOptions.length)];
      cells.push({ x: next.x, y: next.y });
      currentCells.add(`${next.x},${next.y}`);
      curr = { x: next.x, y: next.y };
      currentGrowthDir = next.dir;
    }

    if (cells.length >= 2) {
      const sId = `s_${snakes.length}`;
      cells.forEach(c => occupied.set(`${c.x},${c.y}`, sId));
      snakes.push({ id: sId, direction: dir, cells });
      placed = true;
      consecutiveFails = 0;
      break;
    }
  }

  if (!placed) consecutiveFails++;
}

console.log(`Finished generation: placed ${snakes.length} snakes, occupied ${occupied.size}/${totalCells} (${((occupied.size/totalCells)*100).toFixed(1)}%)`);
console.log(`Min required: ${minSnakeCount}, Max: ${maxSnakeCount}`);
