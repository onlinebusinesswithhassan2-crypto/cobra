import React from 'react';
import { RotateCcw, AlertTriangle, Lightbulb, Medal, Gift } from 'lucide-react';

interface LevelFailedModalProps {
  levelNumber: number;
  reason: 'moves' | 'hearts';
  onRetry: () => void;
  onUseHint: () => void;
  hintsRemaining: number;
  onWatchRewardAd?: (type: 'heart' | 'hint') => void;
  onRequestRewardedAd?: (type: 'heart' | 'hint') => void;
}

export const LevelFailedModal: React.FC<LevelFailedModalProps> = ({
  levelNumber,
  reason,
  onRetry,
  onUseHint,
  hintsRemaining,
  onWatchRewardAd,
  onRequestRewardedAd,
}) => {
  const triggerWatchAd = onWatchRewardAd || onRequestRewardedAd;
  return (
    <div
      id="modal-level-failed"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-slate-900/95 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center text-center transform animate-in zoom-in-95 duration-200 backdrop-blur-xl text-white">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(244,63,94,0.3)] border border-rose-500/30">
          <AlertTriangle className="w-9 h-9 stroke-[2.2]" />
        </div>

        <h2 className="text-2xl font-black text-white font-display tracking-tight">
          STAGE FAILED
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
          {reason === 'moves' ? 'Out of available moves!' : 'Snake Collision / No Lives Left!'}
        </p>

        <p className="text-xs text-slate-400 mt-3 mb-5 px-2 leading-relaxed">
          Tip: Look closely at snake head directions. Unbend the outer snakes first so inner snakes can escape freely!
        </p>

        <div className="w-full flex flex-col gap-2.5">
          {/* Watch Ad to Revive (+1 Life) */}
          {triggerWatchAd && (
            <button
              id="btn-ad-revive"
              type="button"
              onClick={() => triggerWatchAd('heart')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Medal className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Watch Ad to Revive (+1 Life)</span>
            </button>
          )}

          <button
            id="btn-retry-level"
            onClick={onRetry}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            Try Again
          </button>

          {hintsRemaining > 0 && (
            <button
              id="btn-retry-with-hint"
              onClick={onUseHint}
              className="w-full py-3 px-4 rounded-2xl game-button hover:bg-amber-500/15 hover:border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400" />
              Use a Hint ({hintsRemaining} left)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

