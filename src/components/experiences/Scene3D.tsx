"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

function SpinningCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color="#6d5efc" metalness={0.3} roughness={0.25} />
    </mesh>
  );
}

interface Scene3DProps {
  size?: number;
}

/**
 * Reference three.js experience. Copy this pattern for new 3D toys:
 * render a <Canvas> from @react-three/fiber inside a fixed-size box.
 */
export function Scene3D({ size = 280 }: Scene3DProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/15 bg-canvas-surface/80 shadow-2xl backdrop-blur-sm"
      style={{ width: size, height: size }}
    >
      <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <SpinningCube />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
