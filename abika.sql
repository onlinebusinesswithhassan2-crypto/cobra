-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 21, 2026 at 07:41 AM
-- Server version: 11.8.9-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u352705967_snakemaster`
--

-- --------------------------------------------------------

--
-- Table structure for table `cb_coin_gifts`
--

CREATE TABLE `cb_coin_gifts` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `message` varchar(255) DEFAULT 'A gift of CB Coins for you!',
  `status` enum('delivered','claimed') NOT NULL DEFAULT 'delivered',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cb_coin_rewards_config`
--

CREATE TABLE `cb_coin_rewards_config` (
  `id` int(11) NOT NULL,
  `rank_from` int(11) NOT NULL COMMENT 'Starting rank (e.g. 1)',
  `rank_to` int(11) NOT NULL COMMENT 'Ending rank (e.g. 1 or 3 or 10)',
  `cb_coins_reward` decimal(14,2) NOT NULL COMMENT 'CB Coins awarded',
  `reward_title` varchar(64) NOT NULL COMMENT 'e.g. Rank 1 Champion, Top 3 Masters, Top 10 Elite',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cb_transactions`
--

CREATE TABLE `cb_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `type` enum('monthly_reward','admin_grant','checkin_bonus','gameplay_reward','gift_sent','gift_received') NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_by_admin_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friendships`
--

CREATE TABLE `friendships` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL COMMENT 'User ID who sent request',
  `receiver_id` int(11) NOT NULL COMMENT 'User ID who received request',
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_rankings_archive`
--

CREATE TABLE `monthly_rankings_archive` (
  `id` int(11) NOT NULL,
  `month_year` varchar(7) NOT NULL COMMENT 'Format YYYY-MM',
  `user_id` int(11) NOT NULL,
  `player_id` varchar(32) NOT NULL,
  `player_name` varchar(64) NOT NULL,
  `final_points` int(11) NOT NULL,
  `final_rank` int(11) NOT NULL,
  `cb_coins_awarded` decimal(14,2) NOT NULL DEFAULT 0.00,
  `archived_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int(11) NOT NULL,
  `referrer_id` int(11) NOT NULL,
  `referred_user_id` int(11) NOT NULL,
  `status` enum('unverified','verified') NOT NULL DEFAULT 'unverified',
  `cb_coins_rewarded` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `snake_game_config`
--

CREATE TABLE `snake_game_config` (
  `id` int(11) NOT NULL DEFAULT 1,
  `default_hints` int(11) NOT NULL DEFAULT 2,
  `default_burns` int(11) NOT NULL DEFAULT 1,
  `reward_hint_per_ad` int(11) NOT NULL DEFAULT 3,
  `reward_burn_per_ad` int(11) NOT NULL DEFAULT 1,
  `reward_heart_per_ad` int(11) NOT NULL DEFAULT 1,
  `ad_frequency_levels` int(11) NOT NULL DEFAULT 2,
  `ads_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `admob_banner_id` varchar(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/6300978111',
  `admob_interstitial_id` varchar(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/1033173712',
  `admob_rewarded_id` varchar(128) NOT NULL DEFAULT 'ca-app-pub-3940256099942544/5224354917',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `referral_cb_reward` decimal(14,2) NOT NULL DEFAULT 50.00,
  `referral_required_level` int(11) NOT NULL DEFAULT 100,
  `tournament_top_winners_count` int(11) NOT NULL DEFAULT 10,
  `tournament_start_date` datetime DEFAULT NULL,
  `tournament_end_date` datetime DEFAULT NULL,
  `ad_provider` varchar(32) NOT NULL DEFAULT 'admob',
  `banner_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `interstitial_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `rewarded_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `admob_app_id` varchar(128) NOT NULL DEFAULT '',
  `unity_game_id` varchar(64) NOT NULL DEFAULT '',
  `unity_banner_id` varchar(64) NOT NULL DEFAULT '',
  `unity_interstitial_id` varchar(64) NOT NULL DEFAULT '',
  `unity_rewarded_id` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `player_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('player','admin') NOT NULL DEFAULT 'player',
  `cb_coins` decimal(14,2) NOT NULL DEFAULT 0.00 COMMENT 'CB Coin balance awarded by Admin / Monthly Wins',
  `monthly_points` int(11) NOT NULL DEFAULT 0 COMMENT 'Active month competition points',
  `levels_cleared_monthly` int(11) NOT NULL DEFAULT 0 COMMENT 'Levels cleared in current active month',
  `highest_level` int(11) NOT NULL DEFAULT 1,
  `current_month` varchar(7) NOT NULL COMMENT 'Format YYYY-MM (e.g. 2026-09)',
  `referral_code` varchar(16) DEFAULT NULL,
  `referred_by` int(11) DEFAULT NULL,
  `referrals_count` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','banned') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_checkin_date` date DEFAULT NULL,
  `checkin_streak` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_daily_checkins`
--

CREATE TABLE `user_daily_checkins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `pts_rewarded` int(11) NOT NULL DEFAULT 0,
  `claimed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_level_progress`
--

CREATE TABLE `user_level_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `month_year` varchar(7) NOT NULL,
  `stars` tinyint(4) NOT NULL DEFAULT 3,
  `score` int(11) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cb_coin_gifts`
--
ALTER TABLE `cb_coin_gifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_gift_sender` (`sender_id`),
  ADD KEY `idx_gift_receiver` (`receiver_id`);

--
-- Indexes for table `cb_coin_rewards_config`
--
ALTER TABLE `cb_coin_rewards_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cb_transactions`
--
ALTER TABLE `cb_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_friend_pair` (`sender_id`,`receiver_id`),
  ADD KEY `idx_receiver` (`receiver_id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `monthly_rankings_archive`
--
ALTER TABLE `monthly_rankings_archive`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_month_user` (`month_year`,`user_id`),
  ADD KEY `idx_month_rank` (`month_year`,`final_rank`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_referred_user` (`referred_user_id`),
  ADD KEY `idx_referrer_id` (`referrer_id`),
  ADD KEY `idx_referral_status` (`status`);

--
-- Indexes for table `snake_game_config`
--
ALTER TABLE `snake_game_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_player_id` (`player_id`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD KEY `idx_monthly_points` (`monthly_points`),
  ADD KEY `idx_current_month` (`current_month`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `user_daily_checkins`
--
ALTER TABLE `user_daily_checkins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_checkin` (`user_id`,`day_number`),
  ADD KEY `idx_claimed_at` (`claimed_at`);

--
-- Indexes for table `user_level_progress`
--
ALTER TABLE `user_level_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_level_month` (`user_id`,`level_id`,`month_year`),
  ADD KEY `idx_user_month` (`user_id`,`month_year`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cb_coin_gifts`
--
ALTER TABLE `cb_coin_gifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cb_coin_rewards_config`
--
ALTER TABLE `cb_coin_rewards_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cb_transactions`
--
ALTER TABLE `cb_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friendships`
--
ALTER TABLE `friendships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monthly_rankings_archive`
--
ALTER TABLE `monthly_rankings_archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_daily_checkins`
--
ALTER TABLE `user_daily_checkins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_level_progress`
--
ALTER TABLE `user_level_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
