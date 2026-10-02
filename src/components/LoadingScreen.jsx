import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08070B] text-slate-200">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🎂
        </div>
      </div>
      <p className="font-serif text-lg text-amber-200/90 tracking-wide">
        Preparing your birthday surprise...
      </p>
    </div>
  );
}
