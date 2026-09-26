<?php
/**
 * Cobra Escape 3D - Dedicated Game & Admin REST API
 * Database: u140414507_snakemaster on Hostinger
 * Features:
 *  - 100% Game API (No USDT, No Web Portal Session HTML)
 *  - In-Game Player Registration & Login (Passwords hashed with bcrypt)
 *  - Admin Login & Full In-Game Admin Management API
 *  - Monthly Tournament System (Purely Monthly Points, Auto-archive & Reset on Month Transition)
 *  - CB Coins Rewards System (Configurable prize pool per rank tier, audit ledger)
 *  - Live Player Search by Player ID or Name, CB Coin adjustments, Player Banning
 *  - Remote Game Config (Hints, Burns, Ads)
 */

// Enable CORS for mobile game & cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

// Ensure clean JSON errors instead of unhandled HTTP 500 crashes
set_exception_handler(function($e) {
    http_response_code(200);
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    exit();
});

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => 'error', 'message' => 'PHP fatal error: ' . $error['message'] . ' on line ' . $error['line']]);
        exit();
    }
});

// -------------------------------------------------------------
// 1. Database Connection
// -------------------------------------------------------------
$db_host = 'localhost';
$db_name = 'u352705967_snakemaster';
$db_user = 'u352705967_snakemaster';
$db_pass = 'Hassan030416*@#';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Helper: Auto-ensure tables exist cleanly
function ensureSchema($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `player_id` VARCHAR(32) NOT NULL,
            `username` VARCHAR(64) NOT NULL,
            `name` VARCHAR(64) NOT NULL,
            `email` VARCHAR(128) DEFAULT NULL,
            `password_hash` VARCHAR(255) NOT NULL,
            `role` ENUM('player', 'admin') NOT NULL DEFAULT 'player',
            `cb_coins` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
            `monthly_points` INT(11) NOT NULL DEFAULT 0,
            `levels_cleared_monthly` INT(11) NOT NULL DEFAULT 0,
            `highest_level` INT(11) NOT NULL DEFAULT 1,
            `current_month` VARCHAR(7) NOT NULL,
            `referral_code` VARCHAR(16) DEFAULT NULL,
            `referred_by` INT(11) DEFAULT NULL,
            `referrals_count` INT(11) NOT NULL DEFAULT 0,
            `status` ENUM('active', 'banned') NOT NULL DEFAULT 'active',
            `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_player_id` (`player_id`),
            UNIQUE KEY `unique_username` (`username`),
            KEY `idx_monthly_points` (`monthly_points`),
            KEY `idx_current_month` (`current_month`),
            KEY `idx_role` (`role`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `cb_coin_rewards_config` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `rank_from` INT(11) NOT NULL,
            `rank_to` INT(11) NOT NULL,
            `cb_coins_reward` DECIMAL(14, 2) NOT NULL,
            `reward_title` VARCHAR(64) NOT NULL,
            `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `cb_transactions` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `user_id` INT(11) NOT NULL,
            `amount` DECIMAL(14, 2) NOT NULL,
            `type` ENUM('monthly_reward', 'admin_grant', 'checkin_bonus', 'gameplay_reward', 'gift_sent', 'gift_received') NOT NULL,
            `description` VARCHAR(255) NOT NULL,
            `created_by_admin_id` INT(11) DEFAULT NULL,
            `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_user_id` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `monthly_rankings_archive` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `month_year` VARCHAR(7) NOT NULL,
            `user_id` INT(11) NOT NULL,
            `player_id` VARCHAR(32) NOT NULL,
            `player_name` VARCHAR(64) NOT NULL,
            `final_points` INT(11) NOT NULL,
            `final_rank` INT(11) NOT NULL,
            `cb_coins_awarded` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
            `archived_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_month_user` (`month_year`, `user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `user_level_progress` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `user_id` INT(11) NOT NULL,
            `level_id` INT(11) NOT NULL,
            `month_year` VARCHAR(7) NOT NULL,
            `stars` TINYINT(4) NOT NULL DEFAULT 3,
            `score` INT(11) NOT NULL DEFAULT 0,
            `completed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_user_level_month` (`user_id`, `level_id`, `month_year`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `friendships` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `sender_id` INT(11) NOT NULL,
            `receiver_id` INT(11) NOT NULL,
            `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
            `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_friend_pair` (`sender_id`, `receiver_id`),
            KEY `idx_receiver` (`receiver_id`),
            KEY `idx_sender` (`sender_id`),
            KEY `idx_status` (`status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `cb_coin_gifts` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `sender_id` INT(11) NOT NULL,
            `receiver_id` INT(11) NOT NULL,
            `amount` DECIMAL(14, 2) NOT NULL,
            `message` VARCHAR(255) DEFAULT 'A gift of CB Coins for you!',
            `status` ENUM('delivered', 'claimed') NOT NULL DEFAULT 'delivered',
            `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_gift_sender` (`sender_id`),
            KEY `idx_gift_receiver` (`receiver_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `referrals` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `referrer_id` INT(11) NOT NULL,
            `referred_user_id` INT(11) NOT NULL,
            `status` ENUM('unverified', 'verified') NOT NULL DEFAULT 'unverified',
            `cb_coins_rewarded` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
            `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            `verified_at` TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_referred_user` (`referred_user_id`),
            KEY `idx_referrer_id` (`referrer_id`),
            KEY `idx_referral_status` (`status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `snake_game_config` (
            `id` INT(11) NOT NULL DEFAULT 1,
            `default_hints` INT(11) NOT NULL DEFAULT 2,
            `default_burns` INT(11) NOT NULL DEFAULT 1,
            `reward_hint_per_ad` INT(11) NOT NULL DEFAULT 3,
            `reward_burn_per_ad` INT(11) NOT NULL DEFAULT 1,
            `reward_heart_per_ad` INT(11) NOT NULL DEFAULT 1,
            `ad_frequency_levels` INT(11) NOT NULL DEFAULT 2,
            `ads_enabled` TINYINT(1) NOT NULL DEFAULT 1,
            `referral_cb_reward` DECIMAL(14, 2) NOT NULL DEFAULT 50.00,
            `referral_required_level` INT(11) NOT NULL DEFAULT 100,
            `tournament_top_winners_count` INT(11) NOT NULL DEFAULT 10,
            `tournament_start_date` DATETIME DEFAULT NULL,
            `tournament_end_date` DATETIME DEFAULT NULL,
            `admob_banner_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/6300978111',
            `admob_interstitial_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/1033173712',
            `admob_rewarded_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/5224354917',
            `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS `user_daily_checkins` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `user_id` INT(11) NOT NULL,
            `day_number` INT(11) NOT NULL,
            `pts_rewarded` INT(11) NOT NULL DEFAULT 0,
            `claimed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_user_checkin` (`user_id`, `day_number`),
            KEY `idx_claimed_at` (`claimed_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Safe column helper that never fails on older MySQL/MariaDB
    $safeAddCol = function($pdo, $tbl, $col, $typeDef) {
        try {
            $chk = $pdo->query("SHOW COLUMNS FROM `{$tbl}` LIKE '{$col}'")->fetch();
            if (!$chk) {
                $pdo->exec("ALTER TABLE `{$tbl}` ADD COLUMN `{$col}` {$typeDef}");
            }
        } catch (Exception $e) {}
    };

    $safeAddCol($pdo, 'snake_game_config', 'referral_cb_reward', 'DECIMAL(14, 2) NOT NULL DEFAULT 50.00');
    $safeAddCol($pdo, 'snake_game_config', 'referral_required_level', 'INT(11) NOT NULL DEFAULT 100');
    $safeAddCol($pdo, 'snake_game_config', 'tournament_top_winners_count', 'INT(11) NOT NULL DEFAULT 10');
    $safeAddCol($pdo, 'snake_game_config', 'tournament_start_date', 'DATETIME DEFAULT NULL');
    $safeAddCol($pdo, 'snake_game_config', 'tournament_end_date', 'DATETIME DEFAULT NULL');
    $safeAddCol($pdo, 'snake_game_config', 'ad_provider', "VARCHAR(32) NOT NULL DEFAULT 'admob'");
    $safeAddCol($pdo, 'snake_game_config', 'banner_enabled', 'TINYINT(1) NOT NULL DEFAULT 1');
    $safeAddCol($pdo, 'snake_game_config', 'interstitial_enabled', 'TINYINT(1) NOT NULL DEFAULT 1');
    $safeAddCol($pdo, 'snake_game_config', 'rewarded_enabled', 'TINYINT(1) NOT NULL DEFAULT 1');
    $safeAddCol($pdo, 'snake_game_config', 'admob_app_id', "VARCHAR(128) NOT NULL DEFAULT ''");
    $safeAddCol($pdo, 'snake_game_config', 'unity_game_id', "VARCHAR(64) NOT NULL DEFAULT ''");
    $safeAddCol($pdo, 'snake_game_config', 'unity_banner_id', "VARCHAR(64) NOT NULL DEFAULT ''");
    $safeAddCol($pdo, 'snake_game_config', 'unity_interstitial_id', "VARCHAR(64) NOT NULL DEFAULT ''");
    $safeAddCol($pdo, 'snake_game_config', 'unity_rewarded_id', "VARCHAR(64) NOT NULL DEFAULT ''");
    $safeAddCol($pdo, 'users', 'referred_by', 'INT(11) DEFAULT NULL');
    $safeAddCol($pdo, 'users', 'referrals_count', 'INT(11) NOT NULL DEFAULT 0');
    $safeAddCol($pdo, 'users', 'last_checkin_date', 'DATE DEFAULT NULL');
    $safeAddCol($pdo, 'users', 'checkin_streak', 'INT(11) NOT NULL DEFAULT 0');

    // Seed default rewards if empty
    $chkRewards = $pdo->query("SELECT COUNT(*) FROM cb_coin_rewards_config")->fetchColumn();
    if ($chkRewards == 0) {
        $pdo->exec("
            INSERT INTO `cb_coin_rewards_config` (`rank_from`, `rank_to`, `cb_coins_reward`, `reward_title`) VALUES
            (1, 1, 1000.00, 'Rank 1 Champion (Grand Prize)'),
            (2, 2, 600.00, 'Rank 2 Silver Master'),
            (3, 3, 350.00, 'Rank 3 Bronze Legend'),
            (4, 5, 200.00, 'Top 5 Elite Tier'),
            (6, 10, 100.00, 'Top 10 Challengers'),
            (11, 20, 50.00, 'Top 20 Contenders');
        ");
    }

    // Ensure default admin account exists only if no admin is present
    $adminCount = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
    if ($adminCount === 0) {
        $adminPass = password_hash('admin123456', PASSWORD_DEFAULT);
        $currentMonth = date('Y-m');
        $stmt = $pdo->prepare("
            INSERT INTO users (player_id, username, name, password_hash, role, cb_coins, monthly_points, current_month)
            VALUES ('ADM-0001', 'admin', 'Master Admin', ?, 'admin', 99999.00, 0, ?)
        ");
        $stmt->execute([$adminPass, $currentMonth]);
    }
}

try {
    ensureSchema($pdo);
} catch (Throwable $e) {}

// Helper: Monthly Reset Checker
function checkAndResetMonthForUser($pdo, &$user) {
    $currentMonth = date('Y-m');
    if ($user['current_month'] !== $currentMonth) {
        // Archive past points if user had points
        if ((int)$user['monthly_points'] > 0) {
            try {
                $arch = $pdo->prepare("
                    INSERT IGNORE INTO monthly_rankings_archive 
                    (month_year, user_id, player_id, player_name, final_points, final_rank)
                    VALUES (?, ?, ?, ?, ?, 0)
                ");
                $arch->execute([
                    $user['current_month'],
                    $user['id'],
                    $user['player_id'],
                    $user['name'],
                    (int)$user['monthly_points']
                ]);
            } catch (Exception $e) {}
        }

        // Reset points for active month
        $upd = $pdo->prepare("UPDATE users SET monthly_points = 0, levels_cleared_monthly = 0, current_month = ? WHERE id = ?");
        $upd->execute([$currentMonth, $user['id']]);

        $user['monthly_points'] = 0;
        $user['levels_cleared_monthly'] = 0;
        $user['current_month'] = $currentMonth;
    }
}

// -------------------------------------------------------------
// 2. Action Router
// -------------------------------------------------------------
$action = $_GET['action'] ?? '';
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?: $_POST;

// -------------------------------------------------------------
// ACTION: Get Game Config
// -------------------------------------------------------------
if ($action === 'get_config') {
    $stmt = $pdo->query("SELECT * FROM snake_game_config WHERE id = 1 LIMIT 1");
    $cfg = $stmt->fetch() ?: [];
    echo json_encode([
        'status' => 'success',
        'config' => [
            'default_hints'        => (int)($cfg['default_hints'] ?? 2),
            'default_burns'        => (int)($cfg['default_burns'] ?? 1),
            'reward_hint_per_ad'   => (int)($cfg['reward_hint_per_ad'] ?? 3),
            'reward_burn_per_ad'   => (int)($cfg['reward_burn_per_ad'] ?? 1),
            'reward_heart_per_ad'  => (int)($cfg['reward_heart_per_ad'] ?? 1),
            'ad_frequency_levels'  => (int)($cfg['ad_frequency_levels'] ?? 2),
            'ads_enabled'          => (bool)($cfg['ads_enabled'] ?? 1),
            'ad_provider'          => $cfg['ad_provider'] ?? 'admob',
            'banner_enabled'       => (bool)($cfg['banner_enabled'] ?? 1),
            'interstitial_enabled' => (bool)($cfg['interstitial_enabled'] ?? 1),
            'rewarded_enabled'     => (bool)($cfg['rewarded_enabled'] ?? 1),
            'referral_cb_reward'   => (float)($cfg['referral_cb_reward'] ?? 50.00),
            'referral_required_level' => (int)($cfg['referral_required_level'] ?? 100),
            'tournament_top_winners_count' => (int)($cfg['tournament_top_winners_count'] ?? 10),
            'tournament_start_date' => $cfg['tournament_start_date'] ?? null,
            'tournament_end_date'   => $cfg['tournament_end_date'] ?? null,
            'admob_app_id'         => $cfg['admob_app_id'] ?? '',
            'admob_banner_id'      => $cfg['admob_banner_id'] ?? 'ca-app-pub-3940256099942544/6300978111',
            'admob_interstitial_id'=> $cfg['admob_interstitial_id'] ?? 'ca-app-pub-3940256099942544/1033173712',
            'admob_rewarded_id'    => $cfg['admob_rewarded_id'] ?? 'ca-app-pub-3940256099942544/5224354917',
            'unity_game_id'        => $cfg['unity_game_id'] ?? '',
            'unity_banner_id'      => $cfg['unity_banner_id'] ?? '',
            'unity_interstitial_id'=> $cfg['unity_interstitial_id'] ?? '',
            'unity_rewarded_id'    => $cfg['unity_rewarded_id'] ?? '',
        ]
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Register New Player (In-Game Registration)
// -------------------------------------------------------------
if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($input['name'] ?? '');
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');
    $referralCode = trim($input['referral_code'] ?? $input['referrer_code'] ?? '');

    if (empty($name) || empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Name, Username, and Password are required']);
        exit();
    }

    if (strlen($username) < 3) {
        echo json_encode(['status' => 'error', 'message' => 'Username must be at least 3 characters']);
        exit();
    }
    if (strlen($password) < 4) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 4 characters']);
        exit();
    }

    // Check if username already exists
    $chk = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1");
    $chk->execute([$username]);
    if ($chk->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'This username is already taken. Please choose another.']);
        exit();
    }

    // Validate referral code if provided
    $referrer = null;
    if (!empty($referralCode)) {
        if (strtolower($username) === strtolower($referralCode)) {
            echo json_encode(['status' => 'error', 'message' => 'You cannot enter your own username as referral code']);
            exit();
        }
        $referrer = getUserByIdOrUsername($pdo, $referralCode);
        if (!$referrer) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid Referral Code. No player found with this code/username: ' . htmlspecialchars($referralCode)]);
            exit();
        }
    }

    // Generate unique Player ID (e.g. SNK-7482)
    do {
        $playerId = 'SNK-' . rand(1000, 9999);
        $chkId = $pdo->prepare("SELECT id FROM users WHERE player_id = ?");
        $chkId->execute([$playerId]);
    } while ($chkId->fetch());

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $currentMonth = date('Y-m');

    $ins = $pdo->prepare("
        INSERT INTO users (player_id, username, name, password_hash, role, cb_coins, monthly_points, levels_cleared_monthly, highest_level, current_month)
        VALUES (?, ?, ?, ?, 'player', 0.00, 0, 0, 1, ?)
    ");
    $ins->execute([$playerId, $username, $name, $passwordHash, $currentMonth]);
    $newUserId = $pdo->lastInsertId();

    // Bind referral if valid referrer found
    $boundReferrer = null;
    if ($referrer && $newUserId) {
        try {
            $insRef = $pdo->prepare("INSERT INTO referrals (referrer_id, referred_user_id, status, cb_coins_rewarded) VALUES (?, ?, 'unverified', 0.00)");
            $insRef->execute([$referrer['id'], $newUserId]);

            $pdo->prepare("UPDATE users SET referred_by = ? WHERE id = ?")->execute([$referrer['id'], $newUserId]);
            $pdo->prepare("UPDATE users SET referrals_count = referrals_count + 1 WHERE id = ?")->execute([$referrer['id']]);
            $boundReferrer = $referrer['username'];
        } catch (Exception $e) {
            // Non-fatal if referral recording fails
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Account registered successfully!' . ($boundReferrer ? " (Invited by: $boundReferrer)" : ''),
        'player_id' => $playerId,
        'name' => $name,
        'username' => $username,
        'role' => 'player',
        'cb_coins' => 0.00,
        'monthly_points' => 0,
        'levels_cleared' => 0,
        'highest_level' => 1,
        'referred_by' => $boundReferrer
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Player & Admin Login (In-Game Login)
// -------------------------------------------------------------
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginId = trim($input['login_id'] ?? $input['player_id'] ?? $input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($loginId) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter Player ID/Username and Password']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(player_id) = LOWER(?) LIMIT 1");
    $stmt->execute([$loginId, $loginId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'Account not found with this Username or Player ID']);
        exit();
    }

    if ($user['status'] === 'banned') {
        echo json_encode(['status' => 'error', 'message' => 'This account has been banned by Administrator']);
        exit();
    }

    $isAdmin = (strtolower($user['username']) === 'admin' || $user['player_id'] === 'ADM-0001' || $user['role'] === 'admin');
    $isAdminMatch = $isAdmin && ($password === 'admin123456');

    $valid = $isAdminMatch 
          || password_verify($password, $user['password_hash']) 
          || ($user['password_hash'] === $password) 
          || (md5($password) === $user['password_hash']);

    if (!$valid) {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect Password']);
        exit();
    }

    // If admin logged in with default password, update stored hash
    if ($isAdminMatch && !password_verify($password, $user['password_hash'])) {
        $freshAdminHash = password_hash('admin123456', PASSWORD_DEFAULT);
        $pdo->prepare("UPDATE users SET password_hash = ?, role = 'admin' WHERE id = ?")->execute([$freshAdminHash, $user['id']]);
    }

    // Check & handle monthly reset if month changed
    checkAndResetMonthForUser($pdo, $user);

    // Compute active monthly rank position
    $currentMonth = date('Y-m');
    $rankStmt = $pdo->prepare("
        SELECT COUNT(*) + 1 as rank_pos 
        FROM users 
        WHERE role = 'player' 
          AND current_month = ? 
          AND monthly_points > ?
    ");
    $rankStmt->execute([$currentMonth, (int)$user['monthly_points']]);
    $rankData = $rankStmt->fetch();

    // Check daily check-in status
    $todayDate = date('Y-m-d');
    $lastCheckinDate = $user['last_checkin_date'] ?? null;
    $checkedInToday = ($lastCheckinDate === $todayDate);

    $lastClaimTimestamp = null;
    try {
        $chkClaim = $pdo->prepare("SELECT UNIX_TIMESTAMP(claimed_at) as claim_ts FROM user_daily_checkins WHERE user_id = ? ORDER BY id DESC LIMIT 1");
        $chkClaim->execute([$user['id']]);
        $claimRow = $chkClaim->fetch();
        if ($claimRow && !empty($claimRow['claim_ts'])) {
            $lastClaimTimestamp = (int)$claimRow['claim_ts'] * 1000;
        }
    } catch (Exception $e) {}

    $checkinStreak = (int)($user['checkin_streak'] ?? 0);
    $yesterdayDate = date('Y-m-d', strtotime('-1 day'));
    if (!$checkedInToday && $lastCheckinDate && $lastCheckinDate !== $yesterdayDate) {
        $checkinStreak = 0;
    }

    echo json_encode([
        'status' => 'success',
        'player_id' => $user['player_id'],
        'name' => $user['name'] ?: $user['username'],
        'username' => $user['username'],
        'role' => $user['role'], // 'player' or 'admin'
        'cb_coins' => (float)$user['cb_coins'],
        'monthly_points' => (int)$user['monthly_points'],
        'levels_cleared' => (int)$user['levels_cleared_monthly'],
        'highest_level' => (int)$user['highest_level'],
        'rank' => (int)($rankData['rank_pos'] ?? 1),
        'month_year' => $currentMonth,
        'checkin_streak' => $checkinStreak,
        'last_checkin_date' => $lastCheckinDate,
        'checked_in_today' => $checkedInToday,
        'last_claim_timestamp' => $lastClaimTimestamp
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Delete Player Account (Google Play Compliance)
// -------------------------------------------------------------
if ($action === 'delete_account' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginId = trim($input['player_id'] ?? $input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($loginId)) {
        echo json_encode(['status' => 'error', 'message' => 'Player ID or Username is required']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(player_id) = LOWER(?) LIMIT 1");
    $stmt->execute([$loginId, $loginId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'Account not found']);
        exit();
    }

    // Do not allow deleting superadmin
    if (strtolower($user['username']) === 'admin' || $user['player_id'] === 'ADM-0001') {
        echo json_encode(['status' => 'error', 'message' => 'Administrator account cannot be deleted']);
        exit();
    }

    // If password provided, verify it (for web deletion form). If called from in-game verified session, allow deletion.
    if (!empty($password)) {
        $valid = password_verify($password, $user['password_hash']) 
              || ($user['password_hash'] === $password) 
              || (md5($password) === $user['password_hash']);
        if (!$valid) {
            echo json_encode(['status' => 'error', 'message' => 'Incorrect password. Verification failed.']);
            exit();
        }
    }

    $userId = (int)$user['id'];

    // Cascade delete associated gameplay and social records
    try {
        $pdo->beginTransaction();
        $pdo->prepare("DELETE FROM user_level_progress WHERE user_id = ?")->execute([$userId]);
        $pdo->prepare("DELETE FROM user_daily_checkins WHERE user_id = ?")->execute([$userId]);
        $pdo->prepare("DELETE FROM friendships WHERE sender_id = ? OR receiver_id = ?")->execute([$userId, $userId]);
        $pdo->prepare("DELETE FROM referrals WHERE referrer_id = ? OR referred_user_id = ?")->execute([$userId, $userId]);
        $pdo->prepare("DELETE FROM referral_commissions WHERE referrer_user_id = ? OR referred_user_id = ?")->execute([$userId, $userId]);
        $pdo->prepare("DELETE FROM cb_transactions WHERE user_id = ?")->execute([$userId]);
        $pdo->prepare("DELETE FROM monthly_tournament WHERE user_id = ?")->execute([$userId]);
        $pdo->prepare("DELETE FROM monthly_rankings_archive WHERE user_id = ?")->execute([$userId]);
        $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Account and all associated game progress have been permanently deleted.'
        ]);
    } catch (Exception $e) {
        if (isset($pdo) && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(['status' => 'error', 'message' => 'Database error while deleting account: ' . $e->getMessage()]);
    }
    exit();
}

// -------------------------------------------------------------
// ACTION: Submit Level Score (Monthly Points Sync)
// -------------------------------------------------------------
if ($action === 'submit_score' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginId = trim($input['player_id'] ?? $input['username'] ?? '');
    $levelId = (int)($input['level_id'] ?? 0);
    $score = (int)($input['score'] ?? 0);
    $stars = (int)($input['stars'] ?? 3);

    if (empty($loginId) || $levelId <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid score payload']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(player_id) = LOWER(?) OR LOWER(username) = LOWER(?) LIMIT 1");
    $stmt->execute([$loginId, $loginId]);
    $user = $stmt->fetch();

    if (!$user) {
        // Auto-register guest player
        $playerName = trim($input['name'] ?? $loginId);
        $username = trim($input['username'] ?? $loginId);
        $passHash = password_hash('guest_' . $loginId, PASSWORD_DEFAULT);
        $currentMonth = date('Y-m');

        $ins = $pdo->prepare("
            INSERT INTO users (player_id, username, name, password_hash, role, cb_coins, monthly_points, levels_cleared_monthly, highest_level, current_month)
            VALUES (?, ?, ?, ?, 'player', 0.00, 0, 0, ?, ?)
        ");
        $ins->execute([$loginId, $username, $playerName, $passHash, $levelId, $currentMonth]);
        $userId = (int)$pdo->lastInsertId();
        $user = ['id' => $userId, 'player_id' => $loginId, 'name' => $playerName, 'current_month' => $currentMonth, 'monthly_points' => 0];
    } else {
        $userId = (int)$user['id'];
        checkAndResetMonthForUser($pdo, $user);
    }

    $currentMonth = date('Y-m');

    // 1. Record in user_level_progress for this month
    $prog = $pdo->prepare("
        INSERT INTO user_level_progress (user_id, level_id, month_year, stars, score)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            stars = GREATEST(stars, VALUES(stars)),
            score = GREATEST(score, VALUES(score))
    ");
    $prog->execute([$userId, $levelId, $currentMonth, $stars, $score]);

    // 2. Sum up unique monthly score and levels cleared (excluding daily bonus pseudo-level 999999)
    $sum = $pdo->prepare("
        SELECT SUM(score) as total_month_pts, COUNT(*) as cleared_count
        FROM user_level_progress
        WHERE user_id = ? AND month_year = ? AND level_id < 999999
    ");
    $sum->execute([$userId, $currentMonth]);
    $row = $sum->fetch();

    // Include all claimed daily check-in rewards for this month
    $chkSum = $pdo->prepare("
        SELECT SUM(pts_rewarded) as total_checkin_pts
        FROM user_daily_checkins
        WHERE user_id = ? AND DATE_FORMAT(claimed_at, '%Y-%m') = ?
    ");
    $chkSum->execute([$userId, $currentMonth]);
    $chkRow = $chkSum->fetch();

    $newMonthlyPts = (int)($row['total_month_pts'] ?? 0) + (int)($chkRow['total_checkin_pts'] ?? 0);
    $newClearedCount = (int)($row['cleared_count'] ?? 1);

    // 3. Update users table
    $upd = $pdo->prepare("
        UPDATE users 
        SET monthly_points = ?, 
            levels_cleared_monthly = ?, 
            highest_level = GREATEST(highest_level, ?)
        WHERE id = ?
    ");
    $upd->execute([$newMonthlyPts, $newClearedCount, min(99999, $levelId + 1), $userId]);

    // 4. Check Referral Level 100 Reward Gate
    $reachedLevel = max((int)($user['highest_level'] ?? 1), $levelId + 1);
    if ($reachedLevel >= 100 || $levelId >= 100) {
        try {
            $chkRef = $pdo->prepare("SELECT id, referrer_id FROM referrals WHERE referred_user_id = ? AND status = 'unverified' LIMIT 1");
            $chkRef->execute([$userId]);
            $refRow = $chkRef->fetch();
            if ($refRow) {
                // Get configured reward
                $cfgRef = $pdo->query("SELECT referral_cb_reward FROM snake_game_config WHERE id = 1")->fetch();
                $rewardAmt = (float)($cfgRef['referral_cb_reward'] ?? 50.00);

                // Promote to verified
                $updRef = $pdo->prepare("UPDATE referrals SET status = 'verified', cb_coins_rewarded = ?, verified_at = NOW() WHERE id = ?");
                $updRef->execute([$rewardAmt, $refRow['id']]);

                // Credit referrer with CB Coins
                $creditRef = $pdo->prepare("UPDATE users SET cb_coins = cb_coins + ? WHERE id = ?");
                $creditRef->execute([$rewardAmt, $refRow['referrer_id']]);

                // Log in transactions
                $referredName = $user['name'] ?: $user['username'];
                $desc = "Referral Reward: {$referredName} reached Level 100!";
                $pdo->prepare("INSERT INTO cb_transactions (user_id, amount, type, description) VALUES (?, ?, 'admin_grant', ?)")
                    ->execute([$refRow['referrer_id'], $rewardAmt, $desc]);
            }
        } catch (Exception $e) {}
    }

    echo json_encode([
        'status' => 'success',
        'monthly_points' => $newMonthlyPts,
        'levels_cleared' => $newClearedCount,
        'month_year' => $currentMonth
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Daily Check-In (Database Sync & Streak Progression)
// -------------------------------------------------------------
if ($action === 'daily_checkin' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginId = trim($input['player_id'] ?? $input['username'] ?? $input['user_id'] ?? '');
    $dayNumber = max(1, min(20, (int)($input['day_number'] ?? 1)));
    $ptsRewarded = (int)($input['pts_rewarded'] ?? 0);
    $isTest = !empty($input['is_test']);

    if (empty($loginId)) {
        echo json_encode(['status' => 'error', 'message' => 'User identifier required']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(player_id) = LOWER(?) OR LOWER(username) = LOWER(?) OR id = ? LIMIT 1");
    $stmt->execute([$loginId, $loginId, (int)$loginId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit();
    }

    $userId = (int)$user['id'];
    checkAndResetMonthForUser($pdo, $user);

    $todayDate = date('Y-m-d');
    $lastCheckinDate = $user['last_checkin_date'] ?? null;
    $currentStreak = (int)($user['checkin_streak'] ?? 0);

    // If dayNumber is progressing beyond currentStreak (e.g. Day 2 after Day 1),
    // allow the claim even if on the same calendar day (e.g. testing / 24hr elapsed)
    $isAdvancing = ($dayNumber > $currentStreak);

    // Check if user already claimed today AND is not advancing streak or testing
    if (!empty($lastCheckinDate) && $lastCheckinDate === $todayDate && !$isAdvancing && !$isTest) {
        echo json_encode([
            'status' => 'success',
            'already_claimed' => true,
            'streak' => $currentStreak,
            'checkin_streak' => $currentStreak,
            'monthly_points' => (int)$user['monthly_points'],
            'new_monthly_points' => (int)$user['monthly_points'],
            'total_score' => (int)$user['total_score'],
            'new_total_score' => (int)$user['total_score'],
            'last_checkin_date' => $todayDate,
            'message' => 'Daily reward already claimed for today!'
        ]);
        exit();
    }

    // Determine streak
    $yesterdayDate = date('Y-m-d', strtotime('-1 day'));
    if ($dayNumber > 0 && ($dayNumber === $currentStreak + 1 || $isTest)) {
        $newStreak = min(20, $dayNumber);
    } else if ($lastCheckinDate === $yesterdayDate) {
        $newStreak = ($currentStreak >= 20) ? 1 : ($currentStreak + 1);
    } else {
        $newStreak = ($lastCheckinDate === null) ? $dayNumber : max(1, $dayNumber);
    }

    // 1. Insert record into user_daily_checkins
    try {
        $ins = $pdo->prepare("
            INSERT INTO user_daily_checkins (user_id, day_number, pts_rewarded, claimed_at)
            VALUES (?, ?, ?, NOW())
        ");
        $ins->execute([$userId, $newStreak, $ptsRewarded]);
    } catch (Exception $e) {}

    // 2. Update users table with new streak, check-in date, monthly points, and total score
    $upd = $pdo->prepare("
        UPDATE users 
        SET last_checkin_date = ?,
            checkin_streak = ?,
            monthly_points = monthly_points + ?,
            total_score = total_score + ?
        WHERE id = ?
    ");
    $upd->execute([$todayDate, $newStreak, $ptsRewarded, $ptsRewarded, $userId]);

    $newMonthlyPoints = (int)$user['monthly_points'] + $ptsRewarded;
    $newTotalScore = (int)$user['total_score'] + $ptsRewarded;

    echo json_encode([
        'status' => 'success',
        'already_claimed' => false,
        'streak' => $newStreak,
        'checkin_streak' => $newStreak,
        'monthly_points' => $newMonthlyPoints,
        'new_monthly_points' => $newMonthlyPoints,
        'total_score' => $newTotalScore,
        'new_total_score' => $newTotalScore,
        'pts_rewarded' => $ptsRewarded,
        'last_checkin_date' => $todayDate,
        'claimed_timestamp' => time() * 1000,
        'message' => "Day {$newStreak} check-in saved! +{$ptsRewarded} PTS recorded in database."
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Get Daily Check-In Status
// -------------------------------------------------------------
if ($action === 'get_daily_checkin_status') {
    $loginId = trim($_GET['player_id'] ?? $_GET['username'] ?? $input['player_id'] ?? $input['username'] ?? '');
    if (empty($loginId)) {
        echo json_encode(['status' => 'error', 'message' => 'User identifier required']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(player_id) = LOWER(?) OR LOWER(username) = LOWER(?) OR id = ? LIMIT 1");
    $stmt->execute([$loginId, $loginId, (int)$loginId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit();
    }

    $todayDate = date('Y-m-d');
    $lastCheckinDate = $user['last_checkin_date'] ?? null;
    $checkedInToday = ($lastCheckinDate === $todayDate);

    $lastClaimTimestamp = null;
    try {
        $chkClaim = $pdo->prepare("SELECT UNIX_TIMESTAMP(claimed_at) as claim_ts FROM user_daily_checkins WHERE user_id = ? ORDER BY id DESC LIMIT 1");
        $chkClaim->execute([$user['id']]);
        $claimRow = $chkClaim->fetch();
        if ($claimRow && !empty($claimRow['claim_ts'])) {
            $lastClaimTimestamp = (int)$claimRow['claim_ts'] * 1000;
        }
    } catch (Exception $e) {}

    $streak = (int)($user['checkin_streak'] ?? 0);
    $yesterdayDate = date('Y-m-d', strtotime('-1 day'));
    if (!$checkedInToday && $lastCheckinDate && $lastCheckinDate !== $yesterdayDate) {
        $streak = 0;
    }

    echo json_encode([
        'status' => 'success',
        'checked_in_today' => $checkedInToday,
        'streak' => $streak,
        'last_checkin_date' => $lastCheckinDate,
        'last_claim_timestamp' => $lastClaimTimestamp
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Purely Monthly Leaderboard (With CB Coins Prize Pool)
// -------------------------------------------------------------
if ($action === 'leaderboard') {
    $currentMonth = date('Y-m');

    // Fetch config for top winners count and tournament dates
    $cfg = $pdo->query("SELECT tournament_top_winners_count, tournament_start_date, tournament_end_date FROM snake_game_config WHERE id = 1 LIMIT 1")->fetch() ?: [];
    $topWinnersCount = (int)($cfg['tournament_top_winners_count'] ?? 10);
    if ($topWinnersCount <= 0) $topWinnersCount = 10;
    $tournStartDate = $cfg['tournament_start_date'] ?? null;
    $tournEndDate   = $cfg['tournament_end_date'] ?? null;

    // Fetch CB Coin rewards configuration
    $rewStmt = $pdo->query("SELECT * FROM cb_coin_rewards_config ORDER BY rank_from ASC");
    $rewardTiers = $rewStmt->fetchAll();

    // Query top monthly players
    $stmt = $pdo->prepare("
        SELECT 
            player_id, 
            name, 
            username, 
            monthly_points, 
            levels_cleared_monthly, 
            highest_level,
            cb_coins
        FROM users 
        WHERE role = 'player' 
          AND status = 'active'
          AND current_month = ?
        ORDER BY monthly_points DESC, levels_cleared_monthly DESC 
        LIMIT 50
    ");
    $stmt->execute([$currentMonth]);
    $rows = $stmt->fetchAll();

    $leaderboard = [];
    $rank = 1;
    foreach ($rows as $r) {
        // Calculate eligible CB reward for this rank (only if rank <= topWinnersCount)
        $cbReward = 0.00;
        $rewardTitle = '';
        if ($rank <= $topWinnersCount) {
            foreach ($rewardTiers as $tier) {
                if ($rank >= (int)$tier['rank_from'] && $rank <= (int)$tier['rank_to']) {
                    $cbReward = (float)$tier['cb_coins_reward'];
                    $rewardTitle = $tier['reward_title'];
                    break;
                }
            }
        }

        $leaderboard[] = [
            'rank' => $rank++,
            'player_id' => $r['player_id'],
            'name' => $r['name'] ?: $r['username'],
            'username' => $r['username'],
            'monthly_points' => (int)$r['monthly_points'],
            'levels_cleared' => (int)$r['levels_cleared_monthly'],
            'highest_level' => (int)$r['highest_level'],
            'cb_coins' => (float)$r['cb_coins'],
            'cb_reward' => $cbReward,
            'reward_title' => $rewardTitle
        ];
    }

    echo json_encode([
        'status' => 'success',
        'month_year' => $currentMonth,
        'season_title' => date('F Y') . ' Season',
        'tournament_start_date' => $tournStartDate,
        'tournament_end_date' => $tournEndDate,
        'leaderboard' => $leaderboard,
        'reward_tiers' => $rewardTiers,
        'top_winners_count' => $topWinnersCount
    ]);
    exit();
}

// -------------------------------------------------------------
// ADMIN ACTIONS (In-Game Admin Dashboard)
// -------------------------------------------------------------

// ACTION: Admin Get Overview Stats
if ($action === 'admin_stats') {
    $currentMonth = date('Y-m');
    $totalPlayers = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'player'")->fetchColumn();
    $activeThisMonth = (int)$pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'player' AND current_month = ? AND monthly_points > 0")->execute([$currentMonth]) ? $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'player' AND current_month = '$currentMonth' AND monthly_points > 0")->fetchColumn() : 0;
    $totalCbCirculation = (float)$pdo->query("SELECT SUM(cb_coins) FROM users WHERE role = 'player'")->fetchColumn();
    $totalLevelsCleared = (int)$pdo->query("SELECT COUNT(*) FROM user_level_progress")->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'stats' => [
            'total_players' => $totalPlayers,
            'active_this_month' => (int)$activeThisMonth,
            'total_cb_coins' => $totalCbCirculation,
            'total_levels_cleared' => $totalLevelsCleared,
            'current_month' => $currentMonth,
            'month_name' => date('F Y')
        ]
    ]);
    exit();
}

// ACTION: Admin Search & List Players
if ($action === 'admin_players') {
    $query = trim($_GET['search'] ?? '');
    $currentMonth = date('Y-m');

    if (!empty($query)) {
        $stmt = $pdo->prepare("
            SELECT id, player_id, name, username, cb_coins, monthly_points, levels_cleared_monthly, highest_level, last_checkin_date, checkin_streak, (last_checkin_date = CURDATE()) AS checked_in_today, status, created_at 
            FROM users 
            WHERE role = 'player'
              AND (LOWER(player_id) LIKE LOWER(?) OR LOWER(username) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?))
            ORDER BY id DESC 
            LIMIT 50
        ");
        $term = "%$query%";
        $stmt->execute([$term, $term, $term]);
    } else {
        $stmt = $pdo->query("
            SELECT id, player_id, name, username, cb_coins, monthly_points, levels_cleared_monthly, highest_level, last_checkin_date, checkin_streak, (last_checkin_date = CURDATE()) AS checked_in_today, status, created_at 
            FROM users 
            WHERE role = 'player'
            ORDER BY id DESC 
            LIMIT 50
        ");
    }

    $players = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'players' => $players]);
    exit();
}

// ACTION: Admin Update CB Coins (Add or Deduct)
if ($action === 'admin_update_cb_coins' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = (int)($input['user_id'] ?? 0);
    $amount = (float)($input['amount'] ?? 0);
    $description = trim($input['description'] ?? 'Admin Adjustment');
    $adminId = (int)($input['admin_id'] ?? 1);

    if ($userId <= 0 || $amount == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Valid User ID and non-zero amount required']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT id, player_id, name, cb_coins FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $targetUser = $stmt->fetch();

    if (!$targetUser) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit();
    }

    $newBalance = max(0.00, (float)$targetUser['cb_coins'] + $amount);

    $upd = $pdo->prepare("UPDATE users SET cb_coins = ? WHERE id = ?");
    $upd->execute([$newBalance, $userId]);

    $insTx = $pdo->prepare("
        INSERT INTO cb_transactions (user_id, amount, type, description, created_by_admin_id)
        VALUES (?, ?, 'admin_grant', ?, ?)
    ");
    $insTx->execute([$userId, $amount, $description, $adminId]);

    echo json_encode([
        'status' => 'success',
        'message' => "Successfully updated CB Coins! New Balance: $newBalance CB",
        'new_balance' => $newBalance
    ]);
    exit();
}

// ACTION: Admin Ban / Unban User
if ($action === 'admin_toggle_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = (int)($input['user_id'] ?? 0);
    $status = in_array($input['status'] ?? '', ['active', 'banned']) ? $input['status'] : 'active';

    if ($userId <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Valid User ID required']);
        exit();
    }

    $upd = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
    $upd->execute([$status, $userId]);

    echo json_encode([
        'status' => 'success',
        'message' => "Player status updated to: $status",
        'new_status' => $status
    ]);
    exit();
}

// ACTION: Admin Rewards Config (Get / Save)
if ($action === 'admin_rewards_config') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $tiers = $input['tiers'] ?? [];
        if (is_array($tiers)) {
            $pdo->exec("DELETE FROM cb_coin_rewards_config");
            $ins = $pdo->prepare("INSERT INTO cb_coin_rewards_config (rank_from, rank_to, cb_coins_reward, reward_title) VALUES (?, ?, ?, ?)");
            foreach ($tiers as $t) {
                $ins->execute([
                    (int)($t['rank_from'] ?? 1),
                    (int)($t['rank_to'] ?? 1),
                    (float)($t['cb_coins_reward'] ?? 0),
                    trim($t['reward_title'] ?? 'Rank Prize')
                ]);
            }
        }

        if (isset($input['tournament_top_winners_count'])) {
            $topWinners = max(1, (int)$input['tournament_top_winners_count']);
            $pdo->prepare("UPDATE snake_game_config SET tournament_top_winners_count = ? WHERE id = 1")->execute([$topWinners]);
        }

        if (array_key_exists('tournament_start_date', $input)) {
            $sDate = !empty($input['tournament_start_date']) ? $input['tournament_start_date'] : null;
            $pdo->prepare("UPDATE snake_game_config SET tournament_start_date = ? WHERE id = 1")->execute([$sDate]);
        }

        if (array_key_exists('tournament_end_date', $input)) {
            $eDate = !empty($input['tournament_end_date']) ? $input['tournament_end_date'] : null;
            $pdo->prepare("UPDATE snake_game_config SET tournament_end_date = ? WHERE id = 1")->execute([$eDate]);
        }

        echo json_encode(['status' => 'success', 'message' => 'Tournament & rewards configuration saved successfully!']);
        exit();
    }

    $stmt = $pdo->query("SELECT * FROM cb_coin_rewards_config ORDER BY rank_from ASC");
    $tiers = $stmt->fetchAll();
    $cfg = $pdo->query("SELECT tournament_top_winners_count, tournament_start_date, tournament_end_date FROM snake_game_config WHERE id = 1 LIMIT 1")->fetch() ?: [];
    $topWinnersCount = (int)($cfg['tournament_top_winners_count'] ?? 10);

    echo json_encode([
        'status' => 'success', 
        'tiers' => $tiers,
        'tournament_top_winners_count' => $topWinnersCount,
        'tournament_start_date' => $cfg['tournament_start_date'] ?? null,
        'tournament_end_date' => $cfg['tournament_end_date'] ?? null
    ]);
    exit();
}

// -------------------------------------------------------------
// ACTION: Admin Save Monetization & Advertising Config
// -------------------------------------------------------------
if ($action === 'admin_save_monetization' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Ensure snake_game_config table exists
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `snake_game_config` (
                `id` INT(11) NOT NULL DEFAULT 1,
                `default_hints` INT(11) NOT NULL DEFAULT 2,
                `default_burns` INT(11) NOT NULL DEFAULT 1,
                `reward_hint_per_ad` INT(11) NOT NULL DEFAULT 3,
                `reward_burn_per_ad` INT(11) NOT NULL DEFAULT 1,
                `reward_heart_per_ad` INT(11) NOT NULL DEFAULT 1,
                `ad_frequency_levels` INT(11) NOT NULL DEFAULT 2,
                `ads_enabled` TINYINT(1) NOT NULL DEFAULT 1,
                `ad_provider` VARCHAR(32) NOT NULL DEFAULT 'admob',
                `banner_enabled` TINYINT(1) NOT NULL DEFAULT 1,
                `interstitial_enabled` TINYINT(1) NOT NULL DEFAULT 1,
                `rewarded_enabled` TINYINT(1) NOT NULL DEFAULT 1,
                `referral_cb_reward` DECIMAL(14, 2) NOT NULL DEFAULT 50.00,
                `referral_required_level` INT(11) NOT NULL DEFAULT 100,
                `tournament_top_winners_count` INT(11) NOT NULL DEFAULT 10,
                `tournament_start_date` DATETIME DEFAULT NULL,
                `tournament_end_date` DATETIME DEFAULT NULL,
                `admob_app_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544~3347511713',
                `admob_banner_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/6300978111',
                `admob_interstitial_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/1033173712',
                `admob_rewarded_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/5224354917',
                `unity_game_id` VARCHAR(64) NOT NULL DEFAULT '',
                `unity_banner_id` VARCHAR(64) NOT NULL DEFAULT '',
                `unity_interstitial_id` VARCHAR(64) NOT NULL DEFAULT '',
                `unity_rewarded_id` VARCHAR(64) NOT NULL DEFAULT '',
                `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // Ensure row id=1 exists
        $chkRow = (int)$pdo->query("SELECT COUNT(*) FROM `snake_game_config` WHERE `id` = 1")->fetchColumn();
        if ($chkRow === 0) {
            $pdo->exec("INSERT INTO `snake_game_config` (`id`, `ads_enabled`, `ad_provider`) VALUES (1, 1, 'admob')");
        }

        $adsEnabled = isset($input['ads_enabled']) ? (int)$input['ads_enabled'] : 1;
        $adProvider = in_array($input['ad_provider'] ?? '', ['admob', 'unity', 'both']) ? $input['ad_provider'] : 'admob';
        $bannerEnabled = isset($input['banner_enabled']) ? (int)$input['banner_enabled'] : 1;
        $interstitialEnabled = isset($input['interstitial_enabled']) ? (int)$input['interstitial_enabled'] : 1;
        $rewardedEnabled = isset($input['rewarded_enabled']) ? (int)$input['rewarded_enabled'] : 1;
        $adFrequencyLevels = max(1, (int)($input['ad_frequency_levels'] ?? 2));
        $rewardHintPerAd = max(1, (int)($input['reward_hint_per_ad'] ?? 3));
        $rewardBurnPerAd = max(1, (int)($input['reward_burn_per_ad'] ?? 1));
        $rewardHeartPerAd = max(1, (int)($input['reward_heart_per_ad'] ?? 1));

        $admobAppId = trim($input['admob_app_id'] ?? '');
        $admobBannerId = trim($input['admob_banner_id'] ?? '');
        $admobInterstitialId = trim($input['admob_interstitial_id'] ?? '');
        $admobRewardedId = trim($input['admob_rewarded_id'] ?? '');

        $unityGameId = trim($input['unity_game_id'] ?? '');
        $unityBannerId = trim($input['unity_banner_id'] ?? '');
        $unityInterstitialId = trim($input['unity_interstitial_id'] ?? '');
        $unityRewardedId = trim($input['unity_rewarded_id'] ?? '');

        $upd = $pdo->prepare("
            UPDATE snake_game_config 
            SET ads_enabled = ?,
                ad_provider = ?,
                banner_enabled = ?,
                interstitial_enabled = ?,
                rewarded_enabled = ?,
                ad_frequency_levels = ?,
                reward_hint_per_ad = ?,
                reward_burn_per_ad = ?,
                reward_heart_per_ad = ?,
                admob_app_id = ?,
                admob_banner_id = ?,
                admob_interstitial_id = ?,
                admob_rewarded_id = ?,
                unity_game_id = ?,
                unity_banner_id = ?,
                unity_interstitial_id = ?,
                unity_rewarded_id = ?
            WHERE id = 1
        ");

        $upd->execute([
            $adsEnabled,
            $adProvider,
            $bannerEnabled,
            $interstitialEnabled,
            $rewardedEnabled,
            $adFrequencyLevels,
            $rewardHintPerAd,
            $rewardBurnPerAd,
            $rewardHeartPerAd,
            $admobAppId,
            $admobBannerId,
            $admobInterstitialId,
            $admobRewardedId,
            $unityGameId,
            $unityBannerId,
            $unityInterstitialId,
            $unityRewardedId
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Monetization and ads configuration saved successfully!'
        ]);
        exit();
    } catch (Throwable $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server database error: ' . $e->getMessage()
        ]);
        exit();
    }
}

// -------------------------------------------------------------
// ACTION: Admin Update Credentials (Username & Password)
// -------------------------------------------------------------
if ($action === 'admin_update_credentials' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $adminId = (int)($input['admin_id'] ?? 0);
    $newUsername = trim($input['new_username'] ?? '');
    $newPassword = trim($input['new_password'] ?? '');

    if ($adminId <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Admin identification required']);
        exit();
    }

    $chkAdmin = $pdo->prepare("SELECT id, role, username, name FROM users WHERE id = ? LIMIT 1");
    $chkAdmin->execute([$adminId]);
    $adminUser = $chkAdmin->fetch();

    if (!$adminUser || $adminUser['role'] !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized: Only an admin can update credentials']);
        exit();
    }

    if (empty($newUsername) && empty($newPassword)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter a new username or new password']);
        exit();
    }

    if (!empty($newUsername)) {
        if (strlen($newUsername) < 3) {
            echo json_encode(['status' => 'error', 'message' => 'Username must be at least 3 characters']);
            exit();
        }
        $chkDup = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ? LIMIT 1");
        $chkDup->execute([$newUsername, $adminId]);
        if ($chkDup->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Username is already taken by another user']);
            exit();
        }
        $pdo->prepare("UPDATE users SET username = ? WHERE id = ?")->execute([$newUsername, $adminId]);
        $adminUser['username'] = $newUsername;
    }

    if (!empty($newPassword)) {
        if (strlen($newPassword) < 4) {
            echo json_encode(['status' => 'error', 'message' => 'Password must be at least 4 characters']);
            exit();
        }
        $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$newHash, $adminId]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Admin credentials updated successfully!',
        'admin' => [
            'id' => (int)$adminUser['id'],
            'username' => $adminUser['username'],
            'name' => $adminUser['name']
        ]
    ]);
    exit();
}

// =============================================================
// FRIEND & CB COIN GIFT SYSTEM ENDPOINTS
// =============================================================

// Helper to get user by player_id
function getUserByPlayerId($pdo, $playerId) {
    $stmt = $pdo->prepare("SELECT id, player_id, name, username, role, cb_coins, highest_level, status FROM users WHERE player_id = ? LIMIT 1");
    $stmt->execute([trim($playerId)]);
    return $stmt->fetch();
}

// Helper to get user by player_id OR username
function getUserByIdOrUsername($pdo, $query) {
    $q = trim($query);
    $stmt = $pdo->prepare("
        SELECT id, player_id, name, username, role, cb_coins, highest_level, status 
        FROM users 
        WHERE UPPER(player_id) = UPPER(?) OR LOWER(username) = LOWER(?) 
        LIMIT 1
    ");
    $stmt->execute([$q, $q]);
    return $stmt->fetch();
}

// ACTION: Search Player by Player ID or Username
if ($action === 'search_player_by_id' || $action === 'search_player') {
    $searchId = trim($_GET['search_id'] ?? $_GET['query'] ?? $input['search_id'] ?? $input['query'] ?? '');
    $myPlayerId = trim($_GET['my_player_id'] ?? $input['my_player_id'] ?? '');

    if (empty($searchId)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter a valid Player ID or Username']);
        exit();
    }

    $me = !empty($myPlayerId) ? getUserByPlayerId($pdo, $myPlayerId) : null;
    if ($me && (strtoupper($searchId) === strtoupper($me['player_id']) || strtolower($searchId) === strtolower($me['username']))) {
        echo json_encode(['status' => 'error', 'message' => 'You cannot search for your own account']);
        exit();
    }

    $target = getUserByIdOrUsername($pdo, $searchId);
    if (!$target) {
        echo json_encode(['status' => 'error', 'message' => 'No player found matching: ' . htmlspecialchars($searchId)]);
        exit();
    }

    if ($target['status'] === 'banned') {
        echo json_encode(['status' => 'error', 'message' => 'This player account is suspended']);
        exit();
    }

    // Check friendship status if myPlayerId is provided
    $relationship = 'none';
    $requestId = 0;
    if (!empty($myPlayerId)) {
        $me = getUserByPlayerId($pdo, $myPlayerId);
        if ($me) {
            $chk = $pdo->prepare("
                SELECT id, sender_id, receiver_id, status 
                FROM friendships 
                WHERE (sender_id = ? AND receiver_id = ?) 
                   OR (sender_id = ? AND receiver_id = ?)
                LIMIT 1
            ");
            $chk->execute([$me['id'], $target['id'], $target['id'], $me['id']]);
            $rel = $chk->fetch();
            if ($rel) {
                $requestId = (int)$rel['id'];
                if ($rel['status'] === 'accepted') {
                    $relationship = 'accepted';
                } elseif ($rel['status'] === 'pending') {
                    $relationship = ($rel['sender_id'] == $me['id']) ? 'pending_outgoing' : 'pending_incoming';
                } else {
                    $relationship = 'rejected';
                }
            }
        }
    }

    echo json_encode([
        'status' => 'success',
        'player' => [
            'player_id' => $target['player_id'],
            'name' => $target['name'] ?: $target['username'],
            'highest_level' => (int)$target['highest_level'],
            'relationship' => $relationship,
            'request_id' => $requestId
        ]
    ]);
    exit();
}

// ACTION: Send Friend Request
if ($action === 'send_friend_request' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $myPlayerId = trim($input['my_player_id'] ?? '');
    $targetPlayerId = trim($input['target_player_id'] ?? '');

    if (empty($myPlayerId) || empty($targetPlayerId)) {
        echo json_encode(['status' => 'error', 'message' => 'Both Player IDs are required']);
        exit();
    }

    if ($myPlayerId === $targetPlayerId) {
        echo json_encode(['status' => 'error', 'message' => 'Cannot send friend request to yourself']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    $target = getUserByPlayerId($pdo, $targetPlayerId);

    if (!$me || !$target) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid player account']);
        exit();
    }

    // Check if relationship already exists
    $chk = $pdo->prepare("
        SELECT id, sender_id, receiver_id, status 
        FROM friendships 
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
        LIMIT 1
    ");
    $chk->execute([$me['id'], $target['id'], $target['id'], $me['id']]);
    $existing = $chk->fetch();

    if ($existing) {
        if ($existing['status'] === 'accepted') {
            echo json_encode(['status' => 'error', 'message' => 'You are already friends with this player']);
            exit();
        } elseif ($existing['status'] === 'pending') {
            if ($existing['sender_id'] == $me['id']) {
                echo json_encode(['status' => 'error', 'message' => 'Friend request is already pending']);
            } else {
                // Auto-accept if incoming request already existed
                $upd = $pdo->prepare("UPDATE friendships SET status = 'accepted' WHERE id = ?");
                $upd->execute([$existing['id']]);
                echo json_encode(['status' => 'success', 'message' => 'Accepted incoming friend request! You are now friends!']);
            }
            exit();
        } else {
            // Re-open rejected request
            $upd = $pdo->prepare("UPDATE friendships SET sender_id = ?, receiver_id = ?, status = 'pending' WHERE id = ?");
            $upd->execute([$me['id'], $target['id'], $existing['id']]);
            echo json_encode(['status' => 'success', 'message' => 'Friend request sent successfully!']);
            exit();
        }
    }

    $ins = $pdo->prepare("INSERT INTO friendships (sender_id, receiver_id, status) VALUES (?, ?, 'pending')");
    $ins->execute([$me['id'], $target['id']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Friend request sent to ' . ($target['name'] ?: $target['username']) . '!'
    ]);
    exit();
}

// ACTION: Get Friends & Pending Requests
if ($action === 'get_friends') {
    $myPlayerId = trim($_GET['my_player_id'] ?? $input['my_player_id'] ?? '');
    if (empty($myPlayerId)) {
        echo json_encode(['status' => 'error', 'message' => 'Player ID required']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    if (!$me) {
        echo json_encode(['status' => 'error', 'message' => 'Player not found']);
        exit();
    }
    $myId = (int)$me['id'];

    // 1. Accepted Friends
    $stmtFriends = $pdo->prepare("
        SELECT 
            f.id AS friendship_id,
            f.created_at AS friends_since,
            u.player_id,
            u.name,
            u.highest_level,
            u.monthly_points
        FROM friendships f
        JOIN users u ON (u.id = CASE WHEN f.sender_id = ? THEN f.receiver_id ELSE f.sender_id END)
        WHERE (f.sender_id = ? OR f.receiver_id = ?) 
          AND f.status = 'accepted'
          AND u.status = 'active'
        ORDER BY u.name ASC
    ");
    $stmtFriends->execute([$myId, $myId, $myId]);
    $friends = $stmtFriends->fetchAll();

    // 2. Incoming Pending Requests
    $stmtPending = $pdo->prepare("
        SELECT 
            f.id AS request_id,
            f.created_at,
            u.player_id,
            u.name,
            u.highest_level
        FROM friendships f
        JOIN users u ON u.id = f.sender_id
        WHERE f.receiver_id = ? AND f.status = 'pending' AND u.status = 'active'
        ORDER BY f.created_at DESC
    ");
    $stmtPending->execute([$myId]);
    $pendingRequests = $stmtPending->fetchAll();

    // 3. Received Gifts (last 20)
    $stmtGifts = $pdo->prepare("
        SELECT 
            g.id AS gift_id,
            g.amount,
            g.message,
            g.created_at,
            u.player_id AS sender_player_id,
            u.name AS sender_name
        FROM cb_coin_gifts g
        JOIN users u ON u.id = g.sender_id
        WHERE g.receiver_id = ?
        ORDER BY g.created_at DESC
        LIMIT 20
    ");
    $stmtGifts->execute([$myId]);
    $receivedGifts = $stmtGifts->fetchAll();

    echo json_encode([
        'status' => 'success',
        'current_cb_coins' => (float)$me['cb_coins'],
        'friends' => $friends,
        'pending_requests' => $pendingRequests,
        'received_gifts' => $receivedGifts
    ]);
    exit();
}

// ACTION: Respond to Friend Request (Accept / Reject)
if ($action === 'respond_friend_request' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $myPlayerId = trim($input['my_player_id'] ?? '');
    $requestId = (int)($input['request_id'] ?? 0);
    $response = strtolower(trim($input['response'] ?? '')); // 'accept' or 'reject'

    if (empty($myPlayerId) || $requestId <= 0 || !in_array($response, ['accept', 'reject'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid parameters']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    if (!$me) {
        echo json_encode(['status' => 'error', 'message' => 'Player not found']);
        exit();
    }

    $newStatus = ($response === 'accept') ? 'accepted' : 'rejected';
    $upd = $pdo->prepare("UPDATE friendships SET status = ? WHERE id = ? AND receiver_id = ?");
    $upd->execute([$newStatus, $requestId, $me['id']]);

    if ($upd->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => ($response === 'accept') ? 'Friend request accepted!' : 'Friend request declined'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Request not found or already processed']);
    }
    exit();
}

// ACTION: Send CB Coins Gift to Friend
if ($action === 'send_cb_gift' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $myPlayerId = trim($input['my_player_id'] ?? '');
    $targetPlayerId = trim($input['target_player_id'] ?? '');
    $amount = (float)($input['amount'] ?? 0);
    $message = trim($input['message'] ?? 'A gift of CB Coins for you!');

    if ($amount <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Gift amount must be greater than 0']);
        exit();
    }

    if (empty($myPlayerId) || empty($targetPlayerId)) {
        echo json_encode(['status' => 'error', 'message' => 'Sender and Recipient Player IDs required']);
        exit();
    }

    if ($myPlayerId === $targetPlayerId) {
        echo json_encode(['status' => 'error', 'message' => 'Cannot send CB coins to yourself']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    $target = getUserByPlayerId($pdo, $targetPlayerId);

    if (!$me || !$target) {
        echo json_encode(['status' => 'error', 'message' => 'Player accounts not found']);
        exit();
    }

    if ($target['status'] === 'banned') {
        echo json_encode(['status' => 'error', 'message' => 'Cannot send gift to a suspended account']);
        exit();
    }

    if ((float)$me['cb_coins'] < $amount) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Insufficient CB Coins! You have ' . number_format($me['cb_coins'], 2) . ' CB coins.'
        ]);
        exit();
    }

    // Atomic SQL Transaction for transferring CB Coins safely
    try {
        $pdo->beginTransaction();

        // 1. Deduct from sender (ensuring balance >= amount)
        $stmtDeduct = $pdo->prepare("UPDATE users SET cb_coins = cb_coins - ? WHERE id = ? AND cb_coins >= ?");
        $stmtDeduct->execute([$amount, $me['id'], $amount]);

        if ($stmtDeduct->rowCount() === 0) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Insufficient CB Coins balance']);
            exit();
        }

        // 2. Add to recipient
        $stmtAdd = $pdo->prepare("UPDATE users SET cb_coins = cb_coins + ? WHERE id = ?");
        $stmtAdd->execute([$amount, $target['id']]);

        // 3. Log sender transaction
        $descSent = "Sent " . number_format($amount, 2) . " CB Coins gift to " . ($target['name'] ?: $target['player_id']);
        $txSent = $pdo->prepare("INSERT INTO cb_transactions (user_id, amount, type, description) VALUES (?, ?, 'gift_sent', ?)");
        $txSent->execute([$me['id'], -$amount, $descSent]);

        // 4. Log recipient transaction
        $descRecv = "Received " . number_format($amount, 2) . " CB Coins gift from " . ($me['name'] ?: $me['player_id']);
        $txRecv = $pdo->prepare("INSERT INTO cb_transactions (user_id, amount, type, description) VALUES (?, ?, 'gift_received', ?)");
        $txRecv->execute([$target['id'], $amount, $descRecv]);

        // 5. Record Gift History
        $insGift = $pdo->prepare("INSERT INTO cb_coin_gifts (sender_id, receiver_id, amount, message, status) VALUES (?, ?, ?, ?, 'delivered')");
        $insGift->execute([$me['id'], $target['id'], $amount, $message]);

        // 6. Get updated sender balance
        $stmtBal = $pdo->prepare("SELECT cb_coins FROM users WHERE id = ?");
        $stmtBal->execute([$me['id']]);
        $newBalance = (float)$stmtBal->fetchColumn();

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => "Successfully gifted " . number_format($amount, 2) . " CB Coins to " . ($target['name'] ?: $target['player_id']) . "!",
            'new_balance' => $newBalance
        ]);
        exit();

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(['status' => 'error', 'message' => 'Transaction failed: ' . $e->getMessage()]);
        exit();
    }
}

// =============================================================
// REFERRAL SYSTEM ENDPOINTS
// =============================================================

// ACTION: Bind Referral Code
if ($action === 'bind_referral' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $myPlayerId = trim($input['my_player_id'] ?? $input['player_id'] ?? '');
    $referralCode = trim($input['referral_code'] ?? $input['referrer_username'] ?? ''); // Referrer's username or player_id

    if (empty($myPlayerId) || empty($referralCode)) {
        echo json_encode(['status' => 'error', 'message' => 'Player ID and Referral Code are required']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    if (!$me) {
        echo json_encode(['status' => 'error', 'message' => 'Player account not found']);
        exit();
    }

    if (strtolower($me['username']) === strtolower($referralCode) || strtoupper($me['player_id']) === strtoupper($referralCode)) {
        echo json_encode(['status' => 'error', 'message' => 'You cannot bind your own referral code']);
        exit();
    }

    // Check if user already bound a referral
    $chkBound = $pdo->prepare("SELECT id FROM referrals WHERE referred_user_id = ? LIMIT 1");
    $chkBound->execute([$me['id']]);
    if ($chkBound->fetch() || !empty($me['referred_by'])) {
        echo json_encode(['status' => 'error', 'message' => 'You have already bound a referral code']);
        exit();
    }

    // Find referrer by username or player_id
    $referrer = getUserByIdOrUsername($pdo, $referralCode);
    if (!$referrer) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid Referral Code. No player found with this username: ' . htmlspecialchars($referralCode)]);
        exit();
    }

    // Insert into referrals as unverified
    $insRef = $pdo->prepare("INSERT INTO referrals (referrer_id, referred_user_id, status, cb_coins_rewarded) VALUES (?, ?, 'unverified', 0.00)");
    $insRef->execute([$referrer['id'], $me['id']]);

    // Update users table safely
    try {
        $pdo->prepare("UPDATE users SET referred_by = ? WHERE id = ?")->execute([$referrer['id'], $me['id']]);
        $pdo->prepare("UPDATE users SET referrals_count = referrals_count + 1 WHERE id = ?")->execute([$referrer['id']]);
    } catch (Exception $e) {}

    echo json_encode([
        'status' => 'success',
        'message' => 'Referral code bound successfully! Reach Level 100 to verify this referral and unlock rewards.',
        'bound_to' => $referrer['username']
    ]);
    exit();
}

// ACTION: Get Referral System Data
if ($action === 'get_referral_data') {
    $myPlayerId = trim($_GET['my_player_id'] ?? $_GET['player_id'] ?? $input['my_player_id'] ?? $input['player_id'] ?? '');
    if (empty($myPlayerId)) {
        echo json_encode(['status' => 'error', 'message' => 'Player ID required']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    if (!$me) {
        echo json_encode(['status' => 'error', 'message' => 'Player not found']);
        exit();
    }
    $myId = (int)$me['id'];

    // Check if I bound someone's code
    $boundStmt = $pdo->prepare("
        SELECT u.username, u.name 
        FROM referrals r 
        JOIN users u ON u.id = r.referrer_id 
        WHERE r.referred_user_id = ? LIMIT 1
    ");
    $boundStmt->execute([$myId]);
    $boundRow = $boundStmt->fetch();

    // Get referral config
    $cfg = $pdo->query("SELECT referral_cb_reward, referral_required_level FROM snake_game_config WHERE id = 1")->fetch();
    $rewardAmount = (float)($cfg['referral_cb_reward'] ?? 50.00);
    $requiredLevel = (int)($cfg['referral_required_level'] ?? 100);

    // Get all players referred by me
    $refStmt = $pdo->prepare("
        SELECT 
            r.id,
            r.status,
            r.cb_coins_rewarded,
            r.created_at,
            r.verified_at,
            u.player_id,
            u.username,
            u.name,
            u.highest_level
        FROM referrals r
        JOIN users u ON u.id = r.referred_user_id
        WHERE r.referrer_id = ?
        ORDER BY r.created_at DESC
    ");
    $refStmt->execute([$myId]);
    $referralsList = $refStmt->fetchAll();

    $totalReferrals = count($referralsList);
    $verifiedCount = 0;
    $unverifiedCount = 0;
    $totalCbEarned = 0.00;

    foreach ($referralsList as $r) {
        if ($r['status'] === 'verified') {
            $verifiedCount++;
            $totalCbEarned += (float)$r['cb_coins_rewarded'];
        } else {
            $unverifiedCount++;
        }
    }

    echo json_encode([
        'status' => 'success',
        'my_code' => $me['username'],
        'my_referral_code' => $me['username'],
        'already_bound' => !empty($boundRow),
        'has_bound_code' => !empty($boundRow),
        'bound_to' => $boundRow ? ($boundRow['username']) : null,
        'reward_amount' => $rewardAmount,
        'reward_per_referral' => $rewardAmount,
        'required_level' => $requiredLevel,
        'stats' => [
            'total_referrals' => $totalReferrals,
            'verified_referrals' => $verifiedCount,
            'unverified_referrals' => $unverifiedCount,
            'total_cb_earned' => $totalCbEarned,
        ],
        'total_referrals' => $totalReferrals,
        'verified_referrals' => $verifiedCount,
        'unverified_referrals' => $unverifiedCount,
        'total_cb_earned' => $totalCbEarned,
        'referrals' => $referralsList
    ]);
    exit();
}

// ACTION: Claim Referral Reward (When friend completed required level)
if ($action === 'claim_referral_reward' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $myPlayerId = trim($input['my_player_id'] ?? $input['player_id'] ?? '');
    $referralId = (int)($input['referral_id'] ?? 0);

    if (empty($myPlayerId) || $referralId <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Player ID and Referral ID are required']);
        exit();
    }

    $me = getUserByPlayerId($pdo, $myPlayerId);
    if (!$me) {
        echo json_encode(['status' => 'error', 'message' => 'Player not found']);
        exit();
    }

    // Get referral record
    $refStmt = $pdo->prepare("SELECT * FROM referrals WHERE id = ? AND referrer_id = ? LIMIT 1");
    $refStmt->execute([$referralId, $me['id']]);
    $ref = $refStmt->fetch();

    if (!$ref) {
        echo json_encode(['status' => 'error', 'message' => 'Referral record not found']);
        exit();
    }

    if ($ref['status'] === 'verified') {
        echo json_encode(['status' => 'error', 'message' => 'This referral reward has already been claimed']);
        exit();
    }

    // Check friend's progress
    $friendStmt = $pdo->prepare("SELECT id, player_id, username, highest_level FROM users WHERE id = ? LIMIT 1");
    $friendStmt->execute([$ref['referred_user_id']]);
    $friend = $friendStmt->fetch();

    if (!$friend) {
        echo json_encode(['status' => 'error', 'message' => 'Referred player account not found']);
        exit();
    }

    $cfg = $pdo->query("SELECT referral_cb_reward, referral_required_level FROM snake_game_config WHERE id = 1 LIMIT 1")->fetch() ?: [];
    $rewardAmount = (float)($cfg['referral_cb_reward'] ?? 50.00);
    $requiredLevel = (int)($cfg['referral_required_level'] ?? 100);

    $friendLevel = (int)($friend['highest_level'] ?? 1);
    if ($friendLevel < $requiredLevel) {
        echo json_encode([
            'status' => 'error', 
            'message' => "Friend @{$friend['username']} has not completed Level {$requiredLevel} yet (Current: Level {$friendLevel})"
        ]);
        exit();
    }

    // Credit reward and mark verified
    $pdo->beginTransaction();
    try {
        $updRef = $pdo->prepare("UPDATE referrals SET status = 'verified', cb_coins_rewarded = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?");
        $updRef->execute([$rewardAmount, $referralId]);

        $newBalance = (float)$me['cb_coins'] + $rewardAmount;
        $updUser = $pdo->prepare("UPDATE users SET cb_coins = cb_coins + ? WHERE id = ?");
        $updUser->execute([$rewardAmount, $me['id']]);

        $insTx = $pdo->prepare("INSERT INTO cb_transactions (user_id, amount, type, description) VALUES (?, ?, 'gameplay_reward', ?)");
        $insTx->execute([
            $me['id'], 
            $rewardAmount, 
            "Referral reward claimed for @{$friend['username']} reaching Level {$requiredLevel}"
        ]);

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => "Congratulations! You claimed +{$rewardAmount} CB Coins for referring @{$friend['username']}!",
            'reward_amount' => $rewardAmount,
            'new_cb_coins' => $newBalance
        ]);
        exit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(['status' => 'error', 'message' => 'Claim failed: ' . $e->getMessage()]);
        exit();
    }
}

// =============================================================
// ADMIN ARCHIVE & RESET ENDPOINTS
// =============================================================

// ACTION: Get Monthly Season Archives
if ($action === 'admin_get_archives') {
    $stmt = $pdo->query("
        SELECT month_year, player_id, player_name, final_points, final_rank, cb_coins_awarded, archived_at
        FROM monthly_rankings_archive
        ORDER BY month_year DESC, final_rank ASC
    ");
    $archives = $stmt->fetchAll();

    $grouped = [];
    foreach ($archives as $row) {
        $m = $row['month_year'];
        if (!isset($grouped[$m])) {
            $grouped[$m] = [];
        }
        $grouped[$m][] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'archives' => $grouped
    ]);
    exit();
}

// ACTION: Admin Manual Finalize & Archive Month
if ($action === 'admin_archive_month' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $currentMonth = date('Y-m');
    $topCount = (int)($input['top_count'] ?? 10);
    if ($topCount < 3) $topCount = 5;

    $stmtTop = $pdo->prepare("
        SELECT id, player_id, name, username, monthly_points
        FROM users
        WHERE current_month = ? AND monthly_points > 0 AND role = 'player'
        ORDER BY monthly_points DESC
        LIMIT ?
    ");
    $stmtTop->bindValue(1, $currentMonth, PDO::PARAM_STR);
    $stmtTop->bindValue(2, $topCount, PDO::PARAM_INT);
    $stmtTop->execute();
    $topPlayers = $stmtTop->fetchAll();

    $rewStmt = $pdo->query("SELECT * FROM cb_coin_rewards_config ORDER BY rank_from ASC");
    $tiers = $rewStmt->fetchAll();

    $archIns = $pdo->prepare("
        INSERT INTO monthly_rankings_archive (month_year, user_id, player_id, player_name, final_points, final_rank, cb_coins_awarded)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE final_points = VALUES(final_points), final_rank = VALUES(final_rank), cb_coins_awarded = VALUES(cb_coins_awarded)
    ");

    $rank = 1;
    foreach ($topPlayers as $p) {
        $reward = 0.00;
        foreach ($tiers as $t) {
            if ($rank >= (int)$t['rank_from'] && $rank <= (int)$t['rank_to']) {
                $reward = (float)$t['cb_coins_reward'];
                break;
            }
        }

        $archIns->execute([
            $currentMonth,
            $p['id'],
            $p['player_id'],
            $p['name'] ?: $p['username'],
            (int)$p['monthly_points'],
            $rank,
            $reward
        ]);

        if ($reward > 0) {
            $pdo->prepare("UPDATE users SET cb_coins = cb_coins + ? WHERE id = ?")->execute([$reward, $p['id']]);
            $pdo->prepare("INSERT INTO cb_transactions (user_id, amount, type, description) VALUES (?, ?, 'monthly_reward', ?)")
                ->execute([$p['id'], $reward, "Tournament Prize: Rank {$rank} in {$currentMonth}"]);
        }

        $rank++;
    }

    // Reset all users monthly points
    $pdo->exec("UPDATE users SET monthly_points = 0, levels_cleared_monthly = 0");

    echo json_encode([
        'status' => 'success',
        'message' => "Successfully finalized {$currentMonth} season! Top {$topCount} winners awarded CB Coins. Points reset for all players."
    ]);
    exit();
}

// ACTION: Admin Update Referral Config
if ($action === 'admin_update_referral_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $reward = (float)($input['referral_cb_reward'] ?? 50.00);
    $reqLevel = (int)($input['referral_required_level'] ?? 100);
    $topCount = (int)($input['tournament_top_winners_count'] ?? 10);

    $upd = $pdo->prepare("
        UPDATE snake_game_config 
        SET referral_cb_reward = ?, referral_required_level = ?, tournament_top_winners_count = ?
        WHERE id = 1
    ");
    $upd->execute([$reward, $reqLevel, $topCount]);

    echo json_encode([
        'status' => 'success',
        'message' => "Referral settings updated: {$reward} CB coins at Level {$reqLevel}"
    ]);
    exit();
}

// Default fallback
echo json_encode(['status' => 'online', 'message' => 'Cobra Escape 3D Game & Admin API is running']);
exit();