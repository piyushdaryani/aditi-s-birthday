import React, { useRef } from 'react';
import { Flame } from './Flame';
import { Smoke } from './Smoke';

/**
 * Realistic candle with wax body, spiral stripe or drip details, wick, and interactive flame.
 */
export function Candle({ blowIntensity = 0, isExtinguished = false, position = [0, 1.25, 0] }) {
  const wickRef = useRef();

  return (
    <group position={position}>
      {/* Candle Wax Body */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.45, 32]} />
        <meshStandardMaterial
          color="#FFF5EA"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Decorative Pastel Gold Wax Ring / Swirl */}
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[0.072, 0.008, 12, 32]} />
        <meshStandardMaterial color="#ECC94B" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.072, 0.008, 12, 32]} />
        <meshStandardMaterial color="#ECC94B" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Wax Top Rim Indentation */}
      <mesh position={[0, 0.424, 0]}>
        <cylinderGeometry args={[0.065, 0.07, 0.01, 32]} />
        <meshStandardMaterial color="#F7FAFC" roughness={0.4} />
      </mesh>

      {/* Candle Wick with burnt tip */}
      <mesh ref={wickRef} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.06, 12]} />
        <meshStandardMaterial
          color={isExtinguished ? '#2D3748' : '#1A202C'}
          roughness={0.9}
        />
      </mesh>

      {/* Subtle glowing red ember on wick tip when just extinguished */}
      {isExtinguished && (
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#FF3300" />
        </mesh>
      )}

      {/* Dynamic interactive flame */}
      <Flame blowIntensity={blowIntensity} isExtinguished={isExtinguished} />

      {/* Rising smoke effect after blowout */}
      <Smoke active={isExtinguished} />
    </group>
  );
}
