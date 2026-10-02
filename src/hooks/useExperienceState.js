import { useState, useCallback } from 'react';
import { EXPERIENCE_STATES } from '../utils/constants';

export function useExperienceState() {
  const [state, setState] = useState(EXPERIENCE_STATES.INTRO);
  const [blowIntensity, setBlowIntensity] = useState(0);

  // Transition from INTRO to Cake Reveal
  const startExperience = useCallback(() => {
    setState(EXPERIENCE_STATES.REVEAL);
    setTimeout(() => {
      setState(EXPERIENCE_STATES.MIC_PERMISSION);
    }, 1600);
  }, []);

  // Called when mic is calibrated and ready
  const microphoneReady = useCallback(() => {
    setState(EXPERIENCE_STATES.READY);
    setTimeout(() => {
      setState(EXPERIENCE_STATES.LISTENING);
    }, 900);
  }, []);

  // Updates blow intensity and transitions state appropriately
  const handleBlow = useCallback((intensity) => {
    setBlowIntensity(intensity);

    setState((prev) => {
      // Do not leave terminal states
      if (
        prev === EXPERIENCE_STATES.EXTINGUISHED ||
        prev === EXPERIENCE_STATES.CELEBRATION ||
        prev === EXPERIENCE_STATES.ENVELOPE ||
        prev === EXPERIENCE_STATES.LETTER
      ) {
        return prev;
      }
      if (intensity > 0.08) {
        return EXPERIENCE_STATES.BLOWING;
      }
      if (prev === EXPERIENCE_STATES.BLOWING && intensity <= 0.04) {
        return EXPERIENCE_STATES.LISTENING;
      }
      return prev;
    });
  }, []);

  // Triggered when a sustained strong blow extinguishes the flame
  const extinguishCandle = useCallback(() => {
    setState((prev) => {
      if (
        prev === EXPERIENCE_STATES.EXTINGUISHED ||
        prev === EXPERIENCE_STATES.CELEBRATION ||
        prev === EXPERIENCE_STATES.ENVELOPE ||
        prev === EXPERIENCE_STATES.LETTER
      ) {
        return prev;
      }
      setBlowIntensity(0);
      return EXPERIENCE_STATES.EXTINGUISHED;
    });

    // Sequence to CELEBRATION after flame dies down and smoke billows
    setTimeout(() => {
      setState(EXPERIENCE_STATES.CELEBRATION);
    }, 900);
  }, []);

  // Transition to Envelope stage
  const openEnvelope = useCallback(() => {
    setState(EXPERIENCE_STATES.ENVELOPE);
  }, []);

  // Transition to Letter stage
  const openLetter = useCallback(() => {
    setState(EXPERIENCE_STATES.LETTER);
  }, []);

  // Full reset back to beginning
  const resetExperience = useCallback(() => {
    setBlowIntensity(0);
    setState(EXPERIENCE_STATES.INTRO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    state,
    setState,
    blowIntensity,
    setBlowIntensity,
    startExperience,
    microphoneReady,
    handleBlow,
    extinguishCandle,
    openEnvelope,
    openLetter,
    resetExperience,
  };
}
