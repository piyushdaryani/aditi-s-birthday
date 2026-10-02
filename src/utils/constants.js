export const EXPERIENCE_STATES = {
  INTRO: 'INTRO',
  REVEAL: 'REVEAL',
  MIC_PERMISSION: 'MIC_PERMISSION',
  READY: 'READY',
  LISTENING: 'LISTENING',
  BLOWING: 'BLOWING',
  EXTINGUISHED: 'EXTINGUISHED',
  CELEBRATION: 'CELEBRATION',
  ENVELOPE: 'ENVELOPE',
  LETTER: 'LETTER',
};

// Microphone & Blow Detection Constants (Calibrated for Mobile Phones & Laptops)
export const AUDIO_CONFIG = {
  // Baseline noise floor fallback
  DEFAULT_NOISE_FLOOR: 0.015,
  // Duration in ms to sample ambient surroundings
  CALIBRATION_DURATION_MS: 1500,
  // Multiplier above noise floor needed to begin flame reaction
  SENSITIVITY_MULTIPLIER: 2.2,
  // Minimum absolute RMS to trigger any reaction
  MIN_RMS_THRESHOLD: 0.035,
  // Blow trigger threshold (above noise floor) to count as full blow
  BLOW_THRESHOLD_DELTA: 0.075,
  // Time in milliseconds of sustained blow to trigger extinguishing
  BLOW_SUSTAIN_DURATION_MS: 360,
  // Maximum blow intensity
  MAX_BLOW_INTENSITY: 1.0,
  // Smoothing alpha for exponential moving average
  SMOOTHING_FACTOR: 0.24,
  // Fast decay when blow stops
  DECAY_FACTOR: 0.14,
  // Frequency range typical of blowing/wind on mic (Hz)
  BLOW_FREQ_MIN: 50,
  BLOW_FREQ_MAX: 1200,
};

// Debug flag helper (respects import.meta.env.VITE_DEBUG_AUDIO or URL param ?debug=true)
export const isDebugMode = () => {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return import.meta.env.VITE_DEBUG_AUDIO === 'true' || urlParams.get('debug') === 'true';
};
