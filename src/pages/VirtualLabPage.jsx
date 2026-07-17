import React, { useState } from 'react';
import TopTabBar from '../components/VirtualLabRedesign/TopTabBar';
import PlaceholderTab from '../components/VirtualLabRedesign/PlaceholderTab';
import ExperimentsTab from '../components/VirtualLabRedesign/ExperimentsTab/ExperimentsTab';
import MixturesTab from '../components/VirtualLabRedesign/MixturesTab/MixturesTab';
import ThermalShockSimulator from '../components/VirtualLabRedesign/ThermalShockSimulator';

export default function VirtualLabPage() {
  const [activeTab, setActiveTab] = useState('lab');

  // Background Grid Pattern (CSS SVG)
  const gridBackgroundDark = `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`;
  const gridBackgroundLight = `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lab':
        return <ThermalShockSimulator />;
      case 'experiments':
        return <ExperimentsTab />;
      case 'mixtures':
        return <MixturesTab />;
      default:
        return <ThermalShockSimulator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Grid - We use a pseudo-element for cleaner light/dark switching of background-image */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-100 dark:opacity-100" 
        style={{
          backgroundImage: 'var(--grid-bg, linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px))',
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        :root { --grid-bg: ${gridBackgroundLight}; }
        .dark { --grid-bg: ${gridBackgroundDark}; }
      `}} />

      {/* Ambient Blue/Purple Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-[#7c3aed]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 dark:bg-[#00e5ff]/10 blur-[120px] pointer-events-none"></div>

      <TopTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="relative z-10 w-full min-h-[calc(100vh-64px)]">
        {renderTabContent()}
      </div>
    </div>
  );
}
