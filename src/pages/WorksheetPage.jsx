import React from 'react';
import { motion } from 'framer-motion';

export default function WorksheetPage() {
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
            background: 'linear-gradient(135deg, #f3e8ff, #d8b4fe)', 
            borderRadius: 24, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#9333ea'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', marginBottom: 16 }}>Worksheet</h1>
          <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.6, marginBottom: 40 }}>
            Practice chemistry concepts with comprehensive interactive worksheets.
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
                  background: '#c084fc'
                }}
              />
            ))}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>Coming Soon!</h3>
          <p style={{ color: '#9ca3af' }}>We are building an interactive worksheet generator for your chemistry practice.</p>
        </motion.div>
      </div>
    </div>
  );
}
