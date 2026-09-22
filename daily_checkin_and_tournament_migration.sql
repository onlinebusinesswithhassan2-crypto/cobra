-- ==========================================================
-- COBRA ESCAPE: DAILY CHECK-IN & TOURNAMENT SCHEDULE MIGRATION
-- Run this in your MySQL database (e.g., Hostinger phpMyAdmin)
-- ==========================================================

-- 1. Create table for tracking each daily check-in
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

-- 2. Add check-in tracking columns to users table
ALTER TABLE `users` 
  ADD COLUMN IF NOT EXISTS `last_checkin_date` DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `checkin_streak` INT(11) NOT NULL DEFAULT 0;

-- 3. Add competition start and end dates to snake_game_config table
ALTER TABLE `snake_game_config`
  ADD COLUMN IF NOT EXISTS `tournament_start_date` DATETIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `tournament_end_date` DATETIME DEFAULT NULL;
