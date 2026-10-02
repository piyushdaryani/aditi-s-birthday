import { useState, useRef, useEffect, useCallback } from 'react';
import { AUDIO_CONFIG } from '../utils/constants';
import { calculateRMS, calculateBlowBandEnergy, calculateNormalizedBlowIntensity } from '../utils/audioAnalysis';

export function useBlowDetection({
  analyserRef,
  isListening,
  onBlow,
  onExtinguish,
  active = true,
}) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [noiseFloor, setNoiseFloor] = useState(AUDIO_CONFIG.DEFAULT_NOISE_FLOOR);
  const [debugData, setDebugData] = useState({
    rms: 0,
    noiseFloor: AUDIO_CONFIG.DEFAULT_NOISE_FLOOR,
    threshold: 0,
    blowIntensity: 0,
    detectionState: 'IDLE',
    bandEnergy: 0,
  });

  const smoothedIntensityRef = useRef(0);
  const smoothedRmsRef = useRef(0);
  const sustainStartRef = useRef(null);
  const calibrationSamplesRef = useRef([]);
  const calibrationStartTimeRef = useRef(null);
  const isExtinguishedRef = useRef(false);

  // Reset extinguished flag if deactivated/reset
  useEffect(() => {
    if (!active) {
      isExtinguishedRef.current = false;
      smoothedIntensityRef.current = 0;
      smoothedRmsRef.current = 0;
      sustainStartRef.current = null;
    }
  }, [active]);

  // Main Audio Analysis Loop
  useEffect(() => {
    if (!isListening || !analyserRef.current || !active) {
      return;
    }

    const analyser = analyserRef.current;
    const timeDomainData = new Float32Array(analyser.fftSize);
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    let animationFrameId;
    let isCalibrated = false;

    // Start calibration period
    setIsCalibrating(true);
    setCalibrationProgress(0);
    calibrationSamplesRef.current = [];
    calibrationStartTimeRef.current = performance.now();

    const processAudio = (currentTime) => {
      if (!analyserRef.current || isExtinguishedRef.current) {
        return;
      }

      analyser.getFloatTimeDomainData(timeDomainData);
      analyser.getByteFrequencyData(frequencyData);

      const rawRMS = calculateRMS(timeDomainData);
      const bandEnergy = calculateBlowBandEnergy(frequencyData, analyser.context?.sampleRate || 44100, analyser.fftSize);

      // Smooth RMS for stability
      smoothedRmsRef.current = smoothedRmsRef.current * (1 - AUDIO_CONFIG.SMOOTHING_FACTOR) + rawRMS * AUDIO_CONFIG.SMOOTHING_FACTOR;
      const rms = smoothedRmsRef.current;

      // 1. Ambient Noise Calibration Phase
      if (!isCalibrated) {
        const elapsed = currentTime - calibrationStartTimeRef.current;
        const progress = Math.min(1, elapsed / AUDIO_CONFIG.CALIBRATION_DURATION_MS);
        setCalibrationProgress(progress);
        calibrationSamplesRef.current.push(rms);

        if (elapsed >= AUDIO_CONFIG.CALIBRATION_DURATION_MS) {
          isCalibrated = true;
          setIsCalibrating(false);

          // Calculate mean noise floor with 15% safety margin
          const samples = calibrationSamplesRef.current;
          const avgNoise = samples.reduce((a, b) => a + b, 0) / (samples.length || 1);
          const computedNoiseFloor = Math.max(avgNoise * 1.15, AUDIO_CONFIG.DEFAULT_NOISE_FLOOR);
          setNoiseFloor(computedNoiseFloor);
        }

        animationFrameId = requestAnimationFrame(processAudio);
        return;
      }

      // 2. Active Blow Detection Phase
      const effectiveThreshold = noiseFloor + AUDIO_CONFIG.BLOW_THRESHOLD_DELTA;
      let rawIntensity = calculateNormalizedBlowIntensity(rms, noiseFloor);

      // Boost blow score if there is characteristic breath turbulence in low/mid frequencies
      if (bandEnergy > 0.15 && rawIntensity > 0.1) {
        rawIntensity = Math.min(1.0, rawIntensity * (1 + bandEnergy * 0.4));
      }

      // Smoothing: fast attack when blowing, smooth decay when stopping
      if (rawIntensity > smoothedIntensityRef.current) {
        smoothedIntensityRef.current = smoothedIntensityRef.current * 0.65 + rawIntensity * 0.35;
      } else {
        smoothedIntensityRef.current = smoothedIntensityRef.current * (1 - AUDIO_CONFIG.DECAY_FACTOR);
      }

      // Snap near-zero values to 0
      if (smoothedIntensityRef.current < 0.02) {
        smoothedIntensityRef.current = 0;
      }

      const intensity = Math.min(1.0, Math.max(0, smoothedIntensityRef.current));
      onBlow?.(intensity);

      // 3. Sustained Strong Blow Check for Extinguishing
      let detectionState = 'LISTENING';
      if (intensity > 0.08 && intensity < 0.7) {
        detectionState = 'BLOW_DETECTED';
        sustainStartRef.current = null;
      } else if (intensity >= 0.7) {
        detectionState = 'STRONG_BLOW';
        if (!sustainStartRef.current) {
          sustainStartRef.current = currentTime;
        } else {
          const sustainedDuration = currentTime - sustainStartRef.current;
          if (sustainedDuration >= AUDIO_CONFIG.BLOW_SUSTAIN_DURATION_MS) {
            isExtinguishedRef.current = true;
            detectionState = 'EXTINGUISHED';
            onExtinguish?.();
          }
        }
      } else {
        sustainStartRef.current = null;
      }

      setDebugData({
        rms: Number(rms.toFixed(4)),
        noiseFloor: Number(noiseFloor.toFixed(4)),
        threshold: Number(effectiveThreshold.toFixed(4)),
        blowIntensity: Number(intensity.toFixed(2)),
        detectionState,
        bandEnergy: Number(bandEnergy.toFixed(3)),
      });

      if (!isExtinguishedRef.current) {
        animationFrameId = requestAnimationFrame(processAudio);
      }
    };

    animationFrameId = requestAnimationFrame(processAudio);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isListening, analyserRef, noiseFloor, active, onBlow, onExtinguish]);

  return {
    isCalibrating,
    calibrationProgress,
    noiseFloor,
    debugData,
  };
}
