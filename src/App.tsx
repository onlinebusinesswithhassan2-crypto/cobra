import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SnakeData, LevelConfig, MoveRecord, UserProgress, UserProfile, RemoteGameConfig } from './types';
import { LEVELS, LEVEL_MAP, getLevelConfig } from './data/levels';
import { findFirstClearSnake } from './utils/gameLogic';
import { sounds } from './utils/audio';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { BottomControls } from './components/BottomControls';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelFailedModal } from './components/LevelFailedModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { LoginModal } from './components/LoginModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HomeScreen } from './components/HomeScreen';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { RewardType } from './types';
import { submitScoreToCloud, fetchRemoteGameConfig, getCachedRemoteGameConfig, DEFAULT_GAME_CONFIG } from './services/apiService';
import { X } from 'lucide-react';
import { NetworkAdGuard } from './components/NetworkAdGuard';
import { SplashScreen } from './components/SplashScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { FriendsModal } from './components/FriendsModal';
import { ReferralModal } from './components/ReferralModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdMobBanner } from './components/AdMobBanner';
import { AdMobInterstitialModal } from './components/AdMobInterstitialModal';
import { AdMobRewardedModal } from './components/AdMobRewardedModal';

const STORAGE_KEY = 'snake_escape_puzzle_data_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');
  const [remoteConfig, setRemoteConfig] = useState<RemoteGameConfig>(getCachedRemoteGameConfig);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [showFriendsModal, setShowFriendsModal] = useState<boolean>(false);
  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(false);
  const [pendingNextLevel, setPendingNextLevel] = useState<number | null>(null);
  const [showRewardedAd, setShowRewardedAd] = useState<boolean>(false);
  const [activeRewardType, setActiveRewardType] = useState<RewardType>('hint');

  // Load persistent user progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          hintsRemaining: typeof parsed.hintsRemaining === 'number' ? parsed.hintsRemaining : 0,
          burnsRemaining: 0,
          themeMode: parsed.themeMode || 'dark',
          levelScores: parsed.levelScores || {},
        };
      }
    } catch {}
    return {
      unlockedLevel: 1,
      levelStars: {},
      levelScores: {},
      soundEnabled: true,
      hapticsEnabled: true,
      themeMode: 'dark',
      hintsRemaining: 0,
      burnsRemaining: 0,
    };
  });

  // Fetch Remote Config from PHP Admin on App Mount and Focus
  useEffect(() => {
    const syncRemoteConfig = () => {
      fetchRemoteGameConfig().then((cfg) => {
        setRemoteConfig(cfg);
        setProgress((prev) => {
          const updated: UserProgress = {
            ...prev,
            hintsRemaining: prev.hintsRemaining ?? 0,
            burnsRemaining: 0,
          };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      });
    };

    syncRemoteConfig();
    window.addEventListener('focus', syncRemoteConfig);
  }, []);

  // Anti-Cheat: Compute total score strictly by summing the highest score of each unique cleared level
  const totalScore = useMemo(() => {
    const scores = Object.values(progress.levelScores || {}) as number[];
    return scores.reduce((sum: number, s: number) => sum + (Number(s) || 0), 0);
  }, [progress.levelScores]);

  // Sync sounds.enabled
  useEffect(() => {
    sounds.enabled = progress.soundEnabled;
  }, [progress.soundEnabled]);

  // Sync dark / light theme mode with HTML DOM
  useEffect(() => {
    const isLight = progress.themeMode === 'light';
    if (isLight) {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }
  }, [progress.themeMode]);

  // Save progress
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch {}
  };

  const handleToggleTheme = (mode: 'dark' | 'light') => {
    saveProgress({
      ...progress,
      themeMode: mode,
    });
  };

  // Current Level State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isEndlessMode, setIsEndlessMode] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(() => getLevelConfig(1));
  const [snakes, setSnakes] = useState<SnakeData[]>([]);
  const [movesUsed, setMovesUsed] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3); // 3 Lives by default (earned via rewarded ads when depleted)

  // Level Clear Counter for Interstitial Ad Frequency
  const [clearedLevelsSessionCount, setClearedLevelsSessionCount] = useState<number>(0);

  const levelCacheRef = useRef<Record<number, LevelConfig>>({});

  // Interaction and animation lock
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hintedSnakeId, setHintedSnakeId] = useState<string | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Undo history
  const [undoStack, setUndoStack] = useState<MoveRecord[]>([]);
  const undoHandlerRef = useRef<((snake: SnakeData, onDone: () => void) => void) | null>(null);

  // Modals state
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [showLevelFailed, setShowLevelFailed] = useState<boolean>(false);
  const [failReason, setFailReason] = useState<'moves' | 'hearts'>('moves');
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showRulesGuide, setShowRulesGuide] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [lastEarnedScore, setLastEarnedScore] = useState<number>(0);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [isDoubleClaimed, setIsDoubleClaimed] = useState<boolean>(false);

  // Daily Check-In Modal State
  const [showDailyCheckIn, setShowDailyCheckIn] = useState<boolean>(false);

  // Initialize a level (caches configuration so restart retains the exact same puzzle)
  const loadLevel = useCallback(
    (levelId: number, isEndless: boolean = false, forceRegenerate: boolean = false) => {
      let config: LevelConfig;
      if (!forceRegenerate && levelCacheRef.current[levelId]) {
        config = levelCacheRef.current[levelId];
      } else {
        config = getLevelConfig(levelId, isEndless);
        levelCacheRef.current[levelId] = config;
      }

      // Deep clone snakes so we have original coordinates
      const clonedSnakes: SnakeData[] = config.snakes.map((s) => ({
        ...s,
        originalCells: s.cells.map((c) => ({ ...c })),
        originalDirection: s.direction,
        state: 'idle',
      }));

      setCurrentLevel(config);
      setSnakes(clonedSnakes);
      setMovesUsed(0);
      setHearts(3);
      setUndoStack([]);
      setHintedSnakeId(null);
      setShowLevelComplete(false);
      setShowLevelFailed(false);
      setIsDoubleClaimed(false);
    },
    []
  );

  // Load level on start or when levelId changes
  useEffect(() => {
    loadLevel(currentLevelId, isEndlessMode);
  }, [currentLevelId, isEndlessMode, loadLevel]);

  // Handle Snake Escape Success
  const handleSnakeEscape = (escapedSnake: SnakeData) => {
    // 1. Record in undo stack
    setUndoStack((prev) => [
      ...prev,
      { snake: { ...escapedSnake }, timestamp: Date.now() },
    ]);

    // 2. Increment moves used
    const newMoves = movesUsed + 1;
    setMovesUsed(newMoves);

    // 3. Mark snake as removed in state
    setSnakes((prev) => {
      const updated = prev.map((s) =>
        s.id === escapedSnake.id ? { ...s, state: 'removed' as const } : s
      );

      // 4. Check if all snakes escaped
      const remainingCount = updated.filter((s) => s.state !== 'removed').length;
      if (remainingCount === 0) {
        // WIN CONDITION MET!
        const target = currentLevel.targetMoves || currentLevel.snakes.length;
        let stars = 3;
        if (newMoves > target + 3) {
          stars = 1;
        } else if (newMoves > target) {
          stars = 2;
        }

        const bonus = Math.max(100, 500 - (newMoves - target) * 30);
        const levelTotal = 100 * currentLevel.snakes.length + bonus;
        setLastEarnedScore(levelTotal);
        setEarnedStars(stars);

        // Anti-Cheat: Record unique level highest score
        const nextUnlocked = Math.max(progress.unlockedLevel, currentLevelId + 1);
        const newStars = {
          ...progress.levelStars,
          [currentLevelId]: Math.max(progress.levelStars[currentLevelId] || 0, stars),
        };
        const newScores = {
          ...progress.levelScores,
          [currentLevelId]: Math.max(progress.levelScores[currentLevelId] || 0, levelTotal),
        };

        const updatedUniqueTotal = (Object.values(newScores) as number[]).reduce((a: number, b: number) => a + b, 0);
        const updatedProfile = progress.userProfile
          ? {
              ...progress.userProfile,
              totalScore: updatedUniqueTotal,
              levelsCleared: Object.keys(newScores).length,
            }
          : undefined;

        // Immediate Database Save: Sync every played level directly to Hostinger MySQL
        const activePlayerId = updatedProfile?.playerId || (() => {
          let id = localStorage.getItem('snake_guest_player_id');
          if (!id) {
            id = 'SNK-' + Math.floor(1000 + Math.random() * 9000);
            try { localStorage.setItem('snake_guest_player_id', id); } catch {}
          }
          return id;
        })();
        const activeUsername = updatedProfile?.name || updatedProfile?.username || `Guest_${activePlayerId.replace('SNK-', '')}`;

        submitScoreToCloud(
          {
            playerId: activePlayerId,
            username: activeUsername,
            totalScore: updatedUniqueTotal,
            levelsCleared: Object.keys(newScores).length,
            isLoggedIn: !!updatedProfile?.isLoggedIn,
          },
          currentLevelId,
          levelTotal,
          stars
        );

        if (updatedProfile?.isLoggedIn) {
          try {
            localStorage.setItem(`snake_progress_${updatedProfile.playerId}`, JSON.stringify({
              unlockedLevel: nextUnlocked,
              levelStars: newStars,
              levelScores: newScores,
            }));
          } catch {}
        }

        saveProgress({
          ...progress,
          unlockedLevel: nextUnlocked,
          levelStars: newStars,
          levelScores: newScores,
          hintsRemaining: progress.hintsRemaining,
          burnsRemaining: Math.min(6, progress.burnsRemaining + 1),
          userProfile: updatedProfile,
        });

        setTimeout(() => {
          setShowLevelComplete(true);
        }, 350);
      }

      return updated;
    });
  };

  // Handle Snake Blocked (Collision)
  const handleSnakeBlocked = () => {
    setMovesUsed((prev) => prev + 1);

    // Hit Limits: If player has 0 hearts (default), collision immediately fails the level!
    setHearts((prev) => {
      if (prev <= 0) {
        setTimeout(() => {
          setFailReason('hearts');
          setShowLevelFailed(true);
        }, 350);
        return 0;
      }
      const nextHearts = prev - 1;
      if (nextHearts <= 0) {
        setTimeout(() => {
          setFailReason('hearts');
          setShowLevelFailed(true);
        }, 350);
      }
      return Math.max(0, nextHearts);
    });
  };

  // Handle Hint (Requires hints > 0, otherwise prompts rewarded ad)
  const handleHint = () => {
    if (isAnimating) return;
    if (progress.hintsRemaining <= 0) {
      handleOpenRewardedAd('hint');
      return;
    }

    const clearSnake = findFirstClearSnake(
      snakes,
      currentLevel.obstacles,
      currentLevel.gridWidth,
      currentLevel.gridHeight
    );

    if (clearSnake) {
      sounds.playHint();
      setHintedSnakeId(clearSnake.id);

      // Decrement hint count
      saveProgress({
        ...progress,
        hintsRemaining: Math.max(0, progress.hintsRemaining - 1),
      });

      // Clear hint highlight after 3.5s
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setHintedSnakeId(null);
      }, 3500);
    }
  };

  // Handle Login Success (Restore that specific player's levels and score)
  const handleLoginSuccess = (profile: UserProfile) => {
    // Check if we have saved local level progress for this player
    const playerStorageKey = `snake_progress_${profile.playerId}`;
    let playerUnlockedLevel = Math.max(1, profile.highestLevel || 1, (profile.levelsCleared || 0) + 1);
    let playerLevelStars: Record<number, number> = {};
    let playerLevelScores: Record<number, number> = {};

    try {
      const savedPlayerData = localStorage.getItem(playerStorageKey);
      if (savedPlayerData) {
        const parsed = JSON.parse(savedPlayerData);
        playerUnlockedLevel = Math.max(playerUnlockedLevel, parsed.unlockedLevel || 1);
        playerLevelStars = parsed.levelStars || {};
        playerLevelScores = parsed.levelScores || {};
      }
      
      // Ensure all cleared levels up to profile.levelsCleared have scores & stars
      for (let i = 1; i <= (profile.levelsCleared || 0); i++) {
        if (!playerLevelStars[i]) playerLevelStars[i] = 3;
        if (!playerLevelScores[i]) {
          playerLevelScores[i] = Math.round((profile.totalScore || 1000) / Math.max(1, profile.levelsCleared));
        }
      }
    } catch {}

    const updated: UserProgress = {
      ...progress,
      unlockedLevel: playerUnlockedLevel,
      levelStars: playerLevelStars,
      levelScores: playerLevelScores,
      userProfile: profile,
    };

    saveProgress(updated);
    try {
      localStorage.setItem(playerStorageKey, JSON.stringify({
        unlockedLevel: playerUnlockedLevel,
        levelStars: playerLevelStars,
        levelScores: playerLevelScores,
      }));
    } catch {}

    setCurrentLevelId(playerUnlockedLevel);

    // Synchronize Daily Check-In status from server
    if (profile.checkedInToday !== undefined) {
      try {
        const checkinState = {
          currentStreak: profile.checkinStreak || 0,
          lastClaimTimestamp: profile.checkedInToday
            ? (profile.lastClaimTimestamp || Date.now())
            : (profile.lastClaimTimestamp || null),
        };
        localStorage.setItem('snake_daily_checkin_streak_v2', JSON.stringify(checkinState));
      } catch {}
    }

    if (profile.role === 'admin') {
      setShowAdminDashboard(true);
    }
  };

  // Handle Logout (Reset all levels to 0 / 1, points to 0)
  const handleLogout = () => {
    // If current player was logged in, save their current progress to their account slot
    if (progress.userProfile?.playerId) {
      try {
        localStorage.setItem(`snake_progress_${progress.userProfile.playerId}`, JSON.stringify({
          unlockedLevel: progress.unlockedLevel,
          levelStars: progress.levelStars,
          levelScores: progress.levelScores,
        }));
      } catch {}
    }

    const resetProgress: UserProgress = {
      ...progress,
      unlockedLevel: 1,
      levelStars: {},
      levelScores: {},
      userProfile: undefined,
    };

    saveProgress(resetProgress);
    setCurrentLevelId(1);
    setCurrentScreen('home');
  };

  // Handle Undo
  const handleUndo = () => {
    if (isAnimating || undoStack.length === 0) return;

    const lastMove = undoStack[undoStack.length - 1];
    const restoredSnake = lastMove.snake;

    if (undoHandlerRef.current) {
      // Trigger smooth reverse entrance animation on GameBoard
      undoHandlerRef.current(restoredSnake, () => {
        // Restore snake to active state in array
        setSnakes((prev) =>
          prev.map((s) =>
            s.id === restoredSnake.id
              ? {
                  ...restoredSnake,
                  cells: restoredSnake.originalCells
                    ? restoredSnake.originalCells.map((c) => ({ ...c }))
                    : restoredSnake.cells,
                  state: 'idle',
                }
              : s
          )
        );
        setUndoStack((prev) => prev.slice(0, -1));
        setMovesUsed((prev) => Math.max(0, prev - 1));
      });
    }
  };

  // Handle Restart (Resets current exact same puzzle configuration)
  const handleRestart = () => {
    if (isAnimating) return;
    sounds.playTap();
    loadLevel(currentLevelId, isEndlessMode, false);
  };

  // Handle Next Level (Seamless continuous progression with AdMob Interstitial support)
  const handleNextLevel = () => {
    setShowLevelComplete(false);
    sounds.playTap();

    const nextLvl = currentLevelId + 1;
    const newSessionCount = clearedLevelsSessionCount + 1;
    setClearedLevelsSessionCount(newSessionCount);

    const freq = remoteConfig.adFrequencyLevels || 2;
    if (remoteConfig.adsEnabled && remoteConfig.interstitialEnabled && newSessionCount % freq === 0) {
      setPendingNextLevel(nextLvl);
      setShowInterstitialAd(true);
    } else {
      setCurrentLevelId(nextLvl);
    }
  };

  const handleCloseInterstitialAd = () => {
    setShowInterstitialAd(false);
    if (pendingNextLevel !== null) {
      setCurrentLevelId(pendingNextLevel);
      setPendingNextLevel(null);
    }
  };

  // Handle Rewarded Boost Action (triggers AdMob Rewarded modal if enabled)
  const handleOpenRewardedAd = (type: RewardType) => {
    if (remoteConfig.adsEnabled && remoteConfig.rewardedEnabled) {
      setActiveRewardType(type);
      setShowRewardedAd(true);
    } else {
      const amt =
        type === 'hint'
          ? (remoteConfig.rewardHintPerAd || 1)
          : type === 'heart'
          ? (remoteConfig.rewardHeartPerAd || 1)
          : 2;

      sounds.playBonusScore();
      handleRewardEarned(type, amt);
    }
  };

  // Handle Rewarded Ad Earned Callback
  const handleRewardEarned = (type: RewardType, amount: number) => {
    if (type === 'hint') {
      const newHints = progress.hintsRemaining + amount;
      saveProgress({
        ...progress,
        hintsRemaining: newHints,
      });
    } else if (type === 'heart') {
      setHearts((prev) => prev + amount);
      setShowLevelFailed(false);
    } else if (type === 'double_points') {
      setIsDoubleClaimed(true);
      const bonus = lastEarnedScore;
      const doubledScore = lastEarnedScore * 2;
      const newLevelScore = (progress.levelScores[currentLevelId] || lastEarnedScore) + bonus;
      const newScores = {
        ...progress.levelScores,
        [currentLevelId]: newLevelScore,
      };
      const updatedUniqueTotal = (Object.values(newScores) as number[]).reduce((a: number, b: number) => a + b, 0);
      const updatedProfile = progress.userProfile
        ? {
            ...progress.userProfile,
            totalScore: updatedUniqueTotal,
            levelsCleared: Object.keys(newScores).length,
          }
        : undefined;

      const activePlayerId = updatedProfile?.playerId || (() => {
        let id = localStorage.getItem('snake_guest_player_id');
        if (!id) {
          id = 'SNK-' + Math.floor(1000 + Math.random() * 9000);
          try { localStorage.setItem('snake_guest_player_id', id); } catch {}
        }
        return id;
      })();
      const activeUsername = updatedProfile?.name || updatedProfile?.username || `Guest_${activePlayerId.replace('SNK-', '')}`;

      submitScoreToCloud(
        {
          playerId: activePlayerId,
          username: activeUsername,
          totalScore: updatedUniqueTotal,
          levelsCleared: Object.keys(newScores).length,
          isLoggedIn: !!updatedProfile?.isLoggedIn,
        },
        currentLevelId,
        newLevelScore,
        earnedStars
      );

      if (updatedProfile?.isLoggedIn) {
        try {
          localStorage.setItem(`snake_progress_${updatedProfile.playerId}`, JSON.stringify({
            unlockedLevel: progress.unlockedLevel,
            levelStars: progress.levelStars,
            levelScores: newScores,
          }));
        } catch {}
      }

      saveProgress({
        ...progress,
        levelScores: newScores,
        userProfile: updatedProfile,
      });

      setLastEarnedScore(doubledScore);
    }
  };

  // Handle Daily Check-In PTS Reward Claim
  const handleDailyCheckInClaim = (pts: number, newDayStreak?: number) => {
    const dailySlotKey = 999999;
    const prevBonus = Number(progress.levelScores[dailySlotKey]) || 0;
    const newScores = {
      ...progress.levelScores,
      [dailySlotKey]: prevBonus + pts,
    };

    const updatedTotal = (Object.values(newScores) as number[]).reduce((a: number, b: number) => a + b, 0);
    const updatedProfile = progress.userProfile
      ? {
          ...progress.userProfile,
          totalScore: updatedTotal,
          monthlyPoints: (Number(progress.userProfile.monthlyPoints) || 0) + pts,
          checkinStreak: newDayStreak !== undefined ? newDayStreak : (progress.userProfile.checkinStreak || 1),
          checkedInToday: true,
          lastCheckinDate: new Date().toISOString().split('T')[0],
          lastClaimTimestamp: Date.now(),
        }
      : undefined;

    saveProgress({
      ...progress,
      levelScores: newScores,
      userProfile: updatedProfile,
    });
    // Note: Daily Check-In persistence to MySQL is handled exclusively by recordDailyCheckIn() in DailyCheckInModal.
    // We intentionally do NOT call submitScoreToCloud() here, which would treat check-in as a single static level and cap points.
  };

  // Remaining moves for current level (or computed available moves)
  const movesRemaining = currentLevel.maxMoves
    ? Math.max(0, currentLevel.maxMoves - movesUsed)
    : Math.max(0, (currentLevel.targetMoves || currentLevel.snakes.length + 4) - movesUsed);

  // Check moves fail condition (Always active)
  useEffect(() => {
    if (
      currentLevel.maxMoves &&
      movesUsed >= currentLevel.maxMoves &&
      !showLevelComplete
    ) {
      // Check if any snakes are still left
      const remaining = snakes.filter((s) => s.state !== 'removed').length;
      if (remaining > 0) {
        setTimeout(() => {
          setFailReason('moves');
          setShowLevelFailed(true);
        }, 400);
      }
    }
  }, [movesUsed, currentLevel.maxMoves, snakes, showLevelComplete]);

  return (
    <div
      id="snake-escape-app"
      className="w-full min-h-screen h-full bg-ambient-nebula text-white flex flex-col justify-between items-center py-2 px-3 relative overflow-hidden"
    >
      {/* Immersive Ambient Background Decor */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* RENDER HOME SCREEN OR IN-GAME BOARD */}
      {currentScreen === 'home' ? (
        <div className="w-full flex-1 flex flex-col justify-between items-center min-h-0 relative z-10">
          <HomeScreen
            unlockedLevel={progress.unlockedLevel || 1}
            totalScore={totalScore || 0}
            levelsCleared={Object.keys(progress.levelScores || {}).length}
            userProfile={progress.userProfile}
            soundEnabled={progress.soundEnabled ?? true}
            themeMode={progress.themeMode || 'dark'}
            hintsRemaining={progress.hintsRemaining ?? 0}
            heartsRemaining={hearts}
            remoteConfig={remoteConfig}
            onOpenRewardedAd={handleOpenRewardedAd}
            onRequestRewardedAd={handleOpenRewardedAd}
            onPlayGame={() => {
              setCurrentLevelId(progress.unlockedLevel || 1);
              setIsEndlessMode(false);
              setCurrentScreen('game');
            }}
            onOpenLevelSelect={() => setShowLevelSelect(true)}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onOpenSettings={() => setShowSettings(true)}
            onOpenHowToPlay={() => setShowRulesGuide(true)}
            onOpenLogin={() => setShowLoginModal(true)}
            onOpenDailyCheckIn={() => setShowDailyCheckIn(true)}
            onOpenFriends={() => setShowFriendsModal(true)}
            onOpenReferrals={() => setShowReferralModal(true)}
            onOpenAdminDashboard={() => setShowAdminDashboard(true)}
            onToggleSound={() => {
              saveProgress({
                ...progress,
                soundEnabled: !progress.soundEnabled,
              });
            }}
            onToggleTheme={handleToggleTheme}
          />
          {remoteConfig.adsEnabled && remoteConfig.bannerEnabled && (
            <div className="w-full max-w-[420px] mx-auto pb-2 z-20">
              <AdMobBanner adUnitId={remoteConfig.admobBannerId} />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Top Header */}
          <Header
            levelNumber={currentLevelId}
            levelName={currentLevel.name}
            hintsRemaining={progress.hintsRemaining}
            hearts={hearts}
            maxHearts={3}
            movesRemaining={movesRemaining}
            score={totalScore}
            userProfile={progress.userProfile}
            themeMode={progress.themeMode || 'dark'}
            onOpenMenu={() => setShowLevelSelect(true)}
            onGoHome={() => setCurrentScreen('home')}
            onOpenSettings={() => setShowSettings(true)}
            onOpenLogin={() => setShowLoginModal(true)}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onOpenFriends={() => setShowFriendsModal(true)}
            onOpenAdminDashboard={() => setShowAdminDashboard(true)}
            onToggleTheme={handleToggleTheme}
          />

          {/* Main Game Board Area */}
          <main className="w-full flex-1 flex items-center justify-center py-1.5">
            <GameBoard
              gridWidth={currentLevel.gridWidth}
              gridHeight={currentLevel.gridHeight}
              snakes={snakes}
              obstacles={currentLevel.obstacles}
              hintedSnakeId={hintedSnakeId}
              onSnakeEscape={handleSnakeEscape}
              onSnakeBlocked={handleSnakeBlocked}
              onAnimationStateChange={setIsAnimating}
              registerUndoAnimation={(handler) => {
                undoHandlerRef.current = handler;
              }}
            />
          </main>

          {/* AdMob Banner in Game Screen */}
          {remoteConfig.adsEnabled && remoteConfig.bannerEnabled && (
            <div className="w-full max-w-[420px] mx-auto px-2 z-20">
              <AdMobBanner adUnitId={remoteConfig.admobBannerId} />
            </div>
          )}

          {/* Bottom Controls Bar */}
          <BottomControls
            onHint={handleHint}
            onUndo={handleUndo}
            onRestart={handleRestart}
            onRequestRewardedAd={handleOpenRewardedAd}
            canUndo={undoStack.length > 0}
            hintsRemaining={progress.hintsRemaining}
            heartsRemaining={hearts}
            disabled={isAnimating}
          />
        </>
      )}

      {/* Modals */}
      {showLevelComplete && (
        <LevelCompleteModal
          levelNumber={currentLevelId}
          scoreEarned={lastEarnedScore}
          totalScore={totalScore}
          movesUsed={movesUsed}
          targetMoves={currentLevel.targetMoves || currentLevel.snakes.length}
          stars={earnedStars}
          isDoubleClaimed={isDoubleClaimed}
          onDoublePoints={() => handleOpenRewardedAd('double_points')}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
        />
      )}

      {showLevelFailed && (
        <LevelFailedModal
          levelNumber={currentLevelId}
          reason={failReason}
          onRetry={handleRestart}
          onUseHint={() => {
            setShowLevelFailed(false);
            handleHint();
          }}
          onWatchRewardAd={handleOpenRewardedAd}
          onRequestRewardedAd={handleOpenRewardedAd}
          hintsRemaining={progress.hintsRemaining}
        />
      )}

      {showLevelSelect && (
        <LevelSelectModal
          currentLevel={currentLevelId}
          unlockedLevel={progress.unlockedLevel}
          levelStars={progress.levelStars}
          onSelectLevel={(lvlId) => {
            setIsEndlessMode(false);
            setCurrentLevelId(lvlId);
            setCurrentScreen('game');
            setShowLevelSelect(false);
          }}
          onClose={() => setShowLevelSelect(false)}
          onSelectEndless={() => {
            setIsEndlessMode(true);
            setCurrentLevelId(11);
            setCurrentScreen('game');
            setShowLevelSelect(false);
          }}
          isEndlessMode={isEndlessMode}
        />
      )}

      {showSettings && (
        <SettingsModal
          soundEnabled={progress.soundEnabled}
          hapticsEnabled={progress.hapticsEnabled}
          themeMode={progress.themeMode || 'dark'}
          remoteConfig={remoteConfig}
          onToggleSound={() => {
            saveProgress({
              ...progress,
              soundEnabled: !progress.soundEnabled,
            });
          }}
          onToggleHaptics={() => {
            saveProgress({
              ...progress,
              hapticsEnabled: !progress.hapticsEnabled,
            });
          }}
          onToggleTheme={handleToggleTheme}
          onResetProgress={() => {
            const fresh: UserProgress = {
              unlockedLevel: 1,
              levelStars: {},
              levelScores: {},
              soundEnabled: true,
              hapticsEnabled: true,
              hintsRemaining: 0,
              burnsRemaining: 0,
            };
            saveProgress(fresh);
            setCurrentLevelId(1);
            setIsEndlessMode(false);
            setShowSettings(false);
          }}
          onOpenHelp={() => {
            setShowSettings(false);
            setShowRulesGuide(true);
          }}
          onOpenPrivacyPolicy={() => {
            setShowSettings(false);
            setShowPrivacyPolicy(true);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showRulesGuide && (
        <RulesGuideModal onClose={() => setShowRulesGuide(false)} />
      )}

      {/* In-Game Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal
          isOpen={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
        />
      )}

      {/* Account Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        userProfile={progress.userProfile}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenAdminDashboard={() => {
          setShowLoginModal(false);
          setShowAdminDashboard(true);
        }}
        onOpenPrivacyPolicy={() => {
          setShowPrivacyPolicy(true);
        }}
        currentUnlockedLevel={progress.unlockedLevel}
      />

      {/* Global Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        userProfile={progress.userProfile}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* 20-Day Daily Check-In Modal */}
      <DailyCheckInModal
        isOpen={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
        onClaimPTS={handleDailyCheckInClaim}
        userProfile={progress.userProfile}
      />

      {/* Friends & CB Coin Gifting Modal */}
      <FriendsModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        userProfile={progress.userProfile}
        onOpenLogin={() => {
          setShowFriendsModal(false);
          setShowLoginModal(true);
        }}
        onCbCoinsUpdated={(newBalance) => {
          if (progress.userProfile) {
            const updatedProfile = {
              ...progress.userProfile,
              cbCoins: newBalance,
            };
            saveProgress({
              ...progress,
              userProfile: updatedProfile,
            });
          }
        }}
      />

      {/* Referral & Rewards Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        userProfile={progress.userProfile}
        onOpenLogin={() => {
          setShowReferralModal(false);
          setShowLoginModal(true);
        }}
        onCbCoinsUpdated={(newBalance) => {
          if (progress.userProfile) {
            const updatedProfile = {
              ...progress.userProfile,
              cbCoins: newBalance,
            };
            saveProgress({
              ...progress,
              userProfile: updatedProfile,
            });
          }
        }}
      />

      {/* Internet Connection & Ad-Blocker Security Guard Overlay */}
      <NetworkAdGuard adsEnabled={remoteConfig.adsEnabled} />

      {/* Brand New 3D Animated Launch Splash Screen */}
      {showSplash && (
        <SplashScreen
          appName="COBRA ESCAPE 3D"
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* Dedicated Admin Control Dashboard */}
      {showAdminDashboard && progress.userProfile?.role === 'admin' && (
        <AdminDashboard
          currentAdmin={progress.userProfile}
          onLogout={() => {
            setShowAdminDashboard(false);
            handleLogout();
          }}
          onExitToGame={() => setShowAdminDashboard(false)}
          onAdsConfigSaved={() => {
            fetchRemoteGameConfig().then(setRemoteConfig);
          }}
        />
      )}

      {/* Google Test AdMob Interstitial Modal */}
      {showInterstitialAd && (
        <AdMobInterstitialModal
          isOpen={showInterstitialAd}
          onClose={handleCloseInterstitialAd}
          adUnitId={remoteConfig.admobInterstitialId}
          levelNumber={currentLevelId}
        />
      )}

      {/* Google Test AdMob Rewarded Video Modal */}
      {showRewardedAd && (
        <AdMobRewardedModal
          isOpen={showRewardedAd}
          rewardType={activeRewardType}
          rewardAmount={
            activeRewardType === 'hint'
              ? (remoteConfig.rewardHintPerAd || 3)
              : activeRewardType === 'burn'
              ? (remoteConfig.rewardBurnPerAd || 1)
              : activeRewardType === 'heart'
              ? (remoteConfig.rewardHeartPerAd || 2)
              : 2
          }
          adUnitId={remoteConfig.admobRewardedId}
          onRewardEarned={(type, amt) => {
            handleRewardEarned(type, amt);
            setShowRewardedAd(false);
          }}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </div>
  );
}

