import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualLab } from '../../context/VirtualLabContext';

const TitrationApparatus = ({ volumeAdded }) => {
  const liquidRef = useRef();
  
  // Color calculation based on volume added (0 to 50ml)
  // Starts clear (acidic), turns light pink at endpoint (25ml), then dark pink/red
  const getLiquidColor = (vol) => {
    if (vol < 24) return '#f8fafc'; // almost clear
    if (vol >= 24 && vol < 26) return '#fbcfe8'; // light pink (endpoint)
    return '#be185d'; // dark pink (overshot)
  };

  useFrame(() => {
    if (liquidRef.current) {
      liquidRef.current.material.color.set(getLiquidColor(volumeAdded));
      // Increase liquid height slightly as volume is added
      const scaleY = 1 + (volumeAdded / 100);
      liquidRef.current.scale.y = scaleY;
      liquidRef.current.position.y = -1 + (scaleY - 1) / 2;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Burette */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} transmission={0.9} />
      </mesh>
      
      {/* Flask */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[1.5, 2, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} transmission={0.9} />
      </mesh>
      
      {/* Liquid inside flask */}
      <mesh ref={liquidRef} position={[0, -1, 0]}>
        <coneGeometry args={[1.4, 1, 32]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export default function ExperimentZone() {
  const { completeExperiment } = useVirtualLab();
  const [step, setStep] = useState(0);
  const [volume, setVolume] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [experimentResult, setExperimentResult] = useState(null);

  const steps = [
    { title: "Preparation", instruction: "You have a conical flask with 25ml of unknown HCl acid. Add 2 drops of Phenolphthalein indicator." },
    { title: "Titration", instruction: "Slowly add 0.1M NaOH from the burette. Watch carefully for a permanent light pink color change." },
    { title: "Observation", instruction: "Analyze the endpoint." }
  ];

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setShowQuiz(true);
    }
  };

  const addBase = (amount) => {
    setVolume(prev => Math.min(prev + amount, 50));
  };

  const handleQuizAnswer = (answer) => {
    setShowQuiz(false);
    setStep(2);
    // Ideal endpoint is exactly 25ml. Let's say 24-26 is a Pass.
    if (volume >= 24 && volume <= 26 && answer === 'pink') {
      setExperimentResult({ status: 'Pass', msg: `Excellent! You found the endpoint at ${volume.toFixed(1)}ml.` });
      completeExperiment('titration-01');
    } else if (volume < 24) {
      setExperimentResult({ status: 'Fail', msg: `Undershot! The solution is still acidic (${volume.toFixed(1)}ml).` });
    } else {
      setExperimentResult({ status: 'Fail', msg: `Overshot! The solution is too basic (${volume.toFixed(1)}ml).` });
    }
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto" id="experiment-zone">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Guided Experiment: Titration</h2>
        <p className="text-slate-400 max-w-2xl text-lg">Determine the concentration of an unknown acid by neutralizing it with a strong base.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Instructions Panel */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Instructions</h3>
          
          <div className="flex-1">
            {steps.map((s, idx) => (
              <div key={idx} className={`mb-6 p-4 rounded-xl transition-all ${step === idx ? 'bg-sky-900/30 border border-sky-500/50' : 'opacity-50'}`}>
                <h4 className={`font-bold mb-2 ${step === idx ? 'text-sky-400' : 'text-slate-400'}`}>Step {idx + 1}: {s.title}</h4>
                <p className="text-slate-300 text-sm">{s.instruction}</p>
              </div>
            ))}
          </div>

          {step === 0 && (
            <button onClick={handleNextStep} className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-xl transition-colors">
              Add Indicator
            </button>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700 mb-2">
                <span className="text-slate-400 text-sm">Volume Added:</span>
                <span className="text-sky-400 font-mono font-bold text-lg">{volume.toFixed(1)} ml</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => addBase(1.0)} className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">+1.0 ml</button>
                <button onClick={() => addBase(0.1)} className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">+0.1 ml</button>
              </div>
              <button onClick={handleNextStep} className="w-full py-3 mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors">
                Stop Titration
              </button>
            </div>
          )}

          {step === 2 && experimentResult && (
            <div className={`p-6 rounded-xl border ${experimentResult.status === 'Pass' ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-rose-900/20 border-rose-500/50'}`}>
              <h4 className={`text-xl font-bold mb-2 ${experimentResult.status === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {experimentResult.status}
              </h4>
              <p className="text-slate-300 text-sm">{experimentResult.msg}</p>
              <button onClick={() => { setStep(0); setVolume(0); setExperimentResult(null); }} className="mt-4 text-sky-400 hover:text-sky-300 text-sm font-bold underline">
                Retry Experiment
              </button>
            </div>
          )}
        </div>

        {/* 3D Visualization */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden h-[600px] relative">
          <Canvas camera={{ position: [0, 2, 8] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <TitrationApparatus volumeAdded={volume} />
          </Canvas>
          
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">
              Analyte: 25ml HCl (?)
            </span>
            <span className="bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">
              Titrant: 0.1M NaOH
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Observation Check</h3>
              <p className="text-slate-300 mb-8">What color did the solution turn at the endpoint?</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleQuizAnswer('clear')} className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">Remained Clear</button>
                <button onClick={() => handleQuizAnswer('pink')} className="py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors">Light Pink</button>
                <button onClick={() => handleQuizAnswer('blue')} className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">Dark Blue</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
