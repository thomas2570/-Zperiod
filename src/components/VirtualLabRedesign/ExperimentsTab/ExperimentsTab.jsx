import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlameTestExperiment from './FlameTestExperiment';
// import AcidBaseTitration from './AcidBaseTitration'; // Placeholder for future

const EXPERIMENTS = [
  {
    id: 'flame-test',
    title: 'Flame Test Analysis',
    category: 'Chemistry',
    difficulty: 'Beginner',
    time: '15 mins',
    desc: 'Identify unknown metal ions by observing their emission spectra when heated.',
    icon: '🔥',
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'titration',
    title: 'Acid-Base Titration',
    category: 'Chemistry',
    difficulty: 'Intermediate',
    time: '30 mins',
    desc: 'Determine the unknown concentration of an acid using a standard base solution and phenolphthalein.',
    icon: '💧',
    color: 'from-sky-400 to-indigo-500'
  },
  {
    id: 'electrolysis',
    title: 'Electrolysis of Water',
    category: 'Chemistry',
    difficulty: 'Advanced',
    time: '20 mins',
    desc: 'Use electricity to split water into hydrogen and oxygen gas at the electrodes.',
    icon: '⚡',
    color: 'from-emerald-400 to-teal-600'
  }
];

export default function ExperimentsTab() {
  const [activeExperiment, setActiveExperiment] = useState(null);

  if (activeExperiment === 'flame-test') {
    return (
      <div className="p-8 w-full max-w-[1400px] mx-auto">
        <FlameTestExperiment onBack={() => setActiveExperiment(null)} />
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto min-h-[80vh]">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-extrabold font-['Space_Grotesk'] text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]">
          Guided Experiments
        </h2>
        <p className="text-slate-400 mt-2 text-lg">Step-by-step interactive labs with quizzes and PDF reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EXPERIMENTS.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            onClick={() => {
              if (exp.id === 'flame-test') setActiveExperiment(exp.id);
              else alert('This experiment will be available in Phase 3!');
            }}
          >
            {/* Thumbnail Header */}
            <div className={`h-32 bg-gradient-to-br ${exp.color} relative overflow-hidden flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20" />
              <span className="text-6xl drop-shadow-lg relative z-10">{exp.icon}</span>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-300">
                  {exp.category}
                </span>
                <span className="text-slate-500 text-sm font-medium">{exp.time}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6">{exp.desc}</p>
              
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className={`text-sm font-bold ${exp.difficulty === 'Beginner' ? 'text-emerald-400' : exp.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {exp.difficulty}
                </span>
                <button className="text-sky-400 text-sm font-bold group-hover:text-sky-300 transition-colors">
                  Start Lab →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
