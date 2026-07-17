import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Flame, Magnet, ChevronRight, Play } from 'lucide-react';

const METHODS = [
  { id: 'filtration', name: 'Filtration', desc: 'Separates an insoluble solid from a liquid.', icon: Filter },
  { id: 'evaporation', name: 'Evaporation', desc: 'Separates a soluble solid from a liquid by heating.', icon: Flame },
  { id: 'magnetic', name: 'Magnetic Separation', desc: 'Separates magnetic materials (like iron) from non-magnetic ones.', icon: Magnet },
];

export default function SeparationMethods() {
  const [activeMethod, setActiveMethod] = useState('filtration');
  const [isRunning, setIsRunning] = useState(false);

  const startAnimation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 4000);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-lg w-full max-w-7xl mx-auto">
      <div className="mb-10">
        <h3 className="text-3xl font-bold text-[var(--text-primary)] font-['Space_Grotesk'] mb-2">Separation Methods Lab</h3>
        <p className="text-[var(--text-secondary)]">Interactive high-fidelity simulations for physical separation techniques.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          {METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => { setActiveMethod(m.id); setIsRunning(false); }}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 group flex items-start gap-4 ${
                activeMethod === m.id 
                  ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                  : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-sky-500/30'
              }`}
            >
              <div className={`p-3 rounded-xl transition-colors ${activeMethod === m.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] group-hover:text-sky-400'}`}>
                <m.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className={`font-bold text-lg mb-1 transition-colors ${activeMethod === m.id ? 'text-sky-500' : 'text-[var(--text-primary)] group-hover:text-sky-400'}`}>{m.name}</div>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{m.desc}</div>
              </div>
              <div className={`mt-1 transition-transform duration-300 ${activeMethod === m.id ? 'translate-x-1 opacity-100 text-sky-500' : 'opacity-0 -translate-x-2'}`}>
                 <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[500px] shadow-inner">
          <AnimatePresence mode="wait">
            {activeMethod === 'filtration' && (
              <motion.div key="filt" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.95}} transition={{duration:0.3}} className="flex flex-col items-center relative w-full h-full justify-center">
                
                <div className="relative flex flex-col items-center mt-10">
                  {/* Modern Filter Icon representation */}
                  <Filter size={80} strokeWidth={1} className="text-[var(--text-secondary)] relative z-10" />
                  
                  {/* Beaker Below */}
                  <div className="w-32 h-32 border-b-4 border-l-4 border-r-4 border-[var(--border)] rounded-b-2xl relative mt-4 overflow-hidden flex items-end">
                     <motion.div 
                       initial={{ height: '0%' }}
                       animate={{ height: isRunning ? '70%' : '0%' }}
                       transition={{ duration: 4, ease: "linear" }}
                       className="w-full bg-blue-500/20"
                     >
                       <div className="w-full h-1 bg-white/30 absolute top-0" />
                     </motion.div>
                  </div>

                  {/* High-fidelity Dripping Water */}
                  {isRunning && (
                    <motion.div 
                      animate={{ y: [0, 60], opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeIn" }}
                      className="absolute top-[85px] w-2 h-4 bg-blue-400/80 rounded-full blur-[1px] shadow-[0_0_10px_rgba(96,165,250,0.8)] z-0"
                    />
                  )}

                  {/* Impurities trapped in filter */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isRunning ? 1 : 0 }}
                    transition={{ delay: 2, duration: 2 }}
                    className="absolute top-[40px] w-12 h-6 bg-amber-600/40 rounded-full blur-md z-20"
                  />
                </div>
              </motion.div>
            )}

            {/* Evaporation Sim */}
            {activeMethod === 'evaporation' && (
              <motion.div key="evap" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.95}} transition={{duration:0.3}} className="flex flex-col items-center relative w-full h-full justify-center">
                <div className="relative flex flex-col items-center">
                  
                  {/* Vapor Particles */}
                  {isRunning && (
                    <div className="absolute top-[-80px] flex gap-6">
                      {[1,2,3,4].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ y: -60, opacity: [0, 0.4, 0], scale: [1, 2] }}
                          transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                          className="w-8 h-8 bg-sky-200/20 rounded-full blur-xl"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Modern Evaporating Dish */}
                  <div className="w-48 h-16 border-b-4 border-[var(--border)] rounded-b-[100px] relative overflow-hidden flex items-end justify-center shadow-lg">
                    <motion.div 
                      initial={{ height: '80%' }}
                      animate={{ height: isRunning ? '0%' : '80%' }}
                      transition={{ duration: 4, ease: "easeInOut" }}
                      className="w-full bg-blue-500/30 absolute bottom-0"
                    />
                    {/* Crystallizing salt */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isRunning ? 1 : 0 }}
                      transition={{ duration: 2, delay: 2.5 }}
                      className="w-32 h-6 bg-white/80 blur-[2px] absolute bottom-1 rounded-[100px] shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                  
                  {/* Burner Flame */}
                  <div className="w-6 h-16 bg-[var(--text-secondary)] mt-8 relative rounded-t-sm shadow-md">
                    {isRunning && (
                      <motion.div 
                        animate={{ scaleY: [0.9, 1.2, 1], scaleX: [0.9, 1.1, 0.9] }}
                        transition={{ repeat: Infinity, duration: 0.15 }}
                        className="absolute top-[-40px] left-[-10px] w-10 h-10 bg-blue-500 rounded-full blur-md opacity-90 mix-blend-screen"
                        style={{ transformOrigin: 'bottom' }}
                      >
                         <div className="w-6 h-6 bg-cyan-300 absolute bottom-0 left-2 rounded-full blur-sm" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Magnetic Sim */}
            {activeMethod === 'magnetic' && (
              <motion.div key="mag" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.95}} transition={{duration:0.3}} className="flex flex-col items-center relative w-full h-full justify-center h-[300px]">
                
                {/* Advanced Magnet Graphic */}
                <motion.div 
                  initial={{ y: -150 }}
                  animate={{ y: isRunning ? -40 : -150 }}
                  transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                  className="absolute top-0 z-20 flex flex-col items-center"
                >
                  <Magnet size={100} strokeWidth={1} className="text-rose-500 fill-rose-500/10 drop-shadow-[0_10px_20px_rgba(244,63,94,0.3)] rotate-180" />
                  
                  {/* Magnetic Field Lines */}
                  {isRunning && (
                    <motion.div 
                      animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-32 h-16 border-t-2 border-rose-500/30 rounded-t-full absolute bottom-[-20px] blur-sm"
                    />
                  )}
                </motion.div>

                {/* Mixture pile */}
                <div className="absolute bottom-10 w-48 h-16 bg-amber-100/10 rounded-t-[100px] flex items-center justify-center overflow-hidden border border-[var(--border)] border-b-0 shadow-inner">
                   {/* Iron filings */}
                   {[...Array(30)].map((_, i) => (
                     <motion.div
                       key={i}
                       initial={{ y: 0, x: 0 }}
                       animate={{ 
                         y: isRunning ? -120 : 0, 
                         x: isRunning ? (Math.random() - 0.5) * 40 : 0 
                       }}
                       transition={{ duration: 0.6, delay: Math.random() * 0.3, ease: "easeIn" }}
                       className="absolute w-3 h-1 bg-[var(--text-primary)] rounded-full shadow-lg"
                       style={{ left: `${15 + Math.random() * 70}%`, bottom: `${Math.random() * 30}px`, transform: `rotate(${Math.random() * 180}deg)` }}
                     />
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 md:bottom-8 flex gap-4 w-full px-8">
            <button 
              onClick={startAnimation}
              disabled={isRunning}
              className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-2xl disabled:opacity-50 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:bg-sky-400 transition-all flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              {isRunning ? 'Running Simulation...' : 'Start Separation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
