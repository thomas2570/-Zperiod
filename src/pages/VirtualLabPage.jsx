import React from 'react';
import { motion } from 'framer-motion';

export default function VirtualLabPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #fcfaf5 0%, transparent 60%), #fbfbfb',
      padding: '40px 24px 100px',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ 
            width: 80, 
            height: 80, 
            background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', 
            borderRadius: 24, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#0369a1'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 16 }}>Virtual Lab</h1>
          <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.6, marginBottom: 40 }}>
            Simulate chemistry experiments in a secure virtual environment.
            This feature is currently under development.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#fff',
            borderRadius: 24,
            border: '1px solid #e5e7eb',
            padding: 48,
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#38bdf8'
                }}
              />
            ))}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>Coming Soon!</h3>
          <p style={{ color: '#9ca3af' }}>We are building the ultimate virtual chemistry experience.</p>
        </motion.div>
      </div>
    </div>
  );
}
