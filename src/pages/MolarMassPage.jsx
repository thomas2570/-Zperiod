import React from 'react';
import MolarMassCalculator from '../components/MolarMassCalculator';

export default function MolarMassPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse 80% 60% at 20% 100%, #fde68a33 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #fcd34d22 0%, transparent 50%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>
      <MolarMassCalculator />
    </div>
  );
}
