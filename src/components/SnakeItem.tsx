import React, { useMemo } from 'react';
import { Direction, GridPos, SnakeData } from '../types';
import {
  DIR_VECTORS,
  calculateSlitherPositions,
  generateSmoothSplinePath,
  generateTaperedSnakeMesh,
} from '../utils/gameLogic';

interface SnakeItemProps {
  snake: SnakeData;
  cellSize: number;
  padding: number;
  isHinted?: boolean;
  isBlockedAnim?: boolean;
  isBurnMode?: boolean;
  isBurning?: boolean;
  straightenProgress?: number;
  exitOffset?: number; // in cell units along direction
  onTap: (snakeId: string) => void;
  disabled?: boolean;
}

// Utility for natural creature color gradient derivation
function parseHex(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return [34, 197, 94];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbStr(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}

function deriveCreatureTones(baseHex: string) {
  const [r, g, b] = parseHex(baseHex);

  // Subtle dorsal light (soft sun reflection along upper back)
  const dorsalLight = rgbStr(r + (255 - r) * 0.35, g + (255 - g) * 0.35, b + (255 - b) * 0.35);
  // Rich midtone
  const dorsalMid = rgbStr(r, g, b);
  // Flank shadow
  const flankDark = rgbStr(r * 0.62, g * 0.62, b * 0.62);
  // Deep underside contour
  const deepShadow = rgbStr(r * 0.35, g * 0.35, b * 0.35);
  // Crystal crest accent
  const crestGlow = rgbStr(r + (255 - r) * 0.6, g + (255 - g) * 0.6, b + (255 - b) * 0.6);
  // Iris ring color
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

const SnakeItemComponent: React.FC<SnakeItemProps> = ({
  snake,
  cellSize,
  padding,
  isHinted = false,
  isBlockedAnim = false,
  isBurnMode = false,
  isBurning = false,
  exitOffset = 0,
  onTap,
  disabled = false,
}) => {
  const { dx, dy, angle } = DIR_VECTORS[snake.direction];

  // Calculate continuous segment positions with lateral undulation along the body track
  const slitherSegments = useMemo(() => {
    return calculateSlitherPositions(snake, exitOffset);
  }, [snake, exitOffset]);

  // Convert grid positions to pixel centers
  const pixelPositions = useMemo(() => {
    return slitherSegments.map((seg) => ({
      x: padding + seg.x * cellSize + cellSize / 2,
      y: padding + seg.y * cellSize + cellSize / 2,
    }));
  }, [slitherSegments, cellSize, padding]);

  const currentHeadPixel = pixelPositions[0] || {
    x: padding + snake.cells[0].x * cellSize + cellSize / 2,
    y: padding + snake.cells[0].y * cellSize + cellSize / 2,
  };

  // Calculate mathematically continuous tapered body mesh, progressive segments & dorsal markings
  const taperedMesh = useMemo(() => {
    return generateTaperedSnakeMesh(pixelPositions, cellSize);
  }, [pixelPositions, cellSize]);

  // Dynamic head facing direction during slither movement
  const headDir = useMemo(() => {
    const seg = slitherSegments[0];
    if (!seg) return { dx, dy };
    const len = Math.hypot(seg.dirX, seg.dirY) || 1;
    return {
      dx: seg.dirX / len,
      dy: seg.dirY / len,
    };
  }, [slitherSegments, dx, dy]);

  // Perpendicular vector for lateral anatomy
  const perpDir = useMemo(() => {
    return {
      px: -headDir.dy,
      py: headDir.dx,
    };
  }, [headDir]);

  // Subtle creature color gradient shades
  const colors = useMemo(() => {
    const base = isBlockedAnim ? '#ef4444' : snake.color;
    return deriveCreatureTones(base);
  }, [snake.color, isBlockedAnim]);

  // Cute Chubby Arrow Head Contour
  const cuteArrowHeadPath = useMemo(() => {
    const hx = currentHeadPixel.x;
    const hy = currentHeadPixel.y;
    const hdx = headDir.dx;
    const hdy = headDir.dy;
    const px = perpDir.px;
    const py = perpDir.py;

    // 1. Neck attachment
    const neckX = hx - hdx * (cellSize * 0.22);
    const neckY = hy - hdy * (cellSize * 0.22);
    const neckLeft = { x: neckX + px * (cellSize * 0.165), y: neckY + py * (cellSize * 0.165) };
    const neckRight = { x: neckX - px * (cellSize * 0.165), y: neckY - py * (cellSize * 0.165) };

    // 2. Chubby arrow base corners (flared out rounded arrow wings)
    const wingBaseX = hx - hdx * (cellSize * 0.14);
    const wingBaseY = hy - hdy * (cellSize * 0.14);
    const wingLeft = { x: wingBaseX + px * (cellSize * 0.38), y: wingBaseY + py * (cellSize * 0.38) };
    const wingRight = { x: wingBaseX - px * (cellSize * 0.38), y: wingBaseY - py * (cellSize * 0.38) };

    // 3. Cute rounded cheek curve
    const cheekX = hx + hdx * (cellSize * 0.08);
    const cheekY = hy + hdy * (cellSize * 0.08);
    const cheekLeft = { x: cheekX + px * (cellSize * 0.33), y: cheekY + py * (cellSize * 0.33) };
    const cheekRight = { x: cheekX - px * (cellSize * 0.33), y: cheekY - py * (cellSize * 0.33) };

    // 4. Tapering snout toward arrow tip
    const snoutX = hx + hdx * (cellSize * 0.32);
    const snoutY = hy + hdy * (cellSize * 0.32);
    const snoutLeft = { x: snoutX + px * (cellSize * 0.16), y: snoutY + py * (cellSize * 0.16) };
    const snoutRight = { x: snoutX - px * (cellSize * 0.16), y: snoutY - py * (cellSize * 0.16) };

    // 5. Rounded arrow tip (front of head)
    const tipX = hx + hdx * (cellSize * 0.48);
    const tipY = hy + hdy * (cellSize * 0.48);

    return `M ${neckLeft.x.toFixed(2)} ${neckLeft.y.toFixed(2)}
      Q ${neckLeft.x.toFixed(2)} ${neckLeft.y.toFixed(2)} ${wingLeft.x.toFixed(2)} ${wingLeft.y.toFixed(2)}
      Q ${cheekLeft.x.toFixed(2)} ${cheekLeft.y.toFixed(2)} ${snoutLeft.x.toFixed(2)} ${snoutLeft.y.toFixed(2)}
      Q ${tipX.toFixed(2)} ${tipY.toFixed(2)} ${snoutRight.x.toFixed(2)} ${snoutRight.y.toFixed(2)}
      Q ${cheekRight.x.toFixed(2)} ${cheekRight.y.toFixed(2)} ${wingRight.x.toFixed(2)} ${wingRight.y.toFixed(2)}
      Q ${neckRight.x.toFixed(2)} ${neckRight.y.toFixed(2)} ${neckRight.x.toFixed(2)} ${neckRight.y.toFixed(2)}
      Z`;
  }, [currentHeadPixel, headDir, perpDir, cellSize]);

  // Crystalline Directional Forehead Crest
  const crystalCrestPoints = useMemo(() => {
    const hx = currentHeadPixel.x;
    const hy = currentHeadPixel.y;
    const hdx = headDir.dx;
    const hdy = headDir.dy;
    const px = perpDir.px;
    const py = perpDir.py;

    const tip = { x: hx + hdx * (cellSize * 0.36), y: hy + hdy * (cellSize * 0.36) };
    const leftWing = { x: hx + hdx * (cellSize * 0.12) + px * (cellSize * 0.13), y: hy + hdy * (cellSize * 0.12) + py * (cellSize * 0.13) };
    const rightWing = { x: hx + hdx * (cellSize * 0.12) - px * (cellSize * 0.13), y: hy + hdy * (cellSize * 0.12) - py * (cellSize * 0.13) };
    const baseCenter = { x: hx - hdx * (cellSize * 0.02), y: hy - hdy * (cellSize * 0.02) };

    return `${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${leftWing.x.toFixed(2)},${leftWing.y.toFixed(2)} ${baseCenter.x.toFixed(2)},${baseCenter.y.toFixed(2)} ${rightWing.x.toFixed(2)},${rightWing.y.toFixed(2)}`;
  }, [currentHeadPixel, headDir, perpDir, cellSize]);

  // Expressive Eyes with Sparkles
  const cuteEyes = useMemo(() => {
    const forwardOffset = cellSize * 0.06;
    const lateralOffset = cellSize * 0.17;

    const baseCenterX = currentHeadPixel.x + headDir.dx * forwardOffset;
    const baseCenterY = currentHeadPixel.y + headDir.dy * forwardOffset;

    const headAngleDeg = (Math.atan2(headDir.dy, headDir.dx) * 180) / Math.PI;

    return {
      left: {
        x: baseCenterX + perpDir.px * lateralOffset,
        y: baseCenterY + perpDir.py * lateralOffset,
        angle: headAngleDeg,
      },
      right: {
        x: baseCenterX - perpDir.px * lateralOffset,
        y: baseCenterY - perpDir.py * lateralOffset,
        angle: headAngleDeg,
      },
      eyeRadius: cellSize * 0.088,
      pupilRadius: cellSize * 0.072,
      irisRadius: cellSize * 0.058,
      mainSparkleRadius: cellSize * 0.028,
      subSparkleRadius: cellSize * 0.015,
    };
  }, [currentHeadPixel, headDir, perpDir, cellSize]);

  // Cute Rosy Blush Cheeks
  const blushCheeks = useMemo(() => {
    const forwardOffset = cellSize * 0.02;
    const lateralOffset = cellSize * 0.27;

    const baseCenterX = currentHeadPixel.x + headDir.dx * forwardOffset;
    const baseCenterY = currentHeadPixel.y + headDir.dy * forwardOffset;

    return {
      left: {
        x: baseCenterX + perpDir.px * lateralOffset,
        y: baseCenterY + perpDir.py * lateralOffset,
      },
      right: {
        x: baseCenterX - perpDir.px * lateralOffset,
        y: baseCenterY - perpDir.py * lateralOffset,
      },
      radiusX: cellSize * 0.054,
      radiusY: cellSize * 0.038,
    };
  }, [currentHeadPixel, headDir, perpDir, cellSize]);

  // Cute Smile Mouth
  const cuteMouth = useMemo(() => {
    const mouthCenterX = currentHeadPixel.x + headDir.dx * (cellSize * 0.28);
    const mouthCenterY = currentHeadPixel.y + headDir.dy * (cellSize * 0.28);
    const mouthSpread = cellSize * 0.075;
    const mouthDepth = cellSize * 0.04;

    const mLeft = {
      x: mouthCenterX + perpDir.px * mouthSpread - headDir.dx * (cellSize * 0.02),
      y: mouthCenterY + perpDir.py * mouthSpread - headDir.dy * (cellSize * 0.02),
    };
    const mRight = {
      x: mouthCenterX - perpDir.px * mouthSpread - headDir.dx * (cellSize * 0.02),
      y: mouthCenterY - perpDir.py * mouthSpread - headDir.dy * (cellSize * 0.02),
    };
    const mMid = {
      x: mouthCenterX + headDir.dx * mouthDepth,
      y: mouthCenterY + headDir.dy * mouthDepth,
    };

    return `M ${mLeft.x.toFixed(2)} ${mLeft.y.toFixed(2)} Q ${mMid.x.toFixed(2)} ${mMid.y.toFixed(2)} ${mRight.x.toFixed(2)} ${mRight.y.toFixed(2)}`;
  }, [currentHeadPixel, headDir, perpDir, cellSize]);

  // Playful Flicking Tongue
  const tongueConfig = useMemo(() => {
    const base = {
      x: currentHeadPixel.x + headDir.dx * (cellSize * 0.44),
      y: currentHeadPixel.y + headDir.dy * (cellSize * 0.44),
    };

    let extension = 1;
    let lateralFlutter = 0;
    if (exitOffset > 0) {
      const cycle = Math.sin(exitOffset * 18);
      extension = cycle > 0 ? 0.9 + cycle * 0.5 : 0.2;
      lateralFlutter = Math.sin(exitOffset * 36) * (cellSize * 0.02);
    }

    const stemLen = cellSize * 0.14 * extension;
    const forkLen = cellSize * 0.06 * extension;
    const forkSpread = cellSize * 0.035 * extension;

    const stemEnd = {
      x: base.x + headDir.dx * stemLen + perpDir.px * lateralFlutter,
      y: base.y + headDir.dy * stemLen + perpDir.py * lateralFlutter,
    };

    return {
      base,
      stemEnd,
      forkLeft: {
        x: stemEnd.x + headDir.dx * forkLen + perpDir.px * forkSpread,
        y: stemEnd.y + headDir.dy * forkLen + perpDir.py * forkSpread,
      },
      forkRight: {
        x: stemEnd.x + headDir.dx * forkLen - perpDir.px * forkSpread,
        y: stemEnd.y + headDir.dy * forkLen - perpDir.py * forkSpread,
      },
      opacity: exitOffset > 0 ? (extension > 0.3 ? 1 : 0.3) : 1,
    };
  }, [currentHeadPixel, headDir, perpDir, cellSize, exitOffset]);

  // Luminescent Spine Gems along body positions
  const spineGems = useMemo(() => {
    if (pixelPositions.length < 2) return [];
    return pixelPositions.slice(1).map((pos, idx) => {
      const scale = Math.max(0.4, 1 - (idx / pixelPositions.length) * 0.45);
      return {
        x: pos.x,
        y: pos.y,
        r: cellSize * 0.065 * scale,
        scale,
      };
    });
  }, [pixelPositions, cellSize]);

  // Determine shake / blocked / burn styling
  const shakeClass = isBlockedAnim ? 'animate-[blocked-shake_0.35s_ease-in-out]' : '';
  const hintClass = isHinted ? 'animate-hint-pulse' : '';
  const burnClass = isBurning
    ? 'animate-flame-burn pointer-events-none'
    : isBurnMode
    ? 'animate-burn-target hover:brightness-125'
    : '';

  return (
    <g
      id={`snake-${snake.id}`}
      style={{ willChange: 'transform' }}
      className={`cursor-pointer select-none ${shakeClass} ${hintClass} ${burnClass}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onTap(snake.id);
        }
      }}
    >
      <defs>
        {/* Creature Body Linear Gradient */}
        <linearGradient
          id={`skin-grad-${snake.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={colors.dorsalLight} stopOpacity="0.95" />
          <stop offset="45%" stopColor={colors.dorsalMid} stopOpacity="1" />
          <stop offset="85%" stopColor={colors.flankDark} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.deepShadow} stopOpacity="1" />
        </linearGradient>

        {/* Head 3D Specular Highlight */}
        <radialGradient
          id={`head-glow-${snake.id}`}
          cx="44%"
          cy="38%"
          r="65%"
        >
          <stop offset="0%" stopColor={colors.dorsalLight} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.dorsalMid} stopOpacity="1" />
          <stop offset="88%" stopColor={colors.flankDark} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.deepShadow} stopOpacity="1" />
        </radialGradient>

        {/* Crystal Crest Gradient */}
        <linearGradient
          id={`crest-grad-${snake.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor={colors.crestGlow} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.dorsalMid} stopOpacity="0.85" />
        </linearGradient>

        {/* Dorsal Spine Jewel Radial */}
        <radialGradient
          id={`gem-glow-${snake.id}`}
          cx="35%"
          cy="35%"
          r="65%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor={colors.crestGlow} stopOpacity="0.85" />
          <stop offset="100%" stopColor={colors.flankDark} stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {/* Ambient Drop Shadow under snake body */}
      {taperedMesh.bodyPath && (
        <path
          d={taperedMesh.bodyPath}
          fill="rgba(0, 0, 0, 0.38)"
          transform="translate(0, 2.5)"
        />
      )}

      {/* Shadow under Cute Arrow Head */}
      {cuteArrowHeadPath && (
        <path
          d={cuteArrowHeadPath}
          fill="rgba(0, 0, 0, 0.42)"
          transform="translate(0, 3)"
        />
      )}

      {/* Main Continuous Snake Body Mesh */}
      {taperedMesh.bodyPath && (
        <path
          d={taperedMesh.bodyPath}
          fill={`url(#skin-grad-${snake.id})`}
          stroke="rgba(0, 0, 0, 0.25)"
          strokeWidth="0.8"
          className="transition-colors duration-150"
        />
      )}

      {/* Dorsal Spine Highlight Line */}
      {taperedMesh.spineHighlightPath && (
        <path
          d={taperedMesh.spineHighlightPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={cellSize * 0.045}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Luminescent Dorsal Spine Gems */}
      {spineGems.map((gem, gIdx) => (
        <circle
          key={`gem-${gIdx}`}
          cx={gem.x}
          cy={gem.y}
          r={gem.r}
          fill={`url(#gem-glow-${snake.id})`}
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="0.6"
        />
      ))}

      {/* Slender Tail Tip */}
      {taperedMesh.tailTip && (
        <circle
          cx={taperedMesh.tailTip.x}
          cy={taperedMesh.tailTip.y}
          r={taperedMesh.tailTip.radius}
          fill={colors.flankDark}
        />
      )}

      {/* Chubby Cute Snake Head */}
      <g>
        {/* Main Arrow Head Silhouette */}
        <path
          d={cuteArrowHeadPath}
          fill={`url(#head-glow-${snake.id})`}
          stroke="rgba(0, 0, 0, 0.28)"
          strokeWidth="0.9"
          className="transition-colors duration-150"
        />

        {/* Directional Crystalline Forehead Crest / Horn */}
        <polygon
          points={crystalCrestPoints}
          fill={`url(#crest-grad-${snake.id})`}
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="0.7"
          className="animate-crest-glow"
          style={{ color: colors.crestGlow }}
        />

        {/* Rosy Blush Cheeks */}
        <g transform={`translate(${blushCheeks.left.x.toFixed(2)}, ${blushCheeks.left.y.toFixed(2)}) rotate(${((Math.atan2(headDir.dy, headDir.dx) * 180) / Math.PI).toFixed(1)})`}>
          <ellipse
            cx={0}
            cy={0}
            rx={blushCheeks.radiusX}
            ry={blushCheeks.radiusY}
            fill="#fb7185"
            opacity="0.58"
          />
        </g>
        <g transform={`translate(${blushCheeks.right.x.toFixed(2)}, ${blushCheeks.right.y.toFixed(2)}) rotate(${((Math.atan2(headDir.dy, headDir.dx) * 180) / Math.PI).toFixed(1)})`}>
          <ellipse
            cx={0}
            cy={0}
            rx={blushCheeks.radiusX}
            ry={blushCheeks.radiusY}
            fill="#fb7185"
            opacity="0.58"
          />
        </g>

        {/* Sweet Smile */}
        <path
          d={cuteMouth}
          fill="none"
          stroke="rgba(0, 0, 0, 0.45)"
          strokeWidth={cellSize * 0.025}
          strokeLinecap="round"
        />

        {/* Playful Flicking Tongue */}
        <g opacity={tongueConfig.opacity}>
          <line
            x1={tongueConfig.base.x}
            y1={tongueConfig.base.y}
            x2={tongueConfig.stemEnd.x}
            y2={tongueConfig.stemEnd.y}
            stroke="#f43f5e"
            strokeWidth={cellSize * 0.024}
            strokeLinecap="round"
          />
          <line
            x1={tongueConfig.stemEnd.x}
            y1={tongueConfig.stemEnd.y}
            x2={tongueConfig.forkLeft.x}
            y2={tongueConfig.forkLeft.y}
            stroke="#e11d48"
            strokeWidth={cellSize * 0.018}
            strokeLinecap="round"
          />
          <line
            x1={tongueConfig.stemEnd.x}
            y1={tongueConfig.stemEnd.y}
            x2={tongueConfig.forkRight.x}
            y2={tongueConfig.forkRight.y}
            stroke="#e11d48"
            strokeWidth={cellSize * 0.018}
            strokeLinecap="round"
          />
        </g>

        {/* Big Expressive Anime Eyes with Multi-Layer Irises (Centered at local 0,0) */}
        {/* Left Eye */}
        <g
          transform={`translate(${cuteEyes.left.x.toFixed(2)}, ${cuteEyes.left.y.toFixed(2)}) rotate(${cuteEyes.left.angle.toFixed(1)})`}
        >
          <g className="animate-snake-blink">
            <circle
              cx={0}
              cy={0}
              r={cuteEyes.eyeRadius}
              fill="#ffffff"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="0.7"
            />
            <circle
              cx={0}
              cy={0}
              r={cuteEyes.pupilRadius}
              fill="#090d16"
            />
            {/* Subtle colored iris bottom crescent */}
            <circle
              cx={0}
              cy={cuteEyes.pupilRadius * 0.25}
              r={cuteEyes.irisRadius}
              fill={colors.irisColor}
              opacity="0.7"
            />
            {/* Specular Star Highlights */}
            <circle
              cx={-cuteEyes.pupilRadius * 0.35}
              cy={-cuteEyes.pupilRadius * 0.35}
              r={cuteEyes.mainSparkleRadius}
              fill="#ffffff"
            />
            <circle
              cx={cuteEyes.pupilRadius * 0.35}
              cy={cuteEyes.pupilRadius * 0.35}
              r={cuteEyes.subSparkleRadius}
              fill="#ffffff"
            />
          </g>
        </g>

        {/* Right Eye */}
        <g
          transform={`translate(${cuteEyes.right.x.toFixed(2)}, ${cuteEyes.right.y.toFixed(2)}) rotate(${cuteEyes.right.angle.toFixed(1)})`}
        >
          <g className="animate-snake-blink">
            <circle
              cx={0}
              cy={0}
              r={cuteEyes.eyeRadius}
              fill="#ffffff"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="0.7"
            />
            <circle
              cx={0}
              cy={0}
              r={cuteEyes.pupilRadius}
              fill="#090d16"
            />
            {/* Subtle colored iris bottom crescent */}
            <circle
              cx={0}
              cy={cuteEyes.pupilRadius * 0.25}
              r={cuteEyes.irisRadius}
              fill={colors.irisColor}
              opacity="0.7"
            />
            {/* Specular Star Highlights */}
            <circle
              cx={-cuteEyes.pupilRadius * 0.35}
              cy={-cuteEyes.pupilRadius * 0.35}
              r={cuteEyes.mainSparkleRadius}
              fill="#ffffff"
            />
            <circle
              cx={cuteEyes.pupilRadius * 0.35}
              cy={cuteEyes.pupilRadius * 0.35}
              r={cuteEyes.subSparkleRadius}
              fill="#ffffff"
            />
          </g>
        </g>

        {/* Hint Arrow Marker */}
        {isHinted && (
          <g transform={`translate(${currentHeadPixel.x + dx * cellSize * 0.72}, ${currentHeadPixel.y + dy * cellSize * 0.72}) rotate(${angle})`}>
            <polygon
              points="0,-7 13,0 0,7"
              fill="#fbbf24"
              stroke="#78350f"
              strokeWidth="1.4"
            />
          </g>
        )}

        {/* Flame Target Crosshair */}
        {isBurnMode && !isBurning && (
          <g transform={`translate(${currentHeadPixel.x}, ${currentHeadPixel.y})`} className="pointer-events-none">
            <circle
              r={cellSize * 0.46}
              fill="rgba(239, 68, 68, 0.25)"
              stroke="#f97316"
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
            <line x1={-cellSize * 0.48} y1={0} x2={-cellSize * 0.22} y2={0} stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
            <line x1={cellSize * 0.22} y1={0} x2={cellSize * 0.48} y2={0} stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
            <line x1={0} y1={-cellSize * 0.48} x2={0} y2={-cellSize * 0.22} stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
            <line x1={0} y1={cellSize * 0.22} x2={0} y2={cellSize * 0.48} stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}
      </g>
    </g>
  );
};

// High-Performance Custom Comparator for React.memo
// Prevents 20+ idle snakes from running heavy bezier & SVG calculations 60 times/sec while 1 snake is slithering!
function areSnakePropsEqual(prev: SnakeItemProps, next: SnakeItemProps): boolean {
  if (prev.snake !== next.snake) return false;
  if (prev.cellSize !== next.cellSize || prev.padding !== next.padding) return false;
  if (prev.isHinted !== next.isHinted) return false;
  if (prev.isBlockedAnim !== next.isBlockedAnim) return false;
  if (prev.isBurnMode !== next.isBurnMode) return false;
  if (prev.isBurning !== next.isBurning) return false;
  if (prev.disabled !== next.disabled) return false;

  // If exitOffset is different, this snake is the one currently moving
  if (prev.exitOffset !== next.exitOffset) return false;
  if (prev.straightenProgress !== next.straightenProgress) return false;

  // Otherwise, all relevant visual props are identical - DO NOT RE-RENDER!
  return true;
}

export const SnakeItem = React.memo(SnakeItemComponent, areSnakePropsEqual);
