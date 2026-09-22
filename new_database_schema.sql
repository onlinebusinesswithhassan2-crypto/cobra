-- =========================================================
-- COBRA ESCAPE 3D - CLEAN NEW DATABASE SCHEMA
-- Database: u352705967_snakemaster
-- Highlights:
--   - 100% Dedicated to Game (No USDT / No Crypto Wallets)
--   - In-Game Registration & Login (Players + Admins)
--   - Monthly Points Reset (Leaderboard is purely Monthly)
--   - CB Coin Rewards System (Admin decides reward distribution)
--   - Admin Dashboard support (Search players, edit CB coins, config)
-- =========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. USERS TABLE (Players & Admins)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `referrals`;
DROP TABLE IF EXISTS `cb_coin_gifts`;
DROP TABLE IF EXISTS `friendships`;
DROP TABLE IF EXISTS `user_level_progress`;
DROP TABLE IF EXISTS `cb_transactions`;
DROP TABLE IF EXISTS `monthly_rankings_archive`;
DROP TABLE IF EXISTS `cb_coin_rewards_config`;
DROP TABLE IF EXISTS `snake_game_config`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `player_id` VARCHAR(32) NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('player', 'admin') NOT NULL DEFAULT 'player',
  `cb_coins` DECIMAL(14, 2) NOT NULL DEFAULT 0.00 COMMENT 'CB Coin balance awarded by Admin / Monthly Wins',
  `monthly_points` INT(11) NOT NULL DEFAULT 0 COMMENT 'Active month competition points',
  `levels_cleared_monthly` INT(11) NOT NULL DEFAULT 0 COMMENT 'Levels cleared in current active month',
  `highest_level` INT(11) NOT NULL DEFAULT 1,
  `current_month` VARCHAR(7) NOT NULL COMMENT 'Format YYYY-MM (e.g. 2026-09)',
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

-- --------------------------------------------------------
-- 2. CB COIN REWARDS CONFIG (Admin decides how many CB coins top ranks get)
-- --------------------------------------------------------
CREATE TABLE `cb_coin_rewards_config` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `rank_from` INT(11) NOT NULL COMMENT 'Starting rank (e.g. 1)',
  `rank_to` INT(11) NOT NULL COMMENT 'Ending rank (e.g. 1 or 3 or 10)',
  `cb_coins_reward` DECIMAL(14, 2) NOT NULL COMMENT 'CB Coins awarded',
  `reward_title` VARCHAR(64) NOT NULL COMMENT 'e.g. Rank 1 Champion, Top 3 Masters, Top 10 Elite',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default CB Coin distribution for top monthly ranks
INSERT INTO `cb_coin_rewards_config` (`rank_from`, `rank_to`, `cb_coins_reward`, `reward_title`) VALUES
(1, 1, 1000.00, 'Rank 1 Champion (Grand Prize)'),
(2, 2, 600.00, 'Rank 2 Silver Master'),
(3, 3, 350.00, 'Rank 3 Bronze Legend'),
(4, 5, 200.00, 'Top 5 Elite Tier'),
(6, 10, 100.00, 'Top 10 Challengers'),
(11, 20, 50.00, 'Top 20 Contenders');

-- --------------------------------------------------------
-- 3. CB TRANSACTIONS (Audit Ledger of all CB Coins)
-- --------------------------------------------------------
CREATE TABLE `cb_transactions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `amount` DECIMAL(14, 2) NOT NULL,
  `type` ENUM('monthly_reward', 'admin_grant', 'checkin_bonus', 'gameplay_reward', 'gift_sent', 'gift_received') NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_by_admin_id` INT(11) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. MONTHLY RANKINGS ARCHIVE (History preserved when month resets)
-- --------------------------------------------------------
CREATE TABLE `monthly_rankings_archive` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `month_year` VARCHAR(7) NOT NULL COMMENT 'Format YYYY-MM',
  `user_id` INT(11) NOT NULL,
  `player_id` VARCHAR(32) NOT NULL,
  `player_name` VARCHAR(64) NOT NULL,
  `final_points` INT(11) NOT NULL,
  `final_rank` INT(11) NOT NULL,
  `cb_coins_awarded` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `archived_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_month_user` (`month_year`, `user_id`),
  KEY `idx_month_rank` (`month_year`, `final_rank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. USER LEVEL PROGRESS (Tracks completed levels in active month)
-- --------------------------------------------------------
CREATE TABLE `user_level_progress` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `level_id` INT(11) NOT NULL,
  `month_year` VARCHAR(7) NOT NULL,
  `stars` TINYINT(4) NOT NULL DEFAULT 3,
  `score` INT(11) NOT NULL DEFAULT 0,
  `completed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_level_month` (`user_id`, `level_id`, `month_year`),
  KEY `idx_user_month` (`user_id`, `month_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. FRIENDSHIPS TABLE (Player ID Search & Connections)
-- --------------------------------------------------------
CREATE TABLE `friendships` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sender_id` INT(11) NOT NULL COMMENT 'User ID who sent request',
  `receiver_id` INT(11) NOT NULL COMMENT 'User ID who received request',
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_friend_pair` (`sender_id`, `receiver_id`),
  KEY `idx_receiver` (`receiver_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. CB COIN GIFTS TABLE (Gifting CB coins to friends)
-- --------------------------------------------------------
CREATE TABLE `cb_coin_gifts` (
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

-- --------------------------------------------------------
-- 8. REFERRALS TABLE (Unverified until Level 100 complete)
-- --------------------------------------------------------
CREATE TABLE `referrals` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `referrer_id` INT(11) NOT NULL COMMENT 'User whose username was bound',
  `referred_user_id` INT(11) NOT NULL COMMENT 'New player who bound code',
  `status` ENUM('unverified', 'verified') NOT NULL DEFAULT 'unverified',
  `cb_coins_rewarded` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_referred_user` (`referred_user_id`),
  KEY `idx_referrer_id` (`referrer_id`),
  KEY `idx_referral_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. REMOTE GAME CONFIG (Admin remote control & Referral rewards)
-- --------------------------------------------------------
CREATE TABLE `snake_game_config` (
  `id` INT(11) NOT NULL DEFAULT 1,
  `default_hints` INT(11) NOT NULL DEFAULT 2,
  `default_burns` INT(11) NOT NULL DEFAULT 1,
  `reward_hint_per_ad` INT(11) NOT NULL DEFAULT 3,
  `reward_burn_per_ad` INT(11) NOT NULL DEFAULT 1,
  `reward_heart_per_ad` INT(11) NOT NULL DEFAULT 1,
  `ad_frequency_levels` INT(11) NOT NULL DEFAULT 2,
  `ads_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `referral_cb_reward` DECIMAL(14, 2) NOT NULL DEFAULT 50.00 COMMENT 'CB coins awarded when referral hits Level 100',
  `referral_required_level` INT(11) NOT NULL DEFAULT 100,
  `tournament_top_winners_count` INT(11) NOT NULL DEFAULT 10 COMMENT 'Top N players archived for monthly prizes',
  `admob_banner_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/6300978111',
  `admob_interstitial_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/1033173712',
  `admob_rewarded_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/5224354917',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `snake_game_config` (`id`, `default_hints`, `default_burns`, `reward_hint_per_ad`, `reward_burn_per_ad`, `reward_heart_per_ad`, `ad_frequency_levels`, `ads_enabled`, `referral_cb_reward`, `referral_required_level`, `tournament_top_winners_count`)
VALUES (1, 2, 1, 3, 1, 1, 2, 1, 50.00, 100, 10)
ON DUPLICATE KEY UPDATE `id` = 1;

-- --------------------------------------------------------
-- 7. DEFAULT ADMIN ACCOUNT (Admin Login from game)
-- Username: admin
-- Password: admin123456
-- Player ID: ADM-0001
-- --------------------------------------------------------
INSERT INTO `users` (
  `player_id`,
  `username`,
  `name`,
  `password_hash`,
  `role`,
  `cb_coins`,
  `monthly_points`,
  `current_month`
) VALUES (
  'ADM-0001',
  'admin',
  'Master Admin',
  '$2y$10$eO1k5sQWJn1z1M5t.bX6r.eJ7G4YqOQ0C5fN9WfG7lK6V4mJ9oZiq', -- password: admin123456
  'admin',
  99999.00,
  0,
  DATE_FORMAT(NOW(), '%Y-%m')
) ON DUPLICATE KEY UPDATE `role` = 'admin';

COMMIT;
