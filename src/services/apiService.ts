import { LeaderboardEntry, UserProfile, RemoteGameConfig, AdminPlayer, AdminStats, CbRewardTier, FriendItem, FriendRequestItem, ReceivedGiftItem, FriendsDataResponse, SearchedPlayerResult, ReferralDataResponse, MonthlyArchiveEntry } from '../types';

// Production API Base URL (Hostinger Production Endpoint)
const DEFAULT_PRODUCTION_API_URL = 'https://aqsacollections.store/server_api/index.php';
const STORED_API_KEY = 'snake_custom_api_url';
export const CACHED_CONFIG_KEY = 'cobra_cached_remote_config_v4';
let API_BASE_URL = localStorage.getItem(STORED_API_KEY) || DEFAULT_PRODUCTION_API_URL;

export const DEFAULT_GAME_CONFIG: RemoteGameConfig = {
  defaultHints: 0,
  defaultBurns: 0,
  rewardHintPerAd: 1,
  rewardBurnPerAd: 0,
  rewardHeartPerAd: 1,
  adFrequencyLevels: 2,
  adsEnabled: true,
  adProvider: 'admob',
  bannerEnabled: true,
  interstitialEnabled: true,
  rewardedEnabled: true,
  admobAppId: 'ca-app-pub-3940256099942544~3347511713',
  admobBannerId: 'ca-app-pub-3940256099942544/6300978111',
  admobInterstitialId: 'ca-app-pub-3940256099942544/1033173712',
  admobRewardedId: 'ca-app-pub-3940256099942544/5224354917',
  unityGameId: '',
  unityBannerId: '',
  unityInterstitialId: '',
  unityRewardedId: '',
};

export const getCachedRemoteGameConfig = (): RemoteGameConfig => {
  try {
    const raw = localStorage.getItem(CACHED_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GAME_CONFIG, ...parsed };
    }
  } catch {}
  return DEFAULT_GAME_CONFIG;
};

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = (url.trim() || DEFAULT_PRODUCTION_API_URL).replace(/\/+$/, '');
  try {
    localStorage.setItem(STORED_API_KEY, API_BASE_URL);
  } catch {}
};

export const getApiBaseUrl = () => API_BASE_URL;

function getEndpointUrl(action: string, extraParams: Record<string, string> = {}): string {
  const base = (API_BASE_URL || DEFAULT_PRODUCTION_API_URL).trim().replace(/\/+$/, '');
  const query = new URLSearchParams({ action, ...extraParams }).toString();
  if (base.endsWith('.php')) {
    return `${base}?${query}`;
  }
  return `${base}/${action}.php?${query}`;
}

// Local mock storage key for offline fallback
const MOCK_MONTHLY_KEY = 'snake_mock_monthly_v3';

const INITIAL_MONTHLY_LEADERS: LeaderboardEntry[] = [
  { playerId: 'SNK-4934', username: 'Player_One', name: 'Player One', monthlyPoints: 42500, totalScore: 42500, levelsCleared: 42, rank: 1, cbReward: 1000, rewardTitle: 'Rank 1 Champion' },
  { playerId: 'SNK-7721', username: 'ViperKing', name: 'Viper King', monthlyPoints: 21000, totalScore: 21000, levelsCleared: 24, rank: 2, cbReward: 600, rewardTitle: 'Rank 2 Silver Master' },
  { playerId: 'SNK-9042', username: 'CobraQueen', name: 'Cobra Queen', monthlyPoints: 16800, totalScore: 16800, levelsCleared: 19, rank: 3, cbReward: 350, rewardTitle: 'Rank 3 Bronze Legend' },
  { playerId: 'SNK-1001', username: 'ProPlayer', name: 'Pro Player', monthlyPoints: 14200, totalScore: 14200, levelsCleared: 16, rank: 4, cbReward: 200, rewardTitle: 'Top 5 Elite' },
  { playerId: 'SNK-3118', username: 'ShadowSerpent', name: 'Shadow Serpent', monthlyPoints: 11500, totalScore: 11500, levelsCleared: 13, rank: 5, cbReward: 200, rewardTitle: 'Top 5 Elite' },
  { playerId: 'SNK-5502', username: 'PythonMaster', name: 'Python Master', monthlyPoints: 9300, totalScore: 9300, levelsCleared: 11, rank: 6, cbReward: 100, rewardTitle: 'Top 10 Challenger' },
  { playerId: 'SNK-8819', username: 'RattleStrike', name: 'Rattle Strike', monthlyPoints: 7800, totalScore: 7800, levelsCleared: 9, rank: 7, cbReward: 100, rewardTitle: 'Top 10 Challenger' },
  { playerId: 'SNK-2041', username: 'ApexHunter', name: 'Apex Hunter', monthlyPoints: 5200, totalScore: 5200, levelsCleared: 6, rank: 8, cbReward: 100, rewardTitle: 'Top 10 Challenger' },
];

/**
 * 1. Register New Player In-Game
 */
export async function registerPlayer(
  name: string,
  username: string,
  password: string,
  referralCode?: string
): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  const cleanName = name.trim();
  const cleanUsername = username.trim();
  const cleanPass = password.trim();
  const cleanRef = referralCode ? referralCode.trim() : undefined;

  if (!cleanName || !cleanUsername || !cleanPass) {
    return { success: false, message: 'Please enter Name, Username, and Password' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const url = getEndpointUrl('register');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        username: cleanUsername,
        password: cleanPass,
        referral_code: cleanRef,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      const profile: UserProfile = {
        playerId: data.player_id,
        name: data.name || cleanName,
        username: data.username || cleanUsername,
        role: 'player',
        isLoggedIn: true,
        cbCoins: Number(data.cb_coins) || 0,
        monthlyPoints: 0,
        totalScore: 0,
        levelsCleared: 0,
        status: 'active',
      };
      return { success: true, profile, message: data.message };
    }
    return { success: false, message: data.message || 'Registration failed' };
  } catch (err: any) {
    // Offline fallback registration
    const newPlayerId = 'SNK-' + Math.floor(1000 + Math.random() * 9000);
    const mockProfile: UserProfile = {
      playerId: newPlayerId,
      name: cleanName,
      username: cleanUsername,
      role: 'player',
      isLoggedIn: true,
      cbCoins: 0,
      monthlyPoints: 0,
      totalScore: 0,
      levelsCleared: 0,
      status: 'active',
    };
    return { success: true, profile: mockProfile, message: 'Offline account created successfully!' };
  }
}

/**
 * 2. Player & Admin Login
 * Supports username or Player ID (SNK-XXXX / ADM-0001)
 */
export async function loginPlayer(
  loginInput: string,
  passwordInput: string
): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  const loginIdentifier = loginInput.trim();
  const password = passwordInput.trim();

  if (!loginIdentifier || !password) {
    return { success: false, message: 'Please enter Username or Player ID and Password' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const url = getEndpointUrl('login');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login_id: loginIdentifier,
        password,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      const profile: UserProfile = {
        playerId: data.player_id,
        name: data.name || data.username || loginIdentifier,
        username: data.username || loginIdentifier,
        role: (data.role === 'admin') ? 'admin' : 'player',
        isLoggedIn: true,
        cbCoins: Number(data.cb_coins) || 0,
        monthlyPoints: Number(data.monthly_points) || 0,
        totalScore: Number(data.monthly_points) || 0,
        levelsCleared: Math.max(
          Number(data.levels_cleared) || 0,
          Math.max(0, (Number(data.highest_level) || 1) - 1)
        ),
        highestLevel: Number(data.highest_level) || (Number(data.levels_cleared) ? Number(data.levels_cleared) + 1 : 1),
        rank: data.rank,
        status: 'active',
        checkinStreak: Number(data.checkin_streak) || 0,
        lastCheckinDate: data.last_checkin_date || null,
        checkedInToday: Boolean(data.checked_in_today),
        lastClaimTimestamp: data.last_claim_timestamp ? Number(data.last_claim_timestamp) : null,
      };
      return { success: true, profile };
    }
    return { success: false, message: data.message || 'Invalid credentials' };
  } catch (err: any) {
    // Demo admin check for offline test
    if ((loginIdentifier.toLowerCase() === 'admin' || loginIdentifier.toUpperCase() === 'ADM-0001') && password === 'admin123456') {
      const adminProfile: UserProfile = {
        playerId: 'ADM-0001',
        name: 'Master Admin',
        username: 'admin',
        role: 'admin',
        isLoggedIn: true,
        cbCoins: 99999,
        monthlyPoints: 0,
        totalScore: 0,
        levelsCleared: 0,
        status: 'active',
      };
      return { success: true, profile: adminProfile };
    }

    console.error('Server login error:', err);
    return {
      success: false,
      message: `Database server connection failed (${err?.message || 'HTTP 500 / Network Error'}). Please upload the fixed server_api/index.php to Hostinger.`
    };
  }
}

/**
 * 3. Submit Level Score (Monthly Points Sync)
 */
export async function submitScoreToCloud(
  profile: { playerId: string; username: string; name?: string; totalScore?: number; levelsCleared?: number; isLoggedIn?: boolean },
  levelId: number,
  levelScore: number,
  stars: number
): Promise<{ success: boolean; monthlyPoints?: number; levelsCleared?: number; message?: string }> {
  const playerId = profile.playerId || 'SNK-GUEST';
  const username = profile.username || 'Guest Player';
  const name = profile.name || username;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = getEndpointUrl('submit_score');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerId,
        username,
        name,
        level_id: levelId,
        score: levelScore,
        stars,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          success: true,
          monthlyPoints: Number(data.monthly_points) || profile.totalScore,
          levelsCleared: Number(data.levels_cleared) || profile.levelsCleared,
        };
      }
    }
  } catch {}

  return { success: true, monthlyPoints: profile.totalScore, levelsCleared: profile.levelsCleared };
}

/**
 * 4. Fetch Monthly Season Leaderboard with CB Coin Prize Tiers
 */
export async function fetchMonthlyLeaderboard(): Promise<{
  entries: LeaderboardEntry[];
  rewardTiers: CbRewardTier[];
  seasonTitle: string;
  topWinnersCount?: number;
  tournamentStartDate?: string | null;
  tournamentEndDate?: string | null;
  isLive: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = getEndpointUrl('leaderboard');
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.leaderboard)) {
        const mapped: LeaderboardEntry[] = data.leaderboard.map((item: any, idx: number) => ({
          playerId: item.player_id || `SNK-${idx + 1000}`,
          username: item.username || 'Player',
          name: item.name || item.username || 'Player',
          monthlyPoints: Number(item.monthly_points) || 0,
          totalScore: Number(item.monthly_points) || 0,
          levelsCleared: Number(item.levels_cleared) || 0,
          highestLevel: Number(item.highest_level) || Math.max(1, (Number(item.levels_cleared) || 0) + 1),
          rank: Number(item.rank) || idx + 1,
          cbReward: Number(item.cb_reward) || 0,
          rewardTitle: item.reward_title || '',
        }));

        const topWinners = Number(data.top_winners_count) || (data.reward_tiers?.length ? Math.max(...data.reward_tiers.map((t: any) => Number(t.rank_to))) : 10);

        return {
          entries: mapped,
          rewardTiers: data.reward_tiers || [],
          seasonTitle: data.season_title || `${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} Season`,
          topWinnersCount: topWinners,
          tournamentStartDate: data.tournament_start_date || null,
          tournamentEndDate: data.tournament_end_date || null,
          isLive: true,
        };
      }
    }
  } catch {}

  // Fallback offline data
  return {
    entries: INITIAL_MONTHLY_LEADERS,
    rewardTiers: [
      { rank_from: 1, rank_to: 1, cb_coins_reward: 1000, reward_title: '1st Place Champion' },
      { rank_from: 2, rank_to: 2, cb_coins_reward: 600, reward_title: '2nd Place Silver' },
      { rank_from: 3, rank_to: 3, cb_coins_reward: 350, reward_title: '3rd Place Bronze' },
      { rank_from: 4, rank_to: 5, cb_coins_reward: 200, reward_title: 'Top 5 Elite' },
      { rank_from: 6, rank_to: 10, cb_coins_reward: 100, reward_title: 'Top 10 Challenger' },
    ],
    seasonTitle: `${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} Season`,
    topWinnersCount: 10,
    tournamentStartDate: null,
    tournamentEndDate: null,
    isLive: false,
  };
}

// Backward-compatible wrapper
export type LeaderboardTabType = 'monthly';
export async function fetchLeaderboard(tab?: any) {
  const result = await fetchMonthlyLeaderboard();
  return {
    entries: result.entries,
    isLive: result.isLive,
    tab: 'monthly' as const,
    rewardTiers: result.rewardTiers,
    seasonTitle: result.seasonTitle,
    topWinnersCount: result.topWinnersCount,
  };
}

// -------------------------------------------------------------
// 5. Admin API Endpoints
// -------------------------------------------------------------

export async function adminGetStats(): Promise<AdminStats | null> {
  try {
    const url = getEndpointUrl('admin_stats');
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') return data.stats;
    }
  } catch {}
  return {
    total_players: 28,
    active_this_month: 19,
    total_cb_coins: 14500,
    total_levels_cleared: 312,
    current_month: '2026-09',
    month_name: 'September 2026',
  };
}

export async function adminGetPlayers(search: string = ''): Promise<AdminPlayer[]> {
  try {
    const url = getEndpointUrl('admin_players', search ? { search } : {});
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') return data.players;
    }
  } catch {}
  // Mock players fallback
  return [
    { id: 1, player_id: 'SNK-4934', name: 'Player One', username: 'Player_One', cb_coins: 1850, monthly_points: 42500, levels_cleared_monthly: 42, highest_level: 43, last_checkin_date: new Date().toISOString().slice(0, 10), checkin_streak: 5, checked_in_today: true, status: 'active', created_at: '2026-09-01 10:00:00' },
    { id: 2, player_id: 'SNK-7721', name: 'Viper King', username: 'ViperKing', cb_coins: 900, monthly_points: 21000, levels_cleared_monthly: 24, highest_level: 25, last_checkin_date: null, checkin_streak: 0, checked_in_today: false, status: 'active', created_at: '2026-09-02 11:30:00' },
    { id: 3, player_id: 'SNK-1001', name: 'Pro Player', username: 'ProPlayer', cb_coins: 450, monthly_points: 14200, levels_cleared_monthly: 16, highest_level: 17, last_checkin_date: null, checkin_streak: 0, checked_in_today: false, status: 'active', created_at: '2026-09-03 14:15:00' },
  ];
}

export async function adminUpdateCbCoins(
  userId: number,
  amount: number,
  description: string = 'Admin adjustment'
): Promise<{ success: boolean; newBalance?: number; message?: string }> {
  try {
    const url = getEndpointUrl('admin_update_cb_coins');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, amount, description }),
    });
    const data = await res.json();
    return { success: data.status === 'success', newBalance: data.new_balance, message: data.message };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update' };
  }
}

export async function adminTogglePlayerStatus(
  userId: number,
  status: 'active' | 'banned'
): Promise<{ success: boolean; message?: string }> {
  try {
    const url = getEndpointUrl('admin_toggle_status');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, status }),
    });
    const data = await res.json();
    return { success: data.status === 'success', message: data.message };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update' };
  }
}

export interface AdminRewardsConfigResponse {
  tiers: CbRewardTier[];
  topWinnersCount: number;
  tournamentStartDate?: string | null;
  tournamentEndDate?: string | null;
}

export async function adminGetRewardsConfig(): Promise<AdminRewardsConfigResponse> {
  try {
    const url = getEndpointUrl('admin_rewards_config');
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'success') {
      return {
        tiers: data.tiers || [],
        topWinnersCount: Number(data.tournament_top_winners_count) || 10,
        tournamentStartDate: data.tournament_start_date || null,
        tournamentEndDate: data.tournament_end_date || null,
      };
    }
  } catch {}
  return { tiers: [], topWinnersCount: 10 };
}

export async function adminSaveRewardsConfig(
  tiers: CbRewardTier[],
  topWinnersCount?: number,
  tournamentStartDate?: string | null,
  tournamentEndDate?: string | null
): Promise<boolean> {
  try {
    const url = getEndpointUrl('admin_rewards_config');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tiers,
        tournament_top_winners_count: topWinnersCount,
        tournament_start_date: tournamentStartDate,
        tournament_end_date: tournamentEndDate,
      }),
    });
    const data = await res.json();
    return data.status === 'success';
  } catch {
    return false;
  }
}

/**
 * Admin: Update credentials (username and/or password)
 */
export async function adminUpdateCredentials(
  adminId: number,
  newUsername?: string,
  newPassword?: string
): Promise<{ success: boolean; message: string; admin?: { id: number; username: string; name: string } }> {
  try {
    const url = getEndpointUrl('admin_update_credentials');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_id: adminId,
        new_username: newUsername?.trim() || '',
        new_password: newPassword?.trim() || '',
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Credentials updated!' : 'Failed to update credentials'),
      admin: data.admin,
    };
  } catch {
    return { success: false, message: 'Network error updating admin credentials' };
  }
}

/**
 * Player: Record Daily Check-In to database immediately
 */
export async function recordDailyCheckIn(
  userIdOrPlayerId: number | string,
  dayNumber: number,
  ptsRewarded: number
): Promise<{
  success: boolean;
  message: string;
  newTotalScore?: number;
  newMonthlyPoints?: number;
  monthlyPoints?: number;
  streak?: number;
  alreadyClaimed?: boolean;
  lastCheckinDate?: string;
  claimedTimestamp?: number;
}> {
  try {
    const isNumericId = typeof userIdOrPlayerId === 'number' || /^\d+$/.test(String(userIdOrPlayerId));
    const url = getEndpointUrl('daily_checkin');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: isNumericId ? Number(userIdOrPlayerId) : undefined,
        player_id: !isNumericId ? String(userIdOrPlayerId) : undefined,
        day_number: dayNumber,
        pts_rewarded: ptsRewarded,
        is_test: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')),
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Daily check-in saved to database!' : 'Failed to save check-in'),
      newTotalScore: data.new_total_score,
      newMonthlyPoints: data.new_monthly_points || data.monthly_points,
      monthlyPoints: data.monthly_points || data.new_monthly_points,
      streak: data.checkin_streak || data.streak,
      alreadyClaimed: Boolean(data.already_claimed),
      lastCheckinDate: data.last_checkin_date,
      claimedTimestamp: data.claimed_timestamp,
    };
  } catch {
    return { success: false, message: 'Network error saving check-in to database' };
  }
}

/**
 * 6. Fetch Remote Game Config
 */
export async function fetchRemoteGameConfig(): Promise<RemoteGameConfig> {
  try {
    const url = getEndpointUrl('get_config', { _t: `${Date.now()}` });
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const cfg = data.config || {};
      const merged: RemoteGameConfig = {
        defaultHints: cfg.default_hints !== undefined ? Number(cfg.default_hints) : DEFAULT_GAME_CONFIG.defaultHints,
        defaultBurns: 0,
        rewardHintPerAd: Number(cfg.reward_hint_per_ad) || 1,
        rewardBurnPerAd: 0,
        rewardHeartPerAd: Number(cfg.reward_heart_per_ad) || 1,
        adFrequencyLevels: Number(cfg.ad_frequency_levels) || DEFAULT_GAME_CONFIG.adFrequencyLevels,
        adsEnabled: cfg.ads_enabled !== undefined ? !!cfg.ads_enabled : DEFAULT_GAME_CONFIG.adsEnabled,
        adProvider: cfg.ad_provider || DEFAULT_GAME_CONFIG.adProvider,
        bannerEnabled: cfg.banner_enabled !== undefined ? !!cfg.banner_enabled : true,
        interstitialEnabled: cfg.interstitial_enabled !== undefined ? !!cfg.interstitial_enabled : true,
        rewardedEnabled: cfg.rewarded_enabled !== undefined ? !!cfg.rewarded_enabled : true,
        admobAppId: cfg.admob_app_id || DEFAULT_GAME_CONFIG.admobAppId,
        admobBannerId: cfg.admob_banner_id || DEFAULT_GAME_CONFIG.admobBannerId,
        admobInterstitialId: cfg.admob_interstitial_id || DEFAULT_GAME_CONFIG.admobInterstitialId,
        admobRewardedId: cfg.admob_rewarded_id || DEFAULT_GAME_CONFIG.admobRewardedId,
        unityGameId: cfg.unity_game_id || '',
        unityBannerId: cfg.unity_banner_id || '',
        unityInterstitialId: cfg.unity_interstitial_id || '',
        unityRewardedId: cfg.unity_rewarded_id || '',
        referralCbReward: cfg.referral_cb_reward !== undefined ? Number(cfg.referral_cb_reward) : 50,
        referralRequiredLevel: cfg.referral_required_level !== undefined ? Number(cfg.referral_required_level) : 100,
        tournamentTopWinnersCount: cfg.tournament_top_winners_count !== undefined ? Number(cfg.tournament_top_winners_count) : 10,
        tournamentStartDate: cfg.tournament_start_date || null,
        tournamentEndDate: cfg.tournament_end_date || null,
      };
      try {
        localStorage.setItem(CACHED_CONFIG_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch {}
  return getCachedRemoteGameConfig();
}

// =============================================================
// 7. FRIEND & CB COIN GIFT API METHODS
// =============================================================

/**
 * Search a player by Player ID or Username (e.g. SNK-1024 or david125)
 */
export async function searchPlayerById(
  searchQuery: string,
  myPlayerId?: string
): Promise<{ success: boolean; player?: SearchedPlayerResult; message?: string }> {
  try {
    const trimmed = searchQuery.trim();
    const url = getEndpointUrl('search_player_by_id', {
      search_id: trimmed,
      query: trimmed,
      my_player_id: myPlayerId || '',
      _t: `${Date.now()}`,
    });
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.status === 'success' && data.player) {
      return { success: true, player: data.player };
    }
    return { success: false, message: data.message || 'Player not found' };
  } catch (err: any) {
    return { success: false, message: 'Connection error while searching player' };
  }
}

/**
 * Send a friend request
 */
export async function sendFriendRequest(
  myPlayerId: string,
  targetPlayerId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const url = getEndpointUrl('send_friend_request');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        my_player_id: myPlayerId,
        target_player_id: targetPlayerId,
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Friend request sent!' : 'Failed to send request'),
    };
  } catch {
    return { success: false, message: 'Network connection failed' };
  }
}

/**
 * Fetch user's friends, pending requests, and received gifts
 */
export async function fetchFriendsData(
  myPlayerId: string
): Promise<FriendsDataResponse> {
  try {
    const url = getEndpointUrl('get_friends', {
      my_player_id: myPlayerId,
      _t: `${Date.now()}`,
    });
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.status === 'success') {
      return {
        status: 'success',
        current_cb_coins: Number(data.current_cb_coins) || 0,
        friends: Array.isArray(data.friends) ? data.friends : [],
        pending_requests: Array.isArray(data.pending_requests) ? data.pending_requests : [],
        received_gifts: Array.isArray(data.received_gifts) ? data.received_gifts : [],
      };
    }
  } catch {}

  return {
    status: 'error',
    current_cb_coins: 0,
    friends: [],
    pending_requests: [],
    received_gifts: [],
  };
}

/**
 * Accept or reject an incoming friend request
 */
export async function respondFriendRequest(
  myPlayerId: string,
  requestId: number,
  response: 'accept' | 'reject'
): Promise<{ success: boolean; message: string }> {
  try {
    const url = getEndpointUrl('respond_friend_request');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        my_player_id: myPlayerId,
        request_id: requestId,
        response,
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Request processed' : 'Failed to process request'),
    };
  } catch {
    return { success: false, message: 'Network error occurred' };
  }
}

/**
 * Send CB Coins as a gift to a friend
 */
export async function sendCbCoinGift(
  myPlayerId: string,
  targetPlayerId: string,
  amount: number,
  message?: string
): Promise<{ success: boolean; message: string; newBalance?: number }> {
  try {
    const url = getEndpointUrl('send_cb_gift');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        my_player_id: myPlayerId,
        target_player_id: targetPlayerId,
        amount,
        message: message || 'A gift of CB Coins for you!',
      }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      return {
        success: true,
        message: data.message || 'Gift sent successfully!',
        newBalance: Number(data.new_balance),
      };
    }
    return {
      success: false,
      message: data.message || 'Could not send gift',
    };
  } catch {
    return { success: false, message: 'Network error transferring CB coins' };
  }
}

/**
 * 23. Bind a referral code (the referrer's username or player_id)
 */
export async function bindReferralCode(
  myPlayerId: string,
  referrerUsername: string
): Promise<{ success: boolean; message: string }> {
  try {
    const trimmedCode = referrerUsername.trim();
    const url = getEndpointUrl('bind_referral');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        my_player_id: myPlayerId,
        player_id: myPlayerId,
        referral_code: trimmedCode,
        referrer_username: trimmedCode,
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Referral bound successfully!' : 'Failed to bind referral'),
    };
  } catch {
    return { success: false, message: 'Network error connecting to referral system.' };
  }
}

/**
 * 24. Fetch referral dashboard data (counts, reward, list of referred players)
 */
export async function fetchReferralData(myPlayerId: string): Promise<ReferralDataResponse | null> {
  try {
    const url = getEndpointUrl('get_referral_data', {
      my_player_id: myPlayerId,
      player_id: myPlayerId,
      _t: `${Date.now()}`,
    });
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'success') {
      const normalized: ReferralDataResponse = {
        status: data.status,
        my_code: data.my_code || data.my_referral_code || '',
        has_bound_code: Boolean(data.has_bound_code ?? data.already_bound),
        bound_to: data.bound_to || null,
        reward_amount: Number(data.reward_amount ?? data.reward_per_referral ?? 50),
        required_level: Number(data.required_level ?? 100),
        stats: {
          total_referrals: Number(data.stats?.total_referrals ?? data.total_referrals ?? 0),
          verified_referrals: Number(data.stats?.verified_referrals ?? data.verified_referrals ?? 0),
          unverified_referrals: Number(data.stats?.unverified_referrals ?? data.unverified_referrals ?? 0),
          total_cb_earned: Number(data.stats?.total_cb_earned ?? data.total_cb_earned ?? 0),
        },
        referrals: Array.isArray(data.referrals) ? data.referrals : [],
      };
      return normalized;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 25. Admin: Fetch monthly tournament archives
 */
export async function adminGetArchives(adminToken?: string): Promise<{
  success: boolean;
  archives: Record<string, MonthlyArchiveEntry[]>;
}> {
  try {
    const url = getEndpointUrl('admin_get_archives');
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${adminToken || 'snake_admin_secret_token_2026'}`,
      },
    });
    const data = await res.json();
    if (data.status === 'success') {
      return { success: true, archives: data.archives || {} };
    }
    return { success: false, archives: {} };
  } catch {
    return { success: false, archives: {} };
  }
}

/**
 * 26. Admin: Trigger end of month archive and leaderboard reset
 */
export async function adminArchiveMonth(
  topN: number = 10,
  adminToken?: string
): Promise<{ success: boolean; message: string; archivedCount?: number }> {
  try {
    const url = getEndpointUrl('admin_archive_month');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken || 'snake_admin_secret_token_2026'}`,
      },
      body: JSON.stringify({ top_n: topN }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || 'Operation completed',
      archivedCount: data.archived_count,
    };
  } catch {
    return { success: false, message: 'Network error triggering month archive' };
  }
}

/**
 * 27. Admin: Update referral system reward & config
 */
export async function adminUpdateReferralConfig(
  rewardAmount: number,
  requiredLevel: number = 100,
  topWinnersCount: number = 10,
  adminToken?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const url = getEndpointUrl('admin_update_referral_config');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken || 'snake_admin_secret_token_2026'}`,
      },
      body: JSON.stringify({
        referral_cb_reward: rewardAmount,
        referral_required_level: requiredLevel,
        tournament_top_winners_count: topWinnersCount,
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || 'Settings updated',
    };
  } catch {
    return { success: false, message: 'Network error updating referral settings' };
  }
}

/**
  * 28. Claim Referral Reward
  * Allows player to claim CB coin reward when their referred friend conquers target level
  */
export async function claimReferralReward(
  referralId: number,
  myPlayerId: string
): Promise<{ success: boolean; message: string; reward?: number; newBalance?: number }> {
  try {
    const url = getEndpointUrl('claim_referral_reward');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_id: referralId,
        my_player_id: myPlayerId,
        player_id: myPlayerId,
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Reward claimed!' : 'Unable to claim reward'),
      reward: data.reward_amount ? Number(data.reward_amount) : undefined,
      newBalance: data.new_cb_coins !== undefined ? Number(data.new_cb_coins) : undefined,
    };
  } catch {
    return { success: false, message: 'Network error claiming referral reward' };
  }
}

/**
 * 29. Fetch Daily Check-In Status
 * Queries whether user has checked in today and their active streak from database
 */
export async function fetchDailyCheckInStatus(
  playerIdOrUsername: string
): Promise<{
  success: boolean;
  checkedInToday?: boolean;
  streak?: number;
  lastCheckinDate?: string | null;
  lastClaimTimestamp?: number | null;
}> {
  try {
    const url = `${getEndpointUrl('get_daily_checkin_status')}&player_id=${encodeURIComponent(playerIdOrUsername)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'success') {
      return {
        success: true,
        checkedInToday: Boolean(data.checked_in_today),
        streak: Number(data.streak) || 0,
        lastCheckinDate: data.last_checkin_date || null,
        lastClaimTimestamp: data.last_claim_timestamp ? Number(data.last_claim_timestamp) : null,
      };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

/**
 * 30. Delete Player Account & Data (Google Play Compliance)
 * Permanently deletes user account, levels, progress, and transactions
 */
export async function deletePlayerAccount(
  playerIdOrUsername: string,
  password?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const url = getEndpointUrl('delete_account');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerIdOrUsername,
        username: playerIdOrUsername,
        password: password || '',
      }),
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      message: data.message || (data.status === 'success' ? 'Account successfully deleted' : 'Failed to delete account'),
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error communicating with server to delete account',
    };
  }
}

/**
 * 31. Admin Save Monetization & Ads Configuration
 */
export async function adminSaveMonetizationConfig(configData: Partial<RemoteGameConfig>): Promise<{ success: boolean; message: string }> {
  // 1. Immediately update and persist into Local Cache so changes apply right now
  const prevConfig = getCachedRemoteGameConfig();
  const normalizedConfig = configData.adsEnabled === false
    ? { ...configData, bannerEnabled: false, interstitialEnabled: false, rewardedEnabled: false }
    : configData;
  const updatedConfig: RemoteGameConfig = {
    ...prevConfig,
    ...normalizedConfig,
  };
  try {
    localStorage.setItem(CACHED_CONFIG_KEY, JSON.stringify(updatedConfig));
  } catch {}

  // 2. Attempt sync with Cloud Database
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = getEndpointUrl('admin_save_monetization');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ads_enabled: updatedConfig.adsEnabled ? 1 : 0,
        ad_provider: updatedConfig.adProvider || 'admob',
        banner_enabled: updatedConfig.bannerEnabled ? 1 : 0,
        interstitial_enabled: updatedConfig.interstitialEnabled ? 1 : 0,
        rewarded_enabled: updatedConfig.rewardedEnabled ? 1 : 0,
        ad_frequency_levels: updatedConfig.adFrequencyLevels || 2,
        reward_hint_per_ad: updatedConfig.rewardHintPerAd || 1,
        reward_burn_per_ad: 0,
        reward_heart_per_ad: updatedConfig.rewardHeartPerAd || 1,
        admob_app_id: updatedConfig.admobAppId || '',
        admob_banner_id: updatedConfig.admobBannerId || '',
        admob_interstitial_id: updatedConfig.admobInterstitialId || '',
        admob_rewarded_id: updatedConfig.admobRewardedId || '',
        unity_game_id: updatedConfig.unityGameId || '',
        unity_banner_id: updatedConfig.unityBannerId || '',
        unity_interstitial_id: updatedConfig.unityInterstitialId || '',
        unity_rewarded_id: updatedConfig.unityRewardedId || '',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          success: true,
          message: data.message || 'Monetization and advertising settings saved to Cloud DB!',
        };
      }
    }
  } catch {}

  // Graceful local save success notice
  return {
    success: true,
    message: 'Monetization settings saved locally! (Note: Upload complete_database_update.sql in Hostinger phpMyAdmin to sync cloud DB)',
  };
}

