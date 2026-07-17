import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const METHODS = [
  { id: 'filtration', name: 'Filtration', desc: 'Separates an insoluble solid from a liquid.' },
  { id: 'evaporation', name: 'Evaporation', desc: 'Separates a soluble solid from a liquid by heating.' },
  { id: 'magnetic', name: 'Magnetic Separation', desc: 'Separates magnetic materials (like iron) from non-magnetic ones.' },
];

export default function SeparationMethods() {
  const [activeMethod, setActiveMethod] = useState('filtration');
  const [isRunning, setIsRunning] = useState(false);

  const startAnimation = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 4000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-lg">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">Separation Methods Lab</h3>
        <p className="text-slate-400">Interactive mini-simulations for physical separation techniques.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-3">
          {METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => { setActiveMethod(m.id); setIsRunning(false); }}
              className={`text-left p-4 rounded-xl border transition-all ${
                activeMethod === m.id 
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-lg text-white mb-1">{m.name}</div>
              <div className="text-xs">{m.desc}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[400px]">
          {/* Filtration Sim */}
          <AnimatePresence mode="wait">
            {activeMethod === 'filtration' && (
              <motion.div key="filt" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center relative">
                {/* Funnel */}
                <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[60px] border-t-white/30 relative z-10" />
                <div className="w-4 h-12 bg-white/30 relative z-10" />
                
                {/* Beaker */}
                <div className="w-24 h-24 border-b-2 border-l-2 border-r-2 border-white/20 rounded-b-lg relative mt-2 overflow-hidden flex items-end">
                   <motion.div 
                     initial={{ height: '0%' }}
                     animate={{ height: isRunning ? '60%' : '0%' }}
                     transition={{ duration: 3, delay: 0.5 }}
                     className="w-full bg-blue-500/30"
                   />
                </div>

                {/* Dripping Water */}
                {isRunning && (
                  <motion.div 
                    animate={{ y: [0, 40], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute top-[80px] w-1 h-3 bg-blue-400 rounded-full z-0"
                  />
                )}

                {/* Sand left in funnel */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isRunning ? 1 : 0 }}
                  transition={{ delay: 2.5 }}
                  className="absolute top-[20px] w-10 h-4 bg-amber-600/80 rounded-full blur-[2px] z-20"
                />
              </motion.div>
            )}

            {/* Evaporation Sim */}
            {activeMethod === 'evaporation' && (
              <motion.div key="evap" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center relative">
                {/* Vapor */}
                {isRunning && (
                  <div className="absolute top-[-40px] flex gap-4">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ y: -40, opacity: [0, 0.5, 0], scale: [1, 1.5] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                        className="w-4 h-4 bg-white/20 rounded-full blur-md"
                      />
                    ))}
                  </div>
                )}
                
                {/* Dish */}
                <div className="w-32 h-10 border-b-2 border-white/40 rounded-b-full relative overflow-hidden flex items-end justify-center">
                  <motion.div 
                    initial={{ height: '80%' }}
                    animate={{ height: isRunning ? '0%' : '80%' }}
                    transition={{ duration: 3 }}
                    className="w-full bg-blue-500/50 absolute bottom-0"
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isRunning ? 1 : 0 }}
                    transition={{ duration: 1, delay: 2.5 }}
                    className="w-20 h-4 bg-white/90 blur-[1px] absolute bottom-1 rounded-full"
                  />
                </div>
                
                {/* Bunsen Burner */}
                <div className="w-4 h-12 bg-slate-600 mt-4 relative">
                  {isRunning && (
                    <motion.div 
                      animate={{ scaleY: [0.9, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 0.2 }}
                      className="absolute top-[-24px] left-[-4px] w-6 h-6 bg-blue-500 rounded-full blur-[2px] opacity-80"
                      style={{ transformOrigin: 'bottom' }}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Magnetic Sim */}
            {activeMethod === 'magnetic' && (
              <motion.div key="mag" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center relative h-[200px]">
                {/* Mixture pile */}
                <div className="absolute bottom-0 w-32 h-10 bg-amber-100/20 rounded-t-full flex items-center justify-center overflow-hidden">
                   {/* Iron filings */}
                   {[...Array(20)].map((_, i) => (
                     <motion.div
                       key={i}
                       initial={{ y: 0, x: 0 }}
                       animate={{ 
                         y: isRunning ? -60 : 0, 
                         x: isRunning ? (Math.random() - 0.5) * 20 : 0 
                       }}
                       transition={{ duration: 0.5, delay: Math.random() * 0.2 }}
                       className="absolute w-2 h-1 bg-slate-400 rounded-full"
                       style={{ left: `${20 + Math.random() * 60}%`, bottom: `${Math.random() * 20}px`, transform: `rotate(${Math.random() * 180}deg)` }}
                     />
                   ))}
                </div>

                {/* Magnet */}
                <motion.div 
                  initial={{ y: -100 }}
                  animate={{ y: isRunning ? -30 : -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 w-16 h-20 border-[8px] border-rose-500 rounded-t-full flex justify-between"
                  style={{ borderBottom: 'none' }}
                >
                  <div className="w-4 h-4 bg-slate-200 absolute bottom-[-8px] left-[-8px]" />
                  <div className="w-4 h-4 bg-slate-200 absolute bottom-[-8px] right-[-8px]" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 flex gap-4">
            <button 
              onClick={startAnimation}
              disabled={isRunning}
              className="px-6 py-2 bg-[#00e5ff] text-slate-900 font-bold rounded-full disabled:opacity-50 hover:shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all"
            >
              {isRunning ? 'Running Simulation...' : 'Start Separation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
