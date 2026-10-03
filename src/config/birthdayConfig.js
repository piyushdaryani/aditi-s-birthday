export const birthdayConfig = {
  recipient: "Aditi",
  title: "Make a Wish (For Aditi)",

  // Main Birthday Song Configuration
  music: {
    enabled: true,
    src: "/audio/make-a-wish-for-aditi.mp3",
    title: "Make a Wish (For Aditi)",
    defaultVolume: 0.75,
    duckedVolume: 0.38,
    // Timestamp cues in seconds based on the actual audio track:
    // 01:26 (86s): "Take a deep breath now, let the candle glow..."
    // 01:46 (106s): "In every silent wish you whisper in the dark..."
    candlePrepTime: 106,
    // 01:50 (110s): Pre-cue "Ready?"
    candleCueReady: 110,
    // 01:52 (112s): "One, two, three..." countdown
    candleCueCount: 112,
    // 01:58 (118s): "Blow the light into the sky..."
    candleBlowWindow: 118,
    // 02:02 (122s): Big celebratory chorus drop: "Happy Birthday, Aditi!"
    celebrationDrop: 122,
    fadeOutDuration: 1800,
  },

  // Personalised messages across the experience
  messages: {
    headline: "Happy Birthday, Aditi! 🎉",
    wishText: "I wish all your wishes come true, and that God gives you the strength and power to achieve everything you want.",
    transitionText: "But that's not all I wanted to tell you...",
    letterButtonText: "You have a letter ✉️",
    letterGreeting: "To Aditi, one of my favourite people,",
    letterSignature: "— Piyush",
  },

  // Handwritten Scrapbook Letter & 7 Selected Photographs
  letter: {
    greeting: "To Aditi, my favourite person and an even better friend,",
    signature: "— Piyush",
    photos: [
      {
        id: 6,
        src: "/photos/aditi-childhood-06.jpeg",
        caption: "And somehow, this little girl grew up to become you.",
        alt: "Aditi as a little girl wearing a sun hat",
        rotation: "-rotate-2",
        prominent: true,
        tapeAngle: "-1.5deg",
        aspect: "aspect-[3/4]",
        objectPosition: "center 20%",
      },
      {
        id: 5,
        src: "/photos/aditi-smile-05.jpeg",
        caption: "That smile has always been one of my favourite things.",
        alt: "Aditi in blue shirt smiling warmly at the cafe table",
        rotation: "rotate-1",
        tapeAngle: "1.2deg",
        aspect: "aspect-[3/4]",
        objectPosition: "center 15%",
      },
      {
        id: 3,
        src: "/photos/aditi-christmas-03.jpeg",
        caption: "Some moments are special simply because you were there.",
        alt: "Christmas tree memory with festive gifts",
        rotation: "-rotate-1",
        tapeAngle: "-1deg",
        aspect: "aspect-[3/4]",
        objectPosition: "center top",
      },
      {
        id: 8,
        src: "/photos/aditi-family-08.jpeg",
        caption: "The people who are your everything, your strength, and your home.",
        alt: "Aditi with her family",
        rotation: "rotate-1.5",
        tapeAngle: "1deg",
        aspect: "aspect-[3/4]",
        objectPosition: "center center",
      },
      {
        id: 7,
        src: "/photos/aditi-recognition-07.jpeg",
        caption: "I hope you always remember how good it felt to see your hard work get the recognition it deserved.",
        alt: "Aditi receiving recognition certificate for her hard work",
        rotation: "-rotate-2",
        prominent: true,
        tapeAngle: "-1.8deg",
        aspect: "aspect-[3/4]",
        // Position top so both faces/heads and certificate are completely visible
        objectPosition: "center top",
      },
      {
        id: 9,
        src: "/photos/piyush-aditi-09.jpeg",
        caption: "And then there are the memories I'm really glad I got to be part of.",
        alt: "Piyush and Aditi together",
        rotation: "rotate-1",
        prominent: true,
        tapeAngle: "1.5deg",
        aspect: "aspect-[3/4]",
        objectPosition: "center 15%",
      },
      {
        id: 1,
        src: "/photos/aditi-future-01.jpeg",
        caption: "Here's to the person you are, and everything you're still becoming.",
        alt: "Casual outdoor photo of Aditi looking forward to the future",
        rotation: "-rotate-1",
        tapeAngle: "-1.2deg",
        aspect: "aspect-[4/3]",
        objectPosition: "center center",
      },
    ],
  },
};
