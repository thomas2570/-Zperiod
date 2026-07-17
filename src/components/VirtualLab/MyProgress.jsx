import React from 'react';
import { motion } from 'framer-motion';
import { useVirtualLab } from '../../context/VirtualLabContext';

export default function MyProgress() {
  const { completedExperiments, badges } = useVirtualLab();

  const allBadges = [
    { id: 'First Experiment', title: 'First Drop', desc: 'Completed your first virtual experiment.', icon: '🧪', color: 'bg-emerald-500' },
    { id: 'Chemistry Pro', title: 'Chemistry Pro', desc: 'Completed 5 successful experiments.', icon: '🎓', color: 'bg-purple-500' },
    { id: 'Safety First', title: 'Safety First', desc: 'Read all equipment safety guidelines.', icon: '🥽', color: 'bg-amber-500' },
  ];

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800" id="my-progress">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">My Progress</h2>
        <p className="text-slate-400 max-w-2xl text-lg">Track your achievements and completed experiments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stats */}
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 rounded-full bg-sky-500/20 border-4 border-sky-500 flex items-center justify-center mb-6">
            <span className="text-4xl font-extrabold text-sky-400">{completedExperiments.length}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Experiments Completed</h3>
          <p className="text-slate-400">Keep exploring to earn more badges and level up your chemistry skills!</p>
        </div>

        {/* Badges */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🏆 Achievement Badges
          </h3>
          <div className="space-y-4">
            {allBadges.map((badge, i) => {
              const isUnlocked = badges.includes(badge.id);
              return (
                <motion.div 
                  key={badge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border ${isUnlocked ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'}`}
                >
                  <div className={`w-12 h-12 shrink-0 rounded-full ${badge.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{badge.title}</h4>
                    <p className="text-sm text-slate-400">{badge.desc}</p>
                  </div>
                  {isUnlocked && (
                    <div className="ml-auto text-emerald-400">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
