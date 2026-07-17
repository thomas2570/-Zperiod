import React from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'lab', label: 'Virtual Lab', icon: '🧪' },
  { id: 'experiments', label: 'Experiments', icon: '🔥' },
  { id: 'mixtures', label: 'Mixtures & Solutions', icon: '🧬' },
];

export default function TopTabBar({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0a0d14]/80 border-b border-slate-200 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-['Space_Grotesk'] tracking-wide">{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-slate-200/50 dark:bg-white/10 rounded-full border border-slate-300 dark:border-white/20 z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400/10 to-indigo-500/10 dark:from-[#00e5ff]/20 dark:to-[#7c3aed]/20 blur-md"></div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
