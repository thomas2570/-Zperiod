import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Nucleus = ({ atomicNumber }) => {
  const mesh = useRef();
  
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={mesh}>
      {/* Visual representation of a nucleus - using a slightly bumpy sphere */}
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#ef4444" emissive="#991b1b" emissiveIntensity={0.5} roughness={0.7} metalness={0.1} />
    </mesh>
  );
};

const ElectronShell = ({ radius, speed, count }) => {
  const group = useRef();
  
  useFrame((state, delta) => {
    group.current.rotation.z += delta * speed;
    group.current.rotation.x += delta * speed * 0.5;
  });

  return (
    <group ref={group}>
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>
      
      {/* Electrons */}
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} />
          </mesh>
        );
      })}
    </group>
  );
};

export default function AtomModel3D({ element }) {
  // Simple logic to determine electron shells based on atomic number
  // Max shells for first 18 elements: 2, 8, 8
  const getShells = (atomic) => {
    if (atomic <= 2) return [{ radius: 2, speed: 2, count: atomic }];
    if (atomic <= 10) return [
      { radius: 1.5, speed: 2, count: 2 },
      { radius: 2.5, speed: 1.5, count: atomic - 2 }
    ];
    return [
      { radius: 1.5, speed: 2, count: 2 },
      { radius: 2.5, speed: 1.5, count: 8 },
      { radius: 3.5, speed: 1, count: atomic - 10 }
    ];
  };

  const shells = getShells(element.atomic);

  return (
    <div className="w-full h-full bg-slate-950/50 rounded-2xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00e5ff" />
        <Stars radius={50} depth={10} count={1000} factor={3} saturation={0} fade speed={1} />
        
        <group>
          <Nucleus atomicNumber={element.atomic} />
          {shells.map((shell, idx) => (
            <ElectronShell key={idx} {...shell} />
          ))}
        </group>
        
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
