'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedEarth() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.5, 64, 64]}>
      <MeshDistortMaterial
        color="#22c55e"
        envMapIntensity={0.4}
        clearcoat={0.8}
        clearcoatRoughness={0}
        metalness={0.8}
        roughness={0.2}
        distort={0.2}
        speed={1.5}
      />
    </Sphere>
  );
}

export default function EarthScene() {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl relative bg-black/40 backdrop-blur-xl border border-white/10">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={2.0} color="#3b82f6" />
        
        <AnimatedEarth /> <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute bottom-4 right-4 bg-black/60 text-emerald-400 px-4 py-2 rounded-full text-xs uppercase tracking-widest backdrop-blur-md">
        Live Ecosystem
      </div>
    </div>
  );
}
