"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Floor from "./Floor";
import { BUILDING, MATERIALS } from "./config";

interface BuildingProps {
  /** Ref на прогресс стройки (0..1) */
  progressRef: React.RefObject<number>;
}

/**
 * Building — вся башня ОБЕРЁГ.
 * Фундамент (всегда виден) + N этажей (анимируются) + пентхаус/корона.
 */
export default function Building({ progressRef }: BuildingProps) {
  const crownRef = useRef<THREE.Group>(null);
  const crownMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const globalP = progressRef.current ?? 0;
    const crown = crownRef.current;
    const mat = crownMatRef.current;

    // Корона появляется в последней четверти стройки
    const crownP = THREE.MathUtils.clamp((globalP - 0.6) / 0.4, 0, 1);
    if (crown) {
      const targetY = crownP > 0 ? 0 : -2;
      const targetScale = crownP;
      crown.position.y += (targetY - crown.position.y) * 0.15;
      crown.scale.y += (targetScale - crown.scale.y) * 0.15;
    }
    if (mat) {
      mat.opacity += (crownP - mat.opacity) * 0.15;
      // В финале корона мягко светится
      const finishP = THREE.MathUtils.clamp((globalP - 0.85) / 0.15, 0, 1);
      mat.emissiveIntensity += (0.1 + finishP * 0.3 - mat.emissiveIntensity) * 0.1;
    }
  });

  return (
    <group>
      {/* Фундамент — широкий, всегда виден */}
      <mesh position={[0, -BUILDING.baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry
          args={[
            BUILDING.floorSize * 1.25,
            BUILDING.baseHeight,
            BUILDING.floorSize * 1.25,
          ]}
        />
        <meshStandardMaterial color={MATERIALS.base} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Тонкая латунная линия на фундаменте */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry
          args={[
            BUILDING.floorSize * 1.26,
            0.012,
            BUILDING.floorSize * 1.26,
          ]}
        />
        <meshStandardMaterial color={MATERIALS.crown} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Этажи */}
      {Array.from({ length: BUILDING.floors }, (_, i) => (
        <Floor
          key={i}
          index={i}
          total={BUILDING.floors}
          progressRef={progressRef}
        />
      ))}

      {/* Пентхаус / корона на вершине */}
      <group
        ref={crownRef}
        position={[0, -2, 0]}
        scale={[1, 0, 1]}
      >
        {/* Корона чуть уже основной башни, со скосом-впечатлением */}
        <mesh
          position={[0, BUILDING.baseHeight + BUILDING.floors * BUILDING.floorHeight + BUILDING.crownHeight / 2, 0]}
          castShadow
        >
          <coneGeometry
            args={[BUILDING.floorSize * 0.55, BUILDING.crownHeight * 2, 4]}
          />
          <meshStandardMaterial
            ref={crownMatRef}
            color={MATERIALS.crown}
            metalness={0.9}
            roughness={0.25}
            emissive={MATERIALS.crown}
            emissiveIntensity={0.1}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    </group>
  );
}
