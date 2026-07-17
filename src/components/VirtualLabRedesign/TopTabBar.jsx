import React from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'lab', label: 'Virtual Lab', icon: '🧪' },
  { id: 'experiments', label: 'Experiments', icon: '🔥' },
  { id: 'mixtures', label: 'Mixtures & Solutions', icon: '🧬' },
];

export default function TopTabBar({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-0 z-50 w-full flex items-center justify-center p-4">
      <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-2 rounded-full border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] text-white shadow-[0_0_20px_rgba(0,229,255,0.3)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
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
