import React, { useState, useEffect } from 'react';
import { X, Flame, CheckCircle2, Lock, Sparkles, AlertTriangle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import { UserProfile } from '../types';
import { recordDailyCheckIn } from '../services/apiService';

export const DAILY_REWARDS: { day: number; pts: number; isMilestone?: boolean; title?: string }[] = [
  { day: 1, pts: 100 },
  { day: 2, pts: 150 },
  { day: 3, pts: 200 },
  { day: 4, pts: 250 },
  { day: 5, pts: 400, isMilestone: true, title: 'Bronze' },
  { day: 6, pts: 450 },
  { day: 7, pts: 500 },
  { day: 8, pts: 600 },
  { day: 9, pts: 700 },
  { day: 10, pts: 1000, isMilestone: true, title: 'Silver' },
  { day: 11, pts: 1100 },
  { day: 12, pts: 1200 },
  { day: 13, pts: 1300 },
  { day: 14, pts: 1500 },
  { day: 15, pts: 2000, isMilestone: true, title: 'Gold' },
  { day: 16, pts: 2200 },
  { day: 17, pts: 2500 },
  { day: 18, pts: 3000 },
  { day: 19, pts: 3500 },
  { day: 20, pts: 5000, isMilestone: true, title: 'Jackpot' },
];

export const DAILY_CHECKIN_STORAGE_KEY = 'snake_daily_checkin_streak_v2';
export const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Hours
export const MAX_MISS_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 Hours

export interface DailyCheckInState {
  currentStreak: number; // 0 to 20
  lastClaimTimestamp: number | null; // epoch timestamp in ms
}

export function getDailyCheckInStatus(userProfile?: UserProfile): {
  streak: number;
  canClaim: boolean;
  nextDayToClaim: number;
  wasReset: boolean;
  remainingMs: number;
} {
  let savedState: DailyCheckInState = {
    currentStreak: 0,
    lastClaimTimestamp: null,
  };

  try {
    const raw = localStorage.getItem(DAILY_CHECKIN_STORAGE_KEY);
    if (raw) {
      savedState = JSON.parse(raw);
    }
  } catch {}

  const now = Date.now();

  // Use highest streak known between localStorage and userProfile
  const effectiveStreak = Math.max(
    Number(savedState.currentStreak) || 0,
    Number(userProfile?.checkinStreak) || 0
  );

  // If userProfile explicitly indicates today's checkin is completed from database
  if (userProfile?.checkedInToday === true) {
    const streak = effectiveStreak || 1;
    const lastClaim = userProfile.lastClaimTimestamp || savedState.lastClaimTimestamp || now;
    const elapsed = Math.max(0, now - lastClaim);
    const remainingMs = Math.max(1000, COOLDOWN_MS - elapsed);
    const nextDay = streak >= 20 ? 1 : streak + 1;
    return {
      streak,
      canClaim: false,
      nextDayToClaim: nextDay,
      wasReset: false,
      remainingMs,
    };
  }

  // First time ever claiming
  if (!savedState.lastClaimTimestamp && !userProfile?.lastClaimTimestamp) {
    return {
      streak: effectiveStreak,
      canClaim: true,
      nextDayToClaim: effectiveStreak >= 20 ? 1 : Math.max(1, effectiveStreak + 1),
      wasReset: false,
      remainingMs: 0,
    };
  }

  const lastClaim = userProfile?.lastClaimTimestamp || savedState.lastClaimTimestamp || now;
  const elapsed = Math.max(0, now - lastClaim);

  // Active 24-Hour Cooldown
  if (elapsed < COOLDOWN_MS) {
    const remainingMs = COOLDOWN_MS - elapsed;
    const nextDay = effectiveStreak >= 20 ? 1 : effectiveStreak + 1;
    return {
      streak: effectiveStreak,
      canClaim: false,
      nextDayToClaim: nextDay,
      wasReset: false,
      remainingMs,
    };
  }

  // Claim window is open (24h has elapsed)
  const nextDay = effectiveStreak >= 20 ? 1 : effectiveStreak + 1;
  return {
    streak: effectiveStreak,
    canClaim: true,
    nextDayToClaim: nextDay,
    wasReset: false,
    remainingMs: 0,
  };
}

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimPTS: (pts: number, newStreak: number) => void;
  userProfile?: UserProfile;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onClaimPTS,
  userProfile,
}) => {
  const [status, setStatus] = useState(() => getDailyCheckInStatus(userProfile));
  const [countdown, setCountdown] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Sync when userProfile or modal open state changes
  useEffect(() => {
    setStatus(getDailyCheckInStatus(userProfile));
  }, [userProfile?.checkinStreak, userProfile?.checkedInToday, isOpen]);

  // Refresh status & live countdown
  useEffect(() => {
    const updateCountdown = () => {
      const current = getDailyCheckInStatus(userProfile);
      setStatus(current);

      if (!current.canClaim && current.remainingMs > 0) {
        const totalSecs = Math.floor(current.remainingMs / 1000);
        const hours = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSecs % 60).padStart(2, '0');
        setCountdown(`${hours}:${minutes}:${seconds}`);
      } else {
        setCountdown('');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen, userProfile?.checkinStreak, userProfile?.checkedInToday]);

  if (!isOpen) return null;

  const currentClaimDayConfig = DAILY_REWARDS.find((r) => r.day === status.nextDayToClaim) || DAILY_REWARDS[0];

  const handleClaim = () => {
    if (!status.canClaim) return;

    sounds.playBonusScore();

    // Trigger visual confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#06b6d4', '#ec4899'],
      });
    } catch {}

    const now = Date.now();
    const newStreak = status.nextDayToClaim;

    const newState: DailyCheckInState = {
      currentStreak: newStreak,
      lastClaimTimestamp: now,
    };

    try {
      localStorage.setItem(DAILY_CHECKIN_STORAGE_KEY, JSON.stringify(newState));
    } catch {}

    // Credit PTS to player total and monthly points in local state
    onClaimPTS(currentClaimDayConfig.pts, newStreak);

    // Persist to MySQL Cloud Database immediately if player has account or guest identifier
    const idToSync = userProfile?.playerId || userProfile?.username || localStorage.getItem('snake_guest_player_id');
    if (idToSync) {
      setSyncStatus('Syncing to Cloud DB...');
      recordDailyCheckIn(idToSync, newStreak, currentClaimDayConfig.pts)
        .then((res) => {
          if (res.success) {
            setSyncStatus('Synced to Database ✓');
            if (userProfile) {
              userProfile.checkedInToday = true;
              userProfile.checkinStreak = Math.max(res.streak ?? newStreak, newStreak);
              if (res.monthlyPoints !== undefined) {
                userProfile.monthlyPoints = res.monthlyPoints;
              }
              if (res.newTotalScore !== undefined) {
                userProfile.totalScore = res.newTotalScore;
              }
            }
          } else {
            setSyncStatus(res.alreadyClaimed ? 'Already claimed in DB ✓' : (res.message || 'Saved locally'));
          }
        })
        .catch(() => {
          setSyncStatus('Saved locally (Offline)');
        });
    } else {
      setSyncStatus('Saved locally');
    }

    // Update status to 24-hour cooldown
    setStatus({
      streak: newStreak,
      canClaim: false,
      nextDayToClaim: newStreak >= 20 ? 1 : newStreak + 1,
      wasReset: false,
      remainingMs: COOLDOWN_MS,
    });
  };

  return (
    <div
      id="daily-checkin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="daily-checkin-modal-content"
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 text-white max-h-[92vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center text-slate-950 shrink-0">
              <Flame className="w-6 h-6 fill-slate-950 stroke-none" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display tracking-tight text-white flex items-center gap-1.5 leading-tight">
                <span>20-Day Daily Check-In</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30">
                  {status.streak}/20
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Claim daily reward • Strictly 24h cooldown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak Miss Warning Notice */}
        {status.wasReset && (
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-2.5 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">Streak Lost!</p>
              <p className="text-[11px] text-amber-300/80">
                You missed a day! Your streak has been reset to Day 1.
              </p>
            </div>
          </div>
        )}

        {/* Current Active Claim Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-400/40 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/30">
              {status.nextDayToClaim}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {status.canClaim ? 'Ready to Claim' : 'Next Reward'}
              </div>
              <div className="text-lg font-black font-mono text-white flex items-center gap-1">
                <span>+{currentClaimDayConfig.pts.toLocaleString()} PTS</span>
                {currentClaimDayConfig.isMilestone && (
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                )}
              </div>
            </div>
          </div>

          <div>
            {status.canClaim ? (
              <button
                type="button"
                id="btn-claim-daily-pts"
                onClick={handleClaim}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md shadow-emerald-500/30 cursor-pointer animate-pulse"
              >
                Claim Now
              </button>
            ) : (
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Next in:</span>
                </div>
                <div className="text-xs font-mono font-black text-amber-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-amber-400/30">
                  {countdown || '24:00:00'}
                </div>
                {syncStatus && (
                  <span className="text-[10px] font-semibold text-emerald-400 mt-0.5">
                    {syncStatus}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 20-Day Reward Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 my-1">
          {DAILY_REWARDS.map((item) => {
            const isCompleted = item.day <= status.streak && !status.canClaim;
            const isCurrent = item.day === status.nextDayToClaim && status.canClaim;
            const isLocked = item.day > status.nextDayToClaim || (item.day === status.nextDayToClaim && !status.canClaim);

            let bgClass = 'bg-slate-800/40 border-slate-700/60 text-slate-400';
            if (isCompleted) {
              bgClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10';
            } else if (isCurrent) {
              bgClass = 'bg-amber-500/25 border-amber-400 shadow-md shadow-amber-500/25 text-white ring-2 ring-amber-400/50 animate-pulse';
            }

            return (
              <div
                key={`day-${item.day}`}
                className={`p-2 rounded-2xl border flex flex-col items-center justify-between text-center min-h-[70px] transition-all relative overflow-hidden ${bgClass}`}
              >
                {/* Milestone Ribbon */}
                {item.isMilestone && (
                  <span className="absolute top-0 right-0 text-[8px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-bl-lg">
                    {item.title}
                  </span>
                )}

                {/* Day Header */}
                <div className="text-[10px] font-bold text-slate-400">
                  Day {item.day}
                </div>

                {/* Status Icon */}
                <div className="my-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                {/* Points */}
                <div className="text-[11px] font-black font-mono text-white">
                  +{item.pts}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cooldown Footer Note */}
        <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Strict 24h wait between claims. Missing 1 day resets streak to Day 1.</span>
        </div>
      </div>
    </div>
  );
};
