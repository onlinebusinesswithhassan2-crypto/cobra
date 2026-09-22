-- =========================================================
-- COBRA ESCAPE 3D - REFERRAL SYSTEM SQL MIGRATION
-- Database: u352705967_snakemaster
-- Use this in phpMyAdmin to add Referral support to an existing database
-- without losing any existing players or data!
-- =========================================================

-- 1. Create referrals tracking table
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

-- 2. Add referral tracking columns to users table (Skip if already exists or gives #1060 error)
-- Agar #1060 error aye to iska matlab ye columns pehle se mojood hain, is step ko skip kar dein!
ALTER TABLE `users` 
  ADD COLUMN `referred_by` INT(11) DEFAULT NULL,
  ADD COLUMN `referrals_count` INT(11) NOT NULL DEFAULT 0;

-- 3. Add referral reward columns to snake_game_config table (if not already present)
ALTER TABLE `snake_game_config` 
  ADD COLUMN `referral_cb_reward` DECIMAL(14, 2) NOT NULL DEFAULT 50.00,
  ADD COLUMN `referral_required_level` INT(11) NOT NULL DEFAULT 100,
  ADD COLUMN `tournament_top_winners_count` INT(11) NOT NULL DEFAULT 10;
