import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualWorkbench() {
  const canvasRef = useRef(null);
  
  // State
  const [temperature, setTemperature] = useState(20);
  const [heaterOn, setHeaterOn] = useState(false);
  const [heaterIntensity, setHeaterIntensity] = useState(50);
  const [waterLevel, setWaterLevel] = useState(0); // 0 to 100
  const [activeElement, setActiveElement] = useState('Na');
  const [showElementMenu, setShowElementMenu] = useState(false);
  const [isExploding, setIsExploding] = useState(false); // For Na in water
  
  // Refs for animation loop
  const stateRef = useRef({
    temperature: 20,
    heaterOn: false,
    heaterIntensity: 50,
    waterLevel: 0,
    activeElement: 'Na',
    isExploding: false,
    bubbles: [],
    wavePhase: 0,
    elementDropped: false,
    elementY: 0,
    particles: []
  });

  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      temperature,
      heaterOn,
      heaterIntensity,
      waterLevel,
      activeElement,
      isExploding
    };
  }, [temperature, heaterOn, heaterIntensity, waterLevel, activeElement, isExploding]);

  // Handle heating logic
  useEffect(() => {
    let interval;
    if (heaterOn && waterLevel > 0) {
      interval = setInterval(() => {
        setTemperature(prev => {
          const maxTemp = 20 + (heaterIntensity / 100) * 80; // Max 100C based on heater
          if (prev < maxTemp) return Math.min(prev + 0.5, maxTemp);
          return prev;
        });
      }, 100);
    } else {
      interval = setInterval(() => {
        setTemperature(prev => {
          if (prev > 20) return Math.max(prev - 0.2, 20);
          return prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [heaterOn, heaterIntensity, waterLevel]);

  // Reaction Logic
  useEffect(() => {
    if (activeElement === 'Na' && stateRef.current.elementDropped && waterLevel > 0 && !isExploding) {
      // Sodium + Water reaction
      setTimeout(() => setIsExploding(true), 1000);
    }
  }, [waterLevel, stateRef.current.elementDropped, activeElement]);

  // Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 50;
      const beakerW = 120;
      const beakerH = 180;
      const beakerLeft = cx - beakerW / 2;
      const beakerTop = cy - beakerH / 2;

      // Draw Burner underneath
      if (state.heaterOn) {
        // Burner Base
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 15, cy + beakerH / 2 + 10, 30, 40);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 25, cy + beakerH / 2 + 45, 50, 10);
        
        // Flame
        const flameH = (state.heaterIntensity / 100) * 40;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy + beakerH / 2 + 10);
        ctx.quadraticCurveTo(cx, cy + beakerH / 2 + 10 - flameH - Math.random() * 10, cx + 10, cy + beakerH / 2 + 10);
        ctx.fillStyle = `rgba(239, 68, 68, ${0.7 + Math.random() * 0.3})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + beakerH / 2 + 10);
        ctx.quadraticCurveTo(cx, cy + beakerH / 2 + 10 - flameH * 0.6 - Math.random() * 5, cx + 5, cy + beakerH / 2 + 10);
        ctx.fillStyle = `rgba(250, 204, 21, ${0.8 + Math.random() * 0.2})`;
        ctx.fill();
      }

      // Draw Water with wave
      if (state.waterLevel > 0) {
        const waterHeight = (state.waterLevel / 100) * (beakerH - 20);
        const waterY = cy + beakerH / 2 - 10 - waterHeight;
        
        state.wavePhase += 0.05;
        
        ctx.beginPath();
        ctx.moveTo(beakerLeft + 5, cy + beakerH / 2 - 10);
        ctx.lineTo(beakerLeft + 5, waterY);
        
        // Wave logic
        const waveAmp = state.temperature > 50 ? 5 + (state.temperature - 50) * 0.1 : 2;
        for (let x = beakerLeft + 5; x <= beakerLeft + beakerW - 5; x++) {
          const y = waterY + Math.sin((x - beakerLeft) * 0.05 + state.wavePhase) * waveAmp;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(beakerLeft + beakerW - 5, cy + beakerH / 2 - 10);
        ctx.quadraticCurveTo(beakerLeft + beakerW - 5, cy + beakerH / 2 - 5, beakerLeft + beakerW - 10, cy + beakerH / 2);
        ctx.lineTo(beakerLeft + 10, cy + beakerH / 2);
        ctx.quadraticCurveTo(beakerLeft + 5, cy + beakerH / 2 - 5, beakerLeft + 5, cy + beakerH / 2 - 10);
        
        ctx.fillStyle = state.isExploding ? 'rgba(239, 68, 68, 0.6)' : '#3b82f6';
        ctx.fill();
        
        // Draw "particle" circles in water for the stylized look from image
        ctx.fillStyle = state.isExploding ? 'rgba(248, 113, 113, 0.8)' : '#60a5fa';
        for(let i=0; i<3; i++) {
          for(let j=0; j<Math.floor(waterHeight/20); j++) {
            ctx.beginPath();
            ctx.arc(beakerLeft + 20 + i*40, cy + beakerH/2 - 20 - j*20, 15, 0, Math.PI*2);
            ctx.fill();
          }
        }

        // Bubbles if heating
        if (state.temperature > 40) {
          if (Math.random() < (state.temperature - 40) / 100) {
            state.bubbles.push({
              x: beakerLeft + 10 + Math.random() * (beakerW - 20),
              y: cy + beakerH / 2 - 10,
              size: Math.random() * 4 + 2,
              speed: Math.random() * 2 + 1
            });
          }
        }
        
        // Explosion particles
        if (state.isExploding) {
           if (Math.random() < 0.3) {
             state.particles.push({
               x: cx,
               y: waterY,
               vx: (Math.random() - 0.5) * 10,
               vy: -Math.random() * 15 - 5,
               life: 1.0,
               color: Math.random() > 0.5 ? '#facc15' : '#ef4444'
             });
           }
        }

        // Update and draw bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = state.bubbles.length - 1; i >= 0; i--) {
          const b = state.bubbles[i];
          b.y -= b.speed;
          // wiggle
          b.x += Math.sin(b.y * 0.1) * 1;
          
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();
          
          if (b.y < waterY) state.bubbles.splice(i, 1);
        }
        
        // Update and draw explosion particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.5; // gravity
          p.life -= 0.02;
          
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          
          if (p.life <= 0) state.particles.splice(i, 1);
        }
      }

      // Draw Beaker Glass
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(beakerLeft, beakerTop);
      ctx.lineTo(beakerLeft, beakerTop + beakerH - 10);
      ctx.quadraticCurveTo(beakerLeft, beakerTop + beakerH, beakerLeft + 10, beakerTop + beakerH);
      ctx.lineTo(beakerLeft + beakerW - 10, beakerTop + beakerH);
      ctx.quadraticCurveTo(beakerLeft + beakerW, beakerTop + beakerH, beakerLeft + beakerW, beakerTop + beakerH - 10);
      ctx.lineTo(beakerLeft + beakerW, beakerTop);
      ctx.stroke();

      // Measurement lines
      ctx.beginPath();
      ctx.lineWidth = 2;
      for(let i=1; i<=5; i++) {
        const y = beakerTop + beakerH - (i * (beakerH-20) / 5) - 10;
        ctx.moveTo(beakerLeft + beakerW - 15, y);
        ctx.lineTo(beakerLeft + beakerW - 5, y);
      }
      ctx.stroke();

      // Dropped Element
      if (state.elementDropped && !state.isExploding) {
        state.elementY += 5; // fall speed
        const limitY = cy + beakerH/2 - 20;
        if (state.elementY > limitY) state.elementY = limitY;
        
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 15, state.elementY, 30, 30);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.activeElement, cx, state.elementY + 20);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleAddWater = () => {
    setWaterLevel(prev => Math.min(prev + 20, 100));
  };

  const handleReset = () => {
    setWaterLevel(0);
    setTemperature(20);
    setHeaterOn(false);
    setIsExploding(false);
    stateRef.current.elementDropped = false;
    stateRef.current.elementY = 0;
    stateRef.current.particles = [];
  };

  const handleDropElement = () => {
    stateRef.current.elementDropped = true;
    stateRef.current.elementY = canvasRef.current.height / 2 - 150; // Drop from top
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Main App Container */}
      <div className="w-full max-w-6xl h-[80vh] bg-white dark:bg-[#111827] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col relative overflow-hidden border border-slate-200 dark:border-white/5">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-sans">Virtual Lab</h2>
          <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors">
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex">
          
          {/* Canvas Background Area */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0a0d14] dark:to-[#111827]">
            <canvas 
              ref={canvasRef}
              width={1000}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Left Vertical Slider (Temperature) */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-full py-6 px-3 shadow-xl dark:shadow-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center gap-4">
            <div className="relative h-48 w-4 bg-slate-100 dark:bg-slate-900 rounded-full flex flex-col justify-end overflow-hidden">
               {/* Thermometer fill */}
               <motion.div 
                 className="w-full bg-blue-500 rounded-full"
                 animate={{ height: `${temperature}%` }}
                 transition={{ duration: 0.2 }}
               />
               {/* Handle dot */}
               <motion.div 
                 className="absolute w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-md -left-1"
                 animate={{ bottom: `calc(${temperature}% - 12px)` }}
                 transition={{ duration: 0.2 }}
               />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-slate-700 dark:text-white">{Math.round(temperature)}°</div>
              <div className="text-[10px] font-bold text-slate-400">TEMP</div>
            </div>
          </div>

          {/* Bottom Left Heater Control */}
          <div className="absolute bottom-8 left-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-white/5 min-w-[160px]">
             <div className="text-[10px] font-bold text-slate-400 mb-2 text-center tracking-wider">HEATER</div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setHeaterOn(!heaterOn)}
                 className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${heaterOn ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}
               >
                 <span>🔥</span>
                 {heaterOn ? 'ON' : 'OFF'}
               </button>
               <input 
                 type="range" 
                 min="0" max="100" 
                 value={heaterIntensity}
                 onChange={e => setHeaterIntensity(Number(e.target.value))}
                 className="w-full accent-slate-400"
               />
             </div>
          </div>

          {/* Bottom Center Actions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
             <button 
               onClick={handleAddWater}
               className="px-6 py-3 bg-slate-700 hover:bg-slate-800 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
             >
               + Add Water
             </button>
             <button 
               onClick={handleReset}
               className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl shadow-lg border border-slate-100 dark:border-white/5 transition-all flex items-center gap-2"
             >
               ↺ Reset
             </button>
             <div className="relative">
               <button 
                 onClick={() => setShowElementMenu(!showElementMenu)}
                 className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl shadow-lg border border-slate-100 dark:border-white/5 transition-all flex items-center gap-2"
               >
                 ✎ Element
               </button>
               
               {/* Element Menu Dropdown */}
               <AnimatePresence>
                 {showElementMenu && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute bottom-full mb-2 left-0 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 p-2 flex flex-col gap-1"
                   >
                     {['Na', 'K', 'Li'].map(el => (
                       <button 
                         key={el}
                         onClick={() => { setActiveElement(el); setShowElementMenu(false); }}
                         className={`p-2 rounded-lg font-bold text-center ${activeElement === el ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                       >
                         {el}
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>

          {/* Bottom Right Element Stand */}
          <div className="absolute bottom-12 right-24 flex flex-col items-center">
            {/* The Element Block */}
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDropElement}
              className="w-16 h-16 bg-slate-300 dark:bg-slate-600 rounded-lg shadow-lg flex items-center justify-center border-b-4 border-slate-400 dark:border-slate-700 cursor-pointer relative z-10"
            >
              <span className="text-xl font-bold text-rose-500">{activeElement}</span>
            </motion.button>
            {/* The Stool */}
            <div className="w-20 h-4 bg-amber-800 rounded-sm mt-1" />
            <div className="flex gap-10">
              <div className="w-3 h-8 bg-amber-900 rounded-b-sm" />
              <div className="w-3 h-8 bg-amber-900 rounded-b-sm" />
            </div>
            <div className="absolute -bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Click to Drop</div>
          </div>

          {/* Help Button */}
          <button className="absolute bottom-6 right-6 w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-md border border-slate-200 dark:border-white/5">
            ?
          </button>

        </div>
      </div>
    </div>
  );
}
