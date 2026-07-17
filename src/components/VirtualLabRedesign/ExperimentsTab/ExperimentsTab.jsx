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
        <p className="text-slate-400 mt-3 text-lg max-w-2xl">Step-by-step interactive labs with real-time simulations, quizzes, and downloadable PDF reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {EXPERIMENTS.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] overflow-hidden hover:border-slate-500/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col"
            onClick={() => {
              if (exp.id === 'flame-test') setActiveExperiment(exp.id);
              else alert('This experiment will be available in Phase 3!');
            }}
          >
            {/* Thumbnail Header */}
            <div className={`h-48 bg-gradient-to-br ${exp.color} relative overflow-hidden flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
              <motion.span 
                className="text-7xl drop-shadow-2xl relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {exp.icon}
              </motion.span>
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-5">
                <span className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold text-slate-200 tracking-wide uppercase">
                  {exp.category}
                </span>
                <span className="text-slate-400 text-sm font-semibold flex items-center gap-1">
                  ⏱️ {exp.time}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk'] group-hover:text-[#00e5ff] transition-colors">{exp.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{exp.desc}</p>
              
              <div className="flex justify-between items-center border-t border-slate-700/50 pt-6 mt-auto">
                <span className={`text-sm font-extrabold uppercase tracking-widest ${exp.difficulty === 'Beginner' ? 'text-emerald-400' : exp.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {exp.difficulty}
                </span>
                <button className="flex items-center gap-2 text-[#00e5ff] text-sm font-bold group-hover:text-white transition-colors">
                  Start Lab 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
