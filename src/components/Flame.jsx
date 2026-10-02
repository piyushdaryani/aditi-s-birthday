import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural interactive candle flame.
 * Features:
 * - Multi-layer geometry (outer flame, inner luminous core, blue base)
 * - Dynamic organic flicker with sine & noise harmonics
 * - Non-linear bending, scaling, and jitter reacting to blowIntensity
 * - Dynamic PointLight synchronized with flame scale & flicker
 */
export function Flame({ blowIntensity = 0, isExtinguished = false }) {
  const outerFlameRef = useRef();
  const innerFlameRef = useRef();
  const blueBaseRef = useRef();
  const flameLightRef = useRef();
  const groupRef = useRef();

  // Smoothed transition values for organic physics
  const currentScaleRef = useRef(1);
  const currentTiltRef = useRef(0);
  const currentJitterRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Target scale: 0 if extinguished, otherwise slightly shrinks under strong blow
    let targetScale = 1;
    if (isExtinguished) {
      targetScale = 0;
    } else if (blowIntensity > 0) {
      // Shrink and flatten under heavy wind pressure
      targetScale = Math.max(0.08, 1 - blowIntensity * 0.65);
    }

    // Dampened scale transition
    currentScaleRef.current = THREE.MathUtils.lerp(
      currentScaleRef.current,
      targetScale,
      isExtinguished ? Math.min(1, delta * 14) : Math.min(1, delta * 8)
    );

    const s = currentScaleRef.current;
    groupRef.current.scale.set(s, s, s);

    if (s <= 0.005) {
      if (flameLightRef.current) flameLightRef.current.intensity = 0;
      return;
    }

    // Organic flickers
    const naturalFlicker = Math.sin(time * 12) * 0.04 + Math.cos(time * 23) * 0.03;
    const blowJitter = (Math.random() - 0.5) * blowIntensity * 0.45;
    
    // Flame tilt (bends toward +X and slightly +Z when blown)
    const targetTilt = blowIntensity * 1.25 + blowJitter;
    currentTiltRef.current = THREE.MathUtils.lerp(currentTiltRef.current, targetTilt, Math.min(1, delta * 12));

    // Outer flame motion
    if (outerFlameRef.current) {
      outerFlameRef.current.rotation.z = -currentTiltRef.current;
      outerFlameRef.current.rotation.y = time * 2;
      outerFlameRef.current.scale.y = 1 + naturalFlicker * 2 - blowIntensity * 0.3;
      outerFlameRef.current.scale.x = 1 + naturalFlicker - blowIntensity * 0.2;
    }

    // Inner core motion
    if (innerFlameRef.current) {
      innerFlameRef.current.rotation.z = -currentTiltRef.current * 0.85;
      innerFlameRef.current.scale.y = 0.8 + naturalFlicker * 1.5;
    }

    // Light flickering & intensity
    if (flameLightRef.current) {
      const baseIntensity = 1.8 * s;
      const flickerAmp = 0.25 * (1 + blowIntensity * 2);
      flameLightRef.current.intensity = Math.max(0, baseIntensity + (Math.sin(time * 18) + Math.cos(time * 31)) * flickerAmp);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.42, 0]}>
      {/* Outer Golden Orange Flame */}
      <mesh ref={outerFlameRef} position={[0, 0.16, 0]}>
        <coneGeometry args={[0.08, 0.32, 16, 1]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner White-Hot Yellow Core */}
      <mesh ref={innerFlameRef} position={[0, 0.12, 0]}>
        <coneGeometry args={[0.045, 0.22, 16, 1]} />
        <meshBasicMaterial
          color="#FFFFE0"
          transparent
          opacity={0.96}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Base Blue Combustion Glow */}
      <mesh ref={blueBaseRef} position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial
          color="#00A8FF"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Candle Point Light illuminating the cake & surroundings */}
      <pointLight
        ref={flameLightRef}
        color="#FF9933"
        intensity={1.8}
        distance={4.5}
        decay={2}
        castShadow
        shadow-bias={-0.001}
      />
    </group>
  );
}
