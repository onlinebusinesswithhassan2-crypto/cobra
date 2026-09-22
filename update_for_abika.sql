-- ==========================================================
-- COBRA ESCAPE 3D: DATABASE UPDATE FOR CURRENT SCHEMA (`abika.sql`)
-- Database: `u352705967_snakemaster` (MariaDB 11.8.9)
-- Run this in phpMyAdmin -> SQL tab
-- ==========================================================

-- 1. Fix column defaults in `users` (prevents MariaDB strict mode errors)
ALTER TABLE `users` 
  MODIFY `name` varchar(64) NOT NULL DEFAULT 'Player',
  MODIFY `current_month` varchar(7) NOT NULL DEFAULT '2026-09';

-- 2. Insert & Initialize Row 1 in `snake_game_config` with Google Test Ad IDs
-- (This fixes the "network saving monetization config" error because row 1 was missing)
INSERT INTO `snake_game_config` (
  `id`,
  `default_hints`,
  `default_burns`,
  `reward_hint_per_ad`,
  `reward_burn_per_ad`,
  `reward_heart_per_ad`,
  `ad_frequency_levels`,
  `ads_enabled`,
  `ad_provider`,
  `banner_enabled`,
  `interstitial_enabled`,
  `rewarded_enabled`,
  `admob_app_id`,
  `admob_banner_id`,
  `admob_interstitial_id`,
  `admob_rewarded_id`,
  `referral_cb_reward`,
  `referral_required_level`,
  `tournament_top_winners_count`
) VALUES (
  1,
  2,
  1,
  3,
  1,
  1,
  2,
  1,
  'admob',
  1,
  1,
  1,
  'ca-app-pub-3940256099942544~3347511713',
  'ca-app-pub-3940256099942544/6300978111',
  'ca-app-pub-3940256099942544/1033173712',
  'ca-app-pub-3940256099942544/5224354917',
  50.00,
  100,
  10
)
ON DUPLICATE KEY UPDATE
  `ads_enabled` = 1,
  `ad_provider` = 'admob',
  `banner_enabled` = 1,
  `interstitial_enabled` = 1,
  `rewarded_enabled` = 1,
  `admob_app_id` = 'ca-app-pub-3940256099942544~3347511713',
  `admob_banner_id` = 'ca-app-pub-3940256099942544/6300978111',
  `admob_interstitial_id` = 'ca-app-pub-3940256099942544/1033173712',
  `admob_rewarded_id` = 'ca-app-pub-3940256099942544/5224354917';

-- 3. Populate Default Tournament Prize Tiers into `cb_coin_rewards_config`
INSERT INTO `cb_coin_rewards_config` (`id`, `rank_from`, `rank_to`, `cb_coins_reward`, `reward_title`) VALUES
(1, 1, 1, 1000.00, 'Rank 1 Champion (Grand Prize)'),
(2, 2, 2, 600.00, 'Rank 2 Silver Master'),
(3, 3, 3, 350.00, 'Rank 3 Bronze Legend'),
(4, 4, 5, 200.00, 'Top 5 Elite Tier'),
(5, 6, 10, 100.00, 'Top 10 Challengers'),
(6, 11, 20, 50.00, 'Top 20 Contenders')
ON DUPLICATE KEY UPDATE 
  `cb_coins_reward` = VALUES(`cb_coins_reward`),
  `reward_title` = VALUES(`reward_title`);

-- 4. Ensure Master Admin Account exists (`admin` / `admin123456`)
INSERT INTO `users` (`id`, `player_id`, `username`, `name`, `password_hash`, `role`, `cb_coins`, `monthly_points`, `current_month`)
VALUES (1, 'ADM-0001', 'admin', 'Master Admin', '$2y$10$wTqK4i741ZpGfFkGvHqZz.rD6u6uB2dFm0qI78uQ4u5eT8eZ1aX6q', 'admin', 99999.00, 0, '2026-09')
ON DUPLICATE KEY UPDATE `role` = 'admin';
