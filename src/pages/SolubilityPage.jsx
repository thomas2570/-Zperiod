import React from 'react';
import SolubilityTable from '../components/SolubilityTable';

export default function SolubilityPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse 80% 60% at 20% 100%, #a7f3d033 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #6ee7b722 0%, transparent 50%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>
      <SolubilityTable />
    </div>
  );
}
