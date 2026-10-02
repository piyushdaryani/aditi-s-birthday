import confetti from 'canvas-confetti';

/**
 * Fires a sequence of confetti bursts:
 * 1. Warm golden sparklers from bottom center
 * 2. Left and right celebratory champagne and pastel cannons
 * 3. Soft drifting confetti flutter
 */
export function triggerCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.72 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // 1. Initial burst with gold & warm amber
  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    colors: ['#FFD700', '#FFA500', '#FFE4B5', '#FFF8DC'],
    scalar: 1.1,
  });

  // 2. Wider burst with vibrant festive accents
  fire(0.2, {
    spread: 60,
    colors: ['#FF6B8B', '#FFD166', '#06D6A0', '#118AB2', '#9D4EDD'],
  });

  // 3. High velocity scatter
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FFE66D', '#FF6B6B', '#4ECDC4', '#FFFFFF'],
  });

  // 4. Slow floating discs
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    shapes: ['circle'],
    colors: ['#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    scalar: 1.2,
  });

  // 5. Starbursts
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    shapes: ['star'],
    colors: ['#FFD700', '#FFF', '#FFB703'],
    scalar: 0.9,
  });

  // Side cannons 400ms later for depth
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors: ['#FFD700', '#FF69B4', '#00F0FF'],
      zIndex: 9999,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors: ['#FFD700', '#FF69B4', '#00F0FF'],
      zIndex: 9999,
    });
  }, 450);
}

/**
 * Attempts to play `/audio/birthday.mp3`.
 * If missing or blocked, synthesizes a celebratory, ethereal musical chime
 * using Web Audio API so the celebration always feels rewarding and magical.
 */
export async function playCelebrationAudio(audioContext = null) {
  try {
    const audio = new Audio('/audio/birthday.mp3');
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      await playPromise;
      return;
    }
  } catch (err) {
    // Graceful fallback to Web Audio API synthesis
  }

  // Fallback: Web Audio synthesizer for gentle, heartwarming birthday chime
  try {
    const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Gentle musical notes: C5, E5, G5, B5, C6 (Major 7th sparkle)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 2.0);
    });
  } catch (e) {
    // Audio is completely optional, do not throw
    console.debug('Optional celebration audio could not play:', e);
  }
}
