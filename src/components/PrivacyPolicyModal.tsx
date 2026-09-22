import React from 'react';
import { X, ShieldCheck, Lock, Eye, Bell, Award, UserCheck, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-privacy-policy"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col transform animate-in zoom-in-95 duration-200 backdrop-blur-xl text-white max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display tracking-tight text-white leading-tight">
                Privacy Policy
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Cobra Escape / Snake Master • Updated September 2026
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full game-button text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Content */}
        <div className="flex-1 overflow-y-auto pr-1 my-4 text-xs text-slate-300 flex flex-col gap-4 leading-relaxed custom-scrollbar">
          {/* Section 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>1. Overview & Commitment</span>
            </div>
            <p>
              Welcome to <strong>Cobra Escape</strong>. We value your privacy and are committed to safeguarding your personal data. This Privacy Policy details how our game handles your information, progress data, and competitive tournament records.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
              <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>2. Information We Collect</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                <strong>Gameplay & Progress Data:</strong> Levels cleared, puzzle completion stars, daily check-in streaks, and monthly tournament points saved on your device and synced with our server.
              </li>
              <li>
                <strong>Account Credentials (Optional):</strong> When you create an account to compete in monthly leaderboards and invite friends, we securely store your chosen Username, Display Name, and an encrypted password hash.
              </li>
              <li>
                <strong>Device & Diagnostics:</strong> Non-personally identifiable technical details such as OS version, device model, and crash logs to optimize game rendering and battery consumption.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <Bell className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3. Advertisements & Google AdMob</span>
            </div>
            <p>
              Cobra Escape uses <strong>Google AdMob</strong> to display banner, interstitial, and rewarded video ads. AdMob may utilize anonymous advertising identifiers (Google Advertising ID) in accordance with Google Play Developer policies to serve family-safe, relevant advertisements.
            </p>
            <p className="text-[11px] text-slate-400">
              Rewarded ads are optional and user-initiated to grant in-game hints, burns, or check-in perks.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-indigo-300 text-sm">
              <Award className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>4. Tournaments, Leaderboards & CB Coins</span>
            </div>
            <p>
              Points earned by clearing puzzle levels are tallied on the global Monthly Tournament Leaderboard. Only your public display name and monthly score are visible to other players.
            </p>
            <p>
              In-game <strong>CB Coins</strong> and referral rewards represent purely virtual game currency used for unlocking puzzle boosts and participating in community challenges.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>5. Data Security & Storage</span>
            </div>
            <p>
              We implement industry-standard security measures including SSL/TLS encrypted communications, salted password hashing (BCrypt), and role-based access control. We never sell, rent, or trade your player details to third-party brokers.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-300 text-sm">
              <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>6. Children's Privacy</span>
            </div>
            <p>
              Cobra Escape is crafted for family-friendly enjoyment. We do not knowingly collect personal identifiable information from children under 13 without parental consent.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-300 text-sm">
              <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
              <span>7. Account Deletion & Rights</span>
            </div>
            <p>
              You may permanently delete your player profile and associated gameplay data anytime via the <strong>Delete Account</strong> option inside your Profile, or by submitting an online deletion request at our support portal (<code className="text-slate-300">aqsacollections.store/server_api/delete_account.php</code>).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 rounded-2xl font-black text-slate-950 text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
