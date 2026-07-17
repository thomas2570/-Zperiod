import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ELEMENTS = [
  { id: 'Na', name: 'Sodium', type: 'standard', equation: '2Na + 2H₂O → 2NaOH + H₂↑', color: '#facc15' },
  { id: 'Li', name: 'Lithium', type: 'standard', equation: '2Li + 2H₂O → 2LiOH + H₂↑', color: '#f87171' },
  { id: 'NMC', name: 'Negative Mass Carbon', type: 'exotic', equation: 'Δg = -G * (-m / r²) | Field Stabilized', color: '#00e5ff' },
  { id: 'GrC', name: 'Graviton Catalyst', type: 'exotic', equation: '∇ × A = B | Spatiotemporal Warp Active', color: '#7c3aed' }
];

export default function VirtualWorkbench() {
  const canvasRef = useRef(null);
  
  // State
  const [temperature, setTemperature] = useState(20);
  const [heaterOn, setHeaterOn] = useState(false);
  const [heaterIntensity, setHeaterIntensity] = useState(50);
  const [waterLevel, setWaterLevel] = useState(0); 
  const [activeElement, setActiveElement] = useState(ELEMENTS[0]);
  const [showElementMenu, setShowElementMenu] = useState(false);
  const [reactionActive, setReactionActive] = useState(false); 
  
  // Refs for animation loop
  const stateRef = useRef({
    temperature: 20,
    heaterOn: false,
    heaterIntensity: 50,
    waterLevel: 0,
    activeElement: ELEMENTS[0],
    reactionActive: false,
    bubbles: [],
    antiGravParticles: [],
    wavePhase: 0,
    elementDropped: false,
    elementY: 0,
    fluidBaseY: 0
  });

  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      temperature,
      heaterOn,
      heaterIntensity,
      waterLevel,
      activeElement,
      reactionActive
    };
  }, [temperature, heaterOn, heaterIntensity, waterLevel, activeElement, reactionActive]);

  // Heating Logic
  useEffect(() => {
    let interval;
    if (heaterOn && waterLevel > 0) {
      interval = setInterval(() => {
        setTemperature(prev => {
          const maxTemp = 20 + (heaterIntensity / 100) * 80; 
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
    if (stateRef.current.elementDropped && waterLevel > 0 && !reactionActive) {
      setTimeout(() => setReactionActive(true), 1000);
    }
  }, [waterLevel, stateRef.current.elementDropped, activeElement, reactionActive]);

  // Canvas Logic
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
      const beakerW = 140;
      const beakerH = 200;
      const beakerLeft = cx - beakerW / 2;
      const beakerTop = cy - beakerH / 2;

      // Draw Burner underneath
      if (state.heaterOn) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 15, cy + beakerH / 2 + 10, 30, 40);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 25, cy + beakerH / 2 + 45, 50, 10);
        
        const flameH = (state.heaterIntensity / 100) * 50;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy + beakerH / 2 + 10);
        ctx.quadraticCurveTo(cx, cy + beakerH / 2 + 10 - flameH - Math.random() * 10, cx + 10, cy + beakerH / 2 + 10);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.7 + Math.random() * 0.3})`; // Neon cyan burner flame
        ctx.fill();
      }

      const isExotic = state.activeElement.type === 'exotic';
      const isAntiGrav = state.reactionActive && isExotic;

      // Draw Fluid
      if (state.waterLevel > 0) {
        let waterHeight = (state.waterLevel / 100) * (beakerH - 20);
        
        // If anti-gravity is active, the fluid block actually slowly depletes as it turns into flying particles
        if (isAntiGrav) {
           state.waterLevel = Math.max(0, state.waterLevel - 0.2); 
           waterHeight = (state.waterLevel / 100) * (beakerH - 20);
        }

        const waterY = cy + beakerH / 2 - 10 - waterHeight;
        state.wavePhase += 0.05;
        
        if (state.waterLevel > 0) {
          ctx.beginPath();
          ctx.moveTo(beakerLeft + 5, cy + beakerH / 2 - 10);
          ctx.lineTo(beakerLeft + 5, waterY);
          
          const waveAmp = state.temperature > 50 ? 5 + (state.temperature - 50) * 0.1 : 2;
          for (let x = beakerLeft + 5; x <= beakerLeft + beakerW - 5; x++) {
            const y = waterY + Math.sin((x - beakerLeft) * 0.05 + state.wavePhase) * waveAmp;
            ctx.lineTo(x, y);
          }
          
          ctx.lineTo(beakerLeft + beakerW - 5, cy + beakerH / 2 - 10);
          ctx.quadraticCurveTo(beakerLeft + beakerW - 5, cy + beakerH / 2 - 5, beakerLeft + beakerW - 10, cy + beakerH / 2);
          ctx.lineTo(beakerLeft + 10, cy + beakerH / 2);
          ctx.quadraticCurveTo(beakerLeft + 5, cy + beakerH / 2 - 5, beakerLeft + 5, cy + beakerH / 2 - 10);
          
          // Fluid color
          ctx.fillStyle = isAntiGrav ? 'rgba(0, 229, 255, 0.4)' : 'rgba(59, 130, 246, 0.6)';
          ctx.fill();
        }

        // Standard Reaction / Heating Bubbles (Stay in container)
        if (!isAntiGrav && (state.temperature > 40 || state.reactionActive)) {
          if (Math.random() < 0.3) {
            state.bubbles.push({
              x: beakerLeft + 10 + Math.random() * (beakerW - 20),
              y: cy + beakerH / 2 - 10,
              size: Math.random() * 4 + 2,
              speed: Math.random() * 2 + 1
            });
          }
        }
        
        // Anti-Gravity Particles (Fly out of container entirely)
        if (isAntiGrav) {
           if (Math.random() < 0.8) {
             state.antiGravParticles.push({
               x: beakerLeft + Math.random() * beakerW,
               y: waterY + Math.random() * waterHeight,
               vx: (Math.random() - 0.5) * 2,
               vy: -Math.random() * 4 - 2,
               life: 1.0,
               color: Math.random() > 0.5 ? '#00e5ff' : state.activeElement.color,
               size: Math.random() * 6 + 2
             });
           }
        }

        // Draw Standard Bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = state.bubbles.length - 1; i >= 0; i--) {
          const b = state.bubbles[i];
          b.y -= b.speed;
          b.x += Math.sin(b.y * 0.1) * 1;
          
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Pop at surface
          if (b.y < waterY) state.bubbles.splice(i, 1);
        }
        
        // Draw Anti-Gravity Particles
        for (let i = state.antiGravParticles.length - 1; i >= 0; i--) {
          const p = state.antiGravParticles[i];
          p.x += p.vx;
          p.y += p.vy; // Flies straight UP out of beaker!
          p.life -= 0.005;
          
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fill();
          
          // Outer glow for exotic look
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI*2);
          ctx.fill();

          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          
          // Destroy when off screen
          if (p.life <= 0 || p.y < -50) state.antiGravParticles.splice(i, 1);
        }
      }

      // Draw Beaker Glass Container
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(beakerLeft, beakerTop);
      ctx.lineTo(beakerLeft, beakerTop + beakerH - 10);
      ctx.quadraticCurveTo(beakerLeft, beakerTop + beakerH, beakerLeft + 10, beakerTop + beakerH);
      ctx.lineTo(beakerLeft + beakerW - 10, beakerTop + beakerH);
      ctx.quadraticCurveTo(beakerLeft + beakerW, beakerTop + beakerH, beakerLeft + beakerW, beakerTop + beakerH - 10);
      ctx.lineTo(beakerLeft + beakerW, beakerTop);
      ctx.stroke();

      // Grid marks
      ctx.beginPath();
      ctx.lineWidth = 2;
      for(let i=1; i<=5; i++) {
        const y = beakerTop + beakerH - (i * (beakerH-20) / 5) - 10;
        ctx.moveTo(beakerLeft + beakerW - 15, y);
        ctx.lineTo(beakerLeft + beakerW - 5, y);
      }
      ctx.stroke();

      // Dropped Element Token
      if (state.elementDropped) {
        state.elementY += 5; // Gravity
        const limitY = cy + beakerH/2 - 20;
        if (state.elementY > limitY) state.elementY = limitY;
        
        // Dissolve exotic element during antigrav
        let alpha = 1;
        if (isAntiGrav) {
           alpha = Math.max(0, state.waterLevel / 50); // Fades away as fluid depletes
        }

        if (alpha > 0.01) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = state.activeElement.color;
          ctx.fillRect(cx - 20, state.elementY, 40, 40);
          
          ctx.fillStyle = '#0a0d14';
          ctx.font = 'bold 16px Space Grotesk, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(state.activeElement.id, cx, state.elementY + 26);
          ctx.globalAlpha = 1;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleAddWater = () => {
    setWaterLevel(100);
  };

  const handleReset = () => {
    setWaterLevel(0);
    setTemperature(20);
    setHeaterOn(false);
    setReactionActive(false);
    stateRef.current.elementDropped = false;
    stateRef.current.elementY = 0;
    stateRef.current.bubbles = [];
    stateRef.current.antiGravParticles = [];
  };

  const handleDropElement = () => {
    stateRef.current.elementDropped = true;
    stateRef.current.elementY = canvasRef.current.height / 2 - 250; 
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-[#0a0d14]">
      <div className="w-full max-w-6xl h-[85vh] bg-[#0f172a] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden border border-slate-800">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-black/20">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-wide">Antigravity & Exotic Field Theory</h2>
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors">
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex overflow-hidden">
          
          {/* Reaction Equation Badge */}
          <AnimatePresence>
            {reactionActive && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 20, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 px-8 py-3 rounded-full border shadow-2xl font-mono text-lg font-bold backdrop-blur-md
                  ${activeElement.type === 'exotic' 
                     ? 'bg-[#0a0d14]/80 text-[#00e5ff] border-[#00e5ff]/50 shadow-[0_0_40px_rgba(0,229,255,0.3)]' 
                     : 'bg-slate-900 text-white border-slate-700'
                  }
                `}
              >
                {activeElement.equation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas Background Area */}
          <div className="absolute inset-0 bg-[#0a0d14]">
             {/* Faint CSS Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            <canvas 
              ref={canvasRef}
              width={1000}
              height={600}
              className="w-full h-full object-contain mix-blend-screen"
            />
          </div>

          {/* Left Vertical Slider (Temperature) */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md rounded-full py-6 px-3 shadow-2xl border border-slate-700 flex flex-col items-center gap-4 z-10">
            <div className="relative h-48 w-4 bg-slate-800 rounded-full flex flex-col justify-end overflow-hidden border border-slate-700">
               <motion.div 
                 className="w-full bg-[#00e5ff] rounded-full"
                 animate={{ height: `${((temperature - 20) / 80) * 100}%` }}
                 transition={{ duration: 0.2 }}
                 style={{ boxShadow: '0 0 10px #00e5ff' }}
               />
               <motion.div 
                 className="absolute w-6 h-6 bg-slate-900 border-2 border-[#00e5ff] rounded-full shadow-[0_0_15px_#00e5ff] -left-1"
                 animate={{ bottom: `calc(${((temperature - 20) / 80) * 100}% - 12px)` }}
                 transition={{ duration: 0.2 }}
               />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-white font-mono">{Math.round(temperature)}°</div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest">TEMP</div>
            </div>
          </div>

          {/* Bottom Left Heater Control */}
          <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700 min-w-[160px] z-10">
             <div className="text-[10px] font-bold text-slate-400 mb-3 text-center tracking-widest">HEATER</div>
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setHeaterOn(!heaterOn)}
                 className={`flex items-center justify-center w-12 h-8 rounded-lg text-sm font-bold transition-all border ${heaterOn ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]/50 shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
               >
                 {heaterOn ? 'ON' : 'OFF'}
               </button>
               <input 
                 type="range" 
                 min="0" max="100" 
                 value={heaterIntensity}
                 onChange={e => setHeaterIntensity(Number(e.target.value))}
                 className="w-full accent-[#00e5ff]"
               />
             </div>
          </div>

          {/* Bottom Center Actions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
             <button 
               onClick={handleAddWater}
               className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-lg border border-slate-700 transition-all flex items-center gap-2"
             >
               + Inject Fluid/Plasma
             </button>
             <button 
               onClick={handleReset}
               className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl shadow-lg border border-rose-500/30 transition-all flex items-center gap-2"
             >
               🔄 Reset Simulation
             </button>
             <div className="relative">
               <button 
                 onClick={() => setShowElementMenu(!showElementMenu)}
                 className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-lg border border-slate-700 transition-all flex items-center gap-2"
               >
                 ⚛️ Field Element
               </button>
               
               {/* Element Menu Dropdown */}
               <AnimatePresence>
                 {showElementMenu && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute bottom-full mb-2 left-0 w-full bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 flex flex-col gap-1"
                   >
                     {ELEMENTS.map(el => (
                       <button 
                         key={el.id}
                         onClick={() => { setActiveElement(el); setShowElementMenu(false); }}
                         className={`p-3 rounded-lg font-bold text-sm text-left border border-transparent transition-all
                           ${activeElement.id === el.id 
                              ? `bg-slate-900 border-${el.color}` 
                              : 'hover:bg-slate-700 text-slate-300'
                           }`}
                         style={{ borderColor: activeElement.id === el.id ? el.color : 'transparent', color: activeElement.id === el.id ? el.color : '' }}
                       >
                         {el.name} ({el.id})
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>

          {/* Bottom Right Element Stand */}
          <div className="absolute bottom-12 right-24 flex flex-col items-center z-10">
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDropElement}
              className="w-16 h-16 bg-slate-800 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center border border-slate-600 cursor-pointer relative z-10 overflow-hidden"
              style={{ borderBottomWidth: '4px' }}
            >
              {activeElement.type === 'exotic' && (
                <div className="absolute inset-0 animate-pulse blur-md opacity-40" style={{ backgroundColor: activeElement.color }} />
              )}
              <span className="text-xl font-bold relative z-10 font-mono" style={{ color: activeElement.color }}>{activeElement.id}</span>
            </motion.button>
            
            <div className="w-20 h-4 bg-slate-700 rounded-sm mt-1 border-t border-slate-600" />
            <div className="flex gap-10">
              <div className="w-3 h-8 bg-slate-800 rounded-b-sm border-l border-r border-slate-700" />
              <div className="w-3 h-8 bg-slate-800 rounded-b-sm border-l border-r border-slate-700" />
            </div>
            <div className="absolute -bottom-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center whitespace-nowrap">
              Deploy Token
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
