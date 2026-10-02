import { useEffect } from 'react';
import { triggerCelebrationConfetti } from '../utils/celebration';

/**
 * Confetti trigger component that fires celebratory bursts when activated.
 */
export function Confetti({ active = false }) {
  useEffect(() => {
    if (active) {
      triggerCelebrationConfetti();
    }
  }, [active]);

  return null;
}
