import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export function LandscapeNotice() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if mobile phone width/height ratio indicates landscape mode
      const isMobileLandscape =
        window.innerWidth > window.innerHeight &&
        window.innerHeight < 600 &&
        'ontouchstart' in window;
      setIsLandscape(isMobileLandscape);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="fixed top-3 inset-x-4 z-50 pointer-events-none flex justify-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-200 text-xs font-medium shadow-2xl backdrop-blur-md animate-bounce">
        <Smartphone className="w-4 h-4 animate-pulse" />
        <span>Turn your phone upright for the best experience</span>
      </div>
    </div>
  );
}
