import React, { useState, useRef, useEffect } from 'react';

const SUBSTANCES = [
  { id: 'water', name: 'Water (H₂O)', type: 'solvent' },
  { id: 'salt', name: 'Salt (NaCl)', type: 'soluble_solid' },
  { id: 'sand', name: 'Sand (SiO₂)', type: 'insoluble_solid' },
  { id: 'oil', name: 'Vegetable Oil', type: 'immiscible_liquid' },
  { id: 'milk_powder', name: 'Milk Powder', type: 'colloid_particles' },
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
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div>
          <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-6">Mixture Classifier</h3>
          <p className="text-slate-400 mb-6">Select 2 to 4 substances to combine in the beaker.</p>
          
          <div className="flex flex-wrap gap-3 mb-8">
            {SUBSTANCES.map(sub => {
              const isSelected = selected.find(s => s.id === sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => toggleSubstance(sub)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isSelected 
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={analyze}
              disabled={selected.length < 2}
              className="px-6 py-3 bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
            >
              Analyze Mixture
            </button>
            <button 
              onClick={() => { setSelected([]); setResult(null); setShowLaser(false); }}
              className="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 border border-slate-700 transition-all"
            >
              Reset
            </button>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-slate-900/80 border border-slate-700 rounded-2xl">
              <h4 className={`text-xl font-bold mb-2 ${
                result.type.includes('Homogeneous') ? 'text-emerald-400' : 
                result.type.includes('Colloid') ? 'text-purple-400' : 'text-amber-400'
              }`}>
                {result.type}
              </h4>
              <p className="text-slate-300">{result.desc}</p>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[400px] aspect-square bg-[#0a0d14] rounded-[40px] border-4 border-slate-800 overflow-hidden shadow-inner">
            {result ? (
              <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold">
                Awaiting Analysis...
              </div>
            )}
            
            {/* Laser Generator Node */}
            <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-700 rounded-r-lg border border-slate-600 z-10" />
          </div>
          
          {result && (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-slate-400 font-medium">Tyndall Effect Laser</span>
              <button 
                onClick={() => setShowLaser(!showLaser)}
                className={`relative w-14 h-7 rounded-full transition-colors ${showLaser ? 'bg-rose-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${showLaser ? 'translate-x-7' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
