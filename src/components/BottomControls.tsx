import React from 'react';
import { Lightbulb, RotateCcw, RefreshCw, Heart, Plus } from 'lucide-react';

interface BottomControlsProps {
  onHint: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onRequestRewardedAd?: (type: 'hint' | 'heart') => void;
  canUndo: boolean;
  hintsRemaining: number;
  heartsRemaining?: number;
  disabled?: boolean;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  onHint,
  onUndo,
  onRestart,
  onRequestRewardedAd,
  canUndo,
  hintsRemaining,
  heartsRemaining = 0,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto px-3.5 pb-2.5 pt-1 z-20">
      <nav
        id="bottom-controls-bar"
        aria-label="Game Controls"
        className="w-full glass-panel rounded-3xl px-3 py-2 flex items-center justify-around select-none gap-2 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
      >
        {/* Hint Button */}
        <button
          id="btn-hint"
          type="button"
          onClick={() => {
            if (hintsRemaining <= 0 && onRequestRewardedAd) {
              onRequestRewardedAd('hint');
            } else {
              onHint();
            }
          }}
          disabled={disabled}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all relative cursor-pointer flex-1"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl jewel-button flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:border-amber-400/60 group-hover:glow-amber transition-all relative">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] fill-amber-400/20 group-hover:fill-amber-400/40 transition-all" />
            {hintsRemaining <= 0 ? (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-amber-200 shadow-md font-mono flex items-center gap-0.5 animate-pulse">
                <Plus className="w-2.5 h-2.5 stroke-[3]" /> 1 Ad
              </span>
            ) : (
              <span className="absolute -top-1.5 -right-1 bg-amber-500/90 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full border border-amber-300 font-mono shadow">
                {hintsRemaining}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-300 transition-colors">
            {hintsRemaining > 0 ? 'Hint' : '+1 Hint'}
          </span>
        </button>

        {/* Life / Shield (❤️) Rewarded Ad Button */}
        <button
          id="btn-life"
          type="button"
          onClick={() => {
            if (onRequestRewardedAd) {
              onRequestRewardedAd('heart');
            }
          }}
          disabled={disabled}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all relative cursor-pointer flex-1"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl jewel-button flex items-center justify-center text-rose-400 group-hover:text-rose-300 group-hover:border-rose-400/60 group-hover:glow-rose transition-all relative">
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] ${
                heartsRemaining > 0 ? 'fill-rose-500 text-rose-300 animate-pulse' : 'fill-rose-500/20 text-rose-400'
              }`}
            />
            {heartsRemaining <= 0 ? (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full border border-rose-200 shadow-md font-mono flex items-center gap-0.5 animate-pulse">
                <Plus className="w-2.5 h-2.5 stroke-[3]" /> 1 Ad
              </span>
            ) : (
              <span className="absolute -top-1.5 -right-1 bg-rose-500/90 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full border border-rose-300 font-mono shadow">
                {heartsRemaining}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-rose-300 transition-colors">
            {heartsRemaining > 0 ? (heartsRemaining === 1 ? '1 Life' : `${heartsRemaining} Lives`) : '+1 Life'}
          </span>
        </button>

        {/* Undo Button */}
        <button
          id="btn-undo"
          type="button"
          onClick={onUndo}
          disabled={disabled || !canUndo}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex-1"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl jewel-button flex items-center justify-center text-sky-400 group-hover:text-sky-200 group-hover:border-sky-400/60 group-hover:glow-sky transition-all">
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-sky-300 transition-colors">
            Undo
          </span>
        </button>

        {/* Restart Button */}
        <button
          id="btn-restart"
          type="button"
          onClick={onRestart}
          disabled={disabled}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex-1"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl jewel-button flex items-center justify-center text-emerald-400 group-hover:text-emerald-200 group-hover:border-emerald-400/60 group-hover:glow-emerald transition-all group-hover:rotate-180 duration-500">
            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-300 transition-colors">
            Restart
          </span>
        </button>
      </nav>
    </div>
  );
};

