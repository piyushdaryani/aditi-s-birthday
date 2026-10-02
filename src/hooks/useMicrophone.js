import { useState, useRef, useCallback, useEffect } from 'react';

export function useMicrophone() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const animFrameRef = useRef(null);

  const stopMicrophone = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsListening(false);
    setVolume(0);
  }, []);

  const startMicrophone = useCallback(async () => {
    setError(null);

    // Browser support check
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError({
        type: 'UNSUPPORTED',
        message: 'Microphone access is not supported on this browser.',
      });
      return false;
    }

    try {
      // Audio constraints: disable noiseSuppression & autoGainControl if allowed
      // so turbulent breath / blow frequencies are preserved
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintErr) {
        // Fallback to basic audio constraints for older mobile browsers
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceNodeRef.current = source;

      setIsListening(true);
      return true;
    } catch (err) {
      let friendlyError = {
        type: 'UNKNOWN',
        message: 'Could not access microphone.',
      };

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        friendlyError = {
          type: 'PERMISSION_DENIED',
          message: 'Microphone access was denied. Please allow microphone access or tap to blow out.',
        };
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyError = {
          type: 'NO_DEVICE',
          message: 'No microphone was found on your device.',
        };
      } else if (err.name === 'NotReadableError') {
        friendlyError = {
          type: 'IN_USE',
          message: 'Microphone is already in use by another application.',
        };
      }

      setError(friendlyError);
      setIsListening(false);
      return false;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return {
    isListening,
    volume,
    setVolume,
    error,
    startMicrophone,
    stopMicrophone,
    audioContext: audioContextRef.current,
    analyserRef,
  };
}
