import { LevelConfig, SnakeData } from '../types';
import { DIR_VECTORS, isSnakePathClear } from './gameLogic';

export function validateAndSolveLevel(level: LevelConfig): { valid: boolean; errors: string[]; solution?: string[] } {
  const errors: string[] = [];
  const { gridWidth, gridHeight, snakes } = level;

  const occupied = new Map<string, string>();

  for (const snake of snakes) {
    const { id, cells, direction } = snake;
    const { dx, dy } = DIR_VECTORS[direction];

    if (cells.length === 0) {
      errors.push(`Snake ${id} has no cells`);
      return { valid: false, errors };
    }

    // Check bounds & adjacency
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (c.x < 0 || c.x >= gridWidth || c.y < 0 || c.y >= gridHeight) {
        errors.push(`Snake ${id} cell ${i} (${c.x},${c.y}) is out of bounds (${gridWidth}x${gridHeight})`);
      }

      const key = `${c.x},${c.y}`;
      if (occupied.has(key)) {
        errors.push(`Cell collision at (${c.x},${c.y}) between ${occupied.get(key)} and ${id}`);
      } else {
        occupied.set(key, id);
      }

      if (i > 0) {
        const prev = cells[i - 1];
        const dist = Math.abs(c.x - prev.x) + Math.abs(c.y - prev.y);
        if (dist !== 1) {
          errors.push(`Snake ${id} has non-adjacent jump between cell ${i - 1} and cell ${i}`);
        }
      }
    }

    // Check head neck facing direction
    if (cells.length > 1) {
      const h = cells[0];
      const neck = cells[1];
      if (neck.x === h.x + dx && neck.y === h.y + dy) {
        errors.push(`Snake ${id} head is facing directly into its own neck!`);
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Fast Solvability Simulation using mutable cell occupancy map
  const activeSnakes = new Map<string, SnakeData>();
  snakes.forEach((s) => activeSnakes.set(s.id, s));
  const currentOccupied = new Map(occupied);
  const solution: string[] = [];

  while (activeSnakes.size > 0) {
    let progressed = false;

    for (const [sId, s] of activeSnakes.entries()) {
      const head = s.cells[0];
      const { dx, dy } = DIR_VECTORS[s.direction];

      // Check ray in facing direction to grid boundary
      let rx = head.x + dx;
      let ry = head.y + dy;
      let isClear = true;

      while (rx >= 0 && rx < gridWidth && ry >= 0 && ry < gridHeight) {
        const blocker = currentOccupied.get(`${rx},${ry}`);
        if (blocker && blocker !== sId) {
          isClear = false;
          break;
        }
        rx += dx;
        ry += dy;
      }

      if (isClear) {
        solution.push(sId);
        // Remove snake cells from current occupancy
        s.cells.forEach((c) => currentOccupied.delete(`${c.x},${c.y}`));
        activeSnakes.delete(sId);
        progressed = true;
        break;
      }
    }

    if (!progressed) {
      errors.push(`Level ${level.id} (${level.name}) is DEADLOCKED! Remaining unescapable snakes: ${Array.from(activeSnakes.keys()).join(', ')}`);
      return { valid: false, errors, solution };
    }
  }

  return { valid: true, errors: [], solution };
}
