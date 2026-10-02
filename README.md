# 🎂 Birthday Website for Aditi (Mobile-First Interactive Experience)

A mobile-first, production-quality interactive 3D birthday celebration website where the user physically blows out the candle flame using their phone's microphone and Web Audio API, seamlessly synchronized with the custom birthday song **"Make a Wish (For Aditi)"**, reveals celebratory confetti, and opens a heartfelt vertical scrapbook letter with 8 memories.

---

## 🎵 Song Synchronization: "Make a Wish (For Aditi)"

- **Audio File**: Located at [`/public/audio/make-a-wish-for-aditi.mp3`](file:///Users/piyush/.gemini/antigravity/scratch/birthday-cake/public/audio/make-a-wish-for-aditi.mp3) (exact supplied MP3 file preserved byte-for-byte).
- **Single Audio Instance**: Managed via [`useSongSync.js`](file:///Users/piyush/.gemini/antigravity/scratch/birthday-cake/src/hooks/useSongSync.js) so playback remains continuous across React state transitions without overlapping instances or stutter.
- **Autoplay Compliance**: Unlocked naturally upon the user's initial tap on the "Start" button (compliant with iOS Safari and Android media engagement policies). If blocked, an unobtrusive floating `"🎵 Play song"` control allows one-tap start.
- **Audio Ducking**: Automatically ducks music volume subtly to 38% when the user opens the letter so the music accompanies the reading without overpowering it.
- **Microphone as Source of Truth**:
  - The song cues the user ("Make a wish...", "Ready?", "One, two, three...", "Blow the candle now!"), but **never automatically puts out the flame**.
  - The candle flame extinguishes **only** when the Web Audio API detects an actual physical blow from the user (or manual tap fallback).
  - Blowing early, on time, or late keeps the song progressing naturally into the celebratory chorus drop (*"Happy Birthday, Aditi!"*).
  - The microphone is **immediately released** after the blowout for battery and privacy.

---

## ⚙️ Centralized Birthday Configuration

All song timings, recipient name, and messages are configured in [`src/config/birthdayConfig.js`](file:///Users/piyush/.gemini/antigravity/scratch/birthday-cake/src/config/birthdayConfig.js):

```javascript
export const birthdayConfig = {
  recipient: "Aditi",
  title: "Make a Wish (For Aditi)",
  music: {
    enabled: true,
    src: "/audio/make-a-wish-for-aditi.mp3",
    title: "Make a Wish (For Aditi)",
    defaultVolume: 0.75,
    duckedVolume: 0.38,
    candlePrepTime: 106,    // 01:46: "In every silent wish..."
    candleCueReady: 110,    // 01:50: "Ready?"
    candleCueCount: 112,    // 01:52: "One, two, three..."
    candleBlowWindow: 118,  // 01:58: "Blow the light into the sky..."
    celebrationDrop: 122,   // 02:02: Chorus drop: "Happy Birthday, Aditi!"
    fadeOutDuration: 1800,
  },
  messages: {
    headline: "Happy Birthday, Aditi! 🎉",
    wishText: "I wish all your wishes come true, and that God gives you the strength and power to achieve everything you want.",
    transitionText: "But that's not all I wanted to tell you...",
    letterButtonText: "You have a letter ✉️",
    letterGreeting: "To Aditi, one of my favourite people,",
    letterSignature: "— Piyush",
  }
};
```

---

## 📱 Interactive Story Flow

1. **Intro & Start**: 3D cake centered on phone (`100dvh`). Tap "Start" unlocks audio & starts the song.
2. **Cake & Microphone**: Calibrates ambient noise (1.5s). Flame flickers and reacts organically to breath.
3. **Song Cues & Blowout**: Song builds up to the candle cue. User blows out the candle $\rightarrow$ flame extinguishes, smoke rises, PointLight turns off, mic stream stops.
4. **Celebration**: Confetti explodes, chorus drops (*"Happy Birthday, Aditi!"*), and the blessing appears.
5. **3D Envelope**: Tap to unseal the wax emblem and open the flap in 3D perspective.
6. **Scrapbook Letter**: Smooth vertical scroll through parchment paper with 8 Polaroid photos, washi tape, heartfelt memories, and signature (*"— Piyush"*).
7. **Replay**: Resets audio, candle, smoke, letter, and scrolls back to top.

---

## 🎛️ Audio Debug HUD

To see live audio playback time, duration, cue flags, RMS amplitude, noise floor, and blow intensity meter:
- Set `VITE_DEBUG_AUDIO=true` or append `?debug=true` to your browser URL.
