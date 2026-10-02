import React from 'react';
import { Activity, Music, Mic } from 'lucide-react';

export function DebugPanel({
  debugData,
  isListening,
  isCalibrating,
  songSyncData = {},
}) {
  const {
    rms = 0,
    noiseFloor = 0,
    threshold = 0,
    blowIntensity = 0,
    detectionState = 'IDLE',
    bandEnergy = 0,
  } = debugData || {};

  const {
    currentTime = 0,
    duration = 0,
    isPlaying = false,
    isCandlePrep = false,
    isCandleReady = false,
    isCandleCount = false,
    isBlowWindow = false,
  } = songSyncData;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed top-4 left-4 z-50 p-3.5 rounded-xl bg-slate-950/95 border border-amber-500/30 backdrop-blur-md text-xs font-mono text-slate-200 shadow-2xl max-w-xs pointer-events-auto">
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-white/10">
        <span className="flex items-center gap-1.5 font-semibold text-amber-400">
          <Activity className="w-3.5 h-3.5" />
          <span>Audio Diagnostics</span>
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            isCalibrating
              ? 'bg-blue-500/20 text-blue-300'
              : isListening
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-slate-700 text-slate-400'
          }`}
        >
          {isCalibrating ? 'CALIBRATING' : isListening ? 'MIC ACTIVE' : 'MIC IDLE'}
        </span>
      </div>

      {/* Song Sync Section */}
      <div className="mb-2.5 pb-2 border-b border-white/10 space-y-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
          <Music className="w-3 h-3" />
          <span>Song Sync: {isPlaying ? 'PLAYING' : 'PAUSED'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Song Time:</span>
          <span className="text-amber-200 font-bold">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Song Cue:</span>
          <span className="font-semibold text-sky-300">
            {isBlowWindow
              ? 'BLOW WINDOW'
              : isCandleCount
              ? 'COUNTDOWN'
              : isCandleReady
              ? 'READY'
              : isCandlePrep
              ? 'PREP WISH'
              : 'NORMAL TRACK'}
          </span>
        </div>
      </div>

      {/* Microphone Analysis Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
          <Mic className="w-3 h-3" />
          <span>Blow Detection</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">RMS Amplitude:</span>
          <span className="text-amber-200">{rms.toFixed(4)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Noise Floor:</span>
          <span>{noiseFloor.toFixed(4)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Blow Threshold:</span>
          <span>{threshold.toFixed(4)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Band Energy:</span>
          <span>{bandEnergy.toFixed(3)}</span>
        </div>

        <div className="flex justify-between font-semibold">
          <span className="text-slate-400">Blow Intensity:</span>
          <span
            className={
              blowIntensity > 0.7
                ? 'text-red-400'
                : blowIntensity > 0.2
                ? 'text-amber-300'
                : 'text-slate-400'
            }
          >
            {(blowIntensity * 100).toFixed(0)}%
          </span>
        </div>

        {/* Intensity Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-75 ${
              blowIntensity >= 0.7
                ? 'bg-red-500'
                : blowIntensity >= 0.2
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.round(blowIntensity * 100)}%` }}
          />
        </div>

        <div className="flex justify-between pt-1">
          <span className="text-slate-400">State:</span>
          <span className="text-sky-300 font-bold">{detectionState}</span>
        </div>
      </div>
    </div>
  );
}
