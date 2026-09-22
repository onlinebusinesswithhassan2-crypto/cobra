import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Gift, Sparkles, CheckCircle2, ExternalLink, Play, Loader2 } from 'lucide-react';
import { RewardType } from '../types';
import { sounds } from '../utils/audio';
import { fetchLiveGoogleVideoAd, GoogleAdCreative } from '../services/adMobService';

export type { RewardType };

interface AdMobRewardedModalProps {
  isOpen: boolean;
  rewardType: RewardType;
  rewardAmount: number;
  onRewardEarned: (rewardType: RewardType, amount: number) => void;
  onClose: () => void;
  adUnitId?: string;
}

export const AdMobRewardedModal: React.FC<AdMobRewardedModalProps> = ({
  isOpen,
  rewardType,
  rewardAmount,
  onRewardEarned,
  onClose,
  adUnitId = 'ca-app-pub-3940256099942544/5224354917',
}) => {
  const [adData, setAdData] = useState<GoogleAdCreative | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(8);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch real Google VAST Video ad from internet
  useEffect(() => {
    if (!isOpen) {
      setAdData(null);
      setIsFinished(false);
      setSecondsLeft(8);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setIsFinished(false);

    fetchLiveGoogleVideoAd(false).then((data) => {
      if (!isMounted) return;
      setAdData(data);
      setSecondsLeft(data.durationSeconds || 8);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Video Time & Countdown handling
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || adData?.durationSeconds || 8;
    const remaining = Math.max(0, Math.ceil(duration - current));
    setSecondsLeft(remaining);

    if (current >= duration - 0.5 || remaining === 0) {
      if (!isFinished) {
        setIsFinished(true);
        sounds.playBonusScore();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsFinished(true);
    setSecondsLeft(0);
    sounds.playBonusScore();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleClaim = () => {
    onRewardEarned(rewardType, rewardAmount);
    onClose();
  };

  if (!isOpen) return null;

  const rewardLabel =
    rewardType === 'hint'
      ? `+${rewardAmount} Free Hint`
      : rewardType === 'heart'
      ? `+${rewardAmount} Extra Life`
      : `2X Score Double!`;

  return (
    <div
      id="admob-rewarded-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/95 backdrop-blur-md animate-fade-in text-white select-none"
    >
      <div className="w-full max-w-sm bg-[#121212] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[480px] relative">
        {/* Google AdMob Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1f1f1f] border-b border-[#2d2d2d] z-20">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#fbbc04] text-[#202124] font-black text-[10px] uppercase font-sans tracking-tight">
              Ad
            </span>
            <span className="text-[11px] text-[#bdc1c6] font-medium truncate max-w-[140px]">
              Google AdMob Test
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* AdChoices Link */}
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

            {/* Close button (only unlocked when finished) */}
            {isFinished ? (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-[#bdc1c6] hover:text-white hover:bg-[#2d2d2d]"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-[10px] font-mono text-[#fbbc04] font-bold px-1.5 py-0.5 rounded bg-[#2a2a2a]">
                {secondsLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[280px]">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
              <span className="text-xs font-medium">Fetching Google Test Ad from network...</span>
            </div>
          ) : adData ? (
            <video
              ref={videoRef}
              src={adData.videoUrl}
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-contain"
            />
          ) : null}

          {/* Reward Status Pill */}
          <div className="absolute top-2 left-2 z-10">
            {isFinished ? (
              <span className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow">
                <CheckCircle2 className="w-3 h-3" /> Reward Unlocked
              </span>
            ) : (
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[#e8eaed] text-[10px] font-mono border border-white/10">
                Watch until end for {rewardLabel}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-3 bg-[#181818] border-t border-[#2d2d2d] flex flex-col gap-2 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-[#303134] flex items-center justify-center text-xs">
                🎁
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{rewardLabel}</span>
                <span className="text-[9px] text-[#9aa0a6] font-mono">
                  Unit: {adUnitId.slice(0, 24)}...
                </span>
              </div>
            </div>

            <a
              href={adData?.clickThroughUrl || 'https://play.google.com/store/apps'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#8ab4f8] hover:underline flex items-center gap-0.5"
            >
              <span>Learn More</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Claim / Reward Button */}
          {isFinished ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Claim Reward Now</span>
            </button>
          ) : (
            <div className="w-full py-2 bg-[#2a2a2a] text-[#80868b] text-center text-xs font-bold rounded-xl font-mono">
              Reward will unlock in {secondsLeft} seconds...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
