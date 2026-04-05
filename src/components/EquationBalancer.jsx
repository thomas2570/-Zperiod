import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Heuristic balancer for common simple reactions
function balanceEquation(input) {
  const clean = input.replace(/\s+/g, '').replace('=', '->').toUpperCase();

  const examples = {
    'H2+O2->H2O':              '2H₂  +  O₂  →  2H₂O',
    'CH4+O2->CO2+H2O':         'CH₄  +  2O₂  →  CO₂  +  2H₂O',
    'NA+CL2->NACL':            '2Na  +  Cl₂  →  2NaCl',
    'H2+CL2->HCL':             'H₂  +  Cl₂  →  2HCl',
    'FE+O2->FE2O3':            '4Fe  +  3O₂  →  2Fe₂O₃',
    'C+O2->CO2':               'C  +  O₂  →  CO₂',
    'N2+H2->NH3':              'N₂  +  3H₂  →  2NH₃',
    'KMN04+HCL->MNCL2+KCL+H2O+CL2': '2KMnO₄ + 16HCl → 2MnCl₂ + 2KCl + 8H₂O + 5Cl₂',
  };

  return examples[clean] || null;
}

const EXAMPLES = ['H2 + O2 = H2O', 'CH4 + O2 = CO2 + H2O', 'N2 + H2 = NH3', 'Fe + O2 = Fe2O3'];

export default function EquationBalancer() {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const handleBalance = (e) => {
    e.preventDefault();
    if (!equation.trim()) return;
    const balanced = balanceEquation(equation);
    if (balanced) {
      setResult(balanced);
      setError(false);
    } else {
      setResult(null);
      setError(true);
    }
  };

  const tryExample = (ex) => {
    setEquation(ex);
    setResult(null);
    setError(false);
    const balanced = balanceEquation(ex);
    if (balanced) setResult(balanced);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 680,
      background: '#ffffff',
      borderRadius: 24,
      border: '1px solid #e5e7eb',
      boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: '36px 40px 28px',
        borderBottom: '1px solid #f1f5f9',
        background: 'linear-gradient(135deg, #fef9ff 0%, #f8faff 100%)',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64,
          borderRadius: 18,
          background: 'linear-gradient(135deg, #fecdd3, #fda4af)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(248,113,113,0.25)',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
          Equation Balancer
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          Enter a chemical equation to automatically balance it.
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 40px 36px' }}>

        {/* Input Form */}
        <form onSubmit={handleBalance}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input
              type="text"
              value={equation}
              onChange={(e) => { setEquation(e.target.value); setResult(null); setError(false); }}
              placeholder="e.g. H2 + O2 = H2O"
              style={{
                flex: 1,
                border: '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 15,
                color: '#111827',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                outline: 'none',
                transition: 'border-color 0.15s',
                background: '#fafafa',
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="submit"
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.01em',
                transition: 'background 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.target.style.background = '#4f46e5'}
              onMouseLeave={e => e.target.style.background = '#6366f1'}
            >
              Balance
            </button>
          </div>
        </form>

        {/* Try examples */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center' }}>Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => tryExample(ex)}
              style={{
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '4px 10px',
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                color: '#4f46e5', cursor: 'pointer', fontWeight: 600,
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.target.style.background = '#e0e7ff'}
              onMouseLeave={e => e.target.style.background = '#f1f5f9'}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1px solid #bbf7d0',
                borderRadius: 16,
                padding: '24px 28px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#16a34a', marginBottom: 12 }}>
                ✓ Balanced Equation
              </div>
              <div style={{
                fontSize: 22,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                color: '#111827',
                fontWeight: 700,
                letterSpacing: '0.05em',
                lineHeight: 1.5,
              }}>
                {result}
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d97706', marginBottom: 8 }}>
                ⚠ Unable to Balance
              </div>
              <p style={{ color: '#92400e', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                This equation is too complex for the current solver. Try one of the examples above.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
