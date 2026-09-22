import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Info } from 'lucide-react';

interface AdMobBannerProps {
  adUnitId?: string;
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  adUnitId = 'ca-app-pub-3940256099942544/6300978111',
  className = '',
}) => {
  const [closed, setClosed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // Attempt Google AdSense/AdMob web script initialization
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      // Ignore if ads blocked
    }
  }, []);

  if (closed) return null;

  const slotId = adUnitId.includes('/') ? adUnitId.split('/')[1] : '6300978111';

  return (
    <div
      id="admob-banner-container"
      className={`w-full max-w-[360px] mx-auto my-1 px-1 select-none ${className}`}
    >
      <div className="relative w-full h-[54px] bg-[#202124] border border-[#3c4043] rounded-lg flex items-center justify-between shadow-lg overflow-hidden">
        {/* Google Official Ad Tag Top Left */}
        <div className="absolute top-0.5 left-1 z-20 flex items-center gap-1 pointer-events-none">
          <span className="px-1 py-[1px] bg-[#fbbc04] text-[#202124] font-black text-[8px] rounded uppercase font-sans tracking-tight">
            Ad
          </span>
          <span className="text-[8px] text-[#9aa0a6] font-mono">Google Test</span>
        </div>

        {/* Google AdChoices Icon Link Top Right */}
        <div className="absolute top-0.5 right-6 z-20">
          <a
            href="https://adssettings.google.com/whythisad"
            target="_blank"
            rel="noopener noreferrer"
            title="Google AdChoices"
            className="flex items-center text-[#9aa0a6] hover:text-white"
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 2a.75.75 0 110 1.5A.75.75 0 016 3zm.75 5.5h-1.5v-3h1.5v3z" />
            </svg>
          </a>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Close Google ad"
          className="absolute top-0.5 right-1 z-20 w-4 h-4 rounded text-[#9aa0a6] hover:text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Official Google AdSense / AdMob Ins Element */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden pt-2.5">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '320px', height: '50px' }}
            data-ad-client="ca-pub-3940256099942544"
            data-ad-slot={slotId}
            data-ad-test="on"
            data-full-width-responsive="true"
          />

          {/* Live Google AdMob Interactive Creative */}
          <div className="absolute inset-0 flex items-center justify-between px-3 pt-2 pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Google Play / AdMob Official Badge Icon */}
              <div className="w-8 h-8 rounded-lg bg-[#303134] border border-[#5f6368] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M4 3.5v17l13.5-8.5L4 3.5z" fill="#4285F4" />
                  <path d="M14 12l3.5-3.5L4 3.5 14 12z" fill="#34A853" />
                  <path d="M14 12L4 20.5l13.5-5L14 12z" fill="#EA4335" />
                  <path d="M17.5 8.5L14 12l3.5 3.5 2.5-1.5c1-.6 1-2.4 0-3l-2.5-1z" fill="#FBBC04" />
                </svg>
              </div>

              <div className="flex flex-col min-w-0 truncate">
                <span className="text-[11px] font-bold text-[#e8eaed] truncate font-sans">
                  Google Play Games • Test Ad
                </span>
                <span className="text-[9px] text-[#9aa0a6] truncate font-mono">
                  Unit: {adUnitId.slice(0, 26)}...
                </span>
              </div>
            </div>

            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[10px] font-bold rounded uppercase tracking-wide shrink-0 transition-colors shadow flex items-center gap-1"
            >
              <span>Install</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
