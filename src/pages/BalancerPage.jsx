import React from 'react';
import EquationBalancer from '../components/EquationBalancer';

export default function BalancerPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>
      <EquationBalancer />
    </div>
  );
}
