import React, { useState, useMemo } from 'react';
import { X, Star, Lock, Sparkles, Trophy } from 'lucide-react';
import { getChaptersForProgress, getLevelName, TOTAL_GAME_LEVELS, ChapterInfo } from '../data/levels';

interface LevelSelectModalProps {
  currentLevel: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
  onSelectEndless: () => void;
  isEndlessMode?: boolean;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevel,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
  onSelectEndless,
  isEndlessMode = false,
}) => {
  // Dynamically compute all chapters available for player progress (includes Infinity Chapters 101+)
  const allChapters = useMemo(() => {
    return getChaptersForProgress(unlockedLevel);
  }, [unlockedLevel]);

  // Determine active chapter tab
  const initialChapter = useMemo(() => {
    const target = isEndlessMode ? unlockedLevel : currentLevel;
    const found = allChapters.find(
      (c) => target >= c.range[0] && target <= c.range[1]
    );
    return found ? found.id : 1;
  }, [currentLevel, unlockedLevel, isEndlessMode, allChapters]);

  const [activeChapterId, setActiveChapterId] = useState<number>(initialChapter);

  // Active Chapter Object
  const activeChapter = useMemo<ChapterInfo>(() => {
    return allChapters.find((c) => c.id === activeChapterId) || allChapters[0];
  }, [activeChapterId, allChapters]);

  // Overall Stats across all cleared stages (including 101+)
  const stats = useMemo(() => {
    const totalCleared = Object.keys(levelStars).length;
    const totalStars = (Object.values(levelStars) as number[]).reduce((acc: number, s: number) => acc + (s || 0), 0);
    const maxReferenceLevels = Math.max(TOTAL_GAME_LEVELS, unlockedLevel);
    return {
      cleared: totalCleared,
      stars: totalStars,
      maxLevels: maxReferenceLevels,
      maxStars: maxReferenceLevels * 3,
    };
  }, [levelStars, unlockedLevel]);

  // Fast instantaneous retrieval of the 20 levels for the active chapter (0ms latency)
  const chapterLevels = useMemo(() => {
    const [start, end] = activeChapter.range;
    const list: { id: number; name: string }[] = [];

    for (let id = start; id <= end; id++) {
      list.push({ id, name: getLevelName(id) });
    }

    return list;
  }, [activeChapter]);

  return (
    <div
      id="modal-level-select"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="level-select-modal-content"
        className="w-full max-w-lg max-h-[92vh] bg-slate-900/95 rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-cyan-500/20 flex flex-col transform animate-in zoom-in-95 duration-200 backdrop-blur-2xl text-white"
      >
        
        {/* Header with Title and Overall Stats */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white font-display tracking-wide">
                  Stage Selection
                </h2>
                {unlockedLevel > 1000 && (
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    Infinity Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="text-emerald-400 font-bold">{stats.cleared} Cleared</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {stats.stars} Stars
                </span>
                <span>•</span>
                <span className="text-cyan-300 font-mono text-[11px]">
                  Lvl: {unlockedLevel} / 1000
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-2xl jewel-button text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Tabs Selector (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar border-b border-white/5">
          {allChapters.map((chap) => {
            const isSelected = chap.id === activeChapterId;
            const isChapterUnlocked = unlockedLevel >= chap.range[0];

            return (
              <button
                key={`chap-tab-${chap.id}`}
                onClick={() => setActiveChapterId(chap.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/50 scale-102'
                    : isChapterUnlocked
                    ? 'bg-slate-800/80 text-slate-300 border border-white/10 hover:bg-slate-800'
                    : 'bg-slate-950/40 text-slate-500 border border-white/5 opacity-60'
                }`}
              >
                <span>{chap.icon}</span>
                <span>{chap.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-mono">({chap.range[0]}-{chap.range[1]})</span>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Details Banner */}
        <div className="my-2.5 px-3 py-2 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{activeChapter.icon}</span>
            <div>
              <div className="text-xs font-extrabold text-cyan-300 font-display flex items-center gap-1.5">
                <span>Chapter {activeChapter.id}: {activeChapter.name}</span>
                {activeChapter.id > 50 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-mono">
                    ∞ INFINITY MASTER
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                {activeChapter.id === 1
                  ? 'Novice & Gentle Paths'
                  : activeChapter.id === 2
                  ? 'Apprentice Coils & Interlocks'
                  : activeChapter.id === 3
                  ? 'Crystal Entanglement Mazes'
                  : activeChapter.id === 4
                  ? 'Volcanic Caldera Multi-Step Escapes'
                  : activeChapter.id === 5
                  ? 'Celestial Spire Master Challenges'
                  : 'Algorithmic Infinite Labyrinths (Escalating Difficulty)'}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/10">
            {activeChapter.range[0]} - {activeChapter.range[1]}
          </span>
        </div>

        {/* 20 Levels Grid for Active Chapter */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 gap-2.5 py-1">
          {chapterLevels.map((level) => {
            const isUnlocked = level.id <= unlockedLevel;
            const isCurrent = level.id === currentLevel && !isEndlessMode;
            const stars = levelStars[level.id] || 0;

            return (
              <button
                key={level.id}
                id={`btn-select-level-${level.id}`}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(level.id);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all select-none cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.55)] scale-105 z-10 font-black'
                    : isUnlocked
                    ? 'jewel-button text-white hover:border-cyan-400/50 hover:scale-102 active:scale-95'
                    : 'bg-slate-950/40 border-white/5 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <span className={`text-base font-black font-mono ${isCurrent ? 'text-slate-950' : 'text-white'}`}>
                      {level.id}
                    </span>
                    <span className={`text-[9px] max-w-full truncate px-1 text-center font-medium ${isCurrent ? 'text-slate-900/80 font-bold' : 'text-slate-400'}`}>
                      {level.name.split(' ')[0]}
                    </span>
                    {/* Stars Earned */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={`star-${level.id}-${s}`}
                          className={`w-2.5 h-2.5 ${
                            s <= stars
                              ? isCurrent
                                ? 'text-slate-950 fill-slate-950'
                                : 'text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                              : isCurrent
                              ? 'text-teal-800/60 fill-teal-800/60'
                              : 'text-slate-700 fill-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 py-1">
                    <Lock className="w-4 h-4 text-slate-600" />
                    <span className="text-[10px] text-slate-600 font-mono">{level.id}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Jump to Highest Unlocked Level Banner at bottom */}
        <div className="pt-3 border-t border-white/10 mt-2 flex gap-2">
          <button
            id="btn-play-highest"
            onClick={() => {
              onSelectLevel(unlockedLevel);
              onClose();
            }}
            className="flex-1 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Continue at Stage {unlockedLevel}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
