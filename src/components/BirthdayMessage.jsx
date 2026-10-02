import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';

export function BirthdayMessage({ onOpenEnvelope }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const wishRef = useRef(null);
  const transitionRef = useRef(null);
  const buttonRef = useRef(null);

  const {
    headline = "Happy Birthday, Aditi! 🎉",
    wishText = "I wish all your wishes come true, and that God gives you the strength and power to achieve everything you want.",
    transitionText = "But that's not all I wanted to tell you...",
    letterButtonText = "You have a letter ✉️",
  } = birthdayConfig.messages;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Title entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 25, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'back.out(1.4)', delay: 0.1 }
      );

      // 2. Heartfelt wish text
      gsap.fromTo(
        wishRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.45 }
      );

      // 3. Narrative transition prompt
      gsap.fromTo(
        transitionRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
      );

      // 4. Envelope Button
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)', delay: 1.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-8 sm:top-12 inset-x-0 flex flex-col items-center justify-center text-center px-5 pointer-events-none z-30"
    >
      {/* Celebratory ambient radial glow */}
      <div className="absolute -inset-10 bg-gradient-radial from-amber-500/25 via-pink-500/10 to-transparent blur-3xl rounded-full -z-10" />

      {/* Top ribbon pill */}
      <div className="inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-medium tracking-wider uppercase backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>A Wish Made True</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </div>

      {/* Main Headline: Happy Birthday, Aditi! */}
      <h1
        ref={titleRef}
        className="font-serif font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(234,179,8,0.4)] px-2"
        style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', lineHeight: 1.15 }}
      >
        {headline}
      </h1>

      {/* Heartfelt Birthday Blessing */}
      <p
        ref={wishRef}
        className="mt-3 text-sm sm:text-base md:text-lg text-slate-200/95 font-light max-w-sm sm:max-w-md tracking-wide px-3 leading-relaxed drop-shadow"
      >
        {wishText}
      </p>

      {/* Narrative Transition: "But that's not all I wanted to tell you..." */}
      <p
        ref={transitionRef}
        className="mt-3 text-xs sm:text-sm font-handwriting text-amber-300/90 text-lg sm:text-xl tracking-wide"
      >
        {transitionText}
      </p>

      {/* Action button to open envelope */}
      <div ref={buttonRef} className="mt-4 pointer-events-auto">
        <button
          onClick={onOpenEnvelope}
          className="h-13 min-h-[50px] inline-flex items-center justify-center gap-2.5 px-6 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-sm sm:text-base font-bold shadow-xl shadow-amber-500/30 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-amber-400/50 animate-pulse-subtle"
          aria-label="Open your birthday envelope"
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{letterButtonText}</span>
        </button>
      </div>
    </div>
  );
}
