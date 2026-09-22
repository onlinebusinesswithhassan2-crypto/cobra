import React from 'react';
import { Play, Grid, Trophy, Settings, HelpCircle, ShieldCheck, User, Users, Gift, Sparkles, Heart, Infinity as InfinityIcon, ArrowRight, Award, Zap, Moon, Sun, CalendarCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface HomeScreenProps {
  unlockedLevel: number;
  totalScore: number;
  levelsCleared: number;
  userProfile?: UserProfile;
  soundEnabled: boolean;
  themeMode?: 'dark' | 'light';
  hintsRemaining: number;
  heartsRemaining?: number;
  burnsRemaining?: number;
  onPlayGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onOpenLogin: () => void;
  onOpenDailyCheckIn?: () => void;
  onOpenFriends?: () => void;
  onOpenReferrals?: () => void;
  onOpenAdminDashboard?: () => void;
  onToggleSound: () => void;
  onToggleTheme?: (mode: 'dark' | 'light') => void;
  onOpenRewardedAd?: (type: 'hint' | 'heart') => void;
  onRequestRewardedAd?: (type: 'hint' | 'heart') => void;
  remoteConfig?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  unlockedLevel = 1,
  totalScore = 0,
  levelsCleared = 0,
  userProfile,
  soundEnabled = true,
  themeMode = 'dark',
  hintsRemaining = 0,
  heartsRemaining = 0,
  onPlayGame,
  onOpenLevelSelect,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenLogin,
  onOpenDailyCheckIn,
  onOpenFriends,
  onOpenReferrals,
  onOpenAdminDashboard,
  onToggleSound,
  onToggleTheme,
  onOpenRewardedAd,
  onRequestRewardedAd,
  remoteConfig,
}) => {
  const triggerRewardedAd = onOpenRewardedAd || onRequestRewardedAd;
  const isAdsOn = remoteConfig?.adsEnabled !== false;

  return (
    <div
      id="home-screen"
      className="relative w-full max-w-[480px] mx-auto flex-1 flex flex-col justify-between p-3 sm:p-4 select-none text-white min-h-0 overflow-y-auto no-scrollbar"
    >
      {/* Background Decorative Ambient Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Player Card & Theme/Settings Quick Toggles */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-2">
        {/* Profile Card Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onOpenLogin();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel hover:border-amber-400/60 active:scale-95 transition-all shadow-lg cursor-pointer group min-w-0"
        >
          {userProfile?.isLoggedIn ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm glow-emerald shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 shrink-0">
              <User className="w-4 h-4" />
            </div>
          )}

          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-black text-white max-w-[110px] truncate">
                {userProfile?.isLoggedIn ? (userProfile.name || userProfile.username) : 'Guest Player'}
              </span>
              {userProfile?.role === 'admin' ? (
                <span className="text-[8px] font-black text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/40 uppercase shrink-0">
                  Admin
                </span>
              ) : !userProfile?.isLoggedIn && (
                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded-full border border-cyan-500/30 shrink-0">
                  Login
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold mt-0.5">
              <span className="text-amber-300 truncate">
                🪙 {(userProfile?.cbCoins || 0).toLocaleString()} CB
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 truncate">
                {(Number(totalScore) || 0).toLocaleString()} pts
              </span>
            </div>
          </div>
        </button>

        {/* Quick Theme Toggle & Settings + Admin Shortcut */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Admin Dashboard Shortcut Button */}
          {userProfile?.role === 'admin' && onOpenAdminDashboard && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onOpenAdminDashboard();
              }}
              title="Open Admin Dashboard"
              aria-label="Admin Control Panel"
              className="h-10 px-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1 cursor-pointer animate-pulse"
            >
              <span>⚙️ Admin</span>
            </button>
          )}

          {/* Quick Theme Toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onToggleTheme(themeMode === 'dark' ? 'light' : 'dark');
              }}
              aria-label="Toggle Theme Mode"
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
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="w-10 h-10 rounded-2xl jewel-button flex items-center justify-center text-slate-300 hover:text-amber-300 active:scale-95 transition-all shadow-md cursor-pointer group"
          >
            <Settings className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* CENTER HERO: Logo & Animated Snake Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2 sm:py-4 text-center">
        {/* Animated 3D Cobra Emblem Badge */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-400 via-emerald-500 to-teal-400 p-[2.5px] shadow-[0_0_35px_rgba(16,185,129,0.5)] animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] overflow-hidden relative shadow-inner">
              <img
                src="/logo.png"
                alt="Cobra Escape 3D"
                className="w-full h-full object-cover rounded-[22px] transform hover:scale-110 transition-transform duration-300"
              />
              <Sparkles className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        </div>

        {/* Game Title */}
        <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          COBRA ESCAPE 3D
        </h1>
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-400 mt-0.5">
          Tactical 3D Maze Escape
        </p>

        {/* Player Stats Quick Badge Strip */}
        <div className="flex items-center gap-3 mt-3 px-3.5 py-1.5 rounded-2xl glass-pill shadow-lg border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Level {unlockedLevel}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{levelsCleared} Cleared</span>
          </div>
        </div>
      </div>

      {/* ACTION MENU BUTTONS */}
      <div className="relative z-10 flex flex-col gap-3 pb-4">
        {/* BIG PLAY BUTTON */}
        <button
          type="button"
          id="btn-main-play"
          onClick={() => {
            sounds.playTap();
            onPlayGame();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(16,185,129,0.5)] flex items-center justify-between text-slate-950 font-black text-base tracking-wide cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-sm sm:text-base font-black leading-tight text-slate-950">
                {unlockedLevel > 1 ? `CONTINUE LEVEL ${unlockedLevel}` : 'START GAME'}
              </div>
              <div className="text-[11px] font-bold text-emerald-950/80">
                {unlockedLevel > 1 ? `${Math.max(0, 1000 - levelsCleared)} levels remaining` : 'Begin Level 1'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>

        {/* SECONDARY ROW: Level Select & Global Leaderboard */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-main-levels"
            onClick={() => {
              sounds.playTap();
              onOpenLevelSelect();
            }}
            className="p-3.5 rounded-2xl glass-panel hover:border-cyan-400/50 active:scale-95 transition-all shadow-md flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">Select Level</div>
              <div className="text-[10px] text-slate-400 font-medium">1000 Stages</div>
            </div>
          </button>

          <button
            type="button"
            id="btn-main-leaderboard"
            onClick={() => {
              sounds.playTap();
              onOpenLeaderboard();
            }}
            className="p-3.5 rounded-2xl glass-panel hover:border-amber-500/50 active:scale-95 transition-all shadow-md flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform glow-amber">
              <Trophy className="w-4 h-4 fill-amber-400/40" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300">Leaderboard</div>
              <div className="text-[10px] text-slate-400 font-medium">Monthly CB Prizes</div>
            </div>
          </button>
        </div>

        {/* 20-DAY DAILY CHECK-IN CARD */}
        {onOpenDailyCheckIn && (
          <button
            type="button"
            id="btn-main-daily-checkin"
            onClick={() => {
              sounds.playTap();
              onOpenDailyCheckIn();
            }}
            className="w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 border border-amber-400/40 hover:border-amber-300 active:scale-[0.98] transition-all shadow-md flex items-center justify-between gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform shrink-0">
                <CalendarCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-black text-white truncate">
                    20-Day Check-In
                  </span>
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-500/25 px-1.5 py-0.2 rounded-md border border-amber-500/40 uppercase shrink-0">
                    Free PTS
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium truncate">
                  Daily rewards • 24h cooldown
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/40">
              <span>Claim</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}

        {/* FRIENDS & CB GIFTS CARD */}
        {onOpenFriends && (
          <button
            type="button"
            id="btn-main-friends"
            onClick={() => {
              sounds.playTap();
              onOpenFriends();
            }}
            className="w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 border border-cyan-400/40 hover:border-cyan-300 active:scale-[0.98] transition-all shadow-md flex items-center justify-between gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
                <Users className="w-5 h-5 text-slate-950" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-black text-white truncate">
                    Friends & Gifts
                  </span>
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-500/25 px-1.5 py-0.2 rounded-md border border-amber-500/40 uppercase shrink-0">
                    Send CB
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium truncate">
                  Search Player ID • Gift CB Coins
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-xl border border-cyan-500/40">
              <span>Friends</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}

        {/* REFER & EARN CB COINS CARD */}
        {onOpenReferrals && (
          <button
            type="button"
            id="btn-main-referrals"
            onClick={() => {
              sounds.playTap();
              onOpenReferrals();
            }}
            className="w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-green-500/15 border border-emerald-400/40 hover:border-emerald-300 active:scale-[0.98] transition-all shadow-md flex items-center justify-between gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
                <Gift className="w-5 h-5 text-slate-950" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-black text-white truncate">
                    Refer & Earn
                  </span>
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/25 px-1.5 py-0.2 rounded-md border border-emerald-500/40 uppercase shrink-0">
                    CB Coins
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium truncate">
                  Invite friends • Earn on Level 100
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/40">
              <span>Earn</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}

        {/* FREE BOOSTERS ROW */}
        <div className="w-full glass-panel rounded-2xl p-2.5 shadow-md flex items-center justify-between gap-2 border border-amber-500/30 glow-amber">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/30 shrink-0">
              🎁
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-black text-white truncate">Free Boosters</span>
                <span className="text-[8px] font-mono bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded uppercase border border-amber-500/30 shrink-0">
                  ADS
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Hints: {hintsRemaining} • Lives: {heartsRemaining}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id="btn-home-ad-hint"
              onClick={() => {
                sounds.playTap();
                triggerRewardedAd?.('hint');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/25 hover:from-amber-500/40 hover:to-yellow-500/40 border border-amber-500/50 text-amber-300 font-black text-[10px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>+1 Hint</span>
            </button>
            <button
              type="button"
              id="btn-home-ad-life"
              onClick={() => {
                sounds.playTap();
                triggerRewardedAd?.('heart');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/25 to-red-500/25 hover:from-rose-500/40 hover:to-red-500/40 border border-rose-500/50 text-rose-300 font-black text-[10px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>+1 Life</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

