import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WifiOff, ShieldAlert, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

interface NetworkAdGuardProps {
  onStatusChange?: (status: { isOnline: boolean; isAdBlockerActive: boolean }) => void;
  adsEnabled?: boolean;
}

export const NetworkAdGuard: React.FC<NetworkAdGuardProps> = ({ onStatusChange, adsEnabled = true }) => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isAdBlockerActive, setIsAdBlockerActive] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckMessage, setLastCheckMessage] = useState<string | null>(null);

  const isCheckingRef = useRef(false);

  // Helper to detect ad blocker through DOM bait and network fetch
  const detectAdBlocker = async (): Promise<boolean> => {
    // 1. DOM Bait test (Catches cosmetic/element hiding ad blockers like uBlock, AdBlock Plus, AdGuard)
    let domBlocked = false;
    try {
      const bait = document.createElement('div');
      bait.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links adsbox ad-placement ad-banner google-ad';
      bait.setAttribute(
        'style',
        'position: absolute !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; pointer-events: none !important;'
      );
      bait.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bait);

      // Force layout calculation
      const computed = window.getComputedStyle(bait);
      if (
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        bait.clientHeight === 0 ||
        bait.clientWidth === 0 ||
        computed.display === 'none' ||
        computed.visibility === 'hidden'
      ) {
        domBlocked = true;
      }
      bait.remove();
    } catch {
      // If error in DOM manipulation, continue to network test
    }

    if (domBlocked) {
      return true;
    }

    // 2. Network Request test (Catches network-level blockers, Pi-hole, Brave Shields, DNS filters)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Test ad script URL known to be blocked by all ad blockers
      const testAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      await fetch(new Request(testAdUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' }), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return false; // Request succeeded, no ad blocker
    } catch (err: any) {
      // If aborted because of timeout, verify if secondary test URL also fails
      try {
        const secondaryController = new AbortController();
        const secTimeoutId = setTimeout(() => secondaryController.abort(), 3000);
        await fetch(
          new Request('https://googleads.g.doubleclick.net/pagead/id', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
          }),
          { signal: secondaryController.signal }
        );
        clearTimeout(secTimeoutId);
        return false;
      } catch {
        return true; // Both ad requests were blocked by client/filter
      }
    }
  };

  // Helper to verify genuine online connectivity
  const verifyOnlineConnection = async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }
    // Trust navigator.onLine as reliable source
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  };

  // Comprehensive audit function
  const runSecurityAudit = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      // Step 1: Check Internet Connection first
      const onlineStatus = await verifyOnlineConnection();
      setIsOnline(onlineStatus);

      if (!onlineStatus) {
        // If there's no internet, we cannot reliably detect ad blocker, so just block with Offline screen
        setIsAdBlockerActive(false);
        onStatusChange?.({ isOnline: false, isAdBlockerActive: false });
        return;
      }

      // Step 2: Check Ad Blocker
      const adBlockerFound = await detectAdBlocker();
      setIsAdBlockerActive(adBlockerFound);

      onStatusChange?.({ isOnline: true, isAdBlockerActive: adBlockerFound });

      if (!adBlockerFound) {
        setLastCheckMessage(null);
      }
    } catch {
      // Fallback to navigator online
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
      setIsOnline(online);
    } finally {
      setIsChecking(false);
      isCheckingRef.current = false;
    }
  }, [onStatusChange]);

  // Initial check & event listeners
  useEffect(() => {
    runSecurityAudit();

    const handleOnline = () => {
      setIsOnline(true);
      runSecurityAudit();
    };

    const handleOffline = () => {
      setIsOnline(false);
      onStatusChange?.({ isOnline: false, isAdBlockerActive: false });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runSecurityAudit();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('focus', runSecurityAudit);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic heartbeat verification every 12 seconds
    const interval = setInterval(() => {
      runSecurityAudit();
    }, 12000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', runSecurityAudit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [runSecurityAudit, onStatusChange]);

  // If everything is fine, don't show blocking overlay
  if (isOnline && !isAdBlockerActive) {
    return null;
  }

  // Active blocking overlay
  return (
    <div
      id="security-guard-overlay"
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {!isOnline ? (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
        ) : (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        {!isOnline ? (
          /* NO INTERNET CONNECTION SCREEN */
          <>
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/20 text-rose-400">
                <WifiOff className="w-10 h-10 animate-bounce" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                !
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Offline Mode Not Allowed</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 font-display">
              No Internet Connection
            </h2>
            <p className="text-sm font-semibold text-rose-300/90 mb-3">
              Active internet connection required to play
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-xs">
              Snake Escape requires an active internet connection to load puzzles, synchronize leaderboards, and function properly. Please turn on Wi-Fi or Mobile Data to continue.
            </p>

            <div className="w-full bg-slate-800/60 rounded-2xl p-3 mb-6 border border-white/5 text-left text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-slate-200">Current Status:</span>
                <span className="text-rose-400 font-bold">Disconnected</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Please check your network settings and tap the button below once connected.
              </p>
            </div>

            <button
              id="btn-retry-internet"
              disabled={isChecking}
              onClick={() => runSecurityAudit()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2.5 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking Connection...' : 'Retry Connection'}</span>
            </button>
          </>
        ) : (
          /* AD BLOCKER DETECTED SCREEN */
          <>
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20 text-amber-400">
                <ShieldAlert className="w-10 h-10 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 text-xs font-black">
                !
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Ad Blocker Detected</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 font-display">
              Disable Ad Blocker
            </h2>
            <p className="text-sm font-semibold text-amber-300/90 mb-3">
              Please disable ad blocker to continue playing
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 max-w-xs">
              Snake Escape is 100% free to play and is supported by non-intrusive rewards. Please pause or disable your ad blocker (or Brave Shields) to open and play the game.
            </p>

            <div className="w-full bg-slate-800/70 rounded-2xl p-3.5 mb-6 border border-white/5 text-left text-xs text-slate-300 flex flex-col gap-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>How to turn off Ad Blocker:</span>
              </div>
              <ul className="text-[11px] text-slate-300/90 space-y-1 pl-4 list-disc">
                <li>Click your AdBlock extension icon (uBlock / AdBlock / AdGuard).</li>
                <li>Choose <strong className="text-white">&ldquo;Pause on this site&rdquo;</strong> or turn the toggle OFF.</li>
                <li>If using Brave Browser, toggle off <strong>Brave Shields</strong> for this site.</li>
              </ul>
            </div>

            {lastCheckMessage && (
              <p className="text-xs text-rose-400 font-semibold mb-3">
                {lastCheckMessage}
              </p>
            )}

            <button
              id="btn-verify-adblock"
              disabled={isChecking}
              onClick={async () => {
                setIsChecking(true);
                const blocked = await detectAdBlocker();
                setIsAdBlockerActive(blocked);
                setIsChecking(false);
                if (blocked) {
                  setLastCheckMessage('Ad blocker is still detected. Please disable it and try again.');
                } else {
                  setLastCheckMessage(null);
                }
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2.5 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Verifying...' : 'Verify & Continue'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
