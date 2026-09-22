<?php
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Cobra Escape</title>
    <style>
        :root {
            --bg-color: #0d1117;
            --card-bg: #161b22;
            --accent-color: #10b981;
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
            max-width: 800px;
            margin: 0 auto;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 32px 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .header {
            text-align: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 24px;
            margin-bottom: 24px;
        }
        .header h1 {
            color: var(--accent-color);
            font-size: 28px;
            margin-bottom: 8px;
        }
        .header p {
            color: var(--text-muted);
            font-size: 14px;
        }
        h2 {
            color: #38bdf8;
            font-size: 20px;
            margin-top: 28px;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding-bottom: 6px;
        }
        p, ul {
            margin-bottom: 16px;
            color: #cbd5e1;
            font-size: 15px;
        }
        ul {
            padding-left: 24px;
        }
        li {
            margin-bottom: 8px;
        }
        .highlight {
            color: var(--accent-color);
            font-weight: 600;
        }
        .contact-box {
            background: rgba(16, 185, 129, 0.08);
            border: 1px solid rgba(16, 185, 129, 0.25);
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
        }
        .footer {
            text-align: center;
            margin-top: 32px;
            font-size: 13px;
            color: var(--text-muted);
            border-top: 1px solid var(--border-color);
            padding-top: 16px;
        }
        a {
            color: #38bdf8;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐍 Cobra Escape</h1>
            <p><strong>Privacy Policy</strong></p>
            <p>Effective Date: September 18, 2026</p>
        </div>

        <p>
            Welcome to <strong>Cobra Escape</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how our mobile and web application collects, uses, stores, and protects your information when you play Cobra Escape.
        </p>

        <h2>1. Information We Collect</h2>
        <p>When you use Cobra Escape, we may collect the following types of information:</p>
        <ul>
            <li><strong>Account Information:</strong> When you register an account, we collect your chosen username and a securely hashed password. We do not require or collect your real name, physical address, or phone number.</li>
            <li><strong>Gameplay & Progress Data:</strong> Your high scores, completed levels, CB Coin balances, inventory items, achievements, and leaderboard rankings.</li>
            <li><strong>Social & Referral Information:</strong> In-game friends list, tournament rankings, and referral bindings (usernames of players who invited you or whom you invited).</li>
            <li><strong>Device & Technical Data:</strong> Basic non-identifiable technical data such as client device type or network request timestamps necessary for server communication and fraud prevention.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for specific and limited purposes:</p>
        <ul>
            <li>To manage your game profile, progress synchronization, and cloud saves.</li>
            <li>To display global, monthly, and friends leaderboards.</li>
            <li>To process in-game rewards, monthly tournament prizes, and the referral reward program.</li>
            <li>To maintain game security, prevent cheating or exploit attempts, and ensure fair play.</li>
        </ul>

        <h2>3. Data Sharing & Third Parties</h2>
        <p>
            <strong>We do not sell, rent, or trade your personal data to any third party.</strong>
        </p>
        <p>
            Your username, level, and scores are displayed publicly on global leaderboards and to your in-game friends. We do not share private credentials with anyone.
        </p>

        <h2>4. Data Storage & Security</h2>
        <p>
            We implement industry-standard encryption protocols (such as password hashing via BCRYPT and HTTPS transmission) to secure your account data. However, please remember that no electronic transmission over the internet or storage technology can be guaranteed to be 100% secure.
        </p>

        <h2>5. Children's Privacy</h2>
        <p>
            Cobra Escape is designed for a general audience. We do not knowingly collect personally identifiable information from children under the age of 13. If you believe that a child has provided us with personal information, please contact us so we can immediately delete such data.
        </p>

        <h2>6. Account Deletion & Data Rights</h2>
        <p>
            You have the right to request the permanent deletion of your account and all associated gameplay data at any time. You can delete your account via either of the following methods:
        </p>
        <ul>
            <li><strong>In-Game Deletion:</strong> Go to the Player Profile icon on the game's home screen and select "Delete Account" with instant confirmation.</li>
            <li><strong>Web Deletion Portal:</strong> You can submit an account and data wipe request directly on our <a href="delete_account.php" style="color: #ef4444; font-weight: bold;">Account Deletion Request Page</a>.</li>
        </ul>

        <h2>7. Changes to This Privacy Policy</h2>
        <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
        </p>

        <div class="contact-box">
            <p><strong>Contact Us</strong></p>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:</p>
            <p>📧 Email: <a href="mailto:support@aqsacollections.store">support@aqsacollections.store</a></p>
            <p>🌐 Website: <a href="https://aqsacollections.store" target="_blank">https://aqsacollections.store</a></p>
        </div>

        <div class="footer">
            &copy; 2026 Cobra Escape. All rights reserved.
        </div>
    </div>
</body>
</html>
