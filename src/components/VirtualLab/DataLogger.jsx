import React, { useEffect, useRef, useState } from 'react';

export default function DataLogger() {
  const canvasRef = useRef(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [isLogging, setIsLogging] = useState(false);

  // Simulate incoming pH data
  useEffect(() => {
    let interval;
    if (isLogging) {
      interval = setInterval(() => {
        setDataPoints(prev => {
          const newTime = prev.length;
          // Simulate a titration pH curve (starts low, slowly rises, spikes, then flattens high)
          let ph = 1.0;
          if (newTime < 20) ph = 1.0 + (newTime * 0.05);
          else if (newTime >= 20 && newTime < 30) ph = 2.0 + ((newTime - 20) * 0.8);
          else ph = 10.0 + ((newTime - 30) * 0.05);
          
          const newData = [...prev, { time: newTime, ph: Math.min(ph, 14) }];
          // Keep only last 50 points for display
          if (newData.length > 50) return newData.slice(newData.length - 50);
          return newData;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLogging]);

  // Draw graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 14; i += 2) {
      const y = height - (i / 14) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`pH ${i}`, 5, y - 5);
    }

    if (dataPoints.length < 2) return;

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    dataPoints.forEach((point, index) => {
      // X maps to index within the 50 points
      const x = (index / 49) * width;
      // Y maps to pH (0-14), inverted since canvas Y goes down
      const y = height - (point.ph / 14) * height;
      
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw dot on latest point
    const lastPoint = dataPoints[dataPoints.length - 1];
    const lastX = ((dataPoints.length - 1) / 49) * width;
    const lastY = height - (lastPoint.ph / 14) * height;
    
    ctx.beginPath();
    ctx.fillStyle = '#bae6fd';
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fill();

  }, [dataPoints]);

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800" id="data-logger">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Live Data Logger</h2>
          <p className="text-slate-400 max-w-2xl text-lg">Monitor real-time readings from your virtual sensors.</p>
        </div>
        <button 
          onClick={() => {
            if (!isLogging) setDataPoints([]);
            setIsLogging(!isLogging);
          }}
          className={`px-6 py-3 font-bold rounded-xl transition-all ${isLogging ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'}`}
        >
          {isLogging ? 'Stop Logging' : 'Start Titration Simulation'}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        {/* Current Value Display */}
        <div className="absolute top-8 right-8 text-right bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-2xl">
          <div className="text-sm text-slate-400 font-bold mb-1">CURRENT pH</div>
          <div className="text-4xl font-mono font-extrabold text-sky-400">
            {dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].ph.toFixed(2) : '--.--'}
          </div>
        </div>

        {/* Canvas Graph */}
        <canvas 
          ref={canvasRef} 
          width={1000} 
          height={400} 
          className="w-full h-[400px] rounded-xl border border-slate-800 bg-slate-950 shadow-inner"
        />
      </div>
    </div>
  );
}
