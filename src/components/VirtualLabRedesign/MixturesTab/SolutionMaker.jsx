import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SOLUTES = [
  { id: 'nacl', name: 'Sodium Chloride (NaCl)', molarMass: 58.44 },
  { id: 'cuso4', name: 'Copper Sulfate (CuSO₄)', molarMass: 159.609 },
  { id: 'kno3', name: 'Potassium Nitrate (KNO₃)', molarMass: 101.1032 },
];

const SOLVENTS = [
  { id: 'water', name: 'Water (H₂O)', density: 1.0 }, // g/mL
  { id: 'ethanol', name: 'Ethanol (C₂H₅OH)', density: 0.789 },
];

export default function SolutionMaker() {
  const [solute, setSolute] = useState(SOLUTES[0]);
  const [solvent, setSolvent] = useState(SOLVENTS[0]);
  const [mass, setMass] = useState(10); // grams
  const [volume, setVolume] = useState(100); // mL

  // Calculations
  const moles = mass / solute.molarMass;
  const volumeL = volume / 1000;
  const molarity = moles / volumeL;
  
  const solventMassG = volume * solvent.density;
  const totalMassG = mass + solventMassG;
  const massPercent = (mass / totalMassG) * 100;
  
  const solventMassKg = solventMassG / 1000;
  const molality = moles / solventMassKg;

  // For visual representation color
  const getColor = () => {
    if (solute.id === 'cuso4') return 'bg-blue-500';
    if (solute.id === 'kno3') return 'bg-slate-200';
    return 'bg-white';
  };

  const getOpacity = () => {
    // Max visual saturation around 5M
    const cap = Math.min(molarity / 5, 1);
    return 0.2 + (cap * 0.8);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">Solution Maker</h3>
          <p className="text-slate-400">Calculate concentration metrics dynamically.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Solute</label>
              <select 
                value={solute.id} 
                onChange={e => setSolute(SOLUTES.find(s => s.id === e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:border-[#00e5ff] outline-none"
              >
                {SOLUTES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Solvent</label>
              <select 
                value={solvent.id} 
                onChange={e => setSolvent(SOLVENTS.find(s => s.id === e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:border-[#00e5ff] outline-none"
              >
                {SOLVENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 flex justify-between">
              <span>Solute Mass (g)</span>
              <span className="text-white">{mass} g</span>
            </label>
            <input 
              type="range" min="0" max="100" step="1" 
              value={mass} onChange={e => setMass(Number(e.target.value))}
              className="w-full accent-[#00e5ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 flex justify-between">
              <span>Solvent Volume (mL)</span>
              <span className="text-white">{volume} mL</span>
            </label>
            <input 
              type="range" min="10" max="1000" step="10" 
              value={volume} onChange={e => setVolume(Number(e.target.value))}
              className="w-full accent-[#7c3aed]"
            />
          </div>
        </div>

        {/* Results & Visuals */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Molarity (M)</div>
              <div className="text-3xl font-bold text-[#00e5ff]">{molarity.toFixed(3)}</div>
              <div className="text-xs text-slate-500 mt-1">mol / L</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mass %</div>
              <div className="text-3xl font-bold text-[#7c3aed]">{massPercent.toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-1">g / 100g</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Molality (m)</div>
              <div className="text-2xl font-bold text-emerald-400">{molality.toFixed(3)}</div>
              <div className="text-xs text-slate-500 mt-1">mol / kg</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Moles</div>
              <div className="text-2xl font-bold text-amber-400">{moles.toFixed(4)}</div>
              <div className="text-xs text-slate-500 mt-1">mol</div>
            </div>
          </div>

          {/* Virtual Beaker Visualizer */}
          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-end justify-center pb-4 relative overflow-hidden">
            <div className="w-32 h-40 border-b-4 border-l-4 border-r-4 border-white/20 rounded-b-2xl relative flex items-end overflow-hidden">
               <motion.div 
                 className={`w-full ${getColor()} transition-colors duration-500`}
                 animate={{ 
                   height: `${Math.max(20, (volume / 1000) * 100)}%`,
                   opacity: getOpacity()
                 }}
               />
               {mass > 50 && volume < 100 && (
                 <div className="absolute bottom-0 left-0 w-full h-2 bg-white/40 blur-sm" title="Precipitate (Supersaturated)" />
               )}
            </div>
            <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">Visual representation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
