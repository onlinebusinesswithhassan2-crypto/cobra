<?php
header("Content-Type: text/html; charset=UTF-8");

$db_host = 'localhost';
$db_name = 'u352705967_snakemaster';
$db_user = 'u352705967_snakemaster';
$db_pass = 'Hassan030416*@#';

$msg = '';
$msgType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usernameOrId = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirm = isset($_POST['confirm']);

    if (empty($usernameOrId) || empty($password)) {
        $msg = 'Please enter your Player ID / Username and Password.';
        $msgType = 'error';
    } elseif (!$confirm) {
        $msg = 'Please check the confirmation box to authorize permanent deletion.';
        $msgType = 'error';
    } else {
        try {
            $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(player_id) = LOWER(?) LIMIT 1");
            $stmt->execute([$usernameOrId, $usernameOrId]);
            $user = $stmt->fetch();

            if (!$user) {
                $msg = 'Account not found with provided Username or Player ID.';
                $msgType = 'error';
            } elseif (strtolower($user['username']) === 'admin' || $user['player_id'] === 'ADM-0001' || $user['role'] === 'admin') {
                $msg = 'Administrator accounts cannot be deleted through this form.';
                $msgType = 'error';
            } else {
                $valid = password_verify($password, $user['password_hash']) 
                      || ($user['password_hash'] === $password) 
                      || (md5($password) === $user['password_hash']);

                if (!$valid) {
                    $msg = 'Incorrect password. Authentication failed.';
                    $msgType = 'error';
                } else {
                    $userId = (int)$user['id'];
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

                    $msg = 'Your account and all associated gameplay data, rankings, and CB coins have been permanently deleted.';
                    $msgType = 'success';
                }
            }
        } catch (Exception $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $msg = 'Database connection error: ' . htmlspecialchars($e->getMessage());
            $msgType = 'error';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Account & Data - Cobra Escape</title>
    <style>
        :root {
            --bg-color: #0d1117;
            --card-bg: #161b22;
            --accent-color: #ef4444;
            --text-main: #f0f6fc;
            --text-muted: #8b949e;
            --border-color: #30363d;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            padding: 24px 16px;
        }
        .container {
            max-width: 640px;
            margin: 0 auto;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 32px 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }
        .header {
            text-align: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 24px;
            margin-bottom: 24px;
        }
        .header h1 {
            color: #ef4444;
            font-size: 26px;
            margin-bottom: 8px;
        }
        .header p {
            color: var(--text-muted);
            font-size: 14px;
        }
        .alert {
            padding: 14px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.5;
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
        }
        .alert-success {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #6ee7b7;
        }
        .info-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 14px;
            color: #c9d1d9;
        }
        .info-box ul {
            margin-left: 20px;
            margin-top: 8px;
            color: var(--text-muted);
        }
        .info-box li {
            margin-bottom: 4px;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #c9d1d9;
            margin-bottom: 6px;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            background: #090d13;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
            border-color: #ef4444;
        }
        .checkbox-container {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 22px;
            font-size: 13px;
            color: var(--text-muted);
        }
        .checkbox-container input {
            margin-top: 3px;
            accent-color: #ef4444;
        }
        button[type="submit"] {
            width: 100%;
            padding: 14px;
            background: #ef4444;
            color: #fff;
            font-weight: 700;
            font-size: 15px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
        }
        button[type="submit"]:hover {
            background: #dc2626;
        }
        button[type="submit"]:active {
            transform: scale(0.98);
        }
        .footer {
            margin-top: 28px;
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
            border-top: 1px solid var(--border-color);
            padding-top: 16px;
        }
        .footer a {
            color: #38bdf8;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Delete Cobra Escape Account</h1>
            <p>Google Play Data Safety & Account Deletion Request</p>
        </div>

        <?php if (!empty($msg)): ?>
            <div class="alert alert-<?php echo $msgType; ?>">
                <?php echo htmlspecialchars($msg); ?>
            </div>
        <?php endif; ?>

        <?php if ($msgType !== 'success'): ?>
            <div class="info-box">
                <p><strong>Permanent Data Deletion Notice:</strong></p>
                <p>In compliance with Google Play Store User Data policies, you can request the complete and immediate deletion of your Cobra Escape account. Deleting your account will erase:</p>
                <ul>
                    <li>Your player credentials and profile profile</li>
                    <li>Level progress, high scores, and stars</li>
                    <li>CB Coins balance and transaction history</li>
                    <li>Leaderboard monthly points and tournament rankings</li>
                    <li>Friends list and referral connections</li>
                </ul>
                <p style="margin-top: 8px; color: #f87171; font-weight: 600;">This action is permanent and cannot be undone.</p>
            </div>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="username">Player ID or Username</label>
                    <input type="text" id="username" name="username" placeholder="e.g. SNK-1234 or player_user" required>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Your account password" required>
                </div>

                <div class="checkbox-container">
                    <input type="checkbox" id="confirm" name="confirm" required>
                    <label for="confirm" style="display: inline; margin: 0; font-weight: normal; cursor: pointer;">
                        I understand that deleting my account will permanently delete all my game progress, CB coins, and data without recovery.
                    </label>
                </div>

                <button type="submit">Permanently Delete Account & Data</button>
            </form>
        <?php else: ?>
            <div style="text-align: center; padding: 20px 0;">
                <p style="font-size: 15px; color: #94a3b8; margin-bottom: 20px;">
                    Your account has been purged from our database. Thank you for having played Cobra Escape.
                </p>
                <a href="privacy.php" style="color: #38bdf8; text-decoration: none; font-weight: 600;">Return to Privacy Policy</a>
            </div>
        <?php endif; ?>

        <div class="footer">
            Need help? Contact support at <a href="mailto:support@aqsacollections.store">support@aqsacollections.store</a><br>
            <a href="privacy.php">Privacy Policy</a> &bull; &copy; 2026 Cobra Escape.
        </div>
    </div>
</body>
</html>
