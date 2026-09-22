import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import { fetchLiveGoogleVideoAd, GoogleAdCreative } from '../services/adMobService';

interface AdMobInterstitialModalProps {
  isOpen: boolean;
  onClose: () => void;
  adUnitId?: string;
  levelNumber?: number;
}

export const AdMobInterstitialModal: React.FC<AdMobInterstitialModalProps> = ({
  isOpen,
  onClose,
  adUnitId = 'ca-app-pub-3940256099942544/1033173712',
  levelNumber = 1,
}) => {
  const [adData, setAdData] = useState<GoogleAdCreative | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setAdData(null);
      setSecondsRemaining(5);
      setCanSkip(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setSecondsRemaining(5);
    setCanSkip(false);

    // Fetch skippable Google test ad
    fetchLiveGoogleVideoAd(true).then((data) => {
      if (!isMounted) return;
      setAdData(data);
      setLoading(false);
    });

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [isOpen]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="admob-interstitial-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/95 backdrop-blur-md animate-fade-in text-white select-none"
    >
      <div className="w-full max-w-sm bg-[#121212] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[480px] relative">
        {/* Google Ad Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1f1f1f] border-b border-[#2d2d2d] z-20">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#fbbc04] text-[#202124] font-black text-[10px] uppercase font-sans tracking-tight">
              Ad
            </span>
            <span className="text-[11px] text-[#bdc1c6] font-medium truncate max-w-[140px]">
              Google Interstitial
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* AdChoices */}
            <a
              href="https://adssettings.google.com/whythisad"
              target="_blank"
              rel="noopener noreferrer"
              title="Google AdChoices"
              className="text-[#9aa0a6] hover:text-white"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 2a.75.75 0 110 1.5A.75.75 0 016 3zm.75 5.5h-1.5v-3h1.5v3z" />
              </svg>
            </a>

            {/* Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 rounded text-[#bdc1c6] hover:text-white hover:bg-[#2d2d2d]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Skip or Timer */}
            {canSkip ? (
              <button
                id="btn-close-interstitial"
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#303134] hover:bg-[#3c4043] active:scale-95 text-[11px] font-bold text-white flex items-center gap-1 shadow border border-[#5f6368] cursor-pointer"
              >
                <span>Skip</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-[10px] font-mono text-[#fbbc04] font-bold px-1.5 py-0.5 rounded bg-[#2a2a2a]">
                Skip in {secondsRemaining}s
              </div>
            )}
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
              <span className="text-xs font-medium">Loading Google test ad from internet...</span>
            </div>
          ) : adData ? (
            <video
              ref={videoRef}
              src={adData.videoUrl}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-3 bg-[#181818] border-t border-[#2d2d2d] flex items-center justify-between z-20">
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-white truncate">
              {adData?.adTitle || 'Google Test Advertisement'}
            </span>
            <span className="text-[9px] text-[#9aa0a6] font-mono truncate">
              Unit: {adUnitId.slice(0, 24)}...
            </span>
          </div>

          <a
            href={adData?.clickThroughUrl || 'https://play.google.com/store/apps'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold rounded-lg uppercase tracking-wide shrink-0 transition-colors shadow flex items-center gap-1"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
