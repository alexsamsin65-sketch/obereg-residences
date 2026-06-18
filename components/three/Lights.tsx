"use client";

/**
 * Lights — освещение сцены стройки.
 * Тёплый key-light + мягкий ambient + тонкий brass-rim + туман для глубины.
 */
export default function Lights() {
  return (
    <>
      {/* Мягкая общая заливка */}
      <ambientLight intensity={0.35} color="#f4efe6" />

      {/* Тёплый key-light сбоку-сверху — моделирует закатное солнце */}
      <directionalLight
        position={[6, 9, 5]}
        intensity={2.2}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={12}
        shadow-camera-bottom={-2}
      />

      {/* Латунный rim-light с противоположной стороны */}
      <directionalLight
        position={[-5, 4, -4]}
        intensity={0.6}
        color="#b8975c"
      />

      {/* Лёгкий тёплый заполняющий снизу — отражение от земли */}
      <hemisphereLight args={["#ffd9a0", "#0e0d0b", 0.25]} />
    </>
  );
}
