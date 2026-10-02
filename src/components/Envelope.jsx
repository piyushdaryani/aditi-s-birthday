import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export function Envelope({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTap = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Smooth transition: flap opens (600ms) -> letter slides out -> onOpen triggers
    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-[#08070B]/90 backdrop-blur-xl animate-fade-in">
      {/* Top instruction text */}
      <div className="flex flex-col items-center text-center mb-6 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs font-medium tracking-wide mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>A handwritten note for you</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-100">
          Open it ✉️
        </h2>
        <p className="text-xs text-slate-400 mt-1">Tap the envelope to unseal</p>
      </div>

      {/* Interactive Envelope Container */}
      <div
        onClick={handleTap}
        role="button"
        tabIndex={0}
        aria-label="Tap to open birthday envelope"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTap();
          }
        }}
        className={`relative cursor-pointer transition-transform duration-300 active:scale-98 animate-float-gentle focus:outline-none`}
        style={{
          width: 'min(86vw, 400px)',
          height: 'min(58vw, 260px)',
        }}
      >
        {/* Soft Ambient Shadow & Glow behind envelope */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-amber-500/20 rounded-2xl blur-2xl -z-10" />

        {/* Envelope Back Body */}
        <div className="absolute inset-0 rounded-2xl bg-[#1C1628] border border-amber-400/25 shadow-2xl overflow-hidden">
          {/* Inner lining pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-purple-950/20" />
        </div>

        {/* The Letter emerging from inside (slides up when opened) */}
        <div
          className={`absolute inset-x-4 top-2 rounded-t-xl bg-[#FAF6EE] p-4 shadow-md transition-all duration-700 ease-out border border-[#E8DCB8] flex flex-col items-center justify-start ${
            isOpen
              ? '-translate-y-24 sm:-translate-y-32 scale-105 opacity-100 shadow-2xl'
              : 'translate-y-2 opacity-85'
          }`}
          style={{ height: '85%' }}
        >
          {/* Letter preview lines */}
          <span className="font-handwriting text-xl text-[#78350F] font-bold">
            To one of my favourite people...
          </span>
          <div className="w-full space-y-1.5 mt-3 opacity-30">
            <div className="h-1.5 bg-[#8C6D46] rounded-full w-4/5" />
            <div className="h-1.5 bg-[#8C6D46] rounded-full w-full" />
            <div className="h-1.5 bg-[#8C6D46] rounded-full w-2/3" />
          </div>
        </div>

        {/* Envelope Bottom & Side Triangular Folds */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden z-10">
          {/* Left fold */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
              background: 'linear-gradient(135deg, #261E38 0%, #1E172E 100%)',
              borderRight: '1px solid rgba(253, 224, 71, 0.08)',
            }}
          />
          {/* Right fold */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
              background: 'linear-gradient(-135deg, #2A213D 0%, #201831 100%)',
              borderLeft: '1px solid rgba(253, 224, 71, 0.08)',
            }}
          />
          {/* Bottom fold */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)',
              background: 'linear-gradient(to top, #2F2445 0%, #221A34 100%)',
              borderTop: '1px solid rgba(253, 224, 71, 0.15)',
            }}
          />
        </div>

        {/* Top Flap (flips open in 3D) */}
        <div
          className="absolute inset-x-0 top-0 origin-top transition-transform duration-700 ease-in-out z-20"
          style={{
            height: '55%',
            transformStyle: 'preserve-3d',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
          }}
        >
          <div
            className="w-full h-full shadow-lg"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(to bottom, #382B52 0%, #291F3D 100%)',
              borderBottom: '1px solid rgba(253, 224, 71, 0.25)',
            }}
          />
        </div>

        {/* Wax Seal with monogram/heart (breaks and fades on open) */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-400 ${
            isOpen ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-red-600 via-amber-700 to-red-800 shadow-xl border-2 border-amber-400/40 flex items-center justify-center text-amber-200">
            <Heart className="w-5 h-5 fill-amber-200/90 text-amber-100" />
            <span className="absolute -inset-1 rounded-full border border-amber-300/30 animate-pulse-subtle" />
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400/70">
        Handcrafted with love for this special day
      </p>
    </div>
  );
}
