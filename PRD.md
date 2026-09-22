# Product Requirement Document (PRD)
## Project: Snake Escape & Online Backend System

---

## 1. Executive Summary & Overview (خلاصہ اور تعارف)

**Snake Escape** ایک جدید، 2D گرڈ بیسڈ پزل گیم ہے جو پرکشش بصری گرافکس (Glow Effects، فزکس اینیمیشنز اور ریٹرو آڈیو) کے ساتھ تیار کی گئی ہے۔ اس میں 1000 ہاتھ سے تراشیدہ اور پروسیجرل لیولز، چیپٹرز، لیڈر بورڈز، اور سیکیورٹی پروٹیکشنز شامل ہیں۔

اس گیم کے متوازی ایک آن لائن **ویب سائٹ / سرور (Backend API & Admin Portal)** تیار کیا گیا ہے جو بنیادی طور پر **Google Play Store کمپلائنس**، **Google AdMob کمائی کے تحفظ**، **آن لائن کلاؤڈ ڈیٹا بیس**، اور **ریموٹ گیم کنٹرول** کے فرائض انجام دیتا ہے۔

---

## 2. Architecture Diagram & Interaction (سسٹم کا نقشہ)

```
+--------------------------------------------------------------------------------+
|                        SNAKE ESCAPE CLIENT APP (GAME)                          |
|  - React + TypeScript + Tailwind CSS                                           |
|  - 1000 Puzzle Levels (50 Chapters) + Procedural Fallback                      |
|  - 3 Safe Hits (Medals) & Move Limit Engine                                    |
|  - Hints (Fixed 2 per Level) & Fire Burn Powerup                               |
|  - Network & AdBlocker Security Guard Overlay (Always Online)                 |
+------------------------------------+-------------------------------------------+
                                     |
               HTTP REST API (JSON)  | (sync_progress, login, submit_score,
                                     |  get_config, leaderboard)
                                     v
+------------------------------------+-------------------------------------------+
|               OFFICIAL WEB SERVER / BACKEND (HOSTINGER PHP/MYSQL)              |
|               Domain: https://aqsacollections.store                            |
+--------------------------------------------------------------------------------+
| [1] Google Policy & Monetization Requirements                                  |
|     ├── /app-ads.txt          -> AdMob Crawling & Publisher Authorization      |
|     ├── /privacy-policy.html  -> Google Play Store Mandatory Privacy Policy   |
|     └── /terms.html           -> Terms & Conditions / Developer Support        |
|                                                                                |
| [2] Live REST API (index.php)                                                  |
|     ├── ?action=login         -> Player Authentication (SNK-ID / Username)     |
|     ├── ?action=submit_score  -> Level Completion Score & Stars Submission     |
|     ├── ?action=sync_progress -> Full Cloud Game Save & Sync                   |
|     ├── ?action=leaderboard   -> Global Ranks (All-time, Weekly, Monthly)      |
|     └── ?action=get_config    -> Remote Game & Ad Configuration Control        |
|                                                                                |
| [3] MySQL Database (Relational Storage)                                        |
|     ├── Table: players        -> Accounts, Passwords, Total Scores, Levels     |
|     ├── Table: scores_log     -> Per-level breakdown, timestamps, stars        |
|     └── Table: game_config    -> Dynamic AdMob IDs, Ad frequencies, Rewards   |
|                                                                                |
| [4] Admin Dashboard (admin.php)                                                |
|     ├── Manage remote ads (Banner, Interstitial, Rewarded IDs)                 |
|     ├── Tune Game Rules (Ad frequencies, Rewards per video)                   |
|     └── View top players and reset/manage leaderboards                         |
+--------------------------------------------------------------------------------+
```

---

## 3. Game Structure & Mechanics (گیم کا مکمل ڈھانچہ)

### 3.1. کور گیم پلے (Core Gameplay Loop)
1. **Grid Board**: سانپ 2D گرڈ پر مختلف رنگوں اور لمبائی کے ساتھ موجود ہوتے ہیں۔ ان کے سر پر تیر (Arrow) ان کے نکلنے کا رخ بتاتا ہے۔
2. **One-Tap Release**: جب کھلاڑی کسی سانپ پر ٹیپ کرتا ہے، سانپ اپنے سامنے کے رخ پر دوڑتا ہے۔
3. **Collision & 3 Safe Hits (Medals)**:
   - اگر سانپ کا راستہ صاف ہو تو وہ گرڈ سے فرار ہو کر سکور میں اضافہ کرتا ہے۔
   - اگر سانپ دوسرے سانپ یا رکاوٹ سے ٹکرا جائے تو وہ ہلتا ہے (Shake Effect) اور واپس اپنی جگہ رک جاتا ہے۔
   - کھلاڑی کے پاس **3 سیف ہٹ (3 Medals)** ہوتے ہیں۔ اگر 3 بار ٹکر ہو جائے تو لیول فیل ہو جاتا ہے۔
4. **Header Indicators & PTS Display**:
   - ٹاپ بار میں کھلاڑی کے لیے 3 بنیادی انڈیکیٹرز ہیں: **Hints (بلب آئیکن)**، **3 Safe Hits (Medals)**، اور **PTS (Player Points - ٹرافی آئیکن کے ساتھ لائیو کلاؤڈ/ٹوٹل اسکور)**۔ گیم میں مووز کا کاؤنٹر دکھانے کی بجائے کھلاڑی کے پوائنٹس (PTS) دکھائے جاتے ہیں۔
5. **Fail & Revive System**:
   - لیول فیل ہونے پر کھلاڑی **Rewarded Ad** دیکھ کر **+2 Extra Hits** حاصل کر کے اسی جگہ سے گیم جاری رکھ سکتا ہے۔

### 3.2. پاور اپس اور ہنٹس (Powerups & Hints)
* **Hints (بلب آئیکن)**:
  - ہر نیا لیول شروع ہونے پر کھلاڑی کو فکسڈ **2 Hints** ملتے ہیں۔
  - ہنٹ استعمال کرنے پر درست نکلنے والے سانپ کو نمایاں (Glow Effect) کیا جاتا ہے۔
  - لیول پار کرنے پر کوئی خودکار ہنٹ جمع نہیں ہوتا۔ اضافی ہنٹس صرف Ad دیکھ کر ملتے ہیں۔
* **Fire Burn Powerup (آگ کا آئیکن)**:
  - ہر نئے لیول کے لیے کھلاڑی کو **1 فکسڈ Burn Powerup** ملتا ہے۔
  - یہ بورڈ پر راستہ روکنے والے کسی بھی ایک سانپ کو فوری طور پر جلا کر ہٹا دیتا ہے۔
  - 1 برن استعمال ہونے کے بعد کھلاڑی اشتہار (Rewarded Ad) دیکھ کر اضافی برن حاصل کر سکتا ہے۔

### 3.3. لیولز اور پروگریشن (1000 Levels & 50 Chapters)
* **50 Chapters**: ہر چیپٹر میں 20 لیولز ہیں (مثلاً: Novice Sanctuary, Mystic Forest, Crystal Caverns, Grand Master Zenith وغیرہ)۔
* ہر چیپٹر کا الگ کلر تھیم اور ایموجی آئیکن ہے۔
* کھلاڑی کی مقامی پروگریس `localStorage` میں اور آن لائن اکاؤنٹ میں کلاؤڈ پر ہم وقت محفوظ ہوتی ہے۔

### 3.4. سیکیورٹی اور انٹیگریٹی گارڈز (Security Guards)
1. **No Internet, No Play**:
   - انٹرنیٹ (Wi-Fi یا ڈیٹا) بند ہونے پر فوری فل سکرین اوورلے آتا ہے جو گیم کو روک دیتا ہے۔
2. **AdBlocker Detection**:
   - براؤزر یا ڈیوائس پر uBlock، AdGuard، AdBlock Plus یا Brave Shields آن ہونے پر گیم لاک ہو جاتی ہے اور ایڈ بلاکر آف کرنے کی ہدایات کے ساتھ ان لاک تصدیق مانگتی ہے۔
3. **Heartbeat Audit**:
   - ہر 12 سیکنڈ بعد نیٹ ورک اور اشتہارات کے لوڈ ہونے کی لائیو چیکنگ۔

---

## 4. Website Purpose & Functions (ویب سائٹ بنانے کا اصل مقصد)

ہم نے جو الگ ویب سائٹ (`https://aqsacollections.store`) منسلک کی ہے اس کے **4 بنیادی اور لازمی مقاصد** ہیں:

### مقصد 1: Google AdMob کی قانونی پابندی (app-ads.txt)
* **وجہ**: گوگل ایڈموب دھوکہ دہی اور فیک ٹریفک روکنے کے لیے تمام پبلشرز سے ڈیمانڈ کرتا ہے کہ ان کی ایک تصدیق شدہ پبلک ویب سائٹ ہو۔
* **ویب سائٹ پر فائل**: `https://aqsacollections.store/app-ads.txt`
* **کردار**: ایڈموب کا روبوٹ اس ڈومین کو سکین کر کے تصدیق کرتا ہے کہ اشتہارات سے ہونے والی آمدنی صرف آپ کے مصدقہ AdMob اکاؤنٹ میں جائے گی۔

### مقصد 2: Google Play Store کی پالیسی (Privacy Policy & Legal Terms)
* **وجہ**: گوگل پلے اسٹور کسی بھی ایسی ایپ یا گیم کو اپروو نہیں کرتا جس کی پبلک پرائیویسی پالیسی کا فعال لنک نہ ہو۔
* **ویب سائٹ پر پیجز**:
  - `https://aqsacollections.store/privacy-policy.html`: یوزر ڈیٹا، اشتہارات اور کوکیز کا پالیسی بیان۔
  - `https://aqsacollections.store/terms.html`: استعمال کی شرائط۔
  - Developer Support Email & Contact Information.

### مقصد 3: ریموٹ گیم کنفیگریشن (بغیر ایپ اپڈیٹ کیے سیٹنگز بدلنا)
* **وجہ**: اگر آپ کل کو گیم کے اندر ایڈز کی فریکوئنسی یا ایڈ آئی ڈیز تبدیل کرنا چاہیں، تو پلے اسٹور پر نیا APK/AAB اپلوڈ کیے بغیر ویب سائٹ کے ایڈمن پینل سے تبدیل کر سکتے ہیں۔
* **ویب سائٹ سے کنٹرول ہونے والے فیچرز**:
  - `admobBannerId`, `admobInterstitialId`, `admobRewardedId`
  - `adFrequencyLevels` (کتنے لیولز کے بعد فل سکرین اشتہار آئے)
  - `rewardHintPerAd` (ویڈیو دیکھنے پر کتنے ہنٹ ملیں)
  - `rewardHeartPerAd` (ریوائیو پر کتنی ہٹس ملیں: 2 Hits)

### مقصد 4: کلاؤڈ ڈیٹا بیس اور گلوبل لیڈر بورڈ (Cross-Device Accounts)
* کھلاڑیوں کا ڈیٹا صرف موبائل میں گم نہ ہو جائے، بلکہ آن لائن MySQL ڈیٹا بیس میں محفوظ ہو۔
* گلوبل لیڈر بورڈ پر تمام کھلاڑیوں کے اسکورز، آل ٹائم، ہفتہ وار (Weekly) اور ماہانہ (Monthly) رینکنگ لائیو نظر آنا۔

---

## 5. Unified Database Architecture (ڈیٹا بیس کا ڈھانچہ)

ویب سائٹ کے MySQL ڈیٹا بیس اور گیم کے ڈیٹا ماڈل کا آپسی تعلق درج ذیل ہے:

### 5.1. ٹیبل: `players` (کھلاڑیوں کے اکاؤنٹس)
| Column Name | Type | Description |
|---|---|---|
| `id` | INT (AUTO_INCREMENT) | پرائمری کی |
| `player_id` | VARCHAR(32) (UNIQUE) | منفرد ٹیگ (مثلاً: `SNK-4934`) |
| `username` | VARCHAR(50) (UNIQUE) | کھلاڑی کا یوزرنیم |
| `password_hash` | VARCHAR(255) | انکرپٹڈ پاسورڈ |
| `total_score` | INT | مجموعی اسکور (تمام لیولز کا ٹوٹل) |
| `levels_cleared` | INT | مکمل کیے گئے لیولز کی تعداد |
| `highest_level` | INT | سب سے زیادہ ان لاک شدہ لیول |
| `created_at` | TIMESTAMP | اکاؤنٹ بننے کا وقت |
| `last_active` | TIMESTAMP | آخری بار لاگ ان / کھیلنے کا وقت |

### 5.2. ٹیبل: `scores_log` (لیول کے اسکورز کا ریکارڈ)
| Column Name | Type | Description |
|---|---|---|
| `id` | INT (AUTO_INCREMENT) | پرائمری کی |
| `player_id` | VARCHAR(32) | فارن کی (کھلاڑی کا آئی ڈی) |
| `level_id` | INT | لیول نمبر (1 تا 1000) |
| `score` | INT | اس لیول میں حاصل کردہ اسکور |
| `stars` | TINYINT | حاصل کردہ ستارے (1 سے 3) |
| `moves_used` | INT | استعمال ہونے والی مووز |
| `completed_at` | TIMESTAMP | لیول پار کرنے کا وقت |

### 5.3. ٹیبل: `game_config` (ریموٹ سیٹنگز)
| Key | Default Value | Description |
|---|---|---|
| `default_hints` | `2` | ہر لیول کے آغاز پر ہنٹس کی تعداد |
| `default_burns` | `1` | ہر لیول کے آغاز پر فائر برن کی تعداد |
| `reward_hint_per_ad`| `3` | ایڈ دیکھنے پر اضافی ہنٹس |
| `reward_heart_per_ad`| `2` | ایڈ دیکھ کر ریوائیو کرنے پر اضافی ہٹس |
| `ad_frequency_levels`| `2` | ہر 2 لیولز بعد Interstitial Ad |
| `ads_enabled` | `1` | گلوبل ایڈز سوئچ |
| `admob_banner_id` | `ca-app-pub-...` | گوگل بینر یونٹ آئی ڈی |
| `admob_interstitial_id`| `ca-app-pub-...` | فل سکرین اشتہار کی آئی ڈی |
| `admob_rewarded_id` | `ca-app-pub-...` | ریوارڈڈ ویڈیو اشتہار کی آئی ڈی |

---

## 6. API Endpoints Specification (ویب سائٹ اور گیم کا رابطہ)

تمام اینڈ پوائنٹس `https://aqsacollections.store/index.php` کے ذریعے ہینڈل ہوتے ہیں:

1. **Player Login / Register**:
   - `POST index.php?action=login`
   - Body: `{ "username": "...", "password": "...", "player_id": "..." }`
2. **Submit Level Score**:
   - `POST index.php?action=submit_score`
   - Body: `{ "player_id": "SNK-4934", "level_id": 12, "score": 1450, "stars": 3 }`
3. **Sync Progress**:
   - `POST index.php?action=sync_progress`
   - Body: `{ "player_id": "SNK-4934", "score": 45200, "levels_cleared": 32, "highest_level": 33 }`
4. **Fetch Leaderboard**:
   - `GET index.php?action=leaderboard&period=all_time` (یا `weekly`, `monthly`)
   - Return: `[ { "rank": 1, "username": "Aliraza", "total_score": 136090, ... } ]`
5. **Fetch Remote Configuration**:
   - `GET index.php?action=get_config`
   - Return: ریموٹ ایڈز اور ریوارڈ کنفیگریشن جیسن (JSON) فارمیٹ میں۔

---

## 7. Monetization Strategy & Compliance (کمائی کا طریقہ کار)

* **AdMob Banner**: سکرین کے نچلے حصے پر مستقل چلنے والا اشتہار۔
* **AdMob Interstitial**: ہر 2 لیولز مکمل کرنے کے بعد سامنے آنے والا اشتہار۔
* **Rewarded Video Ads**:
  - ہنٹس ختم ہونے پر واچ ایڈ۔
  - لیول فیل ہونے پر ریوائیو (+2 سیف ہٹس) کے لیے واچ ایڈ۔
  - لیول مکمل ہونے پر اسکور ڈبل (2X Score) کرنے کے لیے واچ ایڈ۔
* **حفاظتی قانون**:
  - ویب سائٹ کا `app-ads.txt` اس بات کو یقینی بناتا ہے کہ کوئی دوسرا شخص آپ کے پبلشر ریونیو کو چوری نہ کر سکے اور گوگل ایڈموب اکاؤنٹ ہمیشہ ایکٹیو اور محفوظ رہے۔

---

## 8. Summary of Integration (نتیجہ)

گیم (`Snake Escape`) اور ویب سائٹ (`aqsacollections.store`) ایک دوسرے کے لیے لازم و ملزوم ہیں:
- **گیم** یوزر کو کھیلنے کا بہترین تجربہ، اینیمیشنز اور تفریح فراہم کرتی ہے۔
- **ویب سائٹ** گیم کو انٹرنیٹ پر قانونی تحفظ (Play Store Privacy + AdMob app-ads.txt)، کلاؤڈ ڈیٹا بیس (آن لائن لاگ ان اور لیڈر بورڈ)، اور ایڈمن کنٹرول (بغیر اپڈیٹ ایڈز کنٹرول) فراہم کرتی ہے۔
