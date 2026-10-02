import React, { useCallback, useEffect, useRef } from 'react';
import { useExperienceState } from './hooks/useExperienceState';
import { useMicrophone } from './hooks/useMicrophone';
import { useBlowDetection } from './hooks/useBlowDetection';
import { useSongSync } from './hooks/useSongSync';
import { BirthdayScene } from './components/BirthdayScene';
import { BirthdayMessage } from './components/BirthdayMessage';
import { Envelope } from './components/Envelope';
import { Letter } from './components/Letter';
import { Confetti } from './components/Confetti';
import { StartButton } from './components/StartButton';
import { MicrophonePermission } from './components/MicrophonePermission';
import { MusicController } from './components/music/MusicController';
import { LandscapeNotice } from './components/LandscapeNotice';
import { DebugPanel } from './components/DebugPanel';
import { EXPERIENCE_STATES, isDebugMode } from './utils/constants';

export default function App() {
  const {
    state: experienceState,
    blowIntensity,
    startExperience,
    microphoneReady,
    handleBlow,
    extinguishCandle,
    openEnvelope,
    openLetter,
    resetExperience,
  } = useExperienceState();

  const {
    isListening,
    error: micError,
    startMicrophone,
    stopMicrophone,
    analyserRef,
  } = useMicrophone();

  // Single audio instance managing the supplied "Make a Wish (For Aditi)" song
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    hasStarted,
    hasError: songError,
    playSong,
    togglePlay,
    toggleMute,
    duckAudio,
    resetSong,
    isCandlePrep,
    isCandleReady,
    isCandleCount,
    isBlowWindow,
  } = useSongSync();

  const letterSectionRef = useRef(null);

  // User taps Start: initiates experience and unlocks audio under user gesture
  const handleStart = useCallback(async () => {
    startExperience();
    // Play song on user interaction (iOS Safari compliant)
    await playSong();
  }, [startExperience, playSong]);

  // Handle blow extinguishing sequence:
  // 1. Candle goes out
  // 2. Microphone is IMMEDIATELY released and stopped
  // 3. The song continues naturally without interruption or jumps
  const handleExtinguished = useCallback(() => {
    extinguishCandle();
    stopMicrophone();
  }, [extinguishCandle, stopMicrophone]);

  // Blow detection hook (active only during candle listening)
  const {
    isCalibrating,
    calibrationProgress,
    debugData,
  } = useBlowDetection({
    analyserRef,
    isListening,
    onBlow: handleBlow,
    onExtinguish: handleExtinguished,
    active:
      experienceState !== EXPERIENCE_STATES.EXTINGUISHED &&
      experienceState !== EXPERIENCE_STATES.CELEBRATION &&
      experienceState !== EXPERIENCE_STATES.ENVELOPE &&
      experienceState !== EXPERIENCE_STATES.LETTER,
  });

  // Handle request for microphone access (user gesture safe)
  const handleRequestMic = useCallback(async () => {
    const success = await startMicrophone();
    if (success) {
      microphoneReady();
    }
  }, [startMicrophone, microphoneReady]);

  // Fallback: tap to blow out (manually animates and blows out candle)
  const handleManualBlow = useCallback(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 0.2;
      handleBlow(Math.min(1, current));
      if (current >= 1.0) {
        clearInterval(interval);
        handleExtinguished();
      }
    }, 50);
  }, [handleBlow, handleExtinguished]);

  // Advance from Celebration to Envelope
  const handleOpenEnvelopeModal = useCallback(() => {
    openEnvelope();
  }, [openEnvelope]);

  // Advance from Envelope to Letter
  const handleOpenLetter = useCallback(() => {
    openLetter();
    // Subtly duck music volume so it accompanies the reading without overpowering
    duckAudio(true);
    setTimeout(() => {
      letterSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, [openLetter, duckAudio]);

  // Replay surprise: resets audio, candle, state, and scroll position
  const handleReplay = useCallback(() => {
    stopMicrophone();
    resetSong();
    duckAudio(false);
    resetExperience();
  }, [stopMicrophone, resetSong, duckAudio, resetExperience]);

  // Check if developer debug overlay is requested
  const showDebug = isDebugMode();
  const isLetterStage = experienceState === EXPERIENCE_STATES.LETTER;

  return (
    <div className={`relative w-full min-h-dvh bg-[#08070B] text-slate-100 ${isLetterStage ? 'overflow-y-auto' : 'h-dvh overflow-hidden'}`}>
      {/* Landscape Orientation Advisory for Mobile */}
      <LandscapeNotice />

      {/* Discrete Music Controller (Play/Pause, Mute/Unmute, Playing wave) */}
      <MusicController
        isPlaying={isPlaying}
        isMuted={isMuted}
        hasStarted={hasStarted}
        hasError={songError}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
      />

      {/* 3D WebGL Canvas Layer (Fixed in viewport) */}
      <div className={`fixed inset-0 transition-opacity duration-700 pointer-events-auto ${isLetterStage ? 'opacity-25' : 'opacity-100'}`}>
        <BirthdayScene
          experienceState={experienceState}
          blowIntensity={blowIntensity}
        />
      </div>

      {/* Atmospheric Vignette overlay */}
      <div className="fixed inset-0 vignette-overlay pointer-events-none z-10" />

      {/* UI State 1: INTRO (One-viewport cake scene) */}
      {experienceState === EXPERIENCE_STATES.INTRO && (
        <StartButton onStart={handleStart} />
      )}

      {/* UI State: MICROPHONE PERMISSION / CALIBRATION / LISTENING */}
      {(experienceState === EXPERIENCE_STATES.MIC_PERMISSION ||
        experienceState === EXPERIENCE_STATES.READY ||
        experienceState === EXPERIENCE_STATES.LISTENING ||
        experienceState === EXPERIENCE_STATES.BLOWING) && (
        <MicrophonePermission
          experienceState={experienceState}
          isListening={isListening}
          isCalibrating={isCalibrating}
          calibrationProgress={calibrationProgress}
          micError={micError}
          blowIntensity={blowIntensity}
          onRequestMic={handleRequestMic}
          onManualBlow={handleManualBlow}
          songCues={{
            isCandlePrep,
            isCandleReady,
            isCandleCount,
            isBlowWindow,
          }}
        />
      )}

      {/* UI State: CELEBRATION (Confetti + Birthday Blessing + Envelope Button) */}
      {experienceState === EXPERIENCE_STATES.CELEBRATION && (
        <>
          <Confetti active={true} />
          <BirthdayMessage onOpenEnvelope={handleOpenEnvelopeModal} />
        </>
      )}

      {/* UI State: ENVELOPE MODAL (Tap to unseal) */}
      {experienceState === EXPERIENCE_STATES.ENVELOPE && (
        <Envelope onOpen={handleOpenLetter} />
      )}

      {/* UI State: LETTER (Vertical Scrapbook with 8 photos) */}
      {isLetterStage && (
        <div ref={letterSectionRef} className="relative z-30 animate-fade-in">
          <Letter onReplay={handleReplay} />
        </div>
      )}

      {/* Developer Debug Panel */}
      {showDebug && (
        <DebugPanel
          debugData={debugData}
          isListening={isListening}
          isCalibrating={isCalibrating}
          songSyncData={{
            currentTime,
            duration,
            isPlaying,
            isCandlePrep,
            isCandleReady,
            isCandleCount,
            isBlowWindow,
          }}
        />
      )}
    </div>
  );
}
