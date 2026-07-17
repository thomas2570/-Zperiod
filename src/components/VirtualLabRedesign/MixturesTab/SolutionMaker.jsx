import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, FlaskConical, Scale, Droplets } from 'lucide-react';

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
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-lg w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Controls */}
        <div className="space-y-8 flex flex-col h-full justify-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <FlaskConical size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] font-['Space_Grotesk']">Solution Maker</h3>
            </div>
            <p className="text-[var(--text-secondary)]">Calculate concentration metrics dynamically with high precision.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-secondary)] flex items-center gap-2">
                <Scale size={14} /> Solute
              </label>
              <select 
                value={solute.id} 
                onChange={e => setSolute(SOLUTES.find(s => s.id === e.target.value))}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl p-3 focus:border-sky-500 outline-none transition-colors shadow-sm"
              >
                {SOLUTES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-secondary)] flex items-center gap-2">
                <Droplets size={14} /> Solvent
              </label>
              <select 
                value={solvent.id} 
                onChange={e => setSolvent(SOLVENTS.find(s => s.id === e.target.value))}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl p-3 focus:border-sky-500 outline-none transition-colors shadow-sm"
              >
                {SOLVENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl space-y-8 shadow-inner">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--text-secondary)] flex justify-between items-center">
                <span className="flex items-center gap-2"><Scale size={16} className="text-sky-500"/> Solute Mass</span>
                <span className="text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-lg font-mono border border-[var(--border)] shadow-inner">{mass} g</span>
              </label>
              <input 
                type="range" min="0" max="100" step="1" 
                value={mass} onChange={e => setMass(Number(e.target.value))}
                className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--text-secondary)] flex justify-between items-center">
                <span className="flex items-center gap-2"><Droplets size={16} className="text-indigo-500"/> Solvent Volume</span>
                <span className="text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-lg font-mono border border-[var(--border)] shadow-inner">{volume} mL</span>
              </label>
              <input 
                type="range" min="10" max="1000" step="10" 
                value={volume} onChange={e => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Results & Visuals */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-5 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-sky-500/50 transition-colors">
              <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Molarity (M)</div>
              <div className="text-3xl font-extrabold text-sky-500 font-['Space_Grotesk']">{molarity.toFixed(3)}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">mol / L</div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-5 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Mass %</div>
              <div className="text-3xl font-extrabold text-indigo-500 font-['Space_Grotesk']">{massPercent.toFixed(1)}%</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">g / 100g</div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-5 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Molality (m)</div>
              <div className="text-2xl font-bold text-emerald-500 font-['Space_Grotesk']">{molality.toFixed(3)}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">mol / kg</div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-5 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-colors">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Total Moles</div>
              <div className="text-2xl font-bold text-amber-500 font-['Space_Grotesk']">{moles.toFixed(4)}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">mol</div>
            </div>
          </div>

          {/* Virtual Beaker Visualizer */}
          <div className="flex-1 bg-[var(--bg-primary)] rounded-[2rem] border-[6px] border-[var(--bg-card)] flex flex-col items-center justify-end pb-8 pt-12 relative overflow-hidden shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] outline outline-1 outline-[var(--border)]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10 pointer-events-none" />
            
            <div className="relative flex flex-col items-center z-10 w-full h-[240px] justify-end">
              <Beaker size={200} strokeWidth={1} className="text-[var(--text-secondary)] absolute bottom-[-5px] opacity-20" />
              
              <div className="w-[110px] h-[160px] border-b-4 border-l-4 border-r-4 border-[var(--text-primary)]/20 rounded-b-3xl relative flex items-end overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                 <motion.div 
                   className={`w-full ${getColor()} transition-colors duration-500`}
                   animate={{ 
                     height: `${Math.max(15, (volume / 1000) * 100)}%`,
                     opacity: getOpacity()
                   }}
                 >
                   <div className="w-full h-1 bg-white/30 absolute top-0" />
                 </motion.div>
                 
                 {/* High saturation indicator */}
                 {mass > 50 && volume < 100 && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="absolute bottom-1 w-full h-6 bg-white/60 blur-[3px] rounded-full scale-90" 
                     title="Precipitate (Supersaturated)" 
                   />
                 )}
              </div>
            </div>
            
            <div className="absolute top-6 left-6 text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Live Visualizer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
