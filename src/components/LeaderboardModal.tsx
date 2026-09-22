import React, { useState, useEffect } from 'react';
import { X, Trophy, RefreshCw, User, ShieldCheck, Coins, Sparkles, Calendar, Clock } from 'lucide-react';
import { LeaderboardEntry, UserProfile, CbRewardTier } from '../types';
import { fetchMonthlyLeaderboard } from '../services/apiService';
import { sounds } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onOpenLogin: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenLogin,
}) => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [rewardTiers, setRewardTiers] = useState<CbRewardTier[]>([]);
  const [seasonTitle, setSeasonTitle] = useState<string>('Monthly Season');
  const [topWinnersCount, setTopWinnersCount] = useState<number>(10);
  const [tournamentStartDate, setTournamentStartDate] = useState<string | null>(null);
  const [tournamentEndDate, setTournamentEndDate] = useState<string | null>(null);
  const [timerLabel, setTimerLabel] = useState<string>('Season Ends In');
  const [loading, setLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate live countdown based on configured start/end dates or end of calendar month
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let targetTime: number;
      let label = 'Season Ends In';

      if (tournamentStartDate) {
        const start = new Date(tournamentStartDate.replace(' ', 'T'));
        if (!isNaN(start.getTime()) && now.getTime() < start.getTime()) {
          targetTime = start.getTime();
          label = 'Tournament Starts In';
        } else if (tournamentEndDate) {
          const end = new Date(tournamentEndDate.replace(' ', 'T'));
          if (!isNaN(end.getTime())) {
            targetTime = end.getTime();
            label = 'Tournament Ends In';
          } else {
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            targetTime = endOfMonth.getTime();
          }
        } else {
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          targetTime = endOfMonth.getTime();
        }
      } else if (tournamentEndDate) {
        const end = new Date(tournamentEndDate.replace(' ', 'T'));
        if (!isNaN(end.getTime())) {
          targetTime = end.getTime();
          label = 'Tournament Ends In';
        } else {
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          targetTime = endOfMonth.getTime();
        }
      } else {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        targetTime = endOfMonth.getTime();
      }

      const diff = Math.max(0, targetTime - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setTimerLabel(label);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tournamentStartDate, tournamentEndDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMonthlyLeaderboard();
      setLeaders(data.entries);
      setRewardTiers(data.rewardTiers);
      setSeasonTitle(data.seasonTitle);
      if (data.topWinnersCount) {
        setTopWinnersCount(data.topWinnersCount);
      }
      if (data.tournamentStartDate) {
        setTournamentStartDate(data.tournamentStartDate);
      }
      if (data.tournamentEndDate) {
        setTournamentEndDate(data.tournamentEndDate);
      }
    } catch {
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUserName = userProfile?.name || userProfile?.username || 'Player';
  const currentUserMonthPts = userProfile?.monthlyPoints || 0;

  // Derive 1st, 2nd, 3rd rewards dynamically from rewardTiers
  const tier1 = rewardTiers.find((t) => t.rank_from <= 1 && t.rank_to >= 1)?.cb_coins_reward ?? 1000;
  const tier2 = rewardTiers.find((t) => t.rank_from <= 2 && t.rank_to >= 2)?.cb_coins_reward ?? 600;
  const tier3 = rewardTiers.find((t) => t.rank_from <= 3 && t.rank_to >= 3)?.cb_coins_reward ?? 350;
  const effectiveTopWinners = topWinnersCount || (rewardTiers.length > 0 ? Math.max(...rewardTiers.map(t => t.rank_to)) : 10);

  // Find user's current eligible CB reward
  let userEligibleReward = 0;
  if (userProfile?.isLoggedIn && userProfile.rank && userProfile.rank <= effectiveTopWinners) {
    for (const t of rewardTiers) {
      if (userProfile.rank >= t.rank_from && userProfile.rank <= t.rank_to) {
        userEligibleReward = t.cb_coins_reward;
        break;
      }
    }
  }

  return (
    <div
      id="leaderboard-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="leaderboard-modal-content"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 text-white max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight font-display text-white truncate">
                  Monthly Tournament
                </h2>
                <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium truncate">
                <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{seasonTitle}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                sounds.playTap();
                loadData();
              }}
              aria-label="Refresh"
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Countdown Timer Banner */}
        <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-1.5 shadow-inner">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300">{timerLabel}:</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-black text-white">
            <span className="bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300">{timeLeft.days}d</span>
            <span className="text-cyan-400">:</span>
            <span className="bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300">{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span className="text-cyan-400">:</span>
            <span className="bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300">{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span className="text-cyan-400">:</span>
            <span className="bg-slate-950/90 px-1.5 py-0.5 rounded border border-amber-400/60 text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>

        {/* Prize Pool Highlights Banner - Clean Responsive Chips */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-amber-950/20 border border-amber-500/30 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/40 shrink-0">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Tournament Prizes
              </span>
            </div>
            <span className="text-[10px] font-black font-mono bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
              Top {effectiveTopWinners} Win
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="bg-slate-950/80 border border-amber-400/40 rounded-xl p-1.5 text-center flex flex-col items-center">
              <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                🥇 1st Place
              </span>
              <span className="font-mono font-black text-white text-xs">
                +{tier1.toLocaleString()} <span className="text-[9px] text-amber-400 font-sans">CB</span>
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-700/60 rounded-xl p-1.5 text-center flex flex-col items-center">
              <span className="text-[9px] font-bold text-slate-300 flex items-center gap-0.5">
                🥈 2nd Place
              </span>
              <span className="font-mono font-black text-white text-xs">
                +{tier2.toLocaleString()} <span className="text-[9px] text-amber-400 font-sans">CB</span>
              </span>
            </div>

            <div className="bg-slate-950/80 border border-amber-800/40 rounded-xl p-1.5 text-center flex flex-col items-center">
              <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                🥉 3rd Place
              </span>
              <span className="font-mono font-black text-white text-xs">
                +{tier3.toLocaleString()} <span className="text-[9px] text-amber-400 font-sans">CB</span>
              </span>
            </div>
          </div>
        </div>

        {/* Current User Status Banner */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          {userProfile?.isLoggedIn ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {currentUserName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Highest Level: {userProfile.highestLevel || Math.max(1, (userProfile.levelsCleared || 0) + 1)}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black font-mono text-emerald-400">
                  {currentUserMonthPts.toLocaleString()} <span className="text-[10px] font-sans">PTS</span>
                </div>
                {userEligibleReward > 0 && (
                  <span className="text-[10px] text-amber-300 font-mono font-bold flex items-center justify-end gap-1">
                    <Coins className="w-3 h-3" /> +{userEligibleReward} CB Prize
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">Guest Player (Offline)</span>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                  onOpenLogin();
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
              >
                Log In to Compete
              </button>
            </div>
          )}
        </div>

        {/* Table Column Header Strip - Perfectly aligned with rows */}
        <div className="grid grid-cols-12 items-center px-3.5 py-2 bg-slate-950/70 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-800/70">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-4 text-left truncate pl-1">Player</div>
          <div className="col-span-3 text-right pr-2 truncate">Month PTS</div>
          <div className="col-span-3 text-right truncate">CB Prize</div>
        </div>

        {/* Leaderboard Table List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 min-h-[240px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
              <RefreshCw className="w-7 h-7 animate-spin text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading Monthly Rankings...
              </span>
            </div>
          ) : leaders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs text-center p-4">
              No tournament scores recorded yet for this month. Play level 1 to get on the board!
            </div>
          ) : (
            leaders.map((entry, index) => {
              const rank = entry.rank || index + 1;
              const displayName = entry.name || entry.username || 'Player';
              const isCurrentUser =
                userProfile?.isLoggedIn &&
                (userProfile.playerId.toUpperCase() === entry.playerId.toUpperCase() ||
                  userProfile.username.toLowerCase() === entry.username.toLowerCase());

              let rankBadge = (
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  #{rank}
                </span>
              );

              if (rank === 1) {
                rankBadge = (
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.6)] shrink-0">
                    🥇
                  </span>
                );
              } else if (rank === 2) {
                rankBadge = (
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-[0_0_8px_rgba(226,232,240,0.4)] shrink-0">
                    🥈
                  </span>
                );
              } else if (rank === 3) {
                rankBadge = (
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 text-amber-200 font-black text-xs flex items-center justify-center shadow-[0_0_8px_rgba(180,83,9,0.4)] shrink-0">
                    🥉
                  </span>
                );
              }

              return (
                <div
                  key={entry.playerId + index}
                  className={`grid grid-cols-12 items-center px-3.5 py-2.5 rounded-2xl transition-all ${
                    isCurrentUser
                      ? 'bg-amber-500/15 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                      : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 flex items-center justify-center">
                    {rankBadge}
                  </div>

                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-1.5 truncate pl-1">
                    <span className="text-xs font-bold text-white truncate">
                      {displayName}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-1 py-0.2 rounded shrink-0">
                        You
                      </span>
                    )}
                  </div>

                  {/* Monthly Points */}
                  <div className="col-span-3 text-right pr-2 font-mono font-bold text-emerald-400 text-xs">
                    {(entry.monthlyPoints || entry.totalScore).toLocaleString()}
                  </div>

                  {/* CB Prize */}
                  <div className="col-span-3 text-right flex items-center justify-end">
                    {entry.cbReward && entry.cbReward > 0 ? (
                      <span className="text-[10px] font-black font-mono text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30 whitespace-nowrap">
                        +{entry.cbReward.toLocaleString()} CB
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium pr-3">—</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
