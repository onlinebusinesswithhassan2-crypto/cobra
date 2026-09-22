import { Direction, GridPos, Obstacle, SnakeData } from '../types';

export const DIR_VECTORS: Record<Direction, { dx: number; dy: number; angle: number }> = {
  up: { dx: 0, dy: -1, angle: -90 },
  down: { dx: 0, dy: 1, angle: 90 },
  left: { dx: -1, dy: 0, angle: 180 },
  right: { dx: 1, dy: 0, angle: 0 },
};

export interface SlitherSegmentPos {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  waveOffset?: number;
}

export interface TaperedMeshResult {
  bodyPath: string;
  shadowPath: string;
  spineHighlightPath: string;
  lateralShadingPathLeft: string;
  lateralShadingPathRight: string;
  progressiveSegments: {
    x: number;
    y: number;
    radius: number;
    index: number;
    fraction: number;
    dirX: number;
    dirY: number;
  }[];
  saddleMarkings: {
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    angle: number;
    opacity: number;
  }[];
  tailTip: { x: number; y: number; dirX: number; dirY: number; radius: number };
}

/**
 * Samples Catmull-Rom spline at parameter t (0 <= t <= points.length - 1)
 */
function sampleSpline(
  points: { x: number; y: number }[],
  t: number
): { x: number; y: number; tx: number; ty: number } {
  const n = points.length;
  if (n <= 1) {
    return { x: points[0]?.x || 0, y: points[0]?.y || 0, tx: 1, ty: 0 };
  }
  const clampedT = Math.max(0, Math.min(n - 1 - 0.0001, t));
  const i0 = Math.floor(clampedT);
  const frac = clampedT - i0;

  const p0 = points[Math.max(0, i0 - 1)];
  const p1 = points[i0];
  const p2 = points[Math.min(n - 1, i0 + 1)];
  const p3 = points[Math.min(n - 1, i0 + 2)];

  const tension = 0.45;
  const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
  const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;
  const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
  const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;

  // Cubic Bezier evaluation
  const u = 1 - frac;
  const x = u * u * u * p1.x + 3 * u * u * frac * cp1x + 3 * u * frac * frac * cp2x + frac * frac * frac * p2.x;
  const y = u * u * u * p1.y + 3 * u * u * frac * cp1y + 3 * u * frac * frac * cp2y + frac * frac * frac * p2.y;

  // Derivative for tangent vector
  const dxdt = 3 * u * u * (cp1x - p1.x) + 6 * u * frac * (cp2x - cp1x) + 3 * frac * frac * (p2.x - cp2x);
  const dydt = 3 * u * u * (cp1y - p1.y) + 6 * u * frac * (cp2y - cp1y) + 3 * frac * frac * (p2.y - cp2y);
  const len = Math.hypot(dxdt, dydt) || 1;

  return {
    x,
    y,
    tx: dxdt / len,
    ty: dydt / len,
  };
}

/**
 * Calculates smooth continuous realistic tapered snake mesh with progressive anatomical segments.
 * Organic snake anatomy:
 * - Natural head connection & neck
 * - Sleek muscular torso
 * - Progressively smaller segments from head toward the tail
 * - Delicate, realistic tail tip
 */
export function generateTaperedSnakeMesh(
  points: { x: number; y: number }[],
  cellSize: number
): TaperedMeshResult {
  if (!points || points.length === 0) {
    return {
      bodyPath: '',
      shadowPath: '',
      spineHighlightPath: '',
      lateralShadingPathLeft: '',
      lateralShadingPathRight: '',
      progressiveSegments: [],
      saddleMarkings: [],
      tailTip: { x: 0, y: 0, dirX: 1, dirY: 0, radius: cellSize * 0.08 },
    };
  }

  const numSegments = points.length;
  // High-performance sample count for organic, seamless curvature
  const sampleCount = Math.max(16, numSegments * 6);

  const leftPoints: { x: number; y: number }[] = [];
  const rightPoints: { x: number; y: number }[] = [];
  const spinePoints: { x: number; y: number }[] = [];
  const saddleMarkings: {
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    angle: number;
    opacity: number;
  }[] = [];

  let lastTailTip = {
    x: points[points.length - 1].x,
    y: points[points.length - 1].y,
    dirX: 1,
    dirY: 0,
    radius: cellSize * 0.07,
  };

  // Radius calculation function: sleek and barik arrow body with smooth rounded tail
  const getRadiusAtFraction = (fraction: number): number => {
    if (fraction < 0.08) {
      // Smooth connection to head
      return cellSize * 0.165;
    } else if (fraction < 0.75) {
      // Sleek barik body (clean uniform line like the arrow maze)
      return cellSize * 0.155;
    } else {
      // Gentle slender taper toward tail tip
      const t = (fraction - 0.75) / 0.25;
      return cellSize * (0.155 - t * 0.075);
    }
  };

  for (let i = 0; i <= sampleCount; i++) {
    const fraction = i / sampleCount; // 0 (head) to 1 (tail)
    const splineT = fraction * (numSegments - 1);
    const { x, y, tx, ty } = sampleSpline(points, splineT);

    // Normal vector perpendicular to tangent
    const nx = -ty;
    const ny = tx;

    const r = getRadiusAtFraction(fraction);

    spinePoints.push({ x, y });
    leftPoints.push({ x: x + nx * r, y: y + ny * r });
    rightPoints.push({ x: x - nx * r, y: y - ny * r });

    if (i === sampleCount) {
      lastTailTip = { x, y, dirX: tx, dirY: ty, radius: r };
    }
  }

  // Construct closed tapered ribbon outline
  let bodyPath = `M ${leftPoints[0].x.toFixed(2)} ${leftPoints[0].y.toFixed(2)}`;

  for (let i = 1; i < leftPoints.length; i++) {
    bodyPath += ` L ${leftPoints[i].x.toFixed(2)} ${leftPoints[i].y.toFixed(2)}`;
  }

  // Rounded tail tip cap
  const tailP = spinePoints[spinePoints.length - 1];
  const tailRadius = lastTailTip.radius;
  const tailTx = lastTailTip.dirX;
  const tailTy = lastTailTip.dirY;
  const tipX = tailP.x + tailTx * tailRadius * 1.1;
  const tipY = tailP.y + tailTy * tailRadius * 1.1;
  const lastRight = rightPoints[rightPoints.length - 1];

  bodyPath += ` Q ${tipX.toFixed(2)} ${tipY.toFixed(2)} ${lastRight.x.toFixed(2)} ${lastRight.y.toFixed(2)}`;

  // Travel back along right edge
  for (let i = rightPoints.length - 2; i >= 0; i--) {
    bodyPath += ` L ${rightPoints[i].x.toFixed(2)} ${rightPoints[i].y.toFixed(2)}`;
  }

  // Close back to leftPoints[0]
  bodyPath += ` Z`;

  // Spine highlight path (subtle dorsal ridge highlight)
  let spineHighlightPath = '';
  if (spinePoints.length > 2) {
    const startIdx = Math.floor(sampleCount * 0.04);
    const endIdx = Math.floor(sampleCount * 0.88);
    spineHighlightPath = `M ${spinePoints[startIdx].x.toFixed(2)} ${spinePoints[startIdx].y.toFixed(2)}`;
    for (let i = startIdx + 1; i <= endIdx; i++) {
      spineHighlightPath += ` L ${spinePoints[i].x.toFixed(2)} ${spinePoints[i].y.toFixed(2)}`;
    }
  }

  // Progressive muscular body segments for layered organic depth
  const progressiveSegments: TaperedMeshResult['progressiveSegments'] = [];
  for (let idx = 0; idx < points.length; idx++) {
    const fraction = idx / Math.max(1, points.length - 1);
    const splineT = idx;
    const { x, y, tx, ty } = sampleSpline(points, splineT);
    const radius = getRadiusAtFraction(fraction);

    progressiveSegments.push({
      x,
      y,
      radius,
      index: idx,
      fraction,
      dirX: tx,
      dirY: ty,
    });
  }

  // Subtle organic reptilian saddles / blotches along the spine
  // Progressively smaller and more spaced out toward the tail
  const numSaddles = Math.max(3, numSegments * 2 + 1);
  for (let s = 1; s < numSaddles; s++) {
    const fraction = s / numSaddles;
    const splineT = fraction * (numSegments - 1);
    const { x, y, tx, ty } = sampleSpline(points, splineT);
    const angle = (Math.atan2(ty, tx) * 180) / Math.PI;
    const currentR = getRadiusAtFraction(fraction);

    // Saddle dimensions scale organically with local body radius
    const radiusX = currentR * 0.78;
    const radiusY = currentR * 0.48;
    const opacity = Math.max(0.12, 0.32 * (1 - fraction * 0.45));

    saddleMarkings.push({
      x,
      y,
      radiusX,
      radiusY,
      angle,
      opacity,
    });
  }

  return {
    bodyPath,
    shadowPath: bodyPath,
    spineHighlightPath,
    lateralShadingPathLeft: '',
    lateralShadingPathRight: '',
    progressiveSegments,
    saddleMarkings,
    tailTip: lastTailTip,
  };
}

/**
 * Generates an SVG path string for a smooth Catmull-Rom / Bezier spline through an array of 2D points.
 * Creates continuous, organic curving for snake bodies instead of rigid polygonal edges.
 */
export function generateSmoothSplinePath(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  // Tension parameter (0.5 is standard Catmull-Rom)
  const tension = 0.45;
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Control point 1
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;

    // Control point 2
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return path;
}

/**
 * Calculates continuous positions for all snake segments as the snake slithers
 * forward along its own body curve and exits in its facing direction.
 *
 * Implements real serpentine lateral undulation (transverse traveling sine wave)
 * so the snake realistically wiggles and curves as it slithers forward.
 */
export function calculateSlitherPositions(
  snake: SnakeData,
  exitOffset: number
): SlitherSegmentPos[] {
  const cells = snake.cells;
  if (!cells || cells.length === 0) return [];
  const head = cells[0];
  const { dx, dy } = DIR_VECTORS[snake.direction];

  return cells.map((_, i) => {
    // s is the distance (in grid units) of this segment relative to the head's starting point
    const s = exitOffset - i;

    // Real serpentine lateral undulation wave (lehrana / lateral wave)
    let waveOffset = 0;
    if (exitOffset > 0) {
      // Traveling transverse wave along body
      const wavePhase = exitOffset * 4.6 - i * 1.05;
      // Body amplitude envelope (smooth rise, peak in mid-body, whip at tail)
      const envelope = Math.sin((Math.PI * Math.min(cells.length, i + 0.8)) / (cells.length + 0.8));
      const amp = 0.12 * envelope;
      waveOffset = Math.sin(wavePhase) * amp;
    }

    let posX: number;
    let posY: number;
    let dirX: number;
    let dirY: number;

    if (s >= 0) {
      // Segment has moved past the initial head location into the forward exit path
      posX = head.x + dx * s;
      posY = head.y + dy * s;
      dirX = dx;
      dirY = dy;
    } else {
      // Segment is still following the snake's original body curve
      const u = -s; // distance backwards along body from head (u >= 0)
      const index0 = Math.floor(u);
      const frac = u - index0;
      const index1 = index0 + 1;

      if (index1 < cells.length) {
        const p0 = cells[index0];
        const p1 = cells[index1];
        posX = p0.x + (p1.x - p0.x) * frac;
        posY = p0.y + (p1.y - p0.y) * frac;
        dirX = p0.x - p1.x;
        dirY = p0.y - p1.y;
      } else if (index0 < cells.length) {
        const p0 = cells[index0];
        const pPrev = cells[index0 - 1] || head;
        const tailDx = p0.x - pPrev.x;
        const tailDy = p0.y - pPrev.y;
        posX = p0.x + tailDx * frac;
        posY = p0.y + tailDy * frac;
        dirX = pPrev.x - p0.x;
        dirY = pPrev.y - p0.y;
      } else {
        // Beyond tail
        const lastCell = cells[cells.length - 1];
        const secondLast = cells[cells.length - 2] || head;
        const extra = u - (cells.length - 1);
        const tailDx = lastCell.x - secondLast.x;
        const tailDy = lastCell.y - secondLast.y;
        posX = lastCell.x + tailDx * extra;
        posY = lastCell.y + tailDy * extra;
        dirX = secondLast.x - lastCell.x;
        dirY = secondLast.y - lastCell.y;
      }
    }

    // Apply lateral displacement perpendicular to segment direction
    const len = Math.hypot(dirX, dirY) || 1;
    const nx = -dirY / len;
    const ny = dirX / len;

    return {
      x: posX + nx * waveOffset,
      y: posY + ny * waveOffset,
      dirX,
      dirY,
      waveOffset,
    };
  });
}

/**
 * Checks whether a snake is already in a straight line extending backwards from its head.
 */
export function isAlreadyStraight(snake: SnakeData): boolean {
  if (snake.cells.length <= 1) return true;
  const head = snake.cells[0];
  const { dx, dy } = DIR_VECTORS[snake.direction];

  for (let i = 1; i < snake.cells.length; i++) {
    const expectedX = head.x - dx * i;
    const expectedY = head.y - dy * i;
    if (snake.cells[i].x !== expectedX || snake.cells[i].y !== expectedY) {
      return false;
    }
  }
  return true;
}

/**
 * Calculates the straight target grid positions for each segment of the snake.
 * Head stays in place, segments 1..n-1 align in a straight line behind the head.
 */
export function calculateStraightTargets(snake: SnakeData): GridPos[] {
  const head = snake.cells[0];
  const { dx, dy } = DIR_VECTORS[snake.direction];
  return snake.cells.map((_, i) => ({
    x: head.x - dx * i,
    y: head.y - dy * i,
  }));
}

/**
 * Checks whether the exit trajectory in the direction of the snake's head is clear of all
 * other active snakes and obstacles until leaving the grid boundary.
 */
export function isSnakePathClear(
  snake: SnakeData,
  allSnakes: SnakeData[],
  obstacles: Obstacle[] = [],
  gridWidth: number = 8,
  gridHeight: number = 8
): { isClear: boolean; blockingEntity?: string } {
  if (!snake || snake.cells.length === 0) return { isClear: false };

  const head = snake.cells[0];
  const { dx, dy } = DIR_VECTORS[snake.direction];

  // Map of occupied cells by other active snakes
  const occupiedByOther = new Map<string, string>(); // "x,y" -> snakeId
  allSnakes.forEach((other) => {
    if (other.id !== snake.id && other.state !== 'removed') {
      other.cells.forEach((cell) => {
        occupiedByOther.set(`${cell.x},${cell.y}`, other.id);
      });
    }
  });

  // Obstacles map
  const obstacleMap = new Set<string>();
  obstacles.forEach((obs) => {
    obstacleMap.add(`${obs.x},${obs.y}`);
  });

  // Check ray in facing direction from head+1 to board edge
  let currX = head.x + dx;
  let currY = head.y + dy;

  while (currX >= 0 && currX < gridWidth && currY >= 0 && currY < gridHeight) {
    const key = `${currX},${currY}`;
    if (occupiedByOther.has(key)) {
      return { isClear: false, blockingEntity: occupiedByOther.get(key) };
    }
    if (obstacleMap.has(key)) {
      return { isClear: false, blockingEntity: 'obstacle' };
    }
    currX += dx;
    currY += dy;
  }

  return { isClear: true };
}

/**
 * Finds an unblocked snake that can currently escape, or null if all are blocked.
 */
export function findFirstClearSnake(
  allSnakes: SnakeData[],
  obstacles: Obstacle[] = [],
  gridWidth: number = 8,
  gridHeight: number = 8
): SnakeData | null {
  const activeSnakes = allSnakes.filter((s) => s.state !== 'removed');
  for (const snake of activeSnakes) {
    const check = isSnakePathClear(snake, allSnakes, obstacles, gridWidth, gridHeight);
    if (check.isClear) {
      return snake;
    }
  }
  return null;
}

/**
 * Calculates exit distance in grid units for a snake so that the tail leaves the board.
 */
export function calculateExitDistance(
  snake: SnakeData,
  gridWidth: number,
  gridHeight: number
): number {
  const head = snake.cells[0];
  const { dx, dy } = DIR_VECTORS[snake.direction];
  const length = snake.cells.length;

  let stepsToEdge = 0;
  if (dx === 1) {
    stepsToEdge = gridWidth - head.x;
  } else if (dx === -1) {
    stepsToEdge = head.x + 1;
  } else if (dy === 1) {
    stepsToEdge = gridHeight - head.y;
  } else if (dy === -1) {
    stepsToEdge = head.y + 1;
  }

  return stepsToEdge + length + 1.5;
}

/**
 * Smooth cubic bezier ease: cubic-bezier(.22, .8, .25, 1)
 */
export function easeCubicBezier(t: number): number {
  // Approximate standard smooth out curve
  const ts = t * t;
  const tc = ts * t;
  return -2 * tc + 3 * ts; // Smoothstep fallback
}

/**
 * Custom parameterized cubic-bezier(.22, .8, .25, 1) solver
 */
export function customEase(t: number): number {
  // Fast and accurate approximation of cubic-bezier(0.22, 0.8, 0.25, 1.0)
  return 1 - Math.pow(1 - t, 3.2);
}
