import React, { useState } from 'react';
import TopTabBar from '../components/VirtualLabRedesign/TopTabBar';
import PeriodicTable from '../components/VirtualLabRedesign/ElementsExplorer/PeriodicTable';
import PlaceholderTab from '../components/VirtualLabRedesign/PlaceholderTab';

export default function VirtualLabPage() {
  const [activeTab, setActiveTab] = useState('elements');

  // Background Grid Pattern (CSS SVG)
  const gridBackground = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    backgroundPosition: 'center center'
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'elements':
        return <PeriodicTable />;
      case 'equations':
        return <PlaceholderTab title="Equations & Balancer" description="Live equation balancer, stoichiometry solver, and reaction predictor." icon="⚖️" />;
      case 'lab':
        return <PlaceholderTab title="Virtual Workbench" description="Interactive 3D laboratory workbench with drag-and-drop equipment and live chemical reactions." icon="🧪" />;
      case 'experiments':
        return <PlaceholderTab title="Guided Experiments" description="Step-by-step interactive experiments with live data logging and PDF reports." icon="🔥" />;
      case 'mixtures':
        return <PlaceholderTab title="Mixtures & Solutions" description="Simulate mixtures, solubility rules, and complex separation methods." icon="🧬" />;
      default:
        return <PeriodicTable />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-200 font-sans relative overflow-hidden" style={gridBackground}>
      {/* Ambient Blue/Purple Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7c3aed] opacity-10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00e5ff] opacity-10 blur-[120px] pointer-events-none"></div>

      <TopTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="relative z-10 w-full min-h-[calc(100vh-64px)]">
        {renderTabContent()}
      </div>
    </div>
  );
}
