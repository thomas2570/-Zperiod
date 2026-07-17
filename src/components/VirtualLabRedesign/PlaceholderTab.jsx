import React from 'react';
import { motion } from 'framer-motion';

export default function PlaceholderTab({ title, description, icon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8"
    >
      <div className="w-24 h-24 mb-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(124,58,237,0.2)]">
        {icon}
      </div>
      <h2 className="text-4xl font-extrabold font-['Space_Grotesk'] text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
        {title}
      </h2>
      <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
        {description}
      </p>
      
      <div className="mt-12 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[#00e5ff] font-semibold text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
        Under Construction (Phase 2 & Beyond)
      </div>
    </motion.div>
  );
}
