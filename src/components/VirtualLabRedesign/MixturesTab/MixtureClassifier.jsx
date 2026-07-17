import React, { useState, useRef, useEffect } from 'react';
import { Beaker, Droplets, Hexagon, Database, Wind, Zap, Activity } from 'lucide-react';

const SUBSTANCES = [
  { id: 'water', name: 'Water (H₂O)', type: 'solvent', icon: Droplets },
  { id: 'salt', name: 'Salt (NaCl)', type: 'soluble_solid', icon: Hexagon },
  { id: 'sand', name: 'Sand (SiO₂)', type: 'insoluble_solid', icon: Database },
  { id: 'oil', name: 'Vegetable Oil', type: 'immiscible_liquid', icon: Droplets },
  { id: 'milk_powder', name: 'Milk Powder', type: 'colloid_particles', icon: Wind },
];

export default function MixtureClassifier() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [showLaser, setShowLaser] = useState(false);
  const canvasRef = useRef(null);

  const toggleSubstance = (sub) => {
    if (selected.find(s => s.id === sub.id)) {
      setSelected(selected.filter(s => s.id !== sub.id));
    } else {
      if (selected.length < 4) setSelected([...selected, sub]);
    }
  };

  const analyze = () => {
    if (selected.length < 2) return;
    
    const types = selected.map(s => s.type);
    let classType = 'Homogeneous (Solution)';
    let desc = 'The substances completely mix at a molecular level.';
    
    if (types.includes('insoluble_solid') || types.includes('immiscible_liquid')) {
      classType = 'Heterogeneous';
      desc = 'The substances do not mix uniformly and separate into distinct layers or phases.';
      if (types.includes('insoluble_solid') && types.includes('solvent')) {
        classType = 'Heterogeneous (Suspension)';
      }
    } else if (types.includes('colloid_particles') && types.includes('solvent')) {
      classType = 'Colloid';
      desc = 'Particles are larger than in a solution but small enough to remain evenly dispersed without settling.';
    }

    setResult({ type: classType, desc });
  };

  // Canvas Animation
  useEffect(() => {
    if (!result) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const particles = [];
    
    // Generate particles based on result type
    const isHetero = result.type.includes('Heterogeneous');
    const isColloid = result.type.includes('Colloid');
    
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isHetero ? 0.2 : 1), // Hetero particles move slower
        vy: (Math.random() - 0.5) * (isHetero ? 0.2 : 1),
        radius: isHetero ? Math.random() * 4 + 2 : (isColloid ? Math.random() * 2 + 1 : 1),
        color: isHetero && i % 2 === 0 ? '#fcd34d' : '#38bdf8' // Two colors for hetero
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Laser (Tyndall Effect)
      if (showLaser) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        if (isColloid || result.type.includes('Suspension')) {
          // Scatters light
          ctx.lineWidth = 40;
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.stroke();
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.stroke();
        } else {
          // Passes straight through
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.stroke();
        }
      }

      particles.forEach(p => {
        // Heterogeneous suspension gravity effect
        if (result.type.includes('Suspension') && p.color === '#fcd34d') {
          p.vy += 0.01; // Gravity
          if (p.y > canvas.height - p.radius) {
            p.y = canvas.height - p.radius;
            p.vy = 0;
            p.vx *= 0.9;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || (p.y > canvas.height && !result.type.includes('Suspension'))) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Laser collision scatter
        if (showLaser && (isColloid || result.type.includes('Suspension')) && Math.abs(p.y - canvas.height / 2) < 20) {
           ctx.shadowBlur = 10;
           ctx.shadowColor = '#ef4444';
           ctx.fillStyle = '#fca5a5';
           ctx.fill();
           ctx.shadowBlur = 0;
        }
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    
    return () => cancelAnimationFrame(animationId);
  }, [result, showLaser]);

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-lg w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Controls */}
        <div className="flex flex-col h-full justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
              <Activity size={24} />
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] font-['Space_Grotesk']">Mixture Classifier</h3>
          </div>
          <p className="text-[var(--text-secondary)] mb-8">Select 2 to 4 substances to combine in the diagnostic beaker.</p>
          
          <div className="flex flex-wrap gap-3 mb-10">
            {SUBSTANCES.map(sub => {
              const isSelected = selected.find(s => s.id === sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => toggleSubstance(sub)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isSelected 
                      ? 'bg-sky-500/10 text-sky-500 border border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.2)] scale-[1.02]'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-sky-400/50 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <sub.icon size={16} />
                  {sub.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={analyze}
              disabled={selected.length < 2}
              className="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Zap size={18} fill="currentColor" /> Analyze Mixture
            </button>
            <button 
              onClick={() => { setSelected([]); setResult(null); setShowLaser(false); }}
              className="px-6 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] font-bold rounded-xl hover:bg-[var(--bg-primary)] border border-[var(--border)] transition-all"
            >
              Reset
            </button>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-indigo-500" />
              <h4 className={`text-xl font-bold mb-2 font-['Space_Grotesk'] ${
                result.type.includes('Homogeneous') ? 'text-emerald-500' : 
                result.type.includes('Colloid') ? 'text-purple-500' : 'text-amber-500'
              }`}>
                {result.type}
              </h4>
              <p className="text-[var(--text-secondary)] leading-relaxed">{result.desc}</p>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-[360px] aspect-square bg-[var(--bg-primary)] rounded-[2rem] border-[6px] border-[var(--bg-card)] overflow-hidden shadow-[inset_0_10px_30px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.2)] outline outline-1 outline-[var(--border)]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none" />
            {result ? (
              <canvas ref={canvasRef} width={400} height={400} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)] gap-4">
                <Beaker size={48} strokeWidth={1} className="opacity-50" />
                <span className="font-medium tracking-wide uppercase text-sm">Awaiting Analysis...</span>
              </div>
            )}
            
            {/* Laser Generator Node */}
            <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-3 h-12 rounded-r-lg border-r border-t border-b border-[var(--border)] z-10 transition-colors duration-500 ${showLaser ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]' : 'bg-[var(--bg-secondary)]'}`} />
          </div>
          
          {result && (
            <div className="mt-8 flex items-center gap-4 bg-[var(--bg-card)] p-3 pr-5 pl-4 rounded-full border border-[var(--border)] shadow-sm">
              <span className="text-[var(--text-primary)] font-bold text-sm flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${showLaser ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-[var(--border)]'}`} />
                Tyndall Effect Laser
              </span>
              <button 
                onClick={() => setShowLaser(!showLaser)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showLaser ? 'bg-rose-500' : 'bg-[var(--bg-primary)] border border-[var(--border)]'}`}
              >
                <div className={`absolute top-[2px] left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${showLaser ? 'translate-x-5' : ''} ${showLaser ? 'shadow-sm' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
