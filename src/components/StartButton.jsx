import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function StartButton({ onStart }) {
  return (
    <div className="absolute inset-x-0 bottom-0 pb-safe pb-8 sm:pb-12 flex flex-col items-center justify-end text-center px-6 z-20 pointer-events-auto">
      {/* Small top cue */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs font-medium tracking-wide mb-2.5 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Make a wish ✨</span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-100 mb-5 drop-shadow-md">
        Ready to make a wish?
      </h2>

      {/* Large Mobile Touch Target: 56px height, rounded full */}
      <button
        onClick={onStart}
        className="group relative w-full max-w-[280px] h-14 inline-flex items-center justify-center gap-3 px-8 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/30 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
        aria-label="Start birthday experience"
      >
        <span>Start</span>
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-active:translate-x-1" />
      </button>

      <p className="mt-3 text-[11px] text-slate-400/80 max-w-xs font-light">
        Hold phone naturally and blow toward the mic
      </p>
    </div>
  );
}
