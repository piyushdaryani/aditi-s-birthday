import React from 'react';
import { Mic, MicOff, Wind, ShieldCheck, RefreshCw } from 'lucide-react';
import { EXPERIENCE_STATES } from '../utils/constants';

export function MicrophonePermission({
  experienceState,
  isListening,
  isCalibrating,
  calibrationProgress,
  micError,
  blowIntensity,
  onRequestMic,
  onManualBlow,
  // Song synchronization cue props
  songCues = {},
}) {
  const isExtinguished =
    experienceState === EXPERIENCE_STATES.EXTINGUISHED ||
    experienceState === EXPERIENCE_STATES.CELEBRATION ||
    experienceState === EXPERIENCE_STATES.ENVELOPE ||
    experienceState === EXPERIENCE_STATES.LETTER;

  if (isExtinguished) {
    return null;
  }

  // 1. Microphone Error / Permission Denied State
  if (micError) {
    return (
      <div className="absolute inset-x-0 bottom-0 pb-safe pb-8 sm:pb-12 flex flex-col items-center justify-end text-center px-5 z-20 pointer-events-auto">
        <div className="w-full max-w-[350px] p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-red-500/25 shadow-2xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-2.5">
            <MicOff className="w-5 h-5" />
          </div>

          <h3 className="font-serif text-lg font-semibold text-slate-100 mb-1.5">
            Couldn&apos;t hear that — try again
          </h3>

          <p className="text-xs text-slate-300/90 mb-4 leading-relaxed">
            {micError.message || 'Microphone access is needed to blow out the candle.'}
          </p>

          <div className="flex flex-col gap-2.5 w-full">
            {/* Primary fallback button */}
            <button
              onClick={onManualBlow}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-95 transition-transform"
              aria-label="Tap to blow it out"
            >
              <Wind className="w-4 h-4" />
              <span>Tap to blow it out</span>
            </button>

            {/* Try mic again */}
            <button
              onClick={onRequestMic}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 active:bg-white/20 border border-white/15 text-slate-200 text-xs font-medium transition-colors"
              aria-label="Try microphone permission again"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Microphone Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Microphone Calibration State
  if (isCalibrating) {
    return (
      <div className="absolute inset-x-0 bottom-0 pb-safe pb-10 sm:pb-14 flex flex-col items-center justify-end text-center px-6 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-medium shadow-xl">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
          </div>
          <span>Listening to your surroundings...</span>
        </div>
        <div className="w-40 h-1 bg-white/10 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-150"
            style={{ width: `${Math.round(calibrationProgress * 100)}%` }}
          />
        </div>
      </div>
    );
  }

  // 3. Listening & Blowing State
  if (isListening || experienceState === EXPERIENCE_STATES.LISTENING || experienceState === EXPERIENCE_STATES.BLOWING) {
    const isActivelyBlowing = blowIntensity > 0.08;

    // Determine prompt text dynamically synced with the song without overriding mic truth
    let promptText = 'Now blow out the candle 🕯️';
    if (isActivelyBlowing) {
      promptText = 'Blowing... Keep going! 💨';
    } else if (songCues.isCandleCount) {
      promptText = 'One... Two... Three... 💨';
    } else if (songCues.isBlowWindow) {
      promptText = 'Blow the candle now! 🎂';
    } else if (songCues.isCandleReady) {
      promptText = 'Ready? 🕯️';
    } else if (songCues.isCandlePrep) {
      promptText = 'Make a wish... ✨';
    }

    return (
      <div className="absolute inset-x-0 bottom-0 pb-safe pb-8 sm:pb-12 flex flex-col items-center justify-end text-center px-5 z-20 pointer-events-none">
        {/* Subtle, beautiful prompt */}
        <div
          className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full backdrop-blur-xl border transition-all duration-200 shadow-2xl ${
            isActivelyBlowing
              ? 'bg-amber-500/25 border-amber-400/70 scale-105 shadow-amber-500/25'
              : songCues.isCandleCount || songCues.isBlowWindow
              ? 'bg-amber-500/20 border-amber-400/50 scale-102 shadow-amber-500/20 animate-pulse'
              : 'bg-slate-900/80 border-white/15'
          }`}
        >
          {/* Subtle live microphone aura */}
          <div className="relative flex items-center justify-center w-4 h-4">
            <span
              className={`absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 transition-transform ${
                isActivelyBlowing ? 'scale-150 animate-ping' : 'animate-pulse'
              }`}
            />
            <Mic
              className={`w-3.5 h-3.5 relative z-10 transition-colors ${
                isActivelyBlowing ? 'text-amber-100' : 'text-amber-400'
              }`}
            />
          </div>

          <span className="text-sm sm:text-base font-serif text-slate-100 tracking-wide font-medium">
            {promptText}
          </span>
        </div>

        {/* Fallback button: Tap to blow it out */}
        <button
          onClick={onManualBlow}
          className="mt-3.5 pointer-events-auto min-h-[44px] px-4 py-2 inline-flex items-center gap-1.5 text-xs text-amber-300/90 active:text-amber-200 underline decoration-amber-500/50 transition-colors"
          aria-label="Tap to blow it out"
        >
          <span>Tap to blow it out</span>
        </button>

        {/* Privacy note */}
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400/80">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400/60" />
          <span>Your microphone is used only to detect your blow. No audio is recorded or uploaded.</span>
        </div>
      </div>
    );
  }

  // 4. Initial Mic Permission Request State (MIC_PERMISSION)
  return (
    <div className="absolute inset-x-0 bottom-0 pb-safe pb-8 sm:pb-12 flex flex-col items-center justify-end text-center px-5 z-20 pointer-events-auto">
      <div className="w-full max-w-[340px] p-5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center">
        <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-2.5">
          <Mic className="w-5 h-5" />
        </div>

        <h3 className="font-serif text-lg font-semibold text-slate-100 mb-1">
          Blow Out the Candle
        </h3>

        <p className="text-xs text-slate-300/80 mb-4 leading-relaxed">
          Allow microphone access to blow against your mic and extinguish the flame.
        </p>

        {/* 52px Touch Target Button */}
        <button
          onClick={onRequestMic}
          className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-95 transition-transform"
          aria-label="Enable microphone"
        >
          <Mic className="w-4 h-4" />
          <span>Enable Microphone</span>
        </button>

        {/* Fallback button if user prefers not to use mic */}
        <button
          onClick={onManualBlow}
          className="mt-2.5 min-h-[44px] flex items-center justify-center text-xs text-slate-400 active:text-amber-300 transition-colors"
          aria-label="Continue without microphone"
        >
          Or continue without microphone
        </button>

        <p className="mt-2 text-[10px] text-slate-400/75 flex items-center gap-1">
          <ShieldCheck className="w-3 3 text-emerald-400/70" />
          <span>No audio is recorded or uploaded.</span>
        </p>
      </div>
    </div>
  );
}
