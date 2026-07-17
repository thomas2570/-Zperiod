import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';

// Basic Geometric Representations for Equipment
const BeakerModel = ({ isHovered }) => {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.y += isHovered ? delta * 3 : delta * 0.5;
  });
  return (
    <mesh ref={mesh}>
      <cylinderGeometry args={[1, 1, 2, 32, 1, true]} />
      <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.6} side={2} roughness={0.1} transmission={0.9} thickness={0.5} />
      {/* Liquid inside */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 1, 32]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.8} />
      </mesh>
    </mesh>
  );
};

const TestTubeModel = ({ isHovered }) => {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.y += isHovered ? delta * 3 : delta * 0.5;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
  });
  return (
    <mesh ref={mesh}>
      <capsuleGeometry args={[0.4, 2, 4, 16]} />
      <meshPhysicalMaterial color="#cbd5e1" transparent opacity={0.5} roughness={0.1} transmission={0.9} />
      <mesh position={[0, -0.5, 0]}>
        <capsuleGeometry args={[0.35, 1, 4, 16]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
    </mesh>
  );
};

const BunsenBurnerModel = ({ isHovered }) => {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.y += isHovered ? delta * 3 : delta * 0.5;
  });
  return (
    <group ref={mesh}>
      {/* Base */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tube */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.4, 1.5, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const GenericEquipmentModel = ({ isHovered, color }) => {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.x += isHovered ? delta * 2 : delta * 0.5;
    mesh.current.rotation.y += isHovered ? delta * 2 : delta * 0.5;
  });
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

const EQUIPMENT_DATA = [
  { id: 'microscope', name: 'Microscope', desc: 'Observe microscopic structures.', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1583912265924-72b2260682fa?q=80&w=600&auto=format&fit=crop' },
  { id: 'bunsen', name: 'Bunsen Burner', desc: 'Heating device using gas flame.', type: 'bunsen', image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=600&auto=format&fit=crop' },
  { id: 'beaker', name: 'Beaker', desc: 'Hold, mix, and heat liquids.', type: 'beaker', image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=600&auto=format&fit=crop' },
  { id: 'testtube', name: 'Test Tube', desc: 'Hold small chemical samples.', type: 'testtube', image: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?q=80&w=600&auto=format&fit=crop' },
  { id: 'phmeter', name: 'pH Meter', desc: 'Measure acidity or alkalinity.', color: '#10b981', image: 'https://images.unsplash.com/photo-1629813247954-411bd0175b14?q=80&w=600&auto=format&fit=crop' },
  { id: 'balance', name: 'Weighing Balance', desc: 'Measure mass accurately.', color: '#8b5cf6', image: 'https://images.unsplash.com/photo-1579782500858-a570776bdde9?q=80&w=600&auto=format&fit=crop' },
];

const EquipmentCard = ({ eq, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderModel = () => {
    switch (eq.type) {
      case 'beaker': return <BeakerModel isHovered={isHovered} />;
      case 'testtube': return <TestTubeModel isHovered={isHovered} />;
      case 'bunsen': return <BunsenBurnerModel isHovered={isHovered} />;
      default: return <GenericEquipmentModel isHovered={isHovered} color={eq.color} />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(eq)}
      className={`relative bg-slate-800/50 border ${isHovered ? 'border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'border-slate-700'} rounded-2xl p-4 cursor-pointer overflow-hidden flex flex-col transition-all`}
    >
      <div className="h-48 w-full rounded-xl overflow-hidden mb-4 relative bg-slate-900/50">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          {renderModel()}
        </Canvas>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{eq.name}</h3>
      <p className="text-sm text-slate-400 line-clamp-2">{eq.desc}</p>
      
      {/* Tooltip hint */}
      <div className="absolute top-4 right-4 bg-slate-900/80 p-1.5 rounded-lg text-sky-400 text-xs font-bold border border-slate-700">
        Interactive
      </div>
    </motion.div>
  );
};

export default function EquipmentRoom() {
  const [selectedEq, setSelectedEq] = useState(null);

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto" id="equipment-room">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Equipment Room</h2>
        <p className="text-slate-400 max-w-2xl text-lg">Explore our inventory of high-tech virtual lab equipment. Hover to interact, and click to view a real-world reference.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {EQUIPMENT_DATA.map(eq => (
          <EquipmentCard key={eq.id} eq={eq} onClick={setSelectedEq} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedEq(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedEq.name}</h3>
                <button onClick={() => setSelectedEq(null)} className="text-slate-400 hover:text-white p-2">
                  ✕
                </button>
              </div>
              <img src={selectedEq.image} alt={selectedEq.name} className="w-full h-64 object-cover rounded-xl mb-6" />
              <p className="text-lg text-slate-300">{selectedEq.desc}</p>
              <div className="mt-6 p-4 bg-sky-900/20 border border-sky-500/20 rounded-xl">
                <p className="text-sm text-sky-300">
                  <strong className="text-sky-400">Did you know?</strong> This piece of equipment is essential for conducting accurate and safe chemical analyses in real-world laboratories.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
