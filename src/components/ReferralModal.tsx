import React, { useState, useEffect, useCallback } from 'react';
import { X, Users, Gift, CheckCircle2, Clock, Copy, Check, Share2, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Search } from 'lucide-react';
import { UserProfile, ReferralDataResponse } from '../types';
import { fetchReferralData, bindReferralCode, claimReferralReward } from '../services/apiService';
import { sounds } from '../utils/audio';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onOpenLogin?: () => void;
  onCbCoinsUpdated?: (newBalance: number) => void;
}

const PAGE_SIZE = 5;

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenLogin,
  onCbCoinsUpdated,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ReferralDataResponse | null>(null);
  const [bindInput, setBindInput] = useState<string>('');
  const [binding, setBinding] = useState<boolean>(false);
  const [bindMessage, setBindMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimMessage, setClaimMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Search & Pagination State
  const [searchReferral, setSearchReferral] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadData = useCallback(async () => {
    if (!userProfile?.playerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchReferralData(userProfile.playerId);
      if (res) {
        setData(res);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userProfile?.playerId]);

  useEffect(() => {
    if (isOpen) {
      setBindMessage(null);
      setBindInput('');
      setCopied(false);
      setSearchReferral('');
      setCurrentPage(1);
      loadData();
    }
  }, [isOpen, loadData]);

  if (!isOpen) return null;

  const myCode = data?.my_code || userProfile?.username || userProfile?.name || '---';
  const rewardAmount = data?.reward_amount ?? 50;
  const reqLevel = data?.required_level ?? 100;

  const handleCopyCode = () => {
    if (!myCode || myCode === '---') return;
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    const text = `🐍 Join me in Cobra Escape! Use my referral username "${myCode}" when you register or bind it in-game to earn rewards! Can you conquer Level ${reqLevel}?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Play Cobra Escape',
          text,
          url: 'https://aqsacollections.store/server_api/privacy.php',
        });
      } catch {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  const handleBind = async () => {
    if (!userProfile?.playerId) return;
    const trimmed = bindInput.trim();
    if (!trimmed) {
      setBindMessage({ text: 'Please enter a referral username', isError: true });
      return;
    }

    setBinding(true);
    setBindMessage(null);
    try {
      const res = await bindReferralCode(userProfile.playerId, trimmed);
      setBindMessage({ text: res.message, isError: !res.success });
      if (res.success) {
        setBindInput('');
        loadData();
      }
    } catch {
      setBindMessage({ text: 'Network error binding referral.', isError: true });
    } finally {
      setBinding(false);
    }
  };

  const handleClaim = async (referralId: number, friendUsername: string) => {
    if (!userProfile?.playerId || claimingId) return;
    setClaimingId(referralId);
    setClaimMessage(null);
    sounds.playTap();
    try {
      const res = await claimReferralReward(referralId, userProfile.playerId);
      if (res.success) {
        sounds.playBonusScore();
        if (res.newBalance !== undefined && onCbCoinsUpdated) {
          onCbCoinsUpdated(res.newBalance);
        }
        setClaimMessage({
          text: res.message || `+${res.reward || rewardAmount} CB Coins claimed for referring @${friendUsername}!`,
          isError: false,
        });
        await loadData();
      } else {
        setClaimMessage({ text: res.message || 'Failed to claim reward', isError: true });
      }
    } catch {
      setClaimMessage({ text: 'Error claiming referral reward', isError: true });
    } finally {
      setClaimingId(null);
    }
  };

  // Filtered referrals by search
  const filteredReferrals = (data?.referrals || []).filter((item) => {
    if (!searchReferral.trim()) return true;
    const q = searchReferral.trim().toLowerCase();
    return item.username.toLowerCase().includes(q) || (item.name && item.name.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentReferralSlice = filteredReferrals.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5 truncate">
                <span>Refer & Earn</span>
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              </h2>
              <p className="text-[11px] text-emerald-400 font-medium truncate">
                Earn {rewardAmount} CB Coins per friend at Level {reqLevel}!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* Claim Notification Banner */}
          {claimMessage && (
            <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
              claimMessage.isError
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              {claimMessage.isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span>{claimMessage.text}</span>
            </div>
          )}

          {/* Not logged in prompt */}
          {(!userProfile || !userProfile.isLoggedIn) && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div className="text-xs text-amber-200">
                  <p className="font-bold text-amber-300">Login to participate!</p>
                  <p className="text-[11px]">Sign in to get your referral code and claim rewards.</p>
                </div>
              </div>
              {onOpenLogin && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition shrink-0 cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          )}

          {/* Section 1: My Referral Code Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Your Referral Code
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Username Based
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 gap-2.5">
              <span className="font-mono text-base sm:text-lg font-black text-amber-400 tracking-wider truncate">
                {myCode}
              </span>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95 shadow-sm cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              Your referral code is your username. Share with friends to bind when joining!
            </p>
          </div>

          {/* Section 2: Bind a Friend's Code */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Bind Referrer Code</span>
              {data?.has_bound_code && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Bound to @{data.bound_to}
                </span>
              )}
            </div>

            {data?.has_bound_code ? (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>You linked with referrer <strong>@{data.bound_to}</strong>. Conquer Level {reqLevel} to unlock their reward!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter friend's username..."
                    value={bindInput}
                    onChange={(e) => setBindInput(e.target.value)}
                    disabled={binding || !userProfile?.isLoggedIn}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    onClick={handleBind}
                    disabled={binding || !userProfile?.isLoggedIn || !bindInput.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
                  >
                    {binding ? 'Binding...' : (
                      <>
                        <span>Bind</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
                {bindMessage && (
                  <p className={`text-xs ${bindMessage.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {bindMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: How it Works Rules */}
          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-3.5 sm:p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Referral Program Rules
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-800 text-indigo-200 text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">1</span>
                <span>Invite friends by sharing your username code.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-800 text-indigo-200 text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">2</span>
                <span>When they bind your code, they appear as <strong className="text-amber-400">Unverified</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-800 text-indigo-200 text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">3</span>
                <span>Once they reach <strong className="text-emerald-400">Level {reqLevel}</strong>, the <strong className="text-amber-400">Claim Reward</strong> button unlocks and you get <strong className="text-amber-300">+{rewardAmount} CB Coins</strong>!</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Referral Stats Cards - Responsive 2x2 on Mobile, 4-col on Tablet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            <div className="bg-slate-800/80 border border-slate-700/80 p-2.5 sm:p-3 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">Total</div>
              <div className="text-base sm:text-lg font-black text-white font-mono">{data?.stats?.total_referrals ?? 0}</div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 sm:p-3 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400 mb-0.5 tracking-wider">Verified</div>
              <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">{data?.stats?.verified_referrals ?? 0}</div>
            </div>
            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400 mb-0.5 tracking-wider">Unverified</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono">{data?.stats?.unverified_referrals ?? 0}</div>
            </div>
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-2.5 sm:p-3 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-300 mb-0.5 tracking-wider">CB Earned</div>
              <div className="text-base sm:text-lg font-black text-amber-400 font-mono">{data?.stats?.total_cb_earned ?? 0}</div>
            </div>
          </div>

          {/* Section 5: List of Referrals with Search and Pagination */}
          <div className="space-y-2.5 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Referred Players ({filteredReferrals.length})</span>
              </h3>

              {data?.referrals && data.referrals.length > 0 && (
                <div className="relative flex-1 sm:max-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search referral..."
                    value={searchReferral}
                    onChange={(e) => {
                      setSearchReferral(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  {searchReferral && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchReferral('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p>Loading referral list...</p>
              </div>
            ) : !data?.referrals || data.referrals.length === 0 ? (
              <div className="bg-slate-900/50 border border-dashed border-slate-700/80 rounded-2xl p-6 text-center text-slate-400">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No referrals yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Share your username code with friends to start earning CB coins!
                </p>
              </div>
            ) : filteredReferrals.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-center text-slate-400 text-xs">
                No referrals found matching "<span className="text-white font-bold">{searchReferral}</span>"
              </div>
            ) : (
              <div className="space-y-2">
                {currentReferralSlice.map((item) => {
                  const isVerified = item.status === 'verified';
                  const currentLevel = item.highest_level || 1;
                  const canClaim = !isVerified && currentLevel >= reqLevel;
                  const levelProgress = Math.min(100, Math.round((currentLevel / reqLevel) * 100));

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition ${
                        isVerified
                          ? 'bg-emerald-950/30 border-emerald-500/30'
                          : canClaim
                          ? 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-900/20 ring-1 ring-amber-500/30'
                          : 'bg-slate-800/70 border-slate-700/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">@{item.username}</span>
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3" /> VERIFIED
                            </span>
                          ) : canClaim ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                              <Sparkles className="w-3 h-3 text-amber-400" /> READY TO CLAIM
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-700/60 text-slate-400 border border-slate-600/40">
                              <Clock className="w-3 h-3" /> UNVERIFIED
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-black ${isVerified ? 'text-emerald-400' : canClaim ? 'text-amber-300 font-extrabold' : 'text-slate-400'}`}>
                          {isVerified ? `+${item.cb_coins_rewarded} CB` : canClaim ? `+${rewardAmount} CB Ready!` : `Pending Lvl ${reqLevel}`}
                        </span>
                      </div>

                      {/* Card Content: Claim Button OR Level Progress Bar */}
                      {canClaim ? (
                        <div className="mt-2 pt-2 border-t border-amber-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                            <span>Target Cleared: <strong className="text-white">Level {currentLevel}</strong> (Required: {reqLevel})</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> 100% Complete
                            </span>
                          </div>
                          <button
                            onClick={() => handleClaim(item.id, item.username)}
                            disabled={claimingId === item.id}
                            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                          >
                            {claimingId === item.id ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                Claiming {rewardAmount} CB Coins...
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <Gift className="w-4 h-4 text-slate-950" />
                                Claim +{rewardAmount} CB Coins
                              </span>
                            )}
                          </button>
                        </div>
                      ) : isVerified ? (
                        <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Player reached Level {currentLevel} • +{item.cb_coins_rewarded} CB Coins rewarded</span>
                        </div>
                      ) : (
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>Progress: <strong className="text-white">Level {currentLevel}</strong> / {reqLevel}</span>
                            <span>{levelProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-yellow-400"
                              style={{ width: `${levelProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 px-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <span>‹ Previous</span>
                </button>

                <span className="text-[11px] font-mono font-bold text-slate-400">
                  Page <span className="text-emerald-400">{safeCurrentPage}</span> of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Next ›</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
