import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Cake } from './Cake';
import { EXPERIENCE_STATES } from '../utils/constants';

/**
 * Animated Ambient Gold Sparkles floating gently in the dark room.
 * Optimized for mobile with reduced particle count and efficient updates.
 */
function AmbientDust({ count = 18 }) {
  const pointsRef = useRef();

  const [positions] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = Math.random() * 3.5 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return [pos];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.025;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = positionsAttr.getY(i);
      y += delta * 0.07;
      if (y > 3.0) y = -0.6;
      positionsAttr.setY(i, y);
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FDE047"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Camera Controller tuned specifically for portrait mobile screens:
 * - Frames the cake to occupy 55-65% screen height
 * - Keeps candle flame comfortably below top safe-area
 * - Gentle idle parallax and blow reaction
 */
function CameraController({ experienceState, blowIntensity }) {
  const { camera, size } = useThree();
  const isMobile = size.width < 640;
  const isSmallMobile = size.width < 380;

  // Responsive camera base framing
  // For portrait mobile, slightly higher distance & adjusted Y so flame and cake are perfectly centered
  const baseZ = isSmallMobile ? 4.9 : isMobile ? 4.5 : 4.0;
  const baseY = isMobile ? 1.05 : 1.15;
  const targetLookY = 0.38;

  useEffect(() => {
    if (experienceState === EXPERIENCE_STATES.INTRO) {
      camera.position.set(0, baseY + 0.8, baseZ + 1.2);
      camera.lookAt(0, targetLookY, 0);
    } else if (experienceState === EXPERIENCE_STATES.REVEAL) {
      gsap.to(camera.position, {
        x: 0,
        y: baseY,
        z: baseZ,
        duration: 1.8,
        ease: 'power2.out',
      });
    } else if (experienceState === EXPERIENCE_STATES.CELEBRATION) {
      gsap.to(camera.position, {
        x: 0,
        y: baseY + 0.25,
        z: baseZ + 0.3,
        duration: 2.4,
        ease: 'power1.out',
      });
    }
  }, [experienceState, baseY, baseZ, targetLookY, camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const blowShake = (Math.random() - 0.5) * blowIntensity * 0.025;

    if (experienceState !== EXPERIENCE_STATES.INTRO) {
      camera.lookAt(blowShake, targetLookY, 0);

      // Subtle gentle sway on idle
      if (
        experienceState !== EXPERIENCE_STATES.CELEBRATION &&
        experienceState !== EXPERIENCE_STATES.ENVELOPE &&
        experienceState !== EXPERIENCE_STATES.LETTER
      ) {
        camera.position.x = Math.sin(t * 0.35) * 0.12 + blowShake;
      }
    }
  });

  return null;
}

export function BirthdayScene({
  experienceState,
  blowIntensity,
  modelUrl = null,
}) {
  const isExtinguished =
    experienceState === EXPERIENCE_STATES.EXTINGUISHED ||
    experienceState === EXPERIENCE_STATES.CELEBRATION ||
    experienceState === EXPERIENCE_STATES.ENVELOPE ||
    experienceState === EXPERIENCE_STATES.LETTER;

  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
    const handleResize = () => setIsMobileDevice(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-auto">
      <Canvas
        shadows
        dpr={isMobileDevice ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2)}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 1.1, 4.5], fov: 44, near: 0.1, far: 20 }}
      >
        <CameraController
          experienceState={experienceState}
          blowIntensity={blowIntensity}
        />

        {/* Ambient room fill light */}
        <ambientLight intensity={0.42} color="#1A1526" />

        {/* Key Light */}
        <directionalLight
          position={[2.5, 4.5, 3.5]}
          intensity={0.85}
          color="#FFF8E7"
          castShadow
          shadow-mapSize={isMobileDevice ? [512, 512] : [1024, 1024]}
          shadow-bias={-0.0008}
        />

        {/* Warm Golden Rim Light from behind */}
        <directionalLight
          position={[-2.5, 3.5, -2.5]}
          intensity={1.1}
          color="#FFB03A"
        />

        {/* Ambient Floating Dust */}
        <AmbientDust count={isMobileDevice ? 16 : 28} />

        {/* The 3D Cake & Interactive Candle */}
        <Float
          speed={isExtinguished ? 0.8 : 1.3}
          rotationIntensity={0.05}
          floatIntensity={0.09}
        >
          <Cake
            blowIntensity={blowIntensity}
            isExtinguished={isExtinguished}
            modelUrl={modelUrl}
          />
        </Float>

        {/* Contact Shadow under the cake stand */}
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.6}
          scale={4.8}
          blur={2.2}
          far={1.6}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
