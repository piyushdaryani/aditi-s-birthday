import React, { useMemo, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { Candle } from './Candle';
import * as THREE from 'three';

/**
 * Procedural stylized luxury birthday cake built with Three.js primitives.
 * Mobile-optimized geometry for smooth 60fps performance on smartphones.
 */
function ProceduralCake({ blowIntensity, isExtinguished }) {
  // Piped frosting rosettes along tier edges (balanced count for mobile)
  const bottomRosettes = useMemo(() => {
    const count = 18;
    const radius = 1.32;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [Math.cos(angle) * radius, 0.62, Math.sin(angle) * radius];
    });
  }, []);

  const topRosettes = useMemo(() => {
    const count = 14;
    const radius = 0.88;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [Math.cos(angle) * radius, 1.22, Math.sin(angle) * radius];
    });
  }, []);

  // Fresh berries & golden chocolate pearls on top
  const berries = useMemo(() => {
    const count = 8;
    const radius = 0.55;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        pos: [Math.cos(angle) * radius, 1.25, Math.sin(angle) * radius],
        rot: [0, angle, 0],
        isBerry: i % 2 === 0,
      };
    });
  }, []);

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. Golden Pedestal Base Plate */}
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.65, 1.75, 0.1, 36]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      {/* Pedestal Foot */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.12, 28]} />
        <meshStandardMaterial
          color="#AA820A"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* 2. Bottom Tier - Warm Cocoa / Vanilla Ganache */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.6, 36]} />
        <meshStandardMaterial
          color="#3B2314"
          roughness={0.7}
        />
      </mesh>
      {/* Bottom Tier Top Frosting Layer */}
      <mesh position={[0, 0.605, 0]}>
        <cylinderGeometry args={[1.31, 1.31, 0.03, 36]} />
        <meshStandardMaterial
          color="#FFF8EE"
          roughness={0.35}
        />
      </mesh>

      {/* Rosettes around bottom tier rim */}
      {bottomRosettes.map((pos, i) => (
        <mesh key={`b-ros-${i}`} position={pos} castShadow>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color="#FFF9F0" roughness={0.3} />
        </mesh>
      ))}

      {/* 3. Top Tier - Ivory Whipped Frosting */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.6, 36]} />
        <meshStandardMaterial
          color="#FFFDF7"
          roughness={0.45}
        />
      </mesh>
      {/* Top Tier Soft Glaze */}
      <mesh position={[0, 1.205, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 0.02, 36]} />
        <meshStandardMaterial
          color="#FFF6E5"
          roughness={0.25}
        />
      </mesh>

      {/* Rosettes around top tier rim */}
      {topRosettes.map((pos, i) => (
        <mesh key={`t-ros-${i}`} position={pos} castShadow>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color="#FFF9F0" roughness={0.3} />
        </mesh>
      ))}

      {/* Berries and Golden Pearls decoration */}
      {berries.map((b, i) => (
        <group key={`berry-${i}`} position={b.pos} rotation={b.rot}>
          {b.isBerry ? (
            /* Ruby Berry */
            <mesh castShadow>
              <sphereGeometry args={[0.075, 10, 10]} />
              <meshStandardMaterial
                color="#C51B40"
                roughness={0.25}
                metalness={0.1}
              />
            </mesh>
          ) : (
            /* Crisp Gold Pearl */
            <mesh castShadow>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color="#FFD700"
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* 4. Central Candle */}
      <Candle
        position={[0, 1.22, 0]}
        blowIntensity={blowIntensity}
        isExtinguished={isExtinguished}
      />
    </group>
  );
}

/**
 * Optional GLB loader component if `/models/cake.glb` is supplied.
 */
function ModelCake({ blowIntensity, isExtinguished, modelUrl = '/models/cake.glb' }) {
  const { scene } = useGLTF(modelUrl);
  return (
    <group position={[0, -0.5, 0]}>
      <primitive object={scene.clone()} scale={[1, 1, 1]} />
      <Candle
        position={[0, 1.22, 0]}
        blowIntensity={blowIntensity}
        isExtinguished={isExtinguished}
      />
    </group>
  );
}

/**
 * Main Cake container that defaults to the procedural cake
 * and seamlessly supports replacing with a GLB model when available.
 */
export function Cake({
  blowIntensity = 0,
  isExtinguished = false,
  modelUrl = null,
}) {
  if (modelUrl) {
    return (
      <Suspense fallback={<ProceduralCake blowIntensity={blowIntensity} isExtinguished={isExtinguished} />}>
        <ModelCake
          modelUrl={modelUrl}
          blowIntensity={blowIntensity}
          isExtinguished={isExtinguished}
        />
      </Suspense>
    );
  }

  return (
    <ProceduralCake
      blowIntensity={blowIntensity}
      isExtinguished={isExtinguished}
    />
  );
}
