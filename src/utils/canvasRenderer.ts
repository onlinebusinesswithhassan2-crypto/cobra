import { Direction, GridPos, Obstacle, SnakeData } from '../types';
import {
  DIR_VECTORS,
  calculateSlitherPositions,
  generateTaperedSnakeMesh,
} from './gameLogic';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  rotation: number;
}

export function parseHex(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return [34, 197, 94];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbStr(r: number, g: number, b: number, a?: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  if (a !== undefined) {
    return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${a})`;
  }
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}

export interface CreatureTones {
  dorsalLight: string;
  dorsalMid: string;
  flankDark: string;
  deepShadow: string;
  crestGlow: string;
  irisColor: string;
}

export function deriveCreatureTones(baseHex: string): CreatureTones {
  const [r, g, b] = parseHex(baseHex);
  const dorsalLight = rgbStr(r + (255 - r) * 0.35, g + (255 - g) * 0.35, b + (255 - b) * 0.35);
  const dorsalMid = rgbStr(r, g, b);
  const flankDark = rgbStr(r * 0.62, g * 0.62, b * 0.62);
  const deepShadow = rgbStr(r * 0.35, g * 0.35, b * 0.35);
  const crestGlow = rgbStr(r + (255 - r) * 0.6, g + (255 - g) * 0.6, b + (255 - b) * 0.6);
  const irisColor = rgbStr(r + (255 - r) * 0.4, g + (255 - g) * 0.4, b + (255 - b) * 0.4);

  return {
    dorsalLight,
    dorsalMid,
    flankDark,
    deepShadow,
    crestGlow,
    irisColor,
  };
}

/**
 * Draws beveled grid cells onto the canvas
 */
export function drawGridCells(
  ctx: CanvasRenderingContext2D,
  gridWidth: number,
  gridHeight: number,
  padding: number,
  cellSize: number
) {
  for (let r = 0; r < gridHeight; r++) {
    for (let c = 0; c < gridWidth; c++) {
      const x = padding + c * cellSize + 1.5;
      const y = padding + r * cellSize + 1.5;
      const w = cellSize - 3;
      const h = cellSize - 3;
      const rad = Math.max(4, Math.min(8, cellSize * 0.14));

      // Draw rounded beveled cell
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, rad);
      ctx.fillStyle = 'rgba(18, 26, 48, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Subtle Inner Cell Accent Dot
      const dotX = padding + c * cellSize + cellSize / 2;
      const dotY = padding + r * cellSize + cellSize / 2;
      const dotR = Math.max(1.2, cellSize * 0.035);

      ctx.beginPath();
      ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.fill();
    }
  }
}

/**
 * Draws obstacle ancient rune pillars
 */
export function drawObstacles(
  ctx: CanvasRenderingContext2D,
  obstacles: Obstacle[],
  padding: number,
  cellSize: number
) {
  for (const obs of obstacles) {
    const cx = padding + obs.x * cellSize + cellSize / 2;
    const cy = padding + obs.y * cellSize + cellSize / 2;
    const r = cellSize * 0.42;

    ctx.save();
    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.roundRect(cx - r, cy - r, r * 2, r * 2, cellSize * 0.2);

    const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Emoji Rune
    ctx.font = `${Math.round(cellSize * 0.42)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🗿', cx, cy);
    ctx.restore();
  }
}

/**
 * Draws a single snake onto the canvas context with full creature lighting,
 * smooth spline body, anime eyes, flicking tongue, spine gems, and animations.
 */
export function drawSnake(
  ctx: CanvasRenderingContext2D,
  snake: SnakeData,
  cellSize: number,
  padding: number,
  options: {
    isHinted?: boolean;
    isBlocked?: boolean;
    isBurning?: boolean;
    isBurnMode?: boolean;
    exitOffset?: number;
    animTime?: number;
    blockedOffset?: { dx: number; dy: number };
  }
) {
  const {
    isHinted = false,
    isBlocked = false,
    isBurning = false,
    isBurnMode = false,
    exitOffset = 0,
    animTime = 0,
    blockedOffset,
  } = options;

  if (snake.state === 'removed' && exitOffset === 0) return;

  const colors = deriveCreatureTones(snake.color);
  const headDir = DIR_VECTORS[snake.direction];
  const perpDir = { px: -headDir.dy, py: headDir.dx };

  // Calculate pixel positions for all segments
  let pixelPositions: { x: number; y: number }[] = [];

  if (exitOffset > 0) {
    const slitherPositions = calculateSlitherPositions(snake, exitOffset);
    pixelPositions = slitherPositions.map((pos) => ({
      x: padding + pos.x * cellSize + cellSize / 2,
      y: padding + pos.y * cellSize + cellSize / 2,
    }));
  } else {
    pixelPositions = snake.cells.map((cell) => ({
      x: padding + cell.x * cellSize + cellSize / 2,
      y: padding + cell.y * cellSize + cellSize / 2,
    }));
  }

  if (pixelPositions.length === 0) return;

  ctx.save();

  // Apply blocked bonk recoil shake
  if (isBlocked && blockedOffset) {
    ctx.translate(blockedOffset.dx, blockedOffset.dy);
  }

  // If burning, fade out and scale down
  if (isBurning) {
    ctx.globalAlpha = 0.5;
  }

  // Hint Golden Aura Pulse
  if (isHinted) {
    const pulse = 0.5 + Math.sin(animTime * 0.006) * 0.4;
    ctx.save();
    ctx.shadowColor = `rgba(251, 191, 36, ${0.4 + pulse * 0.5})`;
    ctx.shadowBlur = 14 + pulse * 10;
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(252, 211, 77, ${0.5 + pulse * 0.4})`;
    for (const p of pixelPositions) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, cellSize * 0.28, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  const currentHeadPixel = pixelPositions[0];

  // 1. Tapered Snake Body Mesh
  const taperedMesh = generateTaperedSnakeMesh(pixelPositions, cellSize);

  // Parse SVG path to Canvas Path2D if supported
  let bodyPath2D: Path2D | null = null;
  if (typeof Path2D !== 'undefined' && taperedMesh.bodyPath) {
    try {
      bodyPath2D = new Path2D(taperedMesh.bodyPath);
    } catch {}
  }

  // 2. Draw Body Drop Shadow
  if (bodyPath2D) {
    ctx.save();
    ctx.translate(0, 2.5);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill(bodyPath2D);
    ctx.restore();
  }

  // 3. Draw Body Linear Gradient
  if (bodyPath2D) {
    ctx.save();
    const tailPixel = pixelPositions[pixelPositions.length - 1];
    const bodyGrad = ctx.createLinearGradient(
      currentHeadPixel.x,
      currentHeadPixel.y,
      tailPixel.x,
      tailPixel.y
    );
    bodyGrad.addColorStop(0, colors.dorsalLight);
    bodyGrad.addColorStop(0.45, colors.dorsalMid);
    bodyGrad.addColorStop(0.85, colors.flankDark);
    bodyGrad.addColorStop(1, colors.deepShadow);

    ctx.fillStyle = bodyGrad;
    ctx.fill(bodyPath2D);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke(bodyPath2D);
    ctx.restore();
  }

  // 4. Draw Spine Highlight Line
  if (typeof Path2D !== 'undefined' && taperedMesh.spineHighlightPath) {
    try {
      const spinePath2D = new Path2D(taperedMesh.spineHighlightPath);
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = cellSize * 0.045;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(spinePath2D);
      ctx.restore();
    } catch {}
  }

  // 5. Draw Luminescent Dorsal Spine Gems
  if (pixelPositions.length > 1) {
    for (let idx = 1; idx < pixelPositions.length; idx++) {
      const pos = pixelPositions[idx];
      const scale = Math.max(0.4, 1 - (idx / pixelPositions.length) * 0.45);
      const r = cellSize * 0.065 * scale;

      ctx.save();
      const gemGrad = ctx.createRadialGradient(
        pos.x - r * 0.3,
        pos.y - r * 0.3,
        r * 0.1,
        pos.x,
        pos.y,
        r
      );
      gemGrad.addColorStop(0, '#ffffff');
      gemGrad.addColorStop(0.45, colors.crestGlow);
      gemGrad.addColorStop(1, colors.flankDark);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = gemGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }
  }

  // 6. Rounded Tail Tip
  if (taperedMesh.tailTip) {
    ctx.beginPath();
    ctx.arc(
      taperedMesh.tailTip.x,
      taperedMesh.tailTip.y,
      Math.max(1, taperedMesh.tailTip.radius),
      0,
      Math.PI * 2
    );
    ctx.fillStyle = colors.flankDark;
    ctx.fill();
  }

  // 7. Chubby Cute Arrow Head
  ctx.save();
  ctx.translate(currentHeadPixel.x, currentHeadPixel.y);

  const angleRad = Math.atan2(headDir.dy, headDir.dx);
  ctx.rotate(angleRad);

  // Local head measurements
  const tipForward = cellSize * 0.42;
  const earBack = -cellSize * 0.28;
  const earWidth = cellSize * 0.36;
  const baseBack = -cellSize * 0.22;
  const baseWidth = cellSize * 0.16;

  // Head Silhouette
  ctx.beginPath();
  ctx.moveTo(tipForward, 0);
  ctx.quadraticCurveTo(cellSize * 0.12, earWidth * 0.85, earBack, earWidth);
  ctx.quadraticCurveTo(earBack * 0.65, earWidth * 0.2, baseBack, baseWidth);
  ctx.lineTo(baseBack, -baseWidth);
  ctx.quadraticCurveTo(earBack * 0.65, -earWidth * 0.2, earBack, -earWidth);
  ctx.quadraticCurveTo(cellSize * 0.12, -earWidth * 0.85, tipForward, 0);
  ctx.closePath();

  // Head Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2.5;

  const headGlow = ctx.createRadialGradient(
    cellSize * 0.05,
    -cellSize * 0.05,
    cellSize * 0.05,
    0,
    0,
    cellSize * 0.45
  );
  headGlow.addColorStop(0, colors.dorsalLight);
  headGlow.addColorStop(0.5, colors.dorsalMid);
  headGlow.addColorStop(0.88, colors.flankDark);
  headGlow.addColorStop(1, colors.deepShadow);

  ctx.fillStyle = headGlow;
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Directional Crystalline Forehead Crest / Horn
  const hornTip = tipForward * 0.85;
  const hornBase = -cellSize * 0.05;
  const hornWidth = cellSize * 0.12;

  ctx.beginPath();
  ctx.moveTo(hornTip, 0);
  ctx.lineTo(hornBase, hornWidth);
  ctx.lineTo(hornBase + cellSize * 0.04, 0);
  ctx.lineTo(hornBase, -hornWidth);
  ctx.closePath();

  const crestGrad = ctx.createLinearGradient(hornBase, 0, hornTip, 0);
  crestGrad.addColorStop(0, colors.dorsalMid);
  crestGrad.addColorStop(0.5, colors.crestGlow);
  crestGrad.addColorStop(1, '#ffffff');

  ctx.fillStyle = crestGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // Rosy Blush Cheeks
  const cheekX = -cellSize * 0.04;
  const cheekY = earWidth * 0.58;
  const cheekR = cellSize * 0.055;

  ctx.fillStyle = 'rgba(251, 113, 133, 0.58)';
  ctx.beginPath();
  ctx.ellipse(cheekX, cheekY, cheekR * 1.2, cheekR * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cheekX, -cheekY, cheekR * 1.2, cheekR * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sweet Smile
  ctx.beginPath();
  ctx.arc(tipForward * 0.35, 0, cellSize * 0.07, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = cellSize * 0.025;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Playful Flicking Tongue
  const tongueExt = 0.35 + Math.sin(animTime * 0.012) * 0.45;
  const tongueLen = cellSize * 0.18 * tongueExt;
  const stemLen = tongueLen * 0.65;
  const forkLen = tongueLen * 0.35;
  const forkSpread = cellSize * 0.04 * tongueExt;

  ctx.save();
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = cellSize * 0.024;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(tipForward, 0);
  ctx.lineTo(tipForward + stemLen, 0);
  ctx.stroke();

  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = cellSize * 0.018;

  ctx.beginPath();
  ctx.moveTo(tipForward + stemLen, 0);
  ctx.lineTo(tipForward + stemLen + forkLen, forkSpread);
  ctx.moveTo(tipForward + stemLen, 0);
  ctx.lineTo(tipForward + stemLen + forkLen, -forkSpread);
  ctx.stroke();
  ctx.restore();

  // Big Expressive Anime Eyes
  const eyeX = cellSize * 0.08;
  const eyeY = cellSize * 0.16;
  const eyeR = cellSize * 0.085;

  // Draw Left & Right Eyes
  [-1, 1].forEach((side) => {
    const ey = eyeY * side;

    // Sclera (White background)
    ctx.beginPath();
    ctx.arc(eyeX, ey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Iris (Creature Iris Color)
    const irisR = eyeR * 0.72;
    const irisX = eyeX + eyeR * 0.18; // Looking forward!
    ctx.beginPath();
    ctx.arc(irisX, ey, irisR, 0, Math.PI * 2);
    ctx.fillStyle = colors.irisColor;
    ctx.fill();

    // Deep Pupil
    const pupilR = irisR * 0.62;
    ctx.beginPath();
    ctx.arc(irisX + eyeR * 0.06, ey, pupilR, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Cute Specular Anime Catchlight (White shine dot)
    ctx.beginPath();
    ctx.arc(irisX - pupilR * 0.35, ey - pupilR * 0.35, pupilR * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Secondary smaller glint
    ctx.beginPath();
    ctx.arc(irisX + pupilR * 0.3, ey + pupilR * 0.3, pupilR * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  });

  ctx.restore(); // Restore from head transform

  // 8. Flame Target Crosshair (Burn Mode)
  if (isBurnMode && !isBurning) {
    ctx.save();
    ctx.translate(currentHeadPixel.x, currentHeadPixel.y);

    const cr = cellSize * 0.46;
    ctx.beginPath();
    ctx.arc(0, 0, cr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 3]);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';

    // 4 crosshair tick marks
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.48, 0);
    ctx.lineTo(-cellSize * 0.22, 0);
    ctx.moveTo(cellSize * 0.22, 0);
    ctx.lineTo(cellSize * 0.48, 0);
    ctx.moveTo(0, -cellSize * 0.48);
    ctx.lineTo(0, -cellSize * 0.22);
    ctx.moveTo(0, cellSize * 0.22);
    ctx.lineTo(0, cellSize * 0.48);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore(); // Restore from snake container
}

/**
 * Fast mathematical hit test:
 * Returns snakeId if touch coordinate (x, y) hit any segment of a snake.
 */
export function hitTestSnake(
  touchX: number,
  touchY: number,
  snakes: SnakeData[],
  padding: number,
  cellSize: number,
  animatedSnakeCells: ReadonlyMap<string, readonly GridPos[]> = new Map()
): string | null {
  let hitSnakeId: string | null = null;
  let closestDistanceSquared = Number.POSITIVE_INFINITY;

  // Resolve overlapping touch tolerance by selecting the nearest visible body.
  for (let sIdx = snakes.length - 1; sIdx >= 0; sIdx--) {
    const snake = snakes[sIdx];
    const animatedCells = animatedSnakeCells.get(snake.id);
    if (snake.state === 'removed' && !animatedCells) continue;
    const cells = animatedCells ?? snake.cells;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const cx = padding + cell.x * cellSize + cellSize / 2;
      const cy = padding + cell.y * cellSize + cellSize / 2;

      const hitRadius = i === 0 ? cellSize * 0.62 : cellSize * 0.55;
      const dx = touchX - cx;
      const dy = touchY - cy;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared <= hitRadius * hitRadius && distanceSquared < closestDistanceSquared) {
        hitSnakeId = snake.id;
        closestDistanceSquared = distanceSquared;
      }
    }
  }

  return hitSnakeId;
}

/**
 * Renders particle effects (sparkle stars & flame embers)
 */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (p.alpha <= 0) continue;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;

    // Draw 4-point sparkle star
    ctx.beginPath();
    const s = p.size;
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(0, 0, s, 0);
    ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.fill();
    ctx.restore();
  }
}
