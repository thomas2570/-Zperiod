import React from 'react';
import { motion } from 'framer-motion';
import AtomModel3D from './AtomModel3D';

export default function ElementDrawer({ element, onClose }) {
  if (!element) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0a0d14]/60 backdrop-blur-sm z-[60]"
      />
      
      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0d14] border-l border-white/10 shadow-2xl z-[70] overflow-y-auto no-scrollbar flex flex-col"
      >
        <div className="p-6 flex justify-between items-center border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold font-['Space_Grotesk'] text-white border border-white/20">
              {element.symbol}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">{element.name}</h2>
              <p className="text-sm text-slate-400 capitalize">Atomic Number: {element.atomic}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* 3D Model Viewport */}
          <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10 relative">
            <AtomModel3D element={element} />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/50 backdrop-blur text-xs font-bold text-sky-400 border border-sky-500/30">
              Interactive 3D Model
            </div>
          </div>
          
          {/* Unsplash Real Image Fallback (mocked via source.unsplash.com with chemical terms) */}
          <div className="h-40 w-full rounded-2xl overflow-hidden border border-white/10 relative">
            <img 
              src={`https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=800&auto=format&fit=crop`} 
              alt={element.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-sm font-bold text-white">Visual Reference</span>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-4">Properties</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Category</span>
                <span className="text-white font-medium capitalize">{element.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Atomic Mass</span>
                <span className="text-white font-medium">{element.mass} u</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Electronegativity</span>
                <span className="text-white font-medium">{element.atomic > 2 ? '2.1' : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 text-sm">State at 20°C</span>
                <span className="text-white font-medium">Solid / Gas</span>
              </div>
            </div>
          </div>
          
          {/* Add to Lab Bench Button */}
          <button className="w-full py-4 mt-auto rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] text-white font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all transform hover:scale-[1.02] active:scale-95">
            Add to Lab Bench
          </button>
        </div>
      </motion.div>
    </>
  );
}
