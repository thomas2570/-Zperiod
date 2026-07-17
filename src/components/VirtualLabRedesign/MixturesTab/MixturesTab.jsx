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
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold font-['Space_Grotesk'] text-[var(--text-primary)]">
          Mixtures & Solutions
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-lg">Explore how substances combine, dissolve, and separate.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {SUBTABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-sky-400/20 to-indigo-500/20 text-sky-500 border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-sky-400/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-[var(--bg-secondary)] backdrop-blur-md border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
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
