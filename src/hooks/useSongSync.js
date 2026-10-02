import { useState, useRef, useEffect, useCallback } from 'react';
import { birthdayConfig } from '../config/birthdayConfig';

export function useSongSync() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Single singleton audio element reference
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const {
    enabled = true,
    src = '/audio/make-a-wish-for-aditi.mp3',
    defaultVolume = 0.75,
    duckedVolume = 0.38,
    candlePrepTime = 106,
    candleCueReady = 110,
    candleCueCount = 112,
    candleBlowWindow = 118,
    celebrationDrop = 122,
  } = birthdayConfig.music;

  // Initialize single HTMLAudioElement once
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const audio = new Audio();
    audio.src = src;
    audio.preload = 'auto';
    audio.volume = defaultVolume;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoaded(true);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStarted(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.warn('Birthday song audio file not available or failed to load:', e);
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [enabled, src, defaultVolume]);

  // Play audio safely
  const playSong = useCallback(async () => {
    if (!audioRef.current || hasError) return false;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
      return true;
    } catch (err) {
      console.debug('Autoplay prevented or audio play error:', err);
      setIsPlaying(false);
      return false;
    }
  }, [hasError]);

  // Pause audio
  const pauseSong = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }, [isPlaying, pauseSong, playSong]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Smoothly duck volume (e.g. during letter reading) or restore to default
  const duckAudio = useCallback((shouldDuck = true) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const targetVolume = shouldDuck ? duckedVolume : defaultVolume;
    const step = (targetVolume - audioRef.current.volume) / 15;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current);
        return;
      }
      const newVol = audioRef.current.volume + step;
      if (
        (step > 0 && newVol >= targetVolume) ||
        (step < 0 && newVol <= targetVolume)
      ) {
        audioRef.current.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
      } else {
        audioRef.current.volume = Math.max(0, Math.min(1, newVol));
      }
    }, 40);
  }, [defaultVolume, duckedVolume]);

  // Reset song on replay
  const resetSong = useCallback(() => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = defaultVolume;
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setHasStarted(false);
  }, [defaultVolume]);

  // Derived song cue flags
  const isCandlePrep = currentTime >= candlePrepTime && currentTime < candleCueReady;
  const isCandleReady = currentTime >= candleCueReady && currentTime < candleCueCount;
  const isCandleCount = currentTime >= candleCueCount && currentTime < candleBlowWindow;
  const isBlowWindow = currentTime >= candleBlowWindow && currentTime < celebrationDrop;
  const isCelebrationChorus = currentTime >= celebrationDrop;

  return {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    hasStarted,
    isLoaded,
    hasError,
    playSong,
    pauseSong,
    togglePlay,
    toggleMute,
    duckAudio,
    resetSong,
    // Cue flags
    isCandlePrep,
    isCandleReady,
    isCandleCount,
    isBlowWindow,
    isCelebrationChorus,
  };
}
