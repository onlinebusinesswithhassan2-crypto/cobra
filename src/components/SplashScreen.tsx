import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  appName?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  appName = 'COBRA ESCAPE 3D',
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Cobra Engine...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800; // 1.8s smooth splash load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStatusText('Loading 3D Puzzle Meshes...');
      } else if (pct < 65) {
        setStatusText('Connecting to Cloud Database...');
      } else if (pct < 90) {
        setStatusText('Syncing High Scores & Levels...');
      } else {
        setStatusText('Ready! Entering Game...');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      id="app-splash-screen"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 sm:p-8 bg-slate-950 select-none text-white transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #0f1f38 0%, #080f1d 55%, #030712 100%)',
      }}
    >
      {/* Background glowing ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full flex items-center justify-between opacity-80 pt-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
          Studio Production
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Safe</span>
        </div>
      </div>

      {/* Center: 3D Logo & Title */}
      <div className="relative flex flex-col items-center justify-center my-auto text-center">
        {/* Animated Logo Frame with Neon Glow */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 opacity-60 blur-lg animate-pulse" />
          
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-[3px] bg-gradient-to-b from-cyan-400 via-emerald-500 to-slate-900 shadow-2xl overflow-hidden">
            <img
              src="/logo.png"
              alt={appName}
              className="w-full h-full object-cover rounded-[21px] shadow-inner transform transition-transform duration-700 hover:scale-105"
            />
            
            {/* Sparkle badge */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-500/30 backdrop-blur-md flex items-center justify-center border border-cyan-300/40">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          {appName}
        </h1>
        <p className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-emerald-400 mt-1">
          Tactical 3D Maze Escape
        </p>
      </div>

      {/* Bottom: Smooth Loading Progress Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2.5 pb-4">
        {/* Progress Bar Container */}
        <div className="w-full h-2 rounded-full bg-slate-900/90 border border-white/10 p-[1.5px] overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text & percentage */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="truncate max-w-[200px]">{statusText}</span>
          <span className="font-bold text-cyan-300">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
