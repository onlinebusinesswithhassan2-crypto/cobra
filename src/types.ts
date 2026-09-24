export type Direction = 'up' | 'down' | 'left' | 'right';

export type RewardType = 'hint' | 'heart' | 'double_points';

export interface GridPos {
  x: number;
  y: number;
}

export type SnakeState =
  | 'idle'
  | 'selected'
  | 'straightening'
  | 'exiting'
  | 'blocked'
  | 'burning'
  | 'removed';

export interface SnakeData {
  id: string;
  color: string;
  secondaryColor?: string;
  eyeColor?: string;
  direction: Direction;
  cells: GridPos[]; // index 0 is Head, index cells.length - 1 is Tail
  originalCells?: GridPos[];
  originalDirection?: Direction;
  state?: SnakeState;
  // Animation tracking
  straightenProgress?: number; // 0 to 1
  exitOffset?: number; // in grid cell units along direction
  isBlocked?: boolean;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  type?: 'rock' | 'bush' | 'log';
}

export interface LevelConfig {
  id: number;
  name: string;
  gridWidth: number;
  gridHeight: number;
  snakes: SnakeData[];
  obstacles?: Obstacle[];
  maxMoves?: number;
  targetMoves?: number;
}

export interface MoveRecord {
  snake: SnakeData;
  timestamp: number;
}

export interface UserProfile {
  playerId: string;
  username: string;
  name: string;
  isLoggedIn: boolean;
  role?: 'player' | 'admin';
  cbCoins: number;
  monthlyPoints: number;
  totalScore: number; // monthly points for game display
  levelsCleared: number;
  highestLevel?: number;
  rank?: number;
  referrals?: number;
  status?: 'active' | 'banned';
  checkinStreak?: number;
  lastCheckinDate?: string | null;
  checkedInToday?: boolean;
  lastClaimTimestamp?: number | null;
}

export interface LeaderboardEntry {
  playerId: string;
  username: string;
  name: string;
  monthlyPoints: number;
  totalScore: number;
  levelsCleared: number;
  highestLevel?: number;
  rank: number;
  cbReward?: number;
  rewardTitle?: string;
}

export interface AdminPlayer {
  id: number;
  player_id: string;
  name: string;
  username: string;
  cb_coins: number;
  monthly_points: number;
  levels_cleared_monthly: number;
  highest_level: number;
  last_checkin_date?: string | null;
  checkin_streak?: number;
  checked_in_today?: boolean;
  status: 'active' | 'banned';
  created_at: string;
}

export interface AdminStats {
  total_players: number;
  active_this_month: number;
  total_cb_coins: number;
  total_levels_cleared: number;
  current_month: string;
  month_name: string;
}

export interface CbRewardTier {
  id?: number;
  rank_from: number;
  rank_to: number;
  cb_coins_reward: number;
  reward_title: string;
}

export interface RemoteGameConfig {
  defaultHints: number;
  defaultBurns?: number;
  rewardHintPerAd: number;
  rewardBurnPerAd?: number;
  rewardHeartPerAd: number;
  adFrequencyLevels: number; // Show interstitial every N levels (e.g. 2)
  adsEnabled: boolean;
  adProvider?: 'admob' | 'unity' | 'both';
  bannerEnabled?: boolean;
  interstitialEnabled?: boolean;
  rewardedEnabled?: boolean;
  admobAppId?: string;
  admobBannerId: string;
  admobInterstitialId: string;
  admobRewardedId: string;
  unityGameId?: string;
  unityBannerId?: string;
  unityInterstitialId?: string;
  unityRewardedId?: string;
  referralCbReward?: number;
  referralRequiredLevel?: number;
  tournamentTopWinnersCount?: number;
  tournamentStartDate?: string | null;
  tournamentEndDate?: string | null;
}

export interface UserProgress {
  unlockedLevel: number;
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  levelScores: Record<number, number>; // levelId -> highest single score
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  themeMode?: 'dark' | 'light';
  hintsRemaining: number;
  burnsRemaining?: number;
  userProfile?: UserProfile;
}

export interface FriendItem {
  friendship_id: number;
  friends_since: string;
  player_id: string;
  name: string;
  highest_level: number;
  monthly_points: number;
}

export interface FriendRequestItem {
  request_id: number;
  created_at: string;
  player_id: string;
  name: string;
  highest_level: number;
}

export interface ReceivedGiftItem {
  gift_id: number;
  amount: number;
  message: string;
  created_at: string;
  sender_player_id: string;
  sender_name: string;
}

export interface FriendsDataResponse {
  status: string;
  current_cb_coins: number;
  friends: FriendItem[];
  pending_requests: FriendRequestItem[];
  received_gifts: ReceivedGiftItem[];
}

export interface SearchedPlayerResult {
  player_id: string;
  name: string;
  highest_level: number;
  relationship: 'none' | 'pending_incoming' | 'pending_outgoing' | 'accepted' | 'rejected';
  request_id?: number;
}

export interface ReferralItem {
  id: number;
  referred_user_id: number;
  username: string;
  player_id: string;
  highest_level: number;
  status: 'unverified' | 'verified';
  cb_coins_rewarded: number;
  created_at: string;
  verified_at: string | null;
}

export interface ReferralDataResponse {
  status: string;
  my_code: string;
  has_bound_code: boolean;
  bound_to: string | null;
  reward_amount: number;
  required_level: number;
  stats: {
    total_referrals: number;
    verified_referrals: number;
    unverified_referrals: number;
    total_cb_earned: number;
  };
  referrals: ReferralItem[];
  message?: string;
}

export interface MonthlyArchiveEntry {
  id: number;
  month_year: string;
  rank_position: number;
  player_name: string;
  score: number;
  level_reached: number;
  reward_coins: number;
  archived_at: string;
}


