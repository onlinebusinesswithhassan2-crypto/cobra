import React, { useState, useEffect } from 'react';
import { X, User, Lock, CheckCircle2, ShieldCheck, LogOut, ArrowRight, UserPlus, Coins, Crown, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { loginPlayer, registerPlayer, deletePlayerAccount } from '../services/apiService';
import { sounds } from '../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onLoginSuccess: (profile: UserProfile) => void;
  onLogout: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenPrivacyPolicy?: () => void;
  currentUnlockedLevel?: number;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLoginSuccess,
  onLogout,
  onOpenAdminDashboard,
  onOpenPrivacyPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  // Login form
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration form
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Delete account confirmation hooks (must be declared BEFORE early return)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setShowDeleteConfirm(false);
      setDeleteError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      setErrorMessage('Please enter both Username / Player ID & Password');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    sounds.playTap();

    try {
      const res = await loginPlayer(loginId, password);
      if (res.success && res.profile) {
        sounds.playExit();
        onLoginSuccess(res.profile);
        onClose();
      } else {
        setErrorMessage(res.message || 'Login failed. Check your credentials.');
      }
    } catch {
      setErrorMessage('Unable to connect to server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in Name, Username, and Password');
      return;
    }

    if (!agreedToPolicy) {
      setErrorMessage('Please agree to the Privacy Policy to create an account');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    sounds.playTap();

    try {
      const res = await registerPlayer(regName, regUsername, regPassword, regReferralCode);
      if (res.success && res.profile) {
        sounds.playBonusScore();
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          onLoginSuccess(res.profile!);
          onClose();
        }, 500);
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMessage('Unable to reach server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userProfile) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await deletePlayerAccount(userProfile.playerId || userProfile.username);
      if (res.success) {
        sounds.playLevelComplete();
        setShowDeleteConfirm(false);
        onLogout();
        onClose();
      } else {
        setDeleteError(res.message || 'Failed to delete account');
      }
    } catch {
      setDeleteError('Connection error. Could not delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="login-modal-content"
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white animate-scale-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display tracking-tight leading-tight">
                {userProfile?.isLoggedIn ? 'Account Profile' : 'Player Authentication'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {userProfile?.isLoggedIn ? 'Cobra Escape Cloud Player' : 'Compete for monthly CB Coins'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ALREADY LOGGED IN VIEW */}
        {userProfile?.isLoggedIn ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-emerald-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {userProfile.role === 'admin' ? 'Administrator' : 'Active Player'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {userProfile.playerId || 'SNK-PLAYER'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl font-display shrink-0">
                  {((userProfile.name || userProfile.username || userProfile.playerId || 'P').trim().charAt(0) || 'P').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-white truncate">
                    {userProfile.name || userProfile.username || 'Player'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate">
                    @{userProfile.username || userProfile.playerId || 'player'}
                  </p>
                </div>
              </div>

              {/* Balances & Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CB Coins</div>
                  <div className="text-sm font-black font-mono text-amber-300 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{(userProfile.cbCoins || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Monthly PTS</div>
                  <div className="text-sm font-black font-mono text-emerald-400">
                    {(userProfile.monthlyPoints || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Portal Shortcut Button */}
            {userProfile.role === 'admin' && onOpenAdminDashboard && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onClose();
                  onOpenAdminDashboard();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 rounded-2xl font-black text-sm text-slate-950 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Open Admin Dashboard</span>
              </button>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-2xl font-bold text-sm text-white transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  onLogout();
                }}
                className="px-4 py-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 active:scale-95 rounded-2xl font-bold text-sm text-rose-400 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* In-App Account Deletion Flow (Google Play Compliance) */}
            {userProfile.role !== 'admin' && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setShowDeleteConfirm(true);
                      setDeleteError('');
                    }}
                    className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 py-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account & Data</span>
                  </button>
                ) : (
                  <div className="w-full p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col gap-2.5 animate-fade-in mt-1 text-left">
                    <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Permanently Delete Account?</span>
                    </div>
                    <p className="text-xs text-rose-200/80 leading-relaxed">
                      All your level progress, high scores, CB Coins, leaderboard points, and friends will be permanently erased. This cannot be undone.
                    </p>
                    {deleteError && (
                      <div className="text-[11px] text-rose-300 bg-rose-900/50 p-2 rounded-xl border border-rose-700/50">
                        {deleteError}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setShowDeleteConfirm(false);
                        }}
                        disabled={isDeleting}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-rose-950/60 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* AUTHENTICATION VIEW: TABS FOR LOGIN & REGISTER */
          <div className="flex flex-col gap-3.5">
            {/* Tabs Pill */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* ERROR OR SUCCESS NOTICES */}
            {errorMessage && (
              <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center">
                {successMessage}
              </p>
            )}

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Username or Player ID
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter Username or Player ID"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-amber-400 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setShowLoginPassword(!showLoginPassword);
                      }}
                      className="absolute right-3 text-slate-400 hover:text-amber-300 p-1 transition-colors cursor-pointer"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 rounded-2xl font-black text-slate-950 text-xs tracking-wide transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-1"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: IN-GAME REGISTRATION FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-emerald-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">@</span>
                    <input
                      type="text"
                      placeholder="e.g. player123"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-emerald-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Minimum 4 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-emerald-400 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setShowRegPassword(!showRegPassword);
                      }}
                      className="absolute right-3 text-slate-400 hover:text-emerald-300 p-1 transition-colors cursor-pointer"
                      title={showRegPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Optional Referral Code */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Referral Code</span>
                    <span className="text-[9px] text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <UserPlus className="absolute left-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. SNK-1001 or inviter's username"
                      value={regReferralCode}
                      onChange={(e) => setRegReferralCode(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-purple-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Play Store Compliance: Agreement Checkbox */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left">
                  <input
                    type="checkbox"
                    id="reg-agree-terms"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500 shrink-0"
                  />
                  <label htmlFor="reg-agree-terms" className="text-[11px] text-slate-300 leading-tight select-none cursor-pointer">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        sounds.playTap();
                        onOpenPrivacyPolicy?.();
                      }}
                      className="text-cyan-400 font-bold underline hover:text-cyan-300 cursor-pointer"
                    >
                      Privacy Policy
                    </button>{' '}
                    and Game Rules.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 rounded-2xl font-black text-slate-950 text-xs tracking-wide transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-1"
                >
                  {loading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account & Play</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Offline Guest continue */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-full py-1 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors text-center cursor-pointer"
            >
              Continue in Guest Mode (Offline Play)
            </button>

            <div className="text-[10px] text-slate-500 text-center pt-1 border-t border-slate-800/80">
              By playing, you agree to our{' '}
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onOpenPrivacyPolicy?.();
                }}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
