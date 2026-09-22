-- ==========================================================
-- COBRA ESCAPE 3D: COMPLETE ALL-IN-ONE DATABASE UPDATE
-- Run this in Hostinger phpMyAdmin (Database: SQL Tab)
-- Compatible with MariaDB 10.3+ / 11+ and MySQL 8.0+
-- ==========================================================

-- 1. Add missing columns to `users` table
ALTER TABLE `users` 
  ADD COLUMN IF NOT EXISTS `name` VARCHAR(64) DEFAULT NULL AFTER `username`,
  ADD COLUMN IF NOT EXISTS `role` ENUM('player', 'admin') NOT NULL DEFAULT 'player' AFTER `password_hash`,
  ADD COLUMN IF NOT EXISTS `cb_coins` DECIMAL(14, 2) NOT NULL DEFAULT 0.00 AFTER `role`,
  ADD COLUMN IF NOT EXISTS `monthly_points` INT(11) NOT NULL DEFAULT 0 AFTER `cb_coins`,
  ADD COLUMN IF NOT EXISTS `levels_cleared_monthly` INT(11) NOT NULL DEFAULT 0 AFTER `monthly_points`,
  ADD COLUMN IF NOT EXISTS `current_month` VARCHAR(7) NOT NULL DEFAULT '2026-09' AFTER `highest_level`,
  ADD COLUMN IF NOT EXISTS `referred_by` INT(11) DEFAULT NULL AFTER `current_month`,
  ADD COLUMN IF NOT EXISTS `referrals_count` INT(11) NOT NULL DEFAULT 0 AFTER `referred_by`,
  ADD COLUMN IF NOT EXISTS `last_checkin_date` DATE DEFAULT NULL AFTER `referrals_count`,
  ADD COLUMN IF NOT EXISTS `checkin_streak` INT(11) NOT NULL DEFAULT 0 AFTER `last_checkin_date`,
  ADD COLUMN IF NOT EXISTS `status` ENUM('active', 'banned') NOT NULL DEFAULT 'active' AFTER `checkin_streak`;

-- 2. Ensure `snake_game_config` table exists with all columns
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

ALTER TABLE `snake_game_config`
  ADD COLUMN IF NOT EXISTS `referral_cb_reward` DECIMAL(14, 2) NOT NULL DEFAULT 50.00,
  ADD COLUMN IF NOT EXISTS `referral_required_level` INT(11) NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS `tournament_top_winners_count` INT(11) NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS `tournament_start_date` DATETIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `tournament_end_date` DATETIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `ad_provider` VARCHAR(32) NOT NULL DEFAULT 'admob',
  ADD COLUMN IF NOT EXISTS `banner_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS `interstitial_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS `rewarded_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS `admob_app_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544~3347511713',
  ADD COLUMN IF NOT EXISTS `admob_banner_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/6300978111',
  ADD COLUMN IF NOT EXISTS `admob_interstitial_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/1033173712',
  ADD COLUMN IF NOT EXISTS `admob_rewarded_id` VARCHAR(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/5224354917',
  ADD COLUMN IF NOT EXISTS `unity_game_id` VARCHAR(64) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS `unity_banner_id` VARCHAR(64) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS `unity_interstitial_id` VARCHAR(64) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS `unity_rewarded_id` VARCHAR(64) NOT NULL DEFAULT '';

-- 3. Create Daily Check-In table
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

-- 4. Create Referrals tracking table
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

-- 5. Create Monthly Rankings Archive table
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

-- 6. Create User Level Progress table
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

-- 7. Create Friendships table
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

-- 8. Create CB Coin Gifts table
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

-- 9. Create CB Transactions Ledger table
CREATE TABLE IF NOT EXISTS `cb_transactions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `amount` DECIMAL(14, 2) NOT NULL,
  `type` VARCHAR(32) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Create CB Coin Rewards Tiers Configuration table
CREATE TABLE IF NOT EXISTS `cb_coin_rewards_config` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `rank_from` INT(11) NOT NULL,
  `rank_to` INT(11) NOT NULL,
  `cb_coins_reward` DECIMAL(14, 2) NOT NULL,
  `reward_title` VARCHAR(64) NOT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Populate Default Prize Tiers (if empty)
INSERT IGNORE INTO `cb_coin_rewards_config` (`id`, `rank_from`, `rank_to`, `cb_coins_reward`, `reward_title`) VALUES
(1, 1, 1, 1000.00, 'Rank 1 Champion (Grand Prize)'),
(2, 2, 2, 600.00, 'Rank 2 Silver Master'),
(3, 3, 3, 350.00, 'Rank 3 Bronze Legend'),
(4, 4, 5, 200.00, 'Top 5 Elite Tier'),
(5, 6, 10, 100.00, 'Top 10 Challengers'),
(6, 11, 20, 50.00, 'Top 20 Contenders');

-- 12. Ensure default Master Admin account exists
INSERT IGNORE INTO `users` (`id`, `player_id`, `username`, `name`, `password_hash`, `role`, `cb_coins`, `monthly_points`, `current_month`)
VALUES (1, 'ADM-0001', 'admin', 'Master Admin', '$2y$10$wTqK4i741ZpGfFkGvHqZz.rD6u6uB2dFm0qI78uQ4u5eT8eZ1aX6q', 'admin', 99999.00, 0, '2026-09');

-- 13. Ensure default game config row exists with Google AdMob test IDs enabled
INSERT IGNORE INTO `snake_game_config` (`id`, `ads_enabled`, `ad_provider`, `banner_enabled`, `interstitial_enabled`, `rewarded_enabled`, `ad_frequency_levels`, `reward_hint_per_ad`, `reward_burn_per_ad`, `reward_heart_per_ad`, `admob_app_id`, `admob_banner_id`, `admob_interstitial_id`, `admob_rewarded_id`)
VALUES (1, 1, 'admob', 1, 1, 1, 2, 3, 1, 1, 'ca-app-pub-3940256099942544~3347511713', 'ca-app-pub-3940256099942544/6300978111', 'ca-app-pub-3940256099942544/1033173712', 'ca-app-pub-3940256099942544/5224354917');
