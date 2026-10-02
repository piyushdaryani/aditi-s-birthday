import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural rising smoke simulation triggered when the candle is extinguished.
 */
export function Smoke({ active = false }) {
  const groupRef = useRef();
  const particleCount = 18;

  // Initialize individual particle properties
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      delay: i * 0.08,
      speed: 0.65 + Math.random() * 0.45,
      driftX: (Math.random() - 0.5) * 0.15,
      driftZ: (Math.random() - 0.5) * 0.15,
      maxAge: 2.2 + Math.random() * 0.8,
      size: 0.05 + Math.random() * 0.04,
      age: 0,
      started: false,
    }));
  }, []);

  const meshRefs = useRef([]);

  useFrame((state, delta) => {
    if (!active || !groupRef.current) return;

    particles.forEach((p, idx) => {
      const mesh = meshRefs.current[idx];
      if (!mesh) return;

      if (!p.started) {
        p.delay -= delta;
        if (p.delay <= 0) {
          p.started = true;
          mesh.visible = true;
        } else {
          mesh.visible = false;
          return;
        }
      }

      p.age += delta;

      // Cycle or stop when age exceeds maxAge
      const progress = p.age / p.maxAge;
      if (progress < 1) {
        mesh.visible = true;
        // Float upwards
        mesh.position.y += delta * p.speed * (1 - progress * 0.4);
        // Waver sideways
        mesh.position.x += delta * (p.driftX + Math.sin(state.clock.elapsedTime * 3 + idx) * 0.08);
        mesh.position.z += delta * (p.driftZ + Math.cos(state.clock.elapsedTime * 2.5 + idx) * 0.08);
        
        // Expand as it rises
        const currentScale = (1 + progress * 3.5) * p.size;
        mesh.scale.set(currentScale, currentScale, currentScale);

        // Fade in quickly, then fade out
        let opacity = 0;
        if (progress < 0.15) {
          opacity = (progress / 0.15) * 0.4;
        } else {
          opacity = (1 - progress) * 0.4;
        }
        mesh.material.opacity = opacity;
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.42, 0]}>
      {particles.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el)}
          visible={false}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color="#E2E8F0"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
