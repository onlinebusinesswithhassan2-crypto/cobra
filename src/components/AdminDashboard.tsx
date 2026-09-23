import React, { useState, useEffect } from 'react';
import {
  Users, Trophy, Coins, Search, ShieldCheck, UserX, UserCheck, PlusCircle,
  MinusCircle, Save, LogOut, RefreshCw, X, AlertCircle, Sparkles, Sliders,
  History, Calendar, Award, UserPlus, CheckCircle2, Menu,
  Tv, Radio, DollarSign, PlaySquare, Heart, Flame, HelpCircle, Layers, Check
} from 'lucide-react';
import { AdminPlayer, AdminStats, CbRewardTier, UserProfile, MonthlyArchiveEntry } from '../types';
import { Lock, Key, Eye, EyeOff } from 'lucide-react';
import {
  adminGetStats, adminGetPlayers, adminUpdateCbCoins, adminTogglePlayerStatus,
  adminGetRewardsConfig, adminSaveRewardsConfig, adminGetArchives,
  adminArchiveMonth, adminUpdateReferralConfig, fetchRemoteGameConfig,
  adminUpdateCredentials, adminSaveMonetizationConfig
} from '../services/apiService';
import { sounds } from '../utils/audio';

interface AdminDashboardProps {
  currentAdmin: UserProfile;
  onLogout: () => void;
  onExitToGame: () => void;
  onAdsConfigSaved?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onLogout,
  onExitToGame,
  onAdsConfigSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'players' | 'rewards' | 'monthly_archive' | 'referrals' | 'admin_security' | 'monetization'>('players');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [tournamentStartDate, setTournamentStartDate] = useState<string>('');
  const [tournamentEndDate, setTournamentEndDate] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState<string>(currentAdmin.username || 'admin');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [savingAdminCreds, setSavingAdminCreds] = useState<boolean>(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rewardTiers, setRewardTiers] = useState<CbRewardTier[]>([]);
  const [topWinnersLimit, setTopWinnersLimit] = useState<number>(10);
  const [savingRewards, setSavingRewards] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Monetization & Remote Ads Configuration State
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [adProvider, setAdProvider] = useState<'admob' | 'unity' | 'both'>('admob');
  const [bannerEnabled, setBannerEnabled] = useState<boolean>(true);
  const [interstitialEnabled, setInterstitialEnabled] = useState<boolean>(true);
  const [rewardedEnabled, setRewardedEnabled] = useState<boolean>(true);
  const [adFrequencyLevels, setAdFrequencyLevels] = useState<number>(2);
  const [rewardHintPerAd, setRewardHintPerAd] = useState<number>(1);
  const [rewardHeartPerAd, setRewardHeartPerAd] = useState<number>(1);
  const [admobAppId, setAdmobAppId] = useState<string>('ca-app-pub-3940256099942544~3347511713');
  const [admobBannerId, setAdmobBannerId] = useState<string>('ca-app-pub-3940256099942544/6300978111');
  const [admobInterstitialId, setAdmobInterstitialId] = useState<string>('ca-app-pub-3940256099942544/1033173712');
  const [admobRewardedId, setAdmobRewardedId] = useState<string>('ca-app-pub-3940256099942544/5224354917');
  const [unityGameId, setUnityGameId] = useState<string>('');
  const [unityBannerId, setUnityBannerId] = useState<string>('');
  const [unityInterstitialId, setUnityInterstitialId] = useState<string>('');
  const [unityRewardedId, setUnityRewardedId] = useState<string>('');
  const [savingMonetization, setSavingMonetization] = useState<boolean>(false);

  // Monthly Tournament Archive & Reset State
  const [archives, setArchives] = useState<Record<string, MonthlyArchiveEntry[]>>({});
  const [archiving, setArchiving] = useState<boolean>(false);
  const [archiveTopN, setArchiveTopN] = useState<number>(10);

  // Referral System Configuration State
  const [referralReward, setReferralReward] = useState<number>(50);
  const [referralLevel, setReferralLevel] = useState<number>(100);
  const [savingReferral, setSavingReferral] = useState<boolean>(false);


  // Selected player for CB Coin adjustment modal
  const [selectedPlayer, setSelectedPlayer] = useState<AdminPlayer | null>(null);
  const [coinAmount, setCoinAmount] = useState<string>('100');
  const [coinNote, setCoinNote] = useState<string>('Tournament reward');
  const [updatingCoins, setUpdatingCoins] = useState<boolean>(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, p, r, arch, cfg] = await Promise.all([
        adminGetStats(),
        adminGetPlayers(searchQuery),
        adminGetRewardsConfig(),
        adminGetArchives(),
        fetchRemoteGameConfig(),
      ]);
      setStats(s);
      setPlayers(p);
      if (r) {
        if (Array.isArray(r)) {
          if (r.length > 0) setRewardTiers(r);
        } else if ((r as any).tiers) {
          if ((r as any).tiers.length > 0) setRewardTiers((r as any).tiers);
          if ((r as any).topWinnersCount) setTopWinnersLimit((r as any).topWinnersCount);
          if ((r as any).tournamentStartDate) setTournamentStartDate((r as any).tournamentStartDate);
          if ((r as any).tournamentEndDate) setTournamentEndDate((r as any).tournamentEndDate);
        }
      }
      if (arch && arch.success) setArchives(arch.archives);
      if (cfg) {
        if (typeof (cfg as any).referral_cb_reward === 'number') setReferralReward((cfg as any).referral_cb_reward);
        if (typeof (cfg as any).referral_required_level === 'number') setReferralLevel((cfg as any).referral_required_level);
        if ((cfg as any).tournamentStartDate && !tournamentStartDate) setTournamentStartDate((cfg as any).tournamentStartDate);
        if ((cfg as any).tournamentEndDate && !tournamentEndDate) setTournamentEndDate((cfg as any).tournamentEndDate);
        if (typeof (cfg as any).tournament_top_winners_count === 'number') {
          setArchiveTopN((cfg as any).tournament_top_winners_count);
          setTopWinnersLimit((cfg as any).tournament_top_winners_count);
        }
        if (cfg.adsEnabled !== undefined) setAdsEnabled(cfg.adsEnabled);
        if (cfg.adProvider) setAdProvider(cfg.adProvider);
        if (cfg.bannerEnabled !== undefined) setBannerEnabled(cfg.bannerEnabled);
        if (cfg.interstitialEnabled !== undefined) setInterstitialEnabled(cfg.interstitialEnabled);
        if (cfg.rewardedEnabled !== undefined) setRewardedEnabled(cfg.rewardedEnabled);
        if (cfg.adFrequencyLevels) setAdFrequencyLevels(cfg.adFrequencyLevels);
        if (cfg.rewardHintPerAd) setRewardHintPerAd(cfg.rewardHintPerAd);
        if (cfg.rewardHeartPerAd) setRewardHeartPerAd(cfg.rewardHeartPerAd);
        if (cfg.admobAppId !== undefined) setAdmobAppId(cfg.admobAppId);
        if (cfg.admobBannerId) setAdmobBannerId(cfg.admobBannerId);
        if (cfg.admobInterstitialId) setAdmobInterstitialId(cfg.admobInterstitialId);
        if (cfg.admobRewardedId) setAdmobRewardedId(cfg.admobRewardedId);
        if (cfg.unityGameId !== undefined) setUnityGameId(cfg.unityGameId);
        if (cfg.unityBannerId !== undefined) setUnityBannerId(cfg.unityBannerId);
        if (cfg.unityInterstitialId !== undefined) setUnityInterstitialId(cfg.unityInterstitialId);
        if (cfg.unityRewardedId !== undefined) setUnityRewardedId(cfg.unityRewardedId);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const p = await adminGetPlayers(searchQuery);
    setPlayers(p);
    setLoading(false);
  };

  const handleAdjustCoins = async (isAddition: boolean) => {
    if (!selectedPlayer) return;
    const num = parseFloat(coinAmount);
    if (isNaN(num) || num <= 0) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a valid positive number' });
      return;
    }

    setUpdatingCoins(true);
    const finalAmount = isAddition ? num : -num;
    const res = await adminUpdateCbCoins(selectedPlayer.id, finalAmount, coinNote);
    setUpdatingCoins(false);

    if (res.success) {
      sounds.playBonusScore();
      setFeedbackMessage({ type: 'success', text: res.message || 'CB Coins balance updated!' });
      // Update local state
      setPlayers((prev) =>
        prev.map((p) => (p.id === selectedPlayer.id ? { ...p, cb_coins: res.newBalance ?? p.cb_coins + finalAmount } : p))
      );
      setSelectedPlayer(null);
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || 'Update failed' });
    }
  };

  const handleToggleStatus = async (player: AdminPlayer) => {
    const nextStatus = player.status === 'active' ? 'banned' : 'active';
    sounds.playTap();
    const res = await adminTogglePlayerStatus(player.id, nextStatus);
    if (res.success) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, status: nextStatus } : p))
      );
      setFeedbackMessage({ type: 'success', text: `Player ${player.name} is now ${nextStatus}` });
    }
  };

  const handleSaveRewards = async () => {
    setSavingRewards(true);
    sounds.playTap();
    const ok = await adminSaveRewardsConfig(
      rewardTiers,
      topWinnersLimit,
      tournamentStartDate ? tournamentStartDate.replace('T', ' ') : null,
      tournamentEndDate ? tournamentEndDate.replace('T', ' ') : null
    );
    setSavingRewards(false);
    if (ok) {
      setFeedbackMessage({ type: 'success', text: `Tournament dates, CB Coin prizes & Top ${topWinnersLimit} winners saved successfully!` });
    } else {
      setFeedbackMessage({ type: 'error', text: 'Failed to save rewards configuration' });
    }
  };

  const handleSaveAdminCredentials = async () => {
    const cleanUser = adminUsername.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setFeedbackMessage({ type: 'error', text: 'Username must be at least 3 characters' });
      return;
    }

    if (adminPassword) {
      if (adminPassword.length < 4) {
        setFeedbackMessage({ type: 'error', text: 'Password must be at least 4 characters' });
        return;
      }
      if (adminPassword !== adminConfirmPassword) {
        setFeedbackMessage({ type: 'error', text: 'Passwords do not match!' });
        return;
      }
    }

    setSavingAdminCreds(true);
    sounds.playTap();
    const adminId = currentAdmin.id ? Number(currentAdmin.id) : 1;
    const res = await adminUpdateCredentials(adminId, cleanUser, adminPassword || undefined);
    setSavingAdminCreds(false);

    if (res.success) {
      sounds.playBonusScore();
      setFeedbackMessage({ type: 'success', text: res.message || 'Admin credentials updated!' });
      setAdminPassword('');
      setAdminConfirmPassword('');
      if (res.admin?.username) {
        setAdminUsername(res.admin.username);
        currentAdmin.username = res.admin.username;
      }
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || 'Failed to update credentials' });
    }
  };

  const handleTriggerArchive = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to end this month's tournament? \n\n` +
      `- Top ${archiveTopN} players will be permanently archived and receive CB Coin rewards.\n` +
      `- ALL player Monthly Points will be reset to 0 for the new month!\n\n` +
      `Proceed?`
    );
    if (!confirmed) return;

    setArchiving(true);
    sounds.playTap();
    const res = await adminArchiveMonth(archiveTopN);
    setArchiving(false);
    if (res.success) {
      sounds.playBonusScore();
      setFeedbackMessage({
        type: 'success',
        text: res.message || `Archived Top ${archiveTopN} winners and reset monthly points for the new month!`,
      });
      loadAll();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || 'Failed to archive monthly tournament' });
    }
  };

  const handleSaveReferralConfig = async () => {
    setSavingReferral(true);
    sounds.playTap();
    const res = await adminUpdateReferralConfig(referralReward, referralLevel, archiveTopN);
    setSavingReferral(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'Referral reward settings updated successfully!' });
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || 'Failed to update referral settings' });
    }
  };

  const handleSaveMonetization = async () => {
    setSavingMonetization(true);
    sounds.playTap();
    const res = await adminSaveMonetizationConfig({
      adsEnabled,
      adProvider,
      bannerEnabled,
      interstitialEnabled,
      rewardedEnabled,
      adFrequencyLevels,
      rewardHintPerAd,
      rewardBurnPerAd: 0,
      rewardHeartPerAd,
      admobAppId,
      admobBannerId,
      admobInterstitialId,
      admobRewardedId,
      unityGameId,
      unityBannerId,
      unityInterstitialId,
      unityRewardedId,
    });
    setSavingMonetization(false);
    if (res.success) {
      sounds.playBonusScore();
      setFeedbackMessage({ type: 'success', text: 'Monetization and advertising settings saved successfully!' });
      onAdsConfigSaved?.();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || 'Failed to save monetization settings' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden select-none">
      {/* Slide-out Mobile & Tablet Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dark Blur Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-72 sm:w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white truncate">{currentAdmin.name}</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/40 uppercase shrink-0">
                    Staff
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">@{currentAdmin.username}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsSidebarOpen(false);
              }}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Menu Navigation Items */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 py-1.5">
              Dashboard Navigation
            </div>

            {/* 1. Players Directory */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab('players');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'players'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'players' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <span>Players Directory</span>
              </div>
              {stats && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {stats.total_players}
                </span>
              )}
            </button>

            {/* 2. Prize Tiers & Dates */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab('rewards');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'rewards' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                  <Trophy className="w-4 h-4" />
                </div>
                <span>Prize Tiers & Dates</span>
              </div>
            </button>

            {/* 3. Monthly Archives */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab('monthly_archive');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'monthly_archive'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'monthly_archive' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                  <History className="w-4 h-4" />
                </div>
                <span>Monthly Archives</span>
              </div>
            </button>

            {/* 4. Referral Config */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab('referrals');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'referrals'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'referrals' ? 'bg-purple-500 text-white font-black' : 'bg-slate-800 text-slate-400'}`}>
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>Referral Config</span>
              </div>
            </button>

            {/* 5. Admin Security */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab('admin_security');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'admin_security'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md shadow-rose-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'admin_security' ? 'bg-rose-500 text-white font-black' : 'bg-slate-800 text-slate-400'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Admin Security</span>
              </div>
            </button>

            {/* 6. Monetization & Ads */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab('monetization');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'monetization'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'monetization' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                  <Tv className="w-4 h-4" />
                </div>
                <span>Monetization & Ads</span>
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${adsEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                {adsEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-800 flex flex-col gap-2 bg-slate-950/70">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsSidebarOpen(false);
                onExitToGame();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Play Game</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsSidebarOpen(false);
                onLogout();
              }}
              className="w-full py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Hamburger Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setIsSidebarOpen(true);
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
            title="Open Menu Drawer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center text-slate-950 font-black shrink-0 hidden xs:flex">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-base font-black font-display tracking-tight text-white leading-tight truncate">
                ADMIN CONTROL
              </h1>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/40 uppercase shrink-0">
                Staff
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              <span className="hidden sm:inline">Logged in as </span>
              <span className="text-emerald-400 font-bold">{currentAdmin.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onExitToGame}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Play Game</span>
            <span className="sm:hidden">Game</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-2 sm:px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 border border-red-500/30 transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-3 sm:px-4 py-2 sm:py-3 shrink-0">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="bg-slate-800/60 p-2 sm:p-2.5 rounded-2xl border border-white/5 flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">Players</div>
              <div className="text-xs sm:text-sm font-black font-mono text-white truncate">
                {stats?.total_players.toLocaleString() ?? '—'}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-2 sm:p-2.5 rounded-2xl border border-white/5 flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">Monthly Active</div>
              <div className="text-xs sm:text-sm font-black font-mono text-emerald-400 truncate">
                {stats?.active_this_month.toLocaleString() ?? '—'}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-2 sm:p-2.5 rounded-2xl border border-white/5 flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">Total CB</div>
              <div className="text-xs sm:text-sm font-black font-mono text-amber-300 truncate">
                {stats?.total_cb_coins.toLocaleString() ?? '—'} CB
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-2 sm:p-2.5 rounded-2xl border border-white/5 flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">Cleared</div>
              <div className="text-xs sm:text-sm font-black font-mono text-white truncate">
                {stats?.total_levels_cleared.toLocaleString() ?? '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation: Responsive Scrollable Pills Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-2 sm:py-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('players')}
            className={`py-1.5 sm:py-3 px-3 sm:px-0 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 rounded-xl sm:rounded-none ${
              activeTab === 'players'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10 sm:bg-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Players</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`py-1.5 sm:py-3 px-3 sm:px-0 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 rounded-xl sm:rounded-none ${
              activeTab === 'rewards'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 sm:bg-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Prizes & Dates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly_archive')}
            className={`py-1.5 sm:py-3 px-3 sm:px-0 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 rounded-xl sm:rounded-none ${
              activeTab === 'monthly_archive'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 sm:bg-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Archives</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('referrals')}
            className={`py-1.5 sm:py-3 px-3 sm:px-0 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 rounded-xl sm:rounded-none ${
              activeTab === 'referrals'
                ? 'border-purple-400 text-purple-400 bg-purple-500/10 sm:bg-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Referrals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin_security')}
            className={`py-1.5 sm:py-3 px-3 sm:px-0 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 rounded-xl sm:rounded-none ${
              activeTab === 'admin_security'
                ? 'border-rose-400 text-rose-400 bg-rose-500/10 sm:bg-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monetization')}
            className={`py-1.5 sm:py-3 px-3 sm:px-0 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 rounded-xl sm:rounded-none ${
              activeTab === 'monetization'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10 sm:bg-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Monetization</span>
            <span className={`text-[8px] font-black font-mono px-1.5 py-0.5 rounded-full ${adsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {adsEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMessage && (
        <div
          className={`mx-4 mt-3 max-w-5xl self-center w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto">
          {/* TAB 1: PLAYERS DIRECTORY */}
          {activeTab === 'players' && (
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Player ID (e.g. SNK-1001) or Player Name..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    loadAll();
                  }}
                  className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Refresh Players List"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </form>

              {/* Players Table */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Player ID</th>
                        <th className="py-3 px-4">Player Name</th>
                        <th className="py-3 px-4 text-center">Month PTS</th>
                        <th className="py-3 px-4 text-center">Levels</th>
                        <th className="py-3 px-4 text-center">CB Coins</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500 font-bold">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                            Loading players directory...
                          </td>
                        </tr>
                      ) : players.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                            No players found matching your search.
                          </td>
                        </tr>
                      ) : (
                        players.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                              {p.player_id}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{p.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">@{p.username}</div>
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                              {(p.monthly_points || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-300">
                              {p.levels_cleared_monthly || 0}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-black text-amber-300">
                              {(Number(p.cb_coins) || 0).toLocaleString()} CB
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  p.status === 'banned'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedPlayer(p);
                                    setCoinAmount('100');
                                    setCoinNote('Administrative deduction');
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <MinusCircle className="w-3.5 h-3.5" />
                                  <span>Deduct CB</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(p)}
                                  title={p.status === 'active' ? 'Ban Player' : 'Unban Player'}
                                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                    p.status === 'active'
                                      ? 'bg-red-500/15 hover:bg-red-500/25 border-red-500/30 text-red-400'
                                      : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-400'
                                  }`}
                                >
                                  {p.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MONTHLY CB COIN PRIZES CONFIG */}
          {activeTab === 'rewards' && (
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col gap-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Monthly Leaderboard CB Coin Rewards</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure how many top players win rewards and the exact CB Coins prize for each leaderboard rank tier.
                </p>
              </div>

              {/* Top Winners Count Selector Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Top Winners Eligible for Prizes</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select how many top players win prizes (Leaderboard displays "Top {topWinnersLimit} Win").
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[3, 5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTopWinnersLimit(num)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        topWinnersLimit === num
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Top {num}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold">Custom:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={topWinnersLimit}
                      onChange={(e) => setTopWinnersLimit(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 bg-transparent text-white font-mono font-bold text-xs text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Competition Schedule Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-slate-950 to-emerald-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Tournament Competition Dates</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select a custom Start Date and End Date. (Leave empty to use automatic calendar month countdown).
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={tournamentStartDate ? tournamentStartDate.replace(' ', 'T').slice(0, 16) : ''}
                      onChange={(e) => setTournamentStartDate(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={tournamentEndDate ? tournamentEndDate.replace(' ', 'T').slice(0, 16) : ''}
                      onChange={(e) => setTournamentEndDate(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  {(tournamentStartDate || tournamentEndDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTournamentStartDate('');
                        setTournamentEndDate('');
                      }}
                      className="self-end px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      Clear Dates
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {rewardTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm flex items-center justify-center shrink-0">
                        #{tier.rank_from}{tier.rank_to > tier.rank_from ? `-${tier.rank_to}` : ''}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={tier.reward_title}
                          onChange={(e) => {
                            const copy = [...rewardTiers];
                            copy[idx].reward_title = e.target.value;
                            setRewardTiers(copy);
                          }}
                          className="bg-transparent text-white font-bold text-xs focus:outline-none border-b border-transparent focus:border-cyan-400 transition-colors"
                        />
                        <div className="text-[10px] text-slate-400">
                          Ranks {tier.rank_from} to {tier.rank_to}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-slate-400 font-medium">Prize:</span>
                      <div className="relative">
                        <input
                          type="number"
                          value={tier.cb_coins_reward}
                          onChange={(e) => {
                            const copy = [...rewardTiers];
                            copy[idx].cb_coins_reward = parseFloat(e.target.value) || 0;
                            setRewardTiers(copy);
                          }}
                          className="w-28 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono font-black text-sm text-right pr-9 focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold pointer-events-none">
                          CB
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveRewards}
                  disabled={savingRewards}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingRewards ? 'Saving...' : 'Save Prize Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY ARCHIVES & TOURNAMENT RESET */}
          {activeTab === 'monthly_archive' && (
            <div className="flex flex-col gap-6">
              {/* Monthly Finalization Control Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <History className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-black text-white">Finalize & Archive Current Month</h3>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Archive the current top tournament winners, grant their CB Coin rewards, and reset all player monthly points to 0 for the new month.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
                    <button
                      type="button"
                      onClick={() => setArchiveTopN(5)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        archiveTopN === 5 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Top 5
                    </button>
                    <button
                      type="button"
                      onClick={() => setArchiveTopN(10)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        archiveTopN === 10 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Top 10
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerArchive}
                    disabled={archiving}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Award className="w-4 h-4" />
                    <span>{archiving ? 'Archiving...' : `Archive Top ${archiveTopN} & Reset`}</span>
                  </button>
                </div>
              </div>

              {/* Past Archives List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Past Tournament Winners Records
                  </h4>
                  <button
                    type="button"
                    onClick={loadAll}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                {Object.keys(archives).length === 0 ? (
                  <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-10 text-center text-slate-500">
                    <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-300">No Past Archived Tournaments</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      When a month concludes, click "Archive Top 5 / Top 10 & Reset" to preserve leaderboard history and grant rewards.
                    </p>
                  </div>
                ) : (
                  (Object.entries(archives) as [string, MonthlyArchiveEntry[]][]).map(([month, entries]) => (
                    <div key={month} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-black text-white">{month} Season Winners</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {entries.length} Champions Archived
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950/40 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800/80">
                            <tr>
                              <th className="py-2.5 px-4">Rank</th>
                              <th className="py-2.5 px-4">Player</th>
                              <th className="py-2.5 px-4 text-center">Score</th>
                              <th className="py-2.5 px-4 text-center">Level</th>
                              <th className="py-2.5 px-4 text-right">CB Reward</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {entries.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold">
                                  {item.rank_position === 1 && '🥇 Rank 1'}
                                  {item.rank_position === 2 && '🥈 Rank 2'}
                                  {item.rank_position === 3 && '🥉 Rank 3'}
                                  {item.rank_position > 3 && `#${item.rank_position}`}
                                </td>
                                <td className="py-3 px-4 font-bold text-white">
                                  {item.player_name}
                                </td>
                                <td className="py-3 px-4 text-center font-mono text-cyan-300">
                                  {(item.score || 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-center font-mono text-slate-300">
                                  Level {item.level_reached || 1}
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-black text-amber-400">
                                  +{(item.reward_coins || 0).toLocaleString()} CB
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REFERRAL CONFIGURATION */}
          {activeTab === 'referrals' && (
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Level-100 Referral Program Configuration</h3>
                    <p className="text-xs text-slate-400">
                      Configure CB Coin rewards and verification level requirements for players who invite friends.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      CB Coins Reward per Verified Referral
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={referralReward}
                        onChange={(e) => setReferralReward(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono font-black text-sm pr-12 focus:outline-none focus:border-purple-400"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                        CB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Awarded to referrer as soon as their friend conquers the required level.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Required Level for Verification
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={referralLevel}
                        onChange={(e) => setReferralLevel(parseInt(e.target.value, 10) || 100)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-black text-sm pr-14 focus:outline-none focus:border-purple-400"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                        Levels
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Friend remains "Unverified" until they clear this level (Default: Level 100).
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-5">
                  <button
                    type="button"
                    onClick={handleSaveReferralConfig}
                    disabled={savingReferral}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingReferral ? 'Saving...' : 'Save Referral Configuration'}</span>
                  </button>
                </div>
              </div>

              {/* System Logic Overview */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Referral Lifecycle Rules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5">
                    <span className="font-bold text-slate-200 block mb-1">1. Referral Code</span>
                    Player username automatically functions as their unique invite code.
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5">
                    <span className="font-bold text-amber-300 block mb-1">2. Unverified Status</span>
                    When a friend joins or binds, they are marked Unverified and tracked on the referrer's dashboard.
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5">
                    <span className="font-bold text-emerald-300 block mb-1">3. Level 100 Reward</span>
                    Upon clearing Level 100, the status switches to Verified and CB Coins are automatically credited!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN SECURITY & CREDENTIALS */}
          {activeTab === 'admin_security' && (
            <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <span>Admin Security & Login Credentials</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your Master Admin username and secret password. Changes take effect immediately.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-4 max-w-xl">
                {/* Username Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin Username</span>
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Must be at least 3 characters.
                  </span>
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Minimum 4 characters. Leave empty if you only want to change your username.
                  </span>
                </div>

                {/* Confirm Password Input */}
                {adminPassword.length > 0 && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Confirm New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminConfirmPassword}
                        onChange={(e) => setAdminConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        title={showAdminPassword ? 'Hide password' : 'Show password'}
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveAdminCredentials}
                    disabled={savingAdminCreds}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingAdminCreds ? 'Saving Changes...' : 'Update Admin Credentials'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MONETIZATION & ADS MANAGEMENT */}
          {activeTab === 'monetization' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Header Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl shadow-amber-950/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Monetization & Ads Control</span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-black ${adsEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                        {adsEnabled ? '● Ads Running' : '○ Ads Paused'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Configure Google AdMob & Unity Ads, level completion triggers, and rewarded video perks without rebuilding the app.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveMonetization}
                  disabled={savingMonetization}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingMonetization ? 'Saving...' : 'Save All Settings'}</span>
                </button>
              </div>

              {/* SECTION 1: MASTER KILL-SWITCH & AD NETWORK SELECTOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Master Switch Card */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-amber-400" />
                        <span>Master In-Game Ads Switch</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instant kill-switch. Keep this <strong>OFF</strong> during initial Play Store review. Toggle <strong>ON</strong> once approved!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setAdsEnabled(!adsEnabled);
                    }}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-98 cursor-pointer ${
                      adsEnabled
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 shadow-rose-950/20'
                    }`}
                  >
                    {adsEnabled ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>ADS ARE ACTIVE & LIVE</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span>ALL ADS CURRENTLY PAUSED (SAFE FOR REVIEW)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Network & Mediation Selector */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Primary Ad Network</span>
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choose your ad provider or run both with <strong>AdMob Mediation</strong> to maximize your game revenue.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'admob', label: 'AdMob', desc: 'Google Ads' },
                      { id: 'unity', label: 'Unity Ads', desc: 'Game Ads' },
                      { id: 'both', label: 'Mediation', desc: 'Best eCPM' },
                    ].map((prov) => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setAdProvider(prov.id as any);
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          adProvider === prov.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/40'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-black">{prov.label}</div>
                        <div className="text-[10px] text-slate-500">{prov.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: AD PLACEMENTS & FREQUENCY RULES */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 shadow-lg">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wide">
                      Ad Formats & Level Trigger Rules
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Banner Switch */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-white">Banner Ads</div>
                      <div className="text-[10px] text-slate-400">Bottom screen display</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setBannerEnabled(!bannerEnabled);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer transition-colors ${
                        bannerEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {bannerEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  {/* Interstitial Switch */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-white">Interstitial Ads</div>
                      <div className="text-[10px] text-slate-400">Full-screen level ads</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setInterstitialEnabled(!interstitialEnabled);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer transition-colors ${
                        interstitialEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {interstitialEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  {/* Rewarded Switch */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-white">Rewarded Videos</div>
                      <div className="text-[10px] text-slate-400">Extra hints / lives ads</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setRewardedEnabled(!rewardedEnabled);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer transition-colors ${
                        rewardedEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {rewardedEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                {/* Frequency Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-white">Level Complete Interstitial Frequency</div>
                    <div className="text-[10px] text-slate-400">Show full-screen ad every N puzzle levels completed</div>
                  </div>

                  <div className="flex gap-1.5">
                    {[1, 2, 3, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setAdFrequencyLevels(lvl);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          adFrequencyLevels === lvl
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Every {lvl} {lvl === 1 ? 'Level' : 'Levels'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: REWARDED VIDEO PLAYER PERKS */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 shadow-lg">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wide">
                      Rewarded Video Player Perks (Reward Quantities)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Granted to players upon watching full ad</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Hints Per Ad */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                      <HelpCircle className="w-4 h-4" />
                      <span>Hints Per Ad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={rewardHintPerAd}
                        onChange={(e) => setRewardHintPerAd(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono font-black text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-xs text-slate-500 font-bold">Hints</span>
                    </div>
                  </div>

                  {/* Hearts/Lives Per Ad */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-black text-rose-400">
                      <Heart className="w-4 h-4" />
                      <span>Hearts / Lives Per Ad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={rewardHeartPerAd}
                        onChange={(e) => setRewardHeartPerAd(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono font-black text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                      <span className="text-xs text-slate-500 font-bold">Hearts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: LIVE AD NETWORK CREDENTIALS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Google AdMob IDs */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-black text-xs">
                        G
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Google AdMob Unit IDs</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Android Production</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">AdMob App ID</label>
                      <input
                        type="text"
                        value={admobAppId}
                        onChange={(e) => setAdmobAppId(e.target.value)}
                        placeholder="e.g. ca-app-pub-3940256099942544~3347511713"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Banner Ad Unit ID</label>
                      <input
                        type="text"
                        value={admobBannerId}
                        onChange={(e) => setAdmobBannerId(e.target.value)}
                        placeholder="e.g. ca-app-pub-3940256099942544/6300978111"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Interstitial Ad Unit ID</label>
                      <input
                        type="text"
                        value={admobInterstitialId}
                        onChange={(e) => setAdmobInterstitialId(e.target.value)}
                        placeholder="e.g. ca-app-pub-3940256099942544/1033173712"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Rewarded Video Ad Unit ID</label>
                      <input
                        type="text"
                        value={admobRewardedId}
                        onChange={(e) => setAdmobRewardedId(e.target.value)}
                        placeholder="e.g. ca-app-pub-3940256099942544/5224354917"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Unity Ads IDs */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                        U
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Unity Ads Placement IDs</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Unity Monetization</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Unity Game ID (Android)</label>
                      <input
                        type="text"
                        value={unityGameId}
                        onChange={(e) => setUnityGameId(e.target.value)}
                        placeholder="e.g. 5123456"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Banner Placement ID</label>
                      <input
                        type="text"
                        value={unityBannerId}
                        onChange={(e) => setUnityBannerId(e.target.value)}
                        placeholder="e.g. Banner_Android"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Interstitial Placement ID</label>
                      <input
                        type="text"
                        value={unityInterstitialId}
                        onChange={(e) => setUnityInterstitialId(e.target.value)}
                        placeholder="e.g. Interstitial_Android"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Rewarded Placement ID</label>
                      <input
                        type="text"
                        value={unityRewardedId}
                        onChange={(e) => setUnityRewardedId(e.target.value)}
                        placeholder="e.g. Rewarded_Android"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="text-xs text-slate-400">
                  Changes take effect immediately across all active players upon saving.
                </div>
                <button
                  type="button"
                  onClick={handleSaveMonetization}
                  disabled={savingMonetization}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingMonetization ? 'Saving Settings...' : 'Save Monetization Settings'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: ADJUST CB COINS FOR PLAYER */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-white animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Deduct CB Coins</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedPlayer.name} ({selectedPlayer.player_id})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlayer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Balance:</span>
              <span className="font-mono font-black text-amber-300 text-sm">
                {(Number(selectedPlayer.cb_coins) || 0).toLocaleString()} CB
              </span>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Deduction Amount (CB Coins)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-red-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                  CB
                </span>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-1.5 mt-2">
                {[50, 100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCoinAmount(String(amt))}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                value={coinNote}
                onChange={(e) => setCoinNote(e.target.value)}
                placeholder="e.g. Penalty, Administrative deduction, Correction"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleAdjustCoins(false)}
                disabled={updatingCoins}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                <MinusCircle className="w-4 h-4" />
                <span>Deduct CB Coins</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
