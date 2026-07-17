import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATIONS = ['Na⁺', 'K⁺', 'NH₄⁺', 'Ag⁺', 'Ca²⁺', 'Ba²⁺', 'Cu²⁺', 'Pb²⁺', 'Fe³⁺', 'Al³⁺'];
const ANIONS = ['NO₃⁻', 'Cl⁻', 'SO₄²⁻', 'CO₃²⁻', 'OH⁻', 'S²⁻', 'PO₄³⁻'];

// S = Soluble, I = Insoluble, ss = Slightly Soluble
// A basic mock matrix matching standard solubility rules
const SOLUBILITY_MATRIX = {
  'Na⁺':  { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'S', 'CO₃²⁻':'S', 'OH⁻':'S', 'S²⁻':'S', 'PO₄³⁻':'S' },
  'K⁺':   { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'S', 'CO₃²⁻':'S', 'OH⁻':'S', 'S²⁻':'S', 'PO₄³⁻':'S' },
  'NH₄⁺': { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'S', 'CO₃²⁻':'S', 'OH⁻':'S', 'S²⁻':'S', 'PO₄³⁻':'S' },
  'Ag⁺':  { 'NO₃⁻':'S', 'Cl⁻':'I', 'SO₄²⁻':'ss', 'CO₃²⁻':'I', 'OH⁻':'I', 'S²⁻':'I', 'PO₄³⁻':'I' },
  'Ca²⁺': { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'ss', 'CO₃²⁻':'I', 'OH⁻':'ss', 'S²⁻':'ss', 'PO₄³⁻':'I' },
  'Ba²⁺': { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'I', 'CO₃²⁻':'I', 'OH⁻':'S', 'S²⁻':'S', 'PO₄³⁻':'I' },
  'Cu²⁺': { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'S', 'CO₃²⁻':'I', 'OH⁻':'I', 'S²⁻':'I', 'PO₄³⁻':'I' },
  'Pb²⁺': { 'NO₃⁻':'S', 'Cl⁻':'I', 'SO₄²⁻':'I', 'CO₃²⁻':'I', 'OH⁻':'I', 'S²⁻':'I', 'PO₄³⁻':'I' },
  'Fe³⁺': { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'S', 'CO₃²⁻':'I', 'OH⁻':'I', 'S²⁻':'I', 'PO₄³⁻':'I' },
  'Al³⁺': { 'NO₃⁻':'S', 'Cl⁻':'S', 'SO₄²⁻':'S', 'CO₃²⁻':'I', 'OH⁻':'I', 'S²⁻':'I', 'PO₄³⁻':'I' },
};

const LEGEND = {
  'S': { label: 'Soluble (aq)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  'I': { label: 'Insoluble (s)', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  'ss': { label: 'Slightly Soluble', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
};

export default function SolubilityRules() {
  const [selectedPair, setSelectedPair] = useState(null);
  const [filterAnion, setFilterAnion] = useState('ALL');

  const handleCellClick = (cation, anion) => {
    const state = SOLUBILITY_MATRIX[cation][anion];
    setSelectedPair({ cation, anion, state });
  };

  const filteredAnions = filterAnion === 'ALL' ? ANIONS : [filterAnion];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">Interactive Solubility Table</h3>
          <p className="text-slate-400">Click any ion pair to view precipitation details.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setFilterAnion('ALL')}
             className={`px-3 py-1 text-sm rounded-lg border ${filterAnion === 'ALL' ? 'bg-white/10 text-white' : 'border-white/10 text-slate-400'}`}
           >
             All Anions
           </button>
           {ANIONS.map(a => (
             <button 
               key={a}
               onClick={() => setFilterAnion(a)}
               className={`px-3 py-1 text-sm rounded-lg border ${filterAnion === a ? 'bg-white/10 text-white' : 'border-white/10 text-slate-400'}`}
             >
               {a}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left border-b-2 border-white/10 text-slate-500 font-bold bg-transparent">Cation \ Anion</th>
                {filteredAnions.map(a => (
                  <th key={a} className="p-3 text-center border-b-2 border-white/10 text-white font-bold text-lg bg-transparent">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATIONS.map((cation, i) => (
                <motion.tr 
                  key={cation}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  <td className="p-3 font-bold text-white text-lg">{cation}</td>
                  {filteredAnions.map(anion => {
                    const state = SOLUBILITY_MATRIX[cation][anion];
                    const isSelected = selectedPair?.cation === cation && selectedPair?.anion === anion;
                    return (
                      <td key={anion} className="p-1">
                        <button
                          onClick={() => handleCellClick(cation, anion)}
                          className={`w-full p-2 rounded-lg font-bold border transition-all ${LEGEND[state].color} ${isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`}
                        >
                          {state.toUpperCase()}
                        </button>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex gap-6 mt-6 justify-center text-sm font-medium">
            {Object.entries(LEGEND).map(([k, v]) => (
               <div key={k} className="flex items-center gap-2">
                 <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${v.color}`}>{k.toUpperCase()}</span>
                 <span className="text-slate-400">{v.label}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Selected Details Panel */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 h-fit sticky top-20">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Compound Details</h4>
          
          {selectedPair ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedPair.cation}-${selectedPair.anion}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-3xl font-bold font-['Space_Grotesk'] text-white mb-2">
                  {selectedPair.cation.replace(/[^a-zA-Z]/g, '')}{selectedPair.anion.replace(/[^a-zA-Z]/g, '')}
                </div>
                <div className="text-sm text-slate-400 mb-6">
                  {/* Basic string manipulation for name, in real app we'd have a mapping */}
                  Compound Name
                </div>
                
                <div className={`p-4 rounded-xl border ${LEGEND[selectedPair.state].color} mb-6`}>
                  <div className="font-bold text-lg">{LEGEND[selectedPair.state].label}</div>
                  <p className="text-sm mt-1 opacity-80">
                    {selectedPair.state === 'S' 
                      ? "Dissolves readily in water, forming aqueous ions. No precipitate will form when these ions are mixed."
                      : selectedPair.state === 'I' 
                      ? "Forms a solid precipitate when these ions are mixed in aqueous solution."
                      : "Slightly soluble. A precipitate may form if concentrations are high enough."}
                  </p>
                </div>

                {selectedPair.state === 'I' && (
                  <div className="relative w-full h-32 bg-slate-950 rounded-xl border border-slate-800 flex items-end justify-center overflow-hidden">
                     {/* Fake precipitate animation */}
                     <div className="w-16 h-20 border-b-2 border-l-2 border-r-2 border-white/20 rounded-b-lg relative overflow-hidden flex items-end">
                       <div className="w-full h-full bg-blue-500/20" />
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: 20 }}
                         transition={{ duration: 2 }}
                         className="absolute bottom-0 w-full bg-slate-300 blur-[2px]" 
                       />
                     </div>
                     <span className="absolute top-2 left-2 text-[10px] text-slate-500 uppercase font-bold">Precipitation Demo</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center text-slate-500 py-10">
              Select an ion pair from the table to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
