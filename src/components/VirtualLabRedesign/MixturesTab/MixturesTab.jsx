import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MixtureClassifier from './MixtureClassifier';
import SolutionMaker from './SolutionMaker';
import SolubilityRules from './SolubilityRules';
import SeparationMethods from './SeparationMethods';

const SUBTABS = [
  { id: 'classifier', label: 'Mixture Classifier', icon: '🔍' },
  { id: 'solution', label: 'Solution Maker', icon: '💧' },
  { id: 'solubility', label: 'Solubility Rules', icon: '📊' },
  { id: 'separation', label: 'Separation Methods', icon: '⚗️' }
];

export default function MixturesTab() {
  const [activeTab, setActiveTab] = useState('classifier');

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto min-h-[80vh] flex flex-col">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold font-['Space_Grotesk'] text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]">
          Mixtures & Solutions
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Explore how substances combine, dissolve, and separate.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {SUBTABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00e5ff]/20 to-[#7c3aed]/20 text-white border border-white/20 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/5 to-[#7c3aed]/5 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full relative z-10"
          >
            {activeTab === 'classifier' && <MixtureClassifier />}
            {activeTab === 'solution' && <SolutionMaker />}
            {activeTab === 'solubility' && <SolubilityRules />}
            {activeTab === 'separation' && <SeparationMethods />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
