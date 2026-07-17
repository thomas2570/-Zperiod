import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Info, ChevronRight, Droplets } from 'lucide-react';

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
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-lg w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl">
              <Beaker size={24} />
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] font-['Space_Grotesk']">Solubility Matrix</h3>
          </div>
          <p className="text-[var(--text-secondary)]">Click any ion pair cell to investigate precipitation dynamics.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setFilterAnion('ALL')}
             className={`px-3 py-1 text-sm rounded-lg border ${filterAnion === 'ALL' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'}`}
           >
             All Anions
           </button>
           {ANIONS.map(a => (
             <button 
               key={a}
               onClick={() => setFilterAnion(a)}
               className={`px-3 py-1 text-sm rounded-lg border ${filterAnion === a ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'}`}
             >
               {a}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 overflow-x-auto no-scrollbar bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)] shadow-inner">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th className="p-4 text-left border-b border-[var(--border)] text-[var(--text-secondary)] font-bold uppercase tracking-wider text-sm sticky left-0 z-10 bg-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between">
                    <span>Cation</span>
                    <span className="text-[10px]">Anion <ChevronRight size={14} className="inline" /></span>
                  </div>
                </th>
                {filteredAnions.map(a => (
                  <th key={a} className="p-4 text-center border-b border-l border-[var(--border)] text-[var(--text-primary)] font-bold text-lg">
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
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[var(--bg-card)] transition-colors border-b border-[var(--border)] group"
                >
                  <td className="p-4 font-bold text-[var(--text-primary)] text-lg sticky left-0 z-10 bg-[var(--bg-primary)] group-hover:bg-[var(--bg-card)] transition-colors border-r border-[var(--border)]">
                    {cation}
                  </td>
                  {filteredAnions.map(anion => {
                    const state = SOLUBILITY_MATRIX[cation][anion];
                    const isSelected = selectedPair?.cation === cation && selectedPair?.anion === anion;
                    return (
                      <td key={anion} className="p-2 border-l border-[var(--border)]">
                        <button
                          onClick={() => handleCellClick(cation, anion)}
                          className={`w-full p-3 rounded-xl font-bold border transition-all duration-300 ${LEGEND[state].color} ${isSelected ? 'ring-2 ring-sky-500 scale-[1.02] shadow-md' : 'hover:scale-[1.02] hover:shadow-sm'}`}
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
          
          <div className="flex flex-wrap gap-6 p-6 justify-center text-sm font-medium border-t border-[var(--border)] bg-[var(--bg-secondary)]">
            {Object.entries(LEGEND).map(([k, v]) => (
               <div key={k} className="flex items-center gap-3">
                 <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ${v.color}`}>{k.toUpperCase()}</span>
                 <span className="text-[var(--text-secondary)] tracking-wide">{v.label}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Selected Details Panel */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-6 h-fit sticky top-20 shadow-lg">
          <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Compound Details</h4>
          
          {selectedPair ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedPair.cation}-${selectedPair.anion}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-4xl font-extrabold font-['Space_Grotesk'] text-[var(--text-primary)] mb-2 flex items-center gap-3">
                  {selectedPair.cation.replace(/[^a-zA-Z]/g, '')}{selectedPair.anion.replace(/[^a-zA-Z]/g, '')}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mb-8 flex items-center gap-2">
                  <Info size={16} /> Ionic Compound Analysis
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
                  <div className="relative w-full h-40 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] flex items-center justify-center overflow-hidden shadow-inner">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/10 pointer-events-none" />
                     <div className="relative flex flex-col items-center">
                       <Droplets className="text-sky-400 mb-2 opacity-50" size={24} />
                       <div className="relative">
                         <Beaker size={64} className="text-[var(--text-secondary)] stroke-1" />
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 24, opacity: 1 }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="absolute bottom-[6px] left-[14px] w-[36px] bg-sky-500/20 rounded-b-lg flex items-end justify-center overflow-hidden" 
                         >
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: 12 }}
                             transition={{ duration: 2, delay: 0.5 }}
                             className="w-[28px] bg-[var(--text-secondary)]/80 blur-[1px] rounded-full mb-1" 
                           />
                         </motion.div>
                       </div>
                     </div>
                     <span className="absolute top-3 left-4 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Precipitation Demo</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center text-[var(--text-secondary)] py-10">
              Select an ion pair from the table to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
