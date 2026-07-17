import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThermalShockSimulator() {
  const canvasRef = useRef(null);
  
  // Simulation State
  const [targetTemp, setTargetTemp] = useState(25);
  const [currentTemp, setCurrentTemp] = useState(25);
  const [hasPowder, setHasPowder] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  
  // Refs for animation loop to access latest state without re-triggering effect
  const stateRef = useRef({
    currentTemp: 25,
    targetTemp: 25,
    hasPowder: false,
    hasWater: false,
    isShattered: false,
    shards: [],
    waterLevel: 0
  });

  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      targetTemp,
      hasPowder,
      hasWater,
      isShattered
    };
  }, [targetTemp, hasPowder, hasWater, isShattered]);

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Flame particles
    let flameParticles = [];
    
    // Physics shards initialization on shatter
    const initShards = () => {
      const newShards = [];
      const tubeX = canvas.width / 2 - 30;
      const tubeY = canvas.height / 2 - 80;
      
      for(let i=0; i<30; i++) {
        newShards.push({
          x: tubeX + Math.random() * 60,
          y: tubeY + Math.random() * 160,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 2) * 5,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 15 + 5
        });
      }
      stateRef.current.shards = newShards;
    };

    const draw = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update Temperature (ease towards target)
      if (!state.isShattered) {
        if (state.currentTemp < state.targetTemp) {
          state.currentTemp = Math.min(state.currentTemp + 1, state.targetTemp);
        } else if (state.currentTemp > state.targetTemp) {
          state.currentTemp = Math.max(state.currentTemp - 1, state.targetTemp);
        }
        setCurrentTemp(Math.round(state.currentTemp));
      }

      // Draw Lab Rack (Background)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(canvas.width / 2 - 40, canvas.height / 2 + 30, 80, 10);
      ctx.fillRect(canvas.width / 2 - 35, canvas.height / 2 - 40, 70, 8);
      
      // Draw Flame if burner is on
      if (state.targetTemp > 30 && !state.isShattered) {
        // Add particles
        if (Math.random() < (state.targetTemp / 650)) {
          flameParticles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 40,
            y: canvas.height / 2 + 100,
            vy: -Math.random() * 3 - 2,
            life: 1.0
          });
        }
        
        ctx.globalCompositeOperation = 'screen';
        for(let i = flameParticles.length - 1; i >= 0; i--) {
          let p = flameParticles[i];
          p.y += p.vy;
          p.life -= 0.05;
          
          if (p.life <= 0) {
            flameParticles.splice(i, 1);
            continue;
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10 * p.life, 0, Math.PI * 2);
          // Color shifts from blue to yellow/orange based on heat
          const isHot = state.targetTemp > 300;
          ctx.fillStyle = isHot ? `rgba(251, 146, 60, ${p.life})` : `rgba(56, 189, 248, ${p.life})`;
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        
        // Burner nozzle
        ctx.fillStyle = '#64748b';
        ctx.fillRect(canvas.width / 2 - 15, canvas.height / 2 + 100, 30, 40);
      }

      if (!state.isShattered) {
        // Draw Intact Test Tube
        const tubeX = canvas.width / 2 - 30;
        const tubeY = canvas.height / 2 - 80;
        const tubeW = 60;
        const tubeH = 160;

        // Tube contents
        if (state.hasPowder) {
          ctx.fillStyle = '#a3e635'; // greenish powder
          ctx.fillRect(tubeX + 4, tubeY + tubeH - 20, tubeW - 8, 16);
        }
        
        if (state.hasWater) {
          if (state.waterLevel < 60) state.waterLevel += 2;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fillRect(tubeX + 4, tubeY + tubeH - 20 - state.waterLevel, tubeW - 8, state.waterLevel);
          
          // Boiling bubbles if hot
          if (state.currentTemp > 100) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            for(let i=0; i<5; i++) {
              ctx.beginPath();
              ctx.arc(tubeX + 10 + Math.random()*(tubeW-20), tubeY + tubeH - Math.random()*(state.waterLevel+20), Math.random()*3+1, 0, Math.PI*2);
              ctx.fill();
            }
          }
        }

        // Glass outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tubeX, tubeY);
        ctx.lineTo(tubeX, tubeY + tubeH - 20);
        ctx.quadraticCurveTo(tubeX, tubeY + tubeH, tubeX + tubeW/2, tubeY + tubeH);
        ctx.quadraticCurveTo(tubeX + tubeW, tubeY + tubeH, tubeX + tubeW, tubeY + tubeH - 20);
        ctx.lineTo(tubeX + tubeW, tubeY);
        ctx.stroke();
        
        // Glass glare
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(tubeX + 5, tubeY + 10, 8, tubeH - 30);
      } else {
        // SHATTERED PHYSICS
        if (state.shards.length === 0) initShards();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        state.shards.forEach(shard => {
          shard.vy += 0.5; // gravity
          shard.x += shard.vx;
          shard.y += shard.vy;
          shard.rot += shard.rotSpeed;
          
          ctx.save();
          ctx.translate(shard.x, shard.y);
          ctx.rotate(shard.rot);
          ctx.beginPath();
          ctx.moveTo(0, -shard.size);
          ctx.lineTo(shard.size, shard.size);
          ctx.lineTo(-shard.size, shard.size);
          ctx.fill();
          ctx.restore();
        });
        
        // Draw spill
        if (state.hasWater || state.hasPowder) {
          ctx.fillStyle = state.hasWater ? 'rgba(56, 189, 248, 0.4)' : '#a3e635';
          ctx.beginPath();
          ctx.ellipse(canvas.width/2, canvas.height/2 + 130, 80, 20, 0, 0, Math.PI*2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handlePourWater = () => {
    if (isShattered) return;
    
    // Thermal Shock check
    if (currentTemp > 400) {
      setIsShattered(true);
    } else {
      setHasWater(true);
      // Cooling effect
      setTargetTemp(prev => Math.max(25, prev - 100));
    }
  };

  const handleReset = () => {
    setTargetTemp(25);
    setCurrentTemp(25);
    setHasPowder(false);
    setHasWater(false);
    setIsShattered(false);
    stateRef.current.shards = [];
    stateRef.current.waterLevel = 0;
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#0a0d14] relative">
      
      {/* Red Screen Flash on Shatter */}
      <AnimatePresence>
        {isShattered && (
          <motion.div 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-red-600 z-10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
        
        {/* Left Controls */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">Thermodynamics</h2>
            <p className="text-slate-400 text-sm mb-6">Test the limits of borosilicate glass under extreme thermal stress.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setHasPowder(true)}
              disabled={isShattered || hasPowder}
              className="w-full py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-all disabled:opacity-50"
            >
              Add Chemical Powder
            </button>

            <button 
              onClick={handlePourWater}
              disabled={isShattered || hasWater}
              className="w-full py-3 bg-gradient-to-r from-sky-500/20 to-sky-600/20 text-sky-400 font-bold border border-sky-500/30 rounded-xl hover:bg-sky-500/30 transition-all disabled:opacity-50"
            >
              Pour Cold Water (20°C)
            </button>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-bold text-slate-400 mb-4 flex justify-between">
              <span>Bunsen Burner Heat</span>
              <span className={targetTemp > 400 ? 'text-rose-400' : 'text-amber-400'}>{targetTemp}°C</span>
            </label>
            <input 
              type="range" 
              min="25" max="650" step="5"
              value={targetTemp} 
              onChange={e => setTargetTemp(Number(e.target.value))}
              disabled={isShattered}
              className={`w-full ${targetTemp > 400 ? 'accent-rose-500' : 'accent-amber-500'}`}
            />
          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button 
              onClick={handleReset}
              className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
            >
              Reset Lab State
            </button>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="lg:col-span-2 relative bg-[#0f172a] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center min-h-[500px] shadow-inner">
          {/* Faint CSS Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
          
          <canvas 
            ref={canvasRef}
            width={600}
            height={500}
            className="relative z-10 max-w-full h-auto"
          />

          {/* Digital Readout Gauge */}
          <div className="absolute top-6 right-6 bg-black/60 backdrop-blur border border-white/10 rounded-xl p-4 min-w-[120px] text-right z-20">
            <div className="text-xs text-slate-400 font-bold tracking-wider mb-1">SENSOR TEMP</div>
            <div className={`text-3xl font-mono font-bold ${currentTemp > 400 ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`}>
              {currentTemp}°C
            </div>
            {currentTemp > 400 && !isShattered && (
              <div className="text-[10px] text-rose-500 font-bold mt-1 uppercase">Warning: Critical</div>
            )}
          </div>

          {/* Failure Banner Overlay */}
          <AnimatePresence>
            {isShattered && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30"
              >
                <div className="bg-rose-950/90 border-2 border-rose-500 rounded-2xl p-8 max-w-md text-center shadow-[0_0_50px_rgba(225,29,72,0.5)]">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h2 className="text-3xl font-extrabold font-['Space_Grotesk'] text-white mb-2">THERMAL SHOCK FAILURE</h2>
                  <p className="text-rose-200 text-lg">Vessel Shattered! Rapid temperature change caused uneven thermal contraction, exceeding the tensile strength of the glass.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
