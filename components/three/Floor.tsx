"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  BUILDING,
  MATERIALS,
  floorProgress,
  floorY,
} from "./config";

interface FloorProps {
  /** Индекс этажа (0 = нижний) */
  index: number;
  /** Ref на текущий прогресс стройки (0..1) */
  progressRef: React.RefObject<number>;
  /** Общее число этажей */
  total: number;
}

/**
 * Floor — один этаж башни.
 * Состоит из плиты перекрытия + стеклянного фасада + оконной полосы.
 *
 * Анимируется по локальному прогрессу:
 *  - position.y: выезжает снизу (из finalY - 1.5 → finalY)
 *  - scale.y: 0 → 1 (растёт из земли)
 *  - material.opacity: 0 → 1 (fade-in)
 *  - окна: emissive ramp-up в финале (когда вся башня достроена)
 *
 * В useFrame: lerp к таргету → плавно, без рывков при резком скролле.
 */
export default function Floor({ index, progressRef, total }: FloorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.MeshStandardMaterial>(null);

  const finalY = floorY(index);

  useFrame(() => {
    const group = groupRef.current;
    const glass = glassRef.current;
    if (!group || !glass) return;

    const p = floorProgress(progressRef.current ?? 0, index, total);

    // Целевые значения
    const targetY = finalY - (1 - p) * 1.8; // выезд снизу
    const targetScaleY = p; // рост
    const targetOpacity = p; // fade-in

    // Прогресс «финал»: после PROGRESS.buildEnd окна загораются
    const globalP = progressRef.current ?? 0;
    const finishP = THREE.MathUtils.clamp(
      (globalP - 0.85) / 0.15,
      0,
      1,
    );
    // Только для уже построенных этажей
    const emissiveOn = p >= 0.95 ? finishP : 0;
    const targetEmissive = 0.05 + emissiveOn * (0.6 + Math.sin(index) * 0.15);

    // Lerp к целевым значениям (0.15 = ~10 кадров до цели)
    group.position.y += (targetY - group.position.y) * 0.15;
    group.scale.y += (targetScaleY - group.scale.y) * 0.15;
    glass.opacity += (targetOpacity - glass.opacity) * 0.15;
    glass.emissiveIntensity += (targetEmissive - glass.emissiveIntensity) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, finalY - 1.8, 0]} scale={[1, 0, 1]}>
      {/* Плита перекрытия */}
      <mesh position={[0, -BUILDING.floorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BUILDING.floorSize, BUILDING.slabHeight, BUILDING.floorSize]} />
        <meshStandardMaterial color={MATERIALS.slab} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Стеклянный фасад (чуть меньше плиты) */}
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[
            BUILDING.floorSize * 0.96,
            BUILDING.floorHeight * 0.9,
            BUILDING.floorSize * 0.96,
          ]}
        />
        <meshStandardMaterial
          ref={glassRef}
          color={MATERIALS.glass}
          emissive={MATERIALS.glassEmissive}
          emissiveIntensity={0.05}
          transparent
          opacity={0}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>

      {/* Тонкая латунная полоса-пояс между этажами */}
      <mesh position={[0, BUILDING.floorHeight / 2 - 0.02, 0]}>
        <boxGeometry
          args={[
            BUILDING.floorSize * 0.98,
            0.015,
            BUILDING.floorSize * 0.98,
          ]}
        />
        <meshStandardMaterial
          color={MATERIALS.crown}
          metalness={0.9}
          roughness={0.3}
          emissive={MATERIALS.crown}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
