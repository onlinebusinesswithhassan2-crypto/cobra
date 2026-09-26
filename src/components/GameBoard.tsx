import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Direction, GridPos, Obstacle, SnakeData } from '../types';
import {
  DIR_VECTORS,
  calculateSlitherPositions,
  isSnakePathClear,
  calculateExitDistance,
  customEase,
} from '../utils/gameLogic';
import { sounds } from '../utils/audio';
import {
  drawGridCells,
  drawObstacles,
  drawSnake,
  drawParticles,
  hitTestSnake,
  Particle,
} from '../utils/canvasRenderer';

interface GameBoardProps {
  gridWidth: number;
  gridHeight: number;
  snakes: SnakeData[];
  obstacles?: Obstacle[];
  hintedSnakeId: string | null;
  onSnakeEscape: (snake: SnakeData) => void;
  onSnakeBlocked: (snake: SnakeData) => void;
  onAnimationStateChange: (isAnimating: boolean) => void;
  registerUndoAnimation?: (handler: (snake: SnakeData, onDone: () => void) => void) => void;
}

interface ActiveAnimation {
  snakeId: string;
  phase: 'exiting' | 'undo_enter';
  startTime: number;
  duration: number;
  exitOffset: number;
  maxExitDistance: number;
  snakeData: SnakeData;
  onComplete: () => void;
}

interface BlockedAnimation {
  snakeId: string;
  startTime: number;
  duration: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridWidth,
  gridHeight,
  snakes,
  obstacles = [],
  hintedSnakeId,
  onSnakeEscape,
  onSnakeBlocked,
  onAnimationStateChange,
  registerUndoAnimation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 360, height: 360 });

  const activeAnimRef = useRef<ActiveAnimation[]>([]);
  const blockedAnimRef = useRef<BlockedAnimation | null>(null);
  const escapedSnakeIdsRef = useRef<Set<string>>(new Set());
  const isUndoingRef = useRef<boolean>(false);
  const requestRenderRef = useRef<(() => void) | null>(null);

  // Synchronize escaped set with active snakes array
  useEffect(() => {
    escapedSnakeIdsRef.current.clear();
  }, [snakes]);

  // Sparkle / Flame particle system
  const particlesRef = useRef<Particle[]>([]);
  const particleIdCounter = useRef(0);

  // Responsive board sizing via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const size = Math.min(width, height);
        if (size > 0) {
          setBoardSize({ width: size, height: size });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const padding = 20;
  const boardInnerSize = Math.max(100, boardSize.width - padding * 2);
  const cellSize = boardInnerSize / Math.max(gridWidth, gridHeight);

  // Spawn sparkle particles when a snake escapes
  const spawnSparkles = useCallback((x: number, y: number, color: string) => {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      particlesRef.current.push({
        id: ++particleIdCounter.current,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 5,
        alpha: 1,
        rotation: Math.random() * Math.PI,
      });
    }
  }, []);

  // Expose undo handler to parent
  useEffect(() => {
    if (registerUndoAnimation) {
      registerUndoAnimation((restoredSnake: SnakeData, onDone: () => void) => {
        if (isUndoingRef.current || activeAnimRef.current.length > 0) return;
        isUndoingRef.current = true;
        onAnimationStateChange(true);
        sounds.playUndo();

        const exitDist = calculateExitDistance(restoredSnake, gridWidth, gridHeight);
        activeAnimRef.current.push({
          snakeId: restoredSnake.id,
          phase: 'undo_enter',
          startTime: performance.now(),
          duration: Math.max(700, Math.min(1100, 380 + exitDist * 120)),
          exitOffset: exitDist,
          maxExitDistance: exitDist,
          snakeData: restoredSnake,
          onComplete: onDone,
        });
        requestRenderRef.current?.();
      });
    }
  }, [registerUndoAnimation, gridWidth, gridHeight, onAnimationStateChange]);

  // Snake Tap Handling (Tap to escape)
  const handleSnakeTap = useCallback(
    (snakeId: string) => {
      if (isUndoingRef.current || activeAnimRef.current.some((animation) => animation.snakeId === snakeId)) return;

      const snake = snakes.find((s) => s.id === snakeId);
      if (!snake || snake.state === 'removed') return;

      // Check complete path clearance before movement
      const { isClear } = isSnakePathClear(snake, snakes, obstacles, gridWidth, gridHeight);

      if (!isClear) {
        sounds.playBlocked();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([40, 60, 40]);
          } catch {}
        }
        blockedAnimRef.current = {
          snakeId,
          startTime: performance.now(),
          duration: 360,
        };
        requestRenderRef.current?.();
        onSnakeBlocked(snake);
        return;
      }

      // PATH IS CLEAR: Smoothly slither out along body curve!
      const exitDist = calculateExitDistance(snake, gridWidth, gridHeight);
      const duration = Math.max(360, Math.min(620, 280 + exitDist * 55));

      const head = snake.cells[0];
      const px = padding + head.x * cellSize + cellSize / 2;
      const py = padding + head.y * cellSize + cellSize / 2;
      spawnSparkles(px, py, snake.color);

      activeAnimRef.current.push({
        snakeId: snake.id,
        phase: 'exiting',
        startTime: performance.now(),
        duration,
        exitOffset: 0,
        maxExitDistance: exitDist,
        snakeData: snake,
        onComplete: () => {
          onSnakeEscape(snake);
        },
      });
      onAnimationStateChange(true);
      requestRenderRef.current?.();

      sounds.playExit();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(25);
        } catch {}
      }
    },
    [
      snakes,
      obstacles,
      gridWidth,
      gridHeight,
      onAnimationStateChange,
      onSnakeBlocked,
      onSnakeEscape,
      spawnSparkles,
      cellSize,
      padding,
    ]
  );

  // Touch / Pointer Event Handler with high-precision coordinate mapping
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isUndoingRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = boardSize.width / rect.width;
    const scaleY = boardSize.height / rect.height;
    const touchX = (e.clientX - rect.left) * scaleX;
    const touchY = (e.clientY - rect.top) * scaleY;

    const activeSnakePositions = new Map<string, GridPos[]>();
    activeAnimRef.current.forEach((animation) => {
      activeSnakePositions.set(
        animation.snakeId,
        animation.exitOffset > 0
          ? calculateSlitherPositions(animation.snakeData, animation.exitOffset)
          : animation.snakeData.cells
      );
    });
    const hitId = hitTestSnake(touchX, touchY, snakes, padding, cellSize, activeSnakePositions);
    if (hitId) {
      handleSnakeTap(hitId);
    }
  };

  // High-Performance Hardware-Accelerated 60-120 FPS Canvas Rendering Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId = 0;
    let disposed = false;
    let lastRenderTime = 0;

    const requestFrame = () => {
      if (!disposed && reqId === 0) {
        reqId = requestAnimationFrame(render);
      }
    };

    const render = (now: number) => {
      reqId = 0;
      const frameScale = lastRenderTime === 0 ? 1 : Math.min(2, (now - lastRenderTime) / 16.667);
      lastRenderTime = now;

      for (let index = activeAnimRef.current.length - 1; index >= 0; index--) {
        const anim = activeAnimRef.current[index];
        const elapsed = now - anim.startTime;

        if (anim.phase === 'exiting') {
          const t = Math.min(1, elapsed / anim.duration);
          const eased = t * t * (3 - 2 * t);
          anim.exitOffset = eased * anim.maxExitDistance;

          if (t >= 1) {
            escapedSnakeIdsRef.current.add(anim.snakeId);
            activeAnimRef.current.splice(index, 1);
            anim.onComplete();
            onAnimationStateChange(activeAnimRef.current.length > 0);
          }
        } else if (anim.phase === 'undo_enter') {
          const t = Math.min(1, elapsed / anim.duration);
          const eased = 1 - customEase(t);
          anim.exitOffset = eased * anim.maxExitDistance;

          if (t >= 1) {
            escapedSnakeIdsRef.current.delete(anim.snakeId);
            activeAnimRef.current.splice(index, 1);
            isUndoingRef.current = false;
            anim.onComplete();
            onAnimationStateChange(activeAnimRef.current.length > 0);
          }
        }
      }

      // 2. Check Blocked Recoil Animation
      const blockedAnim = blockedAnimRef.current;
      let blockedOffset: { dx: number; dy: number } | undefined;
      let blockedSnakeId: string | null = null;
      if (blockedAnim) {
        const elapsed = now - blockedAnim.startTime;
        const progress = Math.min(1, elapsed / blockedAnim.duration);
        if (progress >= 1) {
          blockedAnimRef.current = null;
        } else {
          blockedSnakeId = blockedAnim.snakeId;
          const blockedSnake = snakes.find((s) => s.id === blockedAnim.snakeId);
          if (blockedSnake) {
            const shake = Math.sin(progress * Math.PI * 8) * (1 - progress) * (cellSize * 0.12);
            const dir = DIR_VECTORS[blockedSnake.direction];
            blockedOffset = { dx: -dir.dy * shake, dy: dir.dx * shake };
          }
        }
      }

      // 3. Clear Canvas Screen
      ctx.clearRect(0, 0, boardSize.width, boardSize.height);

      // 4. Draw Beveled Grid Cells
      drawGridCells(ctx, gridWidth, gridHeight, padding, cellSize);

      // 5. Draw Obstacle Ancient Runes
      if (obstacles && obstacles.length > 0) {
        drawObstacles(ctx, obstacles, padding, cellSize);
      }

      // 6. Draw All Active Snakes (Exclude any removed or escaped snakes)
      snakes.forEach((snake) => {
        const activeAnimation = activeAnimRef.current.find((animation) => animation.snakeId === snake.id);
        const isAnim = activeAnimation !== undefined;
        const currentExitOffset = activeAnimation?.exitOffset ?? 0;

        if (snake.state === 'removed' && !isAnim) return;
        if (escapedSnakeIdsRef.current.has(snake.id) && !isAnim) return;

        const isHinted = hintedSnakeId === snake.id;
        const isBlocked = blockedSnakeId === snake.id;

        drawSnake(ctx, snake, cellSize, padding, {
          isHinted,
          isBlocked,
          exitOffset: currentExitOffset,
          animTime: now,
          blockedOffset: isBlocked ? blockedOffset : undefined,
        });
      });

      // 7. Update and Draw Particles
      if (particlesRef.current.length > 0) {
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx * frameScale;
          p.y += p.vy * frameScale;
          p.vy += 0.08 * frameScale;
          p.alpha -= 0.024 * frameScale;
          p.rotation += 0.05 * frameScale;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }
        drawParticles(ctx, particlesRef.current);
      }

      if (
        activeAnimRef.current.length > 0 ||
        blockedAnimRef.current !== null ||
        particlesRef.current.length > 0 ||
        hintedSnakeId !== null
      ) {
        requestFrame();
      }
    };

    requestRenderRef.current = requestFrame;
    requestFrame();
    return () => {
      disposed = true;
      if (reqId !== 0) cancelAnimationFrame(reqId);
      if (requestRenderRef.current === requestFrame) requestRenderRef.current = null;
    };
  }, [
    snakes,
    obstacles,
    gridWidth,
    gridHeight,
    boardSize,
    cellSize,
    padding,
    hintedSnakeId,
    onAnimationStateChange,
  ]);

  // High-DPI Retina resolution sync
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(boardSize.width * dpr);
    canvas.height = Math.round(boardSize.height * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    }
  }, [boardSize]);

  return (
    <div
      ref={containerRef}
      id="game-board-container"
      className="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center p-2"
    >
      {/* Outer Rounded Container with Arcade Sanctuary Frame */}
      <div
        id="puzzle-board-card"
        style={{ width: boardSize.width, height: boardSize.height }}
        className="relative snake-grid-arena bg-slate-900/95 rounded-[34px] shadow-[0_24px_70px_rgba(0,0,0,0.7),0_0_40px_rgba(99,102,241,0.12)] border-2 border-indigo-500/20 overflow-hidden flex items-center justify-center transition-all duration-300"
      >
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-black/40 pointer-events-none" />

        {/* 4 Corner Arcane Jewel Brackets */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br-lg pointer-events-none" />

        {/* High-Performance Canvas Arena for Grid, Snakes, and Particles */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{ width: boardSize.width, height: boardSize.height }}
          className="absolute inset-0 z-10 cursor-pointer touch-none select-none"
        />
      </div>
    </div>
  );
};
