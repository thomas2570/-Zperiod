import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Flame, TestTube } from 'lucide-react';

const TABS = [
  { id: 'lab', label: 'Virtual Lab', icon: <FlaskConical size={18} /> },
  { id: 'experiments', label: 'Experiments', icon: <Flame size={18} /> },
  { id: 'mixtures', label: 'Mixtures & Solutions', icon: <TestTube size={18} /> },
];

export default function TopTabBar({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-0 z-50 w-full flex items-center justify-center p-2 md:p-4 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full max-w-4xl px-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex-shrink-0 ${
                isActive 
                  ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' 
                  : 'text-[var(--text-secondary)] border border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <span className="flex items-center justify-center">{tab.icon}</span>
              <span className="font-['Space_Grotesk'] tracking-wide">{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-sky-500/5 rounded-xl border border-sky-500/30 z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
