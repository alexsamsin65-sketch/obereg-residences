"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Building from "./Building";
import Lights from "./Lights";
import { BUILDING, MATERIALS } from "./config";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * ArchModelViewer — интерактивная 3D-модель башни для секции Architecture.
 * Drag-вращение через OrbitControls, полностью построенное здание.
 * Лёгкая постобработка (Bloom + Vignette, без DepthOfField).
 */
export default function ArchModelViewer() {
  // Статичный ref на progress=1 (здание полностью построено)
  const progressRef = useRef(1);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [5, 4, 6], fov: 35, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[MATERIALS.ground, 14, 30]} />

      <Suspense fallback={null}>
        <Lights />
        <Building progressRef={progressRef} />

        <Environment preset="sunset" background={false} />

        <ContactShadows
          position={[0, -BUILDING.baseHeight - 0.01, 0]}
          opacity={0.4}
          scale={14}
          blur={2}
          far={8}
          color="#000000"
        />

        <EffectComposer multisampling={2}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.7} />
        </EffectComposer>
      </Suspense>

      {/* Drag-вращение: ограниченные углы для архитектурного облика */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
      />

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
