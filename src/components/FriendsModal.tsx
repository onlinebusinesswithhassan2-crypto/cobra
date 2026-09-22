import React, { useState, useEffect } from 'react';
import { 
  X, Users, UserPlus, Gift, Copy, Check, Search, 
  Send, ShieldCheck, Clock, ArrowRight, Sparkles, Heart, AlertCircle 
} from 'lucide-react';
import { UserProfile, FriendItem, FriendRequestItem, ReceivedGiftItem, SearchedPlayerResult } from '../types';
import { 
  searchPlayerById, sendFriendRequest, fetchFriendsData, 
  respondFriendRequest, sendCbCoinGift 
} from '../services/apiService';
import { sounds } from '../utils/audio';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onOpenLogin: () => void;
  onCbCoinsUpdated: (newBalance: number) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenLogin,
  onCbCoinsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'add' | 'requests' | 'gifts'>('friends');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Lists
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequestItem[]>([]);
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGiftItem[]>([]);
  const [myCbCoins, setMyCbCoins] = useState<number>(userProfile?.cbCoins || 0);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedPlayer, setSearchedPlayer] = useState<SearchedPlayerResult | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchMessage, setSearchMessage] = useState<string>('');

  // Gift sending state
  const [selectedFriendForGift, setSelectedFriendForGift] = useState<FriendItem | null>(null);
  const [giftAmount, setGiftAmount] = useState<string>('10');
  const [giftMessage, setGiftMessage] = useState<string>('A gift of CB Coins for you!');
  const [giftLoading, setGiftLoading] = useState<boolean>(false);
  const [giftFeedback, setGiftFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Refresh friends data
  const loadFriendsData = async () => {
    if (!userProfile?.playerId) return;
    setLoading(true);
    try {
      const data = await fetchFriendsData(userProfile.playerId);
      setFriends(data.friends || []);
      setPendingRequests(data.pending_requests || []);
      setReceivedGifts(data.received_gifts || []);
      if (typeof data.current_cb_coins === 'number') {
        setMyCbCoins(data.current_cb_coins);
        if (data.current_cb_coins !== userProfile.cbCoins) {
          onCbCoinsUpdated(data.current_cb_coins);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userProfile?.playerId && userProfile?.isLoggedIn) {
      loadFriendsData();
    }
  }, [isOpen, userProfile?.playerId, userProfile?.isLoggedIn]);

  useEffect(() => {
    if (userProfile?.cbCoins !== undefined) {
      setMyCbCoins(userProfile.cbCoins);
    }
  }, [userProfile?.cbCoins]);

  if (!isOpen) return null;

  // If player is not logged in, show prompt to log in first
  if (!userProfile?.isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Users className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black mb-2 text-white">Login Required</h3>
          <p className="text-sm text-slate-300 mb-6">
            Log in or create a player account to add friends, receive friend requests, and send CB Coins as gifts!
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Login or Register</span>
          </button>
        </div>
      </div>
    );
  }

  // Copy Player ID
  const handleCopyPlayerId = () => {
    if (!userProfile.playerId) return;
    navigator.clipboard?.writeText(userProfile.playerId);
    setCopiedId(true);
    sounds.playTap();
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Search player
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    sounds.playTap();
    setSearchLoading(true);
    setSearchMessage('');
    setSearchedPlayer(null);

    const res = await searchPlayerById(searchQuery.trim(), userProfile.playerId);
    setSearchLoading(false);
    if (res.success && res.player) {
      setSearchedPlayer(res.player);
    } else {
      setSearchMessage(res.message || 'Player not found');
    }
  };

  // Send friend request
  const handleSendFriendRequest = async (targetId: string) => {
    sounds.playTap();
    setSearchLoading(true);
    const res = await sendFriendRequest(userProfile.playerId, targetId);
    setSearchLoading(false);
    if (res.success) {
      sounds.playBonusScore();
      setSearchMessage(`✅ ${res.message}`);
      setSearchedPlayer((prev) => (prev ? { ...prev, relationship: 'pending_outgoing' } : null));
      loadFriendsData();
    } else {
      setSearchMessage(`⚠️ ${res.message}`);
    }
  };

  // Respond to incoming request
  const handleRespondRequest = async (requestId: number, action: 'accept' | 'reject') => {
    sounds.playTap();
    const res = await respondFriendRequest(userProfile.playerId, requestId, action);
    if (res.success) {
      if (action === 'accept') sounds.playBonusScore();
      loadFriendsData();
    }
  };

  // Send CB coins gift
  const handleSendGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriendForGift) return;
    const amountNum = parseFloat(giftAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setGiftFeedback({ type: 'error', text: 'Enter a valid amount of CB Coins' });
      return;
    }
    if (amountNum > myCbCoins) {
      setGiftFeedback({ type: 'error', text: `Insufficient balance! You have ${myCbCoins.toLocaleString()} CB` });
      return;
    }

    setGiftLoading(true);
    setGiftFeedback(null);
    const res = await sendCbCoinGift(
      userProfile.playerId,
      selectedFriendForGift.player_id,
      amountNum,
      giftMessage.trim()
    );
    setGiftLoading(false);

    if (res.success) {
      sounds.playBonusScore();
      const updatedBalance = res.newBalance !== undefined ? res.newBalance : Math.max(0, myCbCoins - amountNum);
      setMyCbCoins(updatedBalance);
      onCbCoinsUpdated(updatedBalance);
      setGiftFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setSelectedFriendForGift(null);
        setGiftFeedback(null);
        loadFriendsData();
      }, 1800);
    } else {
      setGiftFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-[0_0_60px_rgba(6,182,212,0.2)] text-white max-h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                Friends & Gifts
                <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  🪙 {myCbCoins.toLocaleString()} CB
                </span>
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-slate-400">My ID:</span>
                <span className="text-[11px] font-mono font-black text-cyan-300 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/60">
                  {userProfile.playerId}
                </span>
                <button
                  onClick={handleCopyPlayerId}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded transition-all active:scale-95 cursor-pointer"
                  title="Copy My Player ID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl my-3">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('friends');
            }}
            className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'friends'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Friends</span>
            {friends.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'friends' ? 'bg-slate-950/30 text-slate-950' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {friends.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('add');
            }}
            className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('requests');
            }}
            className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer relative ${
              activeTab === 'requests'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Requests</span>
            {pendingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('gifts');
            }}
            className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'gifts'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Gifts</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-3 pr-0.5">
          {/* TAB 1: FRIENDS LIST */}
          {activeTab === 'friends' && (
            <div>
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
                  Loading friends list...
                </div>
              ) : friends.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                    <Users className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-slate-300 mb-1">No Friends Yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mb-4">
                    Share your Player ID <span className="font-mono text-cyan-300 font-bold">{userProfile.playerId}</span> or tap Add Friend to connect!
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    + Add Friends
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((f) => (
                    <div
                      key={f.friendship_id}
                      className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-700/70 border border-slate-600/60 flex items-center justify-center text-slate-300 font-black text-sm shrink-0">
                          {((f.name || f.username || f.player_id || 'F').trim().charAt(0) || 'F').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                            {f.name || f.username || f.player_id}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-cyan-300 font-bold">{f.player_id}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">Lvl {f.highest_level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Gift Action Button */}
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setSelectedFriendForGift(f);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 transition-all shrink-0 cursor-pointer"
                      >
                        <Gift className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Send Gift</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD FRIEND (Search by Username or Player ID) */}
          {activeTab === 'add' && (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">
                  Search Player by Username or Player ID
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.trim())}
                      placeholder="Enter Username or ID (e.g. david125 or SNK-1001)..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    disabled={searchLoading || !searchQuery.trim()}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {searchMessage && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                  {searchMessage}
                </div>
              )}

              {searchedPlayer && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/90 to-cyan-950/40 border border-cyan-500/50 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">{searchedPlayer.name}</h4>
                      <p className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                        {searchedPlayer.player_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Level {searchedPlayer.highest_level}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60">
                    {searchedPlayer.relationship === 'accepted' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span>Already Friends!</span>
                      </div>
                    ) : searchedPlayer.relationship === 'pending_outgoing' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <Clock className="w-4 h-4" />
                        <span>Friend Request Pending...</span>
                      </div>
                    ) : searchedPlayer.relationship === 'pending_incoming' ? (
                      <button
                        onClick={() => {
                          if (searchedPlayer.request_id) {
                            handleRespondRequest(searchedPlayer.request_id, 'accept');
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Accept Incoming Friend Request!
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(searchedPlayer.player_id)}
                        disabled={searchLoading}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Send Friend Request</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INCOMING REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              {pendingRequests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No pending friend requests
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.request_id}
                      className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-white">{req.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono text-cyan-300 font-bold">{req.player_id}</span>
                          <span>•</span>
                          <span className="text-emerald-400">Level {req.highest_level}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRespondRequest(req.request_id, 'accept')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondRequest(req.request_id, 'reject')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECEIVED GIFTS */}
          {activeTab === 'gifts' && (
            <div>
              {receivedGifts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No gifts received yet. Friends can send you CB Coins anytime!
                </div>
              ) : (
                <div className="space-y-2">
                  {receivedGifts.map((g) => (
                    <div
                      key={g.gift_id}
                      className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-800/70 to-slate-800/70 border border-amber-500/30 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            From: <span className="text-amber-300 font-extrabold">{g.sender_name}</span> ({g.sender_player_id})
                          </h4>
                          <p className="text-[11px] text-slate-300 italic truncate mt-0.5">
                            "{g.message}"
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-full">
                          + {Number(g.amount).toLocaleString()} CB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEND GIFT SUB-MODAL OVERLAY */}
        {selectedFriendForGift && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
            <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white flex flex-col max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">Send Gift</h3>
                    <p className="text-xs text-amber-300 font-bold">To: {selectedFriendForGift.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFriendForGift(null);
                    setGiftFeedback(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendGiftSubmit} className="space-y-4 my-3">
                {/* Balance Card */}
                <div className="text-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Your Current Balance</span>
                  <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                    🪙 {myCbCoins.toLocaleString()} CB Coins
                  </div>
                </div>

                {/* Preset Amounts */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    CB Coins to Send
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['10', '25', '50', '100'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGiftAmount(preset)}
                        className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          giftAmount === preset
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/40'
                        }`}
                      >
                        {preset} CB
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={myCbCoins}
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    placeholder="Custom amount..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                {/* Gift Message */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Gift Message (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="e.g. Good luck bro!"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                {giftFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold ${
                      giftFeedback.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {giftFeedback.text}
                  </div>
                )}

                {/* Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={giftLoading || parseFloat(giftAmount) <= 0 || parseFloat(giftAmount) > myCbCoins}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{giftLoading ? 'Sending Gift...' : `Send ${giftAmount} CB Coins`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFriendForGift(null);
                      setGiftFeedback(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel / Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
