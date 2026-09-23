import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Trophy, CheckCircle2, Sparkles, Gift } from 'lucide-react';
import { sounds } from '../utils/audio';
import { formatPoints } from '../utils/formatPoints';

interface LevelCompleteModalProps {
  levelNumber: number;
  scoreEarned: number;
  totalScore: number;
  movesUsed: number;
  targetMoves: number;
  stars: number;
  isDoubleClaimed?: boolean;
  onDoublePoints?: () => void;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  scoreEarned,
  totalScore,
  movesUsed,
  targetMoves,
  stars,
  isDoubleClaimed = false,
  onDoublePoints,
  onNextLevel,
  onReplay,
}) => {
  useEffect(() => {
    // Fire victory sound
    sounds.playLevelComplete();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {}
  }, []);

  return (
    <div
      id="modal-level-complete"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-slate-900/95 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center text-center transform animate-in zoom-in-95 duration-200 backdrop-blur-xl text-white">
        {/* Celebration Header */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(52,211,153,0.3)] border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-black text-white font-display tracking-tight">
          LEVEL COMPLETE!
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
          Stage {levelNumber} Cleared
        </p>

        {/* 3-Star Rating Animation */}
        <div className="flex items-center justify-center gap-3 my-5">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={`star-${starIdx}`}
                className={`transition-all duration-500 transform ${
                  isEarned
                    ? 'scale-110 text-amber-400 fill-amber-400 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]'
                    : 'scale-90 text-slate-700 fill-slate-800'
                }`}
              >
                <Star className="w-10 h-10" />
              </div>
            );
          })}
        </div>

        {/* Score & Stats Card */}
        <div className="w-full bg-slate-800/60 rounded-2xl p-4 mb-4 border border-white/5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Stage Score</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono text-base">
              <span>+{scoreEarned}</span>
              {isDoubleClaimed && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase">
                  2X Boosted
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Moves Used</span>
            <span className="font-mono text-white font-bold">
              {movesUsed} <span className="text-xs text-slate-500 font-normal font-sans">/ {targetMoves} ideal</span>
            </span>
          </div>

          <div className="h-px bg-white/10 my-1" />

          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Total Score
            </span>
            <span className="text-emerald-400 font-mono text-lg">
              {formatPoints(totalScore)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
            <span>Database Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              ✓ Saved to Cloud
            </span>
          </div>
        </div>

        {/* 2X Points Rewarded Ad Button */}
        {onDoublePoints && !isDoubleClaimed ? (
          <button
            id="btn-double-points-ad"
            onClick={onDoublePoints}
            className="w-full mb-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.4)] active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>2X Points Bonus</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-950/20 text-[10px] font-black uppercase">
              Watch Ad
            </span>
          </button>
        ) : isDoubleClaimed ? (
          <div className="w-full mb-3 py-2 px-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>2X Score Claimed (+{scoreEarned / 2} Bonus)</span>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="w-full flex gap-3">
          <button
            id="btn-replay-level"
            onClick={onReplay}
            className="flex-1 py-3.5 px-4 rounded-2xl game-button text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Replay
          </button>

          <button
            id="btn-next-level"
            onClick={onNextLevel}
            className="flex-[1.4] py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Next Level</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
