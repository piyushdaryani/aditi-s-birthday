import React, { useEffect, useRef } from 'react';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';

/**
 * Individual physical photograph styled as a real scrapbook print
 * with authentic paper borders, washi tape, and handwritten ink caption.
 */
function ScrapbookPhoto({ item, index, priority = false }) {
  const isProminent = item.prominent;

  return (
    <div
      className={`scrapbook-photo-card relative mx-auto my-7 sm:my-9 transition-transform duration-500 ease-out ${
        isProminent
          ? 'w-[88%] sm:w-[84%] max-w-[420px]'
          : 'w-[82%] sm:w-[78%] max-w-[370px]'
      }`}
    >
      {/* Physical Photo Frame */}
      <div
        className={`relative p-3 sm:p-3.5 pb-4 sm:pb-5 bg-[#FFFDF9] rounded-sm shadow-[0_8px_24px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.08)] border border-[#EBE4D5] ${item.rotation} hover:rotate-0 transition-transform duration-300`}
      >
        {/* Semi-transparent washi tape holding photo */}
        <div
          className="washi-tape"
          style={{
            transform: `translateX(-50%) rotate(${item.tapeAngle || '0deg'})`,
          }}
        />

        {/* Photo Image with authentic photographic gloss & soft inner border */}
        <div className={`relative w-full ${item.aspect || 'aspect-[3/4]'} bg-stone-100 overflow-hidden rounded-[2px] shadow-inner`}>
          <img
            src={item.src}
            alt={item.alt || item.caption}
            loading={priority ? 'eager' : 'lazy'}
            style={{ objectPosition: item.objectPosition || 'center center' }}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Handwritten Ink Caption */}
        <div className="mt-3 px-1 text-center">
          <p className="font-handwriting text-[19px] sm:text-[21px] md:text-[22px] text-[#3D2C1E] leading-snug tracking-wide select-text">
            {item.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Letter({ onReplay }) {
  const containerRef = useRef(null);
  const { letter, messages } = birthdayConfig;
  const photos = letter?.photos || [];

  // Map photos by ID for precise emotional narrative placement
  const photoMap = React.useMemo(() => {
    const map = {};
    photos.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [photos]);

  const p6 = photoMap[6]; // Childhood
  const p5 = photoMap[5]; // Personality / Smile
  const p3 = photoMap[3]; // Memory / Christmas
  const p8 = photoMap[8]; // Family
  const p7 = photoMap[7]; // Work recognition
  const p9 = photoMap[9]; // Piyush + Aditi
  const p1 = photoMap[1]; // Future

  // IntersectionObserver for staggered, soft scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    );

    const items = containerRef.current?.querySelectorAll('.reveal-on-scroll');
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen py-8 sm:py-14 px-3 sm:px-4 flex flex-col items-center bg-[#08070B] overflow-x-hidden"
    >
      {/* Ambient warm background glow */}
      <div className="fixed inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* The Parchment Letter Paper Container */}
      <article
        className="paper-texture relative rounded-2xl p-6 sm:p-10 md:p-14 text-stone-900 border border-[#E6D9C0] shadow-2xl mb-12"
        style={{
          width: 'min(92vw, 700px)',
          margin: '0 auto',
        }}
      >
        {/* Vintage Postmark stamp top right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-stone-400/40 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center text-[9px] sm:text-[10px] uppercase font-mono text-stone-500 rotate-12 select-none pointer-events-none">
          <span>ADITI</span>
          <span className="font-bold">2026</span>
          <span>AIRMAIL</span>
        </div>

        {/* 1. Letter Header in handwritten script */}
        <header className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out mb-6">
          <div className="inline-flex items-center gap-1.5 text-amber-800/80 text-xs tracking-wider uppercase font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Special Delivery for Aditi</span>
          </div>

          <h1 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-amber-950 tracking-tight leading-tight">
            {letter?.greeting || 'To Aditi, one of my favourite people,'}
          </h1>
        </header>

        {/* Section 1: Where she started */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          Happy Birthday Pinky! As another year turns around the sun, I wanted to take a moment to celebrate the person you are, the person you’ve become, and all the little things that make you so genuinely special. The world moves so fast, but today belongs completely to you.
        </p>

        {/* PHOTO 6 — Childhood photo (Prominent) */}
        {p6 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p6} index={0} priority={true} />
          </div>
        )}

        {/* Section 2: Who she became & Her personality */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          Thinking back over the memories we’ve shared always brings the biggest smile to my face. Whether it’s talking for hours about our wildest dreams or just sharing laughs over the smallest things, your presence is an absolute gift to me.
        </p>

        {/* PHOTO 5 — Happy/natural Aditi photo */}
        {p5 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p5} index={1} />
          </div>
        )}

        {/* Section 3: The little memories */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          You have this effortless ability to bring warmth and energy wherever you walk in. Even on ordinary days, you make things feel memorable and lighthearted just by being yourself.
        </p>

        {/* PHOTO 3 — Christmas/tree memory photo */}
        {p3 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p3} index={2} />
          </div>
        )}

        {/* Section 4: The people who make a place feel like home (Family) */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          There’s something so grounding about the love that surrounds you. The ones who have stood by your side through every single chapter, celebrating your joy and keeping you rooted in who you are.
        </p>

        {/* PHOTO 8 — Family photo */}
        {p8 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p8} index={3} />
          </div>
        )}

        {/* Section 5: Something she is proud of / Work recognition */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          I admire your resilience and the heart you pour into everything you care about. Seeing you dedicate yourself, overcome hurdles, and watch your hard work finally get the recognition and pride it deserves is something truly special.
        </p>

        {/* PHOTO 7 — Work recognition / achievement (Prominent) */}
        {p7 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p7} index={4} />
          </div>
        )}

        {/* Section 6: The friendship we share (Piyush & Aditi) */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          Through all the seasons, the late-night talks, the spontaneous plans, and the quiet comfort of knowing someone truly gets you, having you as a Best friend has been one of the best parts of my journey.
        </p>

        {/* PHOTO 9 — Piyush and Aditi together (Prominent) */}
        {p9 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p9} index={5} />
          </div>
        )}

        {/* Section 7: Everything still ahead of her (Future) */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-4">
          May this upcoming year be packed with everything you’ve been hoping for: new places to explore, sudden bursts of inspiration, peaceful mornings, and all the unwritten adventures waiting just around the corner.
        </p>

        {/* PHOTO 1 — Natural/recent Aditi photo (Future) */}
        {p1 && (
          <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <ScrapbookPhoto item={p1} index={6} />
          </div>
        )}

        {/* Closing warm message */}
        <p className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out text-[17px] sm:text-[18px] leading-[1.65] text-stone-800 font-normal mb-6">
          Thank you for simply being you. Never change, and keep shining as brightly as ever.
        </p>

        {/* Final Sign-off in handwritten script */}
        <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out mt-8 pt-4 border-t border-stone-300/60 flex flex-col items-end">
          <p className="font-handwriting text-2xl sm:text-3xl text-amber-950 font-bold flex items-center gap-1.5">
            <span>With all my love & warmest wishes,</span>
            <Heart className="w-5 h-5 fill-red-500 text-red-500 inline" />
          </p>
          <p className="font-handwriting text-3xl sm:text-4xl text-amber-900 font-bold mt-1">
            {letter?.signature || '— Piyush'}
          </p>
        </div>
      </article>

      {/* Replay Section at the very bottom */}
      <div className="reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out flex flex-col items-center justify-center text-center pb-safe pb-12 z-20">
        <p className="text-xs text-slate-400 mb-3 font-light">
          Want to make another wish and blow out the candle again?
        </p>

        {/* 52px Touch Target Replay Button */}
        <button
          onClick={onReplay}
          className="h-13 min-h-[52px] inline-flex items-center justify-center gap-2.5 px-8 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-slate-100 text-sm sm:text-base font-semibold backdrop-blur-md shadow-xl active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-400/40"
          aria-label="Replay the surprise"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" />
          <span>Replay the surprise</span>
        </button>
      </div>
    </div>
  );
}
