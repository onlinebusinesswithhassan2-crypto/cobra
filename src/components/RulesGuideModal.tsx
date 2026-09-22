import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

interface RulesGuideModalProps {
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ onClose }) => {
  return (
    <div
      id="modal-rules-guide"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-slate-900/95 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col transform animate-in zoom-in-95 duration-200 backdrop-blur-xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-display">
            How to Play
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full game-button text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 my-4 overflow-y-auto max-h-[60vh] pr-1">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-display">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs flex items-center justify-center font-black">1</span>
              <span>Look at Eyes & Direction</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Each snake has cute googly eyes pointing in its exit direction. Tap a snake whose forward exit path is completely clear.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm font-display">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-black">2</span>
              <span>Realistic Slither Escape</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When tapped, the snake smoothly slithers forward along its exact body curve and exits cleanly into freedom without colliding with neighbors!
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm font-display">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-slate-950 text-xs flex items-center justify-center font-black">3</span>
              <span>3 Safe Hits & Move Limits</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have 3 safe collision chances (medals) and limited moves per stage. If you hit obstacles or run out of moves, watch a short ad to revive with +2 extra hits!
            </p>
          </div>

          {/* Step 4: Burn Power-up */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-orange-500/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm font-display">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 text-xs flex items-center justify-center font-black">4</span>
              <span>🔥 Burn Power-up (Deadlock Breaker)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stuck or in a deadlock? Tap the Burn button, then select any blocking snake to incinerate it with realistic flame particles and unlock your puzzle!
            </p>
          </div>
        </div>

        <button
          id="btn-close-rules"
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition-all"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Got it, Let's Play!</span>
        </button>
      </div>
    </div>
  );
};
