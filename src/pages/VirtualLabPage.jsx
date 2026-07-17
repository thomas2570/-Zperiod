import React from 'react';
import { VirtualLabProvider } from '../context/VirtualLabContext';
import HeroSection from '../components/VirtualLab/HeroSection';
import EquipmentRoom from '../components/VirtualLab/EquipmentRoom';
import ExperimentZone from '../components/VirtualLab/ExperimentZone';
import DataLogger from '../components/VirtualLab/DataLogger';
import MyProgress from '../components/VirtualLab/MyProgress';

export default function VirtualLabPage() {
  return (
    <VirtualLabProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-sky-500/30 selection:text-sky-200">
        
        {/* Navigation / Quick Links within the Lab */}
        <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6 overflow-x-auto text-sm font-semibold">
            <a href="#hero" className="text-slate-400 hover:text-white whitespace-nowrap transition-colors">Lab Entrance</a>
            <a href="#equipment-room" className="text-slate-400 hover:text-white whitespace-nowrap transition-colors">Equipment Room</a>
            <a href="#experiment-zone" className="text-sky-400 hover:text-sky-300 whitespace-nowrap transition-colors flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Live Experiment
            </a>
            <a href="#data-logger" className="text-slate-400 hover:text-white whitespace-nowrap transition-colors">Data Logger</a>
            <a href="#my-progress" className="text-slate-400 hover:text-white whitespace-nowrap transition-colors ml-auto">My Progress</a>
          </div>
        </div>

        {/* Sections */}
        <div id="hero">
          <HeroSection />
        </div>
        
        <EquipmentRoom />
        
        <ExperimentZone />
        
        <DataLogger />
        
        <MyProgress />

        {/* Footer */}
        <footer className="py-8 text-center border-t border-slate-900 bg-slate-950">
          <p className="text-slate-600 text-sm">Zperiod Virtual Science Laboratory © 2026</p>
        </footer>
      </div>
    </VirtualLabProvider>
  );
}
