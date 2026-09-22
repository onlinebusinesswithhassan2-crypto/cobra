-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 17, 2026 at 04:22 PM
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
-- Database: `u140414507_snakemaster`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `global_leaderboard`
-- (See below for the actual view)
--
CREATE TABLE `global_leaderboard` (
`user_id` int(11)
,`player_id` varchar(32)
,`username` varchar(64)
,`total_score` int(11)
,`levels_cleared` int(11)
,`highest_level` int(11)
,`rank_position` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `monthly_tournament`
--

CREATE TABLE `monthly_tournament` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `month_year` varchar(7) NOT NULL,
  `tournament_points` int(11) DEFAULT 0,
  `levels_played_in_tournament` int(11) DEFAULT 0,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referral_commissions`
--

CREATE TABLE `referral_commissions` (
  `id` int(11) NOT NULL,
  `referrer_user_id` int(11) NOT NULL,
  `referred_user_id` int(11) NOT NULL,
  `referred_username` varchar(64) NOT NULL,
  `level_id` int(11) NOT NULL,
  `referred_score` int(11) NOT NULL,
  `commission_pts` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reward_transactions`
--

CREATE TABLE `reward_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `player_id` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `amount` decimal(14,4) NOT NULL,
  `type` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `snake_game_config`
--

CREATE TABLE `snake_game_config` (
  `id` int(11) NOT NULL DEFAULT 1,
  `default_hints` int(11) DEFAULT 5,
  `default_burns` int(11) DEFAULT 3,
  `reward_hint_per_ad` int(11) DEFAULT 2,
  `reward_burn_per_ad` int(11) DEFAULT 1,
  `reward_heart_per_ad` int(11) DEFAULT 1,
  `ad_frequency_levels` int(11) DEFAULT 2,
  `ads_enabled` tinyint(1) DEFAULT 1,
  `admob_banner_id` varchar(128) DEFAULT 'ca-app-pub-3940256099942544/6300978111',
  `admob_interstitial_id` varchar(128) DEFAULT 'ca-app-pub-3940256099942544/1033173712',
  `admob_rewarded_id` varchar(128) DEFAULT 'ca-app-pub-3940256099942544/5224354917',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `snake_level_scores`
--

CREATE TABLE `snake_level_scores` (
  `id` int(11) NOT NULL,
  `player_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `level_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `stars` tinyint(4) DEFAULT 3,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `snake_players`
--

CREATE TABLE `snake_players` (
  `id` int(11) NOT NULL,
  `player_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `total_score` bigint(20) DEFAULT 0,
  `levels_cleared` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `player_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `total_score` int(11) DEFAULT 0,
  `levels_cleared` int(11) DEFAULT 0,
  `highest_level` int(11) DEFAULT 1,
  `coins` int(11) DEFAULT 100,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `usdt_balance` decimal(14,4) NOT NULL DEFAULT 0.0000,
  `wallet_network` varchar(16) DEFAULT NULL,
  `wallet_address` varchar(128) DEFAULT NULL,
  `referral_code` varchar(16) DEFAULT NULL,
  `referred_by` int(11) DEFAULT NULL,
  `referral_points` int(11) DEFAULT 0,
  `tournament_joined` tinyint(1) DEFAULT 0,
  `referral_qualified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_level_progress`
--

CREATE TABLE `user_level_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `stars` int(11) DEFAULT 0,
  `best_moves` int(11) DEFAULT 0,
  `score` int(11) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_requests`
--

CREATE TABLE `withdrawal_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `player_id` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `amount` decimal(14,4) NOT NULL,
  `network` varchar(16) NOT NULL,
  `wallet_address` varchar(128) NOT NULL,
  `status` enum('pending','completed','rejected') NOT NULL DEFAULT 'pending',
  `tx_hash` varchar(128) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `monthly_tournament`
--
ALTER TABLE `monthly_tournament`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_month` (`user_id`,`month_year`),
  ADD KEY `month_year` (`month_year`),
  ADD KEY `tournament_points` (`tournament_points`);

--
-- Indexes for table `referral_commissions`
--
ALTER TABLE `referral_commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `referrer_user_id` (`referrer_user_id`),
  ADD KEY `referred_user_id` (`referred_user_id`);

--
-- Indexes for table `reward_transactions`
--
ALTER TABLE `reward_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `snake_game_config`
--
ALTER TABLE `snake_game_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `snake_level_scores`
--
ALTER TABLE `snake_level_scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_player_score` (`player_id`,`level_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `snake_players`
--
ALTER TABLE `snake_players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `player_id` (`player_id`),
  ADD KEY `idx_total_score` (`total_score` DESC);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `player_id` (`player_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_level_progress`
--
ALTER TABLE `user_level_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_level` (`user_id`,`level_id`);

--
-- Indexes for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `monthly_tournament`
--
ALTER TABLE `monthly_tournament`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referral_commissions`
--
ALTER TABLE `referral_commissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reward_transactions`
--
ALTER TABLE `reward_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `snake_level_scores`
--
ALTER TABLE `snake_level_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `snake_players`
--
ALTER TABLE `snake_players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_level_progress`
--
ALTER TABLE `user_level_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

--
-- Structure for view `global_leaderboard`
--
DROP TABLE IF EXISTS `global_leaderboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u140414507_snakemaster`@`127.0.0.1` SQL SECURITY DEFINER VIEW `global_leaderboard`  AS SELECT `users`.`id` AS `user_id`, `users`.`player_id` AS `player_id`, `users`.`username` AS `username`, `users`.`total_score` AS `total_score`, `users`.`levels_cleared` AS `levels_cleared`, `users`.`highest_level` AS `highest_level`, dense_rank() over ( order by `users`.`total_score` desc,`users`.`levels_cleared` desc) AS `rank_position` FROM `users` ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_level_progress`
--
ALTER TABLE `user_level_progress`
  ADD CONSTRAINT `user_level_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
