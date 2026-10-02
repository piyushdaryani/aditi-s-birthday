import { AUDIO_CONFIG } from './constants';

/**
 * Calculates the Root Mean Square (RMS) amplitude of a time-domain float buffer.
 * @param {Float32Array} timeDomainData 
 * @returns {number} RMS value between 0 and 1
 */
export function calculateRMS(timeDomainData) {
  let sumSquares = 0;
  const len = timeDomainData.length;
  if (!len) return 0;

  for (let i = 0; i < len; i++) {
    const val = timeDomainData[i];
    sumSquares += val * val;
  }
  return Math.sqrt(sumSquares / len);
}

/**
 * Calculates spectral energy in the blow frequency band (turbulence from breath on mic capsule).
 * @param {Uint8Array} frequencyData 
 * @param {number} sampleRate 
 * @param {number} fftSize 
 * @returns {number} Normalized band energy (0 to 1)
 */
export function calculateBlowBandEnergy(frequencyData, sampleRate = 44100, fftSize = 1024) {
  const binWidth = sampleRate / fftSize;
  const startBin = Math.max(0, Math.floor(AUDIO_CONFIG.BLOW_FREQ_MIN / binWidth));
  const endBin = Math.min(frequencyData.length - 1, Math.ceil(AUDIO_CONFIG.BLOW_FREQ_MAX / binWidth));

  if (startBin >= endBin) return 0;

  let sum = 0;
  for (let i = startBin; i <= endBin; i++) {
    sum += frequencyData[i];
  }
  const avg = sum / (endBin - startBin + 1);
  return avg / 255; // Normalize 0 to 1
}

/**
 * Normalizes blow intensity based on current RMS, baseline noise floor, and threshold.
 * Applies non-linear easing so the flame reaction feels organic and physical.
 * 
 * @param {number} rms Current smoothed RMS
 * @param {number} noiseFloor Calibrated noise floor
 * @returns {number} Normalized intensity between 0.0 and 1.0
 */
export function calculateNormalizedBlowIntensity(rms, noiseFloor) {
  const effectiveNoiseFloor = Math.max(noiseFloor, AUDIO_CONFIG.DEFAULT_NOISE_FLOOR);
  const minActiveRMS = effectiveNoiseFloor + AUDIO_CONFIG.BLOW_THRESHOLD_DELTA * 0.25;

  if (rms <= minActiveRMS) {
    return 0;
  }

  // Signal headroom above noise floor
  const targetMax = effectiveNoiseFloor + AUDIO_CONFIG.BLOW_THRESHOLD_DELTA * 1.8;
  const rawRatio = Math.max(0, (rms - minActiveRMS) / (targetMax - minActiveRMS));
  const clampedRatio = Math.min(1.0, rawRatio);

  // Apply cubic non-linear power curve for gentle initial tilt, dramatic deep bend, and crisp blowout
  return Math.pow(clampedRatio, 1.25);
}
