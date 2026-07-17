import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ElementDrawer from './ElementDrawer';

// Simplified Elements Data (First 18 for Phase 1 Demo)
const ELEMENTS = [
  { atomic: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', col: 1, row: 1 },
  { atomic: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'noble', col: 18, row: 1 },
  { atomic: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali', col: 1, row: 2 },
  { atomic: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'alkaline', col: 2, row: 2 },
  { atomic: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', col: 13, row: 2 },
  { atomic: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'nonmetal', col: 14, row: 2 },
  { atomic: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'nonmetal', col: 15, row: 2 },
  { atomic: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'nonmetal', col: 16, row: 2 },
  { atomic: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'halogen', col: 17, row: 2 },
  { atomic: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'noble', col: 18, row: 2 },
  { atomic: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'alkali', col: 1, row: 3 },
  { atomic: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline', col: 2, row: 3 },
  { atomic: 13, symbol: 'Al', name: 'Aluminum', mass: 26.982, category: 'metal', col: 13, row: 3 },
  { atomic: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'metalloid', col: 14, row: 3 },
  { atomic: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'nonmetal', col: 15, row: 3 },
  { atomic: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'nonmetal', col: 16, row: 3 },
  { atomic: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', col: 17, row: 3 },
  { atomic: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'noble', col: 18, row: 3 },
];

const CAT_COLORS = {
  nonmetal: 'from-[#10b981]/20 to-[#10b981]/10 border-[#10b981]/30 hover:border-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] text-[#10b981]',
  noble: 'from-[#c084fc]/20 to-[#c084fc]/10 border-[#c084fc]/30 hover:border-[#c084fc] hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] text-[#c084fc]',
  alkali: 'from-[#f59e0b]/20 to-[#f59e0b]/10 border-[#f59e0b]/30 hover:border-[#f59e0b] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] text-[#f59e0b]',
  alkaline: 'from-[#fcd34d]/20 to-[#fcd34d]/10 border-[#fcd34d]/30 hover:border-[#fcd34d] hover:shadow-[0_0_15px_rgba(252,211,77,0.4)] text-[#fcd34d]',
  metalloid: 'from-[#00e5ff]/20 to-[#00e5ff]/10 border-[#00e5ff]/30 hover:border-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] text-[#00e5ff]',
  halogen: 'from-[#ec4899]/20 to-[#ec4899]/10 border-[#ec4899]/30 hover:border-[#ec4899] hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] text-[#ec4899]',
  metal: 'from-[#94a3b8]/20 to-[#94a3b8]/10 border-[#94a3b8]/30 hover:border-[#94a3b8] hover:shadow-[0_0_15px_rgba(148,163,184,0.4)] text-[#94a3b8]',
};

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleElementClick = (el) => {
    setSelectedElement(el);
  };

  return (
    <div className="relative min-h-[80vh] p-8 w-full max-w-[1400px] mx-auto">
      {/* Header / Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-['Space_Grotesk'] text-white">Elements Explorer</h2>
          <p className="text-slate-400">Interactive periodic table of elements.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'nonmetal', 'noble', 'alkali', 'metalloid', 'halogen'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                filter === cat 
                  ? 'bg-white/10 border-white/30 text-white' 
                  : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-18 gap-2 overflow-x-auto pb-8 min-w-[800px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
        {ELEMENTS.map(el => {
          const isFaded = filter !== 'all' && filter !== el.category;
          return (
            <motion.button
              key={el.atomic}
              onClick={() => handleElementClick(el)}
              layoutId={`element-${el.atomic}`}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              style={{
                gridColumn: el.col,
                gridRow: el.row
              }}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border bg-gradient-to-br backdrop-blur-md transition-all duration-300 ${CAT_COLORS[el.category]} ${isFaded ? 'opacity-20 grayscale' : 'opacity-100'}`}
            >
              <span className="absolute top-1 left-1.5 text-[0.6rem] font-bold opacity-70">{el.atomic}</span>
              <span className="text-xl font-bold font-['Space_Grotesk']">{el.symbol}</span>
              <span className="text-[0.55rem] uppercase tracking-wider opacity-80 mt-1 truncate w-full px-1">{el.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Side Drawer */}
      <AnimatePresence>
        {selectedElement && (
          <ElementDrawer 
            element={selectedElement} 
            onClose={() => setSelectedElement(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
