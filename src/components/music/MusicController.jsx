import React from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

export function MusicController({
  isPlaying,
  isMuted,
  hasStarted,
  hasError,
  onTogglePlay,
  onToggleMute,
}) {
  // If audio failed to load or is disabled in config, don't show controls
  if (hasError || !birthdayConfig.music.enabled) {
    return null;
  }

  return (
    <div className="fixed top-3 right-3 pt-safe pr-safe z-50 flex items-center gap-2 pointer-events-auto select-none">
      {/* If audio has not started yet (e.g. mobile autoplay blocked before start tap), show subtle 'Play song' pill */}
      {!hasStarted && (
        <button
          onClick={onTogglePlay}
          className="h-11 min-h-[44px] px-3.5 rounded-full bg-slate-900/80 hover:bg-slate-900/95 active:scale-95 border border-amber-400/30 text-amber-200 text-xs font-medium backdrop-blur-md shadow-lg flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          aria-label="Play birthday song"
        >
          <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Play song</span>
        </button>
      )}

      {/* Discrete floating music controls (Once song has started or playing) */}
      {hasStarted && (
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950/75 border border-white/10 backdrop-blur-md shadow-xl">
          {/* Play / Pause toggle */}
          <button
            onClick={onTogglePlay}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-300 hover:text-amber-200 active:text-amber-300 transition-colors focus:outline-none"
            aria-label={isPlaying ? 'Pause birthday music' : 'Resume birthday music'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Mute / Unmute toggle */}
          <button
            onClick={onToggleMute}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-300 hover:text-amber-200 active:text-amber-300 transition-colors focus:outline-none"
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Subtle soundwave equalizer animation indicator when playing */}
          {isPlaying && !isMuted && (
            <div className="flex items-end gap-0.5 h-3 pr-2.5 pl-0.5">
              <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-amber-300 rounded-full animate-ping" />
              <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
