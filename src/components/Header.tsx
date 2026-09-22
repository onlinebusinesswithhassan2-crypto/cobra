import React from 'react';
import { ChevronLeft, Settings, Lightbulb, Medal, Trophy, User, Users, ShieldCheck, Home, Sparkles, Moon, Sun } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  levelNumber: number;
  levelName: string;
  hintsRemaining: number;
  hearts: number;
  maxHearts?: number;
  movesRemaining?: number;
  score: number;
  userProfile?: UserProfile;
  themeMode?: 'dark' | 'light';
  onOpenMenu: () => void;
  onGoHome?: () => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
  onOpenLeaderboard: () => void;
  onOpenFriends?: () => void;
  onOpenAdminDashboard?: () => void;
  onToggleTheme?: (mode: 'dark' | 'light') => void;
  isChallengeMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  levelNumber,
  levelName,
  hintsRemaining,
  hearts,
  maxHearts = 3,
  movesRemaining,
  score,
  userProfile,
  themeMode = 'dark',
  onOpenMenu,
  onGoHome,
  onOpenSettings,
  onOpenLogin,
  onOpenLeaderboard,
  onOpenFriends,
  onOpenAdminDashboard,
  onToggleTheme,
  isChallengeMode = false,
}) => {
  const isMasterLevel = levelNumber > 1000;

  return (
    <header id="game-header" className="w-full max-w-[500px] mx-auto px-3.5 pt-2 pb-1.5 flex flex-col gap-2.5 select-none z-20">
      {/* Top Profile / Leaderboard Quick Row */}
      <div className="flex items-center justify-between gap-2">
        {/* Player Status / Login Pill */}
        <button
          id="btn-profile-status"
          onClick={onOpenLogin}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill hover:border-cyan-400/50 text-xs font-bold transition-all active:scale-95 shadow-md cursor-pointer group"
        >
          {userProfile?.isLoggedIn ? (
            <>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-100 max-w-[100px] truncate font-bold">{userProfile.name || userProfile.username}</span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-1.5 py-0.2 rounded-full border border-amber-500/30 shrink-0">
                🪙 {(userProfile.cbCoins || 0).toLocaleString()} CB
              </span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300 group-hover:text-white transition-colors">Guest</span>
              <span className="text-[10px] text-amber-300 font-extrabold bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded-full shrink-0">
                Login
              </span>
            </>
          )}
        </button>

        {/* Admin Shortcut for Admin Account */}
        {userProfile?.role === 'admin' && onOpenAdminDashboard && (
          <button
            id="btn-header-admin"
            onClick={onOpenAdminDashboard}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-black hover:bg-red-600/50 transition-all active:scale-95 shadow-md cursor-pointer"
          >
            🛡️ Admin
          </button>
        )}

        {/* Friends & CB Gifts Quick Button */}
        {onOpenFriends && (
          <button
            id="btn-header-friends"
            onClick={onOpenFriends}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 active:scale-95 text-cyan-300 text-xs font-black transition-all shadow-md cursor-pointer group"
            title="Friends & CB Gifts"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden xs:inline font-bold">Friends</span>
          </button>
        )}

        {/* Global Leaderboard Trophy Button */}
        <button
          id="btn-open-leaderboard"
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-yellow-500/20 light-theme:from-amber-100 light-theme:to-amber-200 border border-amber-500/40 hover:border-amber-400/70 active:scale-95 text-amber-300 light-theme-leaderboard-btn text-xs font-black tracking-wide transition-all shadow-[0_0_16px_rgba(245,158,11,0.2)] cursor-pointer backdrop-blur-md group"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="font-black">Leaderboard</span>
        </button>
      </div>

      {/* Main Row: Home / Menu button, Level title capsule, Quick Theme + Settings button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {onGoHome && (
            <button
              id="btn-home"
              onClick={onGoHome}
              aria-label="Main Menu"
              className="w-10 h-10 rounded-2xl jewel-button flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Home className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          <button
            id="btn-level-menu"
            onClick={onOpenMenu}
            aria-label="Level Select Menu"
            className="w-10 h-10 rounded-2xl jewel-button flex items-center justify-center text-slate-300 hover:text-cyan-300 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Central Level Title Capsule */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-cyan-400 font-extrabold">
              {levelName || `Sanctuary ${Math.ceil(levelNumber / 5)}-${((levelNumber - 1) % 5) + 1}`}
            </span>
            {isMasterLevel && (
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 border border-indigo-400/40 text-[9px] font-black text-indigo-300 uppercase tracking-wider">
                ∞ Master
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-display drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] flex items-center gap-1.5">
            <span>Level {levelNumber}</span>
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleTheme && (
            <button
              id="btn-quick-theme"
              type="button"
              onClick={() => onToggleTheme(themeMode === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 rounded-2xl jewel-button flex items-center justify-center text-slate-300 hover:text-amber-300 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              {themeMode === 'light' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-spin" style={{ animationDuration: '20s' }} />
              ) : (
                <Moon className="w-4 h-4 text-indigo-300 fill-indigo-300/20" />
              )}
            </button>
          )}

          <button
            id="btn-settings"
            onClick={onOpenSettings}
            aria-label="Game Settings"
            className="w-10 h-10 rounded-2xl jewel-button flex items-center justify-center text-slate-300 hover:text-amber-300 active:scale-95 transition-all shadow-md cursor-pointer group"
          >
            <Settings className="w-5 h-5 stroke-[2.2] group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Second row stats pill badges (Hints, Lives, Score) */}
      <div className="flex items-center justify-between gap-2">
        {/* Hints pill */}
        <div
          id="pill-hints"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-2xl glass-pill border border-amber-500/35 glow-amber text-amber-300 text-xs font-bold transition-transform"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold hidden sm:inline">Hints</span>
            <span className="font-mono text-sm font-black text-amber-200">{hintsRemaining}</span>
          </div>
        </div>

        {/* Hit / Chance Medals indicator (3 safe collisions) */}
        <div
          id="pill-medals"
          title="Safe Hits: 3 Chances"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-2xl glass-pill border border-amber-500/35 glow-amber"
        >
          {Array.from({ length: maxHearts }).map((_, i) => (
            <Medal
              key={`medal-${i}`}
              className={`w-4 h-4 transition-all duration-300 ${
                i < hearts
                  ? 'text-amber-400 fill-amber-400/80 scale-100 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-[heart-pulse_2s_infinite]'
                  : 'text-slate-600 fill-slate-800/80 scale-85 opacity-30'
              }`}
            />
          ))}
        </div>

        {/* Player Points (PTS) pill */}
        <div
          id="pill-score"
          title="Player Points (PTS)"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-2xl glass-pill border border-emerald-500/35 glow-emerald text-emerald-300 text-xs font-bold"
        >
          <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">PTS</span>
            <span className="font-mono text-sm text-emerald-300 font-black">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

