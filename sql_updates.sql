-- =========================================================
-- Cobra Escape 3D - MySQL Database Updates
-- Hostinger Database: u140414507_snakemaster
-- =========================================================

-- 1. Ensure required columns exist on `users` table
ALTER TABLE `users` 
  ADD COLUMN IF NOT EXISTS `name` VARCHAR(64) DEFAULT NULL AFTER `username`,
  ADD COLUMN IF NOT EXISTS `referrals` INT NOT NULL DEFAULT 0 AFTER `wallet_address`,
  ADD COLUMN IF NOT EXISTS `referral_points` INT NOT NULL DEFAULT 0 AFTER `referrals`,
  ADD COLUMN IF NOT EXISTS `referred_by` INT(11) DEFAULT NULL AFTER `referral_points`;

-- 2. Ensure `monthly_tournament` table exists for monthly resets
CREATE TABLE IF NOT EXISTS `monthly_tournament` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `month_year` VARCHAR(7) NOT NULL COMMENT 'Format: YYYY-MM',
  `tournament_points` INT(11) DEFAULT 0,
  `levels_played_in_tournament` INT(11) DEFAULT 0,
  `joined_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_month` (`user_id`, `month_year`),
  KEY `month_year` (`month_year`),
  KEY `tournament_points` (`tournament_points`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Ensure `referral_commissions` table exists for referral commission tracking
CREATE TABLE IF NOT EXISTS `referral_commissions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `referrer_user_id` INT(11) NOT NULL,
  `referred_user_id` INT(11) NOT NULL,
  `referred_username` VARCHAR(64) NOT NULL,
  `level_id` INT(11) NOT NULL,
  `referred_score` INT(11) NOT NULL,
  `commission_pts` INT(11) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `referrer_user_id` (`referrer_user_id`),
  KEY `referred_user_id` (`referred_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Ensure `snake_level_scores` table exists for instant score audit trail
CREATE TABLE IF NOT EXISTS `snake_level_scores` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `player_id` VARCHAR(32) NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `level_id` INT(11) NOT NULL,
  `score` INT(11) NOT NULL,
  `stars` TINYINT(4) DEFAULT 3,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `level_id` (`level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
