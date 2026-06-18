"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing";
import * as THREE from "three";
import Building from "./Building";
import Lights from "./Lights";
import { BUILDING, MATERIALS } from "./config";

interface BuildingSceneProps {
  /** Ref на прогресс стройки (0..1) — читается в useFrame */
  progressRef: React.RefObject<number>;
  /** Включить тяжёлую постобработку (Bloom + DoF). Отключать на слабых. */
  heavy?: boolean;
}

/**
 * RigCamera — камера, поднимающаяся и слегка орбитящая по прогрессу.
 * В начале смотрит в котлован снизу, к концу — на готовый дом.
 */
function RigCamera({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const target = useRef(new THREE.Vector3(0, 2, 0));

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    // Камера поднимается и орбитит
    const baseY = 1.2;
    const liftY = 4.5;
    const camY = baseY + p * liftY;
    // Орбит по X: лёгкий облёт
    const angle = -0.3 + p * 0.5;
    const radius = 7.5 - p * 1.2; // чуть приближается к финалу
    const camX = Math.sin(angle) * radius;
    const camZ = Math.cos(angle) * radius;

    // Цель взгляда тоже поднимается
    target.current.y = 1 + p * 3;

    // Lerp для плавности
    state.camera.position.x += (camX - state.camera.position.x) * 0.05;
    state.camera.position.y += (camY - state.camera.position.y) * 0.05;
    state.camera.position.z += (camZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(target.current);
  });

  return null;
}

/**
 * BuildingScene — полный Canvas с процедурной стройкой башни.
 *
 * Включает:
 *  - Lighting (Lights.tsx)
 *  - Environment preset="sunset" для тёплых отражений
 *  - ContactShadows под фундаментом
 *  - Постобработка: Bloom (окна), Vignette, опционально DepthOfField
 *  - Камера с облетом/подъёмом по прогрессу
 *  - fog для глубины
 *
 * dpr ограничен [1, 2], frameloop="always" (сцена постоянно анимируется скроллом).
 */
export default function BuildingScene({
  progressRef,
  heavy = true,
}: BuildingSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [7, 1.2, 7.5], fov: 35, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ background: "transparent" }}
    >
      {/* Туман — глубина и киношность */}
      <fog attach="fog" args={[MATERIALS.ground, 12, 28]} />

      <Suspense fallback={null}>
        <Lights />
        <Building progressRef={progressRef} />
        <RigCamera progressRef={progressRef} />

        {/* Тёплые отражения в стекле */}
        <Environment preset="sunset" background={false} />

        {/* Контактные тени под фундаментом — дёшево и эффектно */}
        <ContactShadows
          position={[0, -BUILDING.baseHeight - 0.01, 0]}
          opacity={0.55}
          scale={16}
          blur={2.5}
          far={8}
          color="#000000"
        />

        {heavy && (
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            {heavy && (
              <DepthOfField
                focusDistance={0.015}
                focalLength={0.04}
                bokehScale={2.5}
              />
            )}
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        )}
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
