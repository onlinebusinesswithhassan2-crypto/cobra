import React from 'react';
import { X, Volume2, VolumeX, Smartphone, RotateCcw, HelpCircle, Moon, Sun, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';
import { RemoteGameConfig } from '../types';

interface SettingsModalProps {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  themeMode?: 'dark' | 'light';
  remoteConfig?: RemoteGameConfig;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onToggleTheme: (mode: 'dark' | 'light') => void;
  onResetProgress: () => void;
  onOpenHelp: () => void;
  onOpenPrivacyPolicy?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  hapticsEnabled,
  themeMode = 'dark',
  remoteConfig,
  onToggleSound,
  onToggleHaptics,
  onToggleTheme,
  onResetProgress,
  onOpenHelp,
  onOpenPrivacyPolicy,
  onClose,
}) => {
  return (
    <div
      id="modal-settings"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-slate-900/95 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col transform animate-in zoom-in-95 duration-200 backdrop-blur-xl text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-display">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full game-button text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 my-5">
          {/* Theme Mode Toggle (Dark / Light) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                {themeMode === 'light' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-300" />}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-200">Theme Mode</div>
                <div className="text-xs text-slate-400">Dark / Light style</div>
              </div>
            </div>

            <div className="flex items-center bg-slate-950/60 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onToggleTheme('dark');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onToggleTheme('light');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-slate-900" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-200">Sound Effects</div>
                <div className="text-xs text-slate-400">Pops, whooshes, chimes</div>
              </div>
            </div>
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) sounds.playTap();
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                soundEnabled ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-200">Vibrations</div>
                <div className="text-xs text-slate-400">Haptic bump feedback</div>
              </div>
            </div>
            <button
              onClick={onToggleHaptics}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                hapticsEnabled ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* How to Play button */}
          <button
            onClick={onOpenHelp}
            className="w-full p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 flex items-center justify-between text-slate-200 font-bold text-sm transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span>How to Play</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Guide</span>
          </button>

          {/* In-Game Privacy Policy button (Google Play Store compliance) */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenPrivacyPolicy?.();
            }}
            className="w-full p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 flex items-center justify-between text-slate-200 font-bold text-sm transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>Privacy Policy</span>
            </div>
            <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
              Read Policy
            </span>
          </button>
        </div>

        {/* Reset Data */}
        <button
          onClick={() => {
            if (window.confirm('Reset all level progress and scores?')) {
              onResetProgress();
            }
          }}
          className="w-full py-2.5 px-4 text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Progress
        </button>
      </div>
    </div>
  );
};
