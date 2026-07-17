import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MixtureClassifier from './MixtureClassifier';
import SolutionMaker from './SolutionMaker';
import SolubilityRules from './SolubilityRules';
import SeparationMethods from './SeparationMethods';

export default function MixturesTab() {
  const [activeSection, setActiveSection] = useState('classifier');

  const SECTIONS = [
    { id: 'classifier', label: 'Mixture Classifier', icon: '🔍' },
    { id: 'maker', label: 'Solution Maker', icon: '💧' },
    { id: 'solubility', label: 'Solubility Rules', icon: '📊' },
    { id: 'separation', label: 'Separation Methods', icon: '⚗️' },
  ];

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto min-h-[80vh]">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-extrabold font-['Space_Grotesk'] text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]">
          Mixtures & Solutions
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Explore how substances combine, dissolve, and separate.</p>
      </div>

      {/* Internal Navigation */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeSection === sec.id
                ? 'bg-gradient-to-r from-[#00e5ff]/20 to-[#7c3aed]/20 text-white border border-[#00e5ff]/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            <span>{sec.icon}</span>
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'classifier' && <MixtureClassifier />}
            {activeSection === 'maker' && <SolutionMaker />}
            {activeSection === 'solubility' && <SolubilityRules />}
            {activeSection === 'separation' && <SeparationMethods />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
