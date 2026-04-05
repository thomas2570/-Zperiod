import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import TablePage from './pages/TablePage';
import BalancerPage from './pages/BalancerPage';
import ToolsPage from './pages/ToolsPage';
import MolarMassPage from './pages/MolarMassPage';
import SolubilityPage from './pages/SolubilityPage';
import GasLawsPage from './pages/GasLawsPage';
import IonsPage from './pages/IonsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative z-0">
          <Navbar />
          <main className="flex-1">
              <Routes>
                <Route path="/" element={<TablePage />} />
                <Route path="/ions" element={<IonsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/balancer" element={<BalancerPage />} />
                <Route path="/molar-mass" element={<MolarMassPage />} />
                <Route path="/solubility" element={<SolubilityPage />} />
                <Route path="/gas-laws" element={<GasLawsPage />} />
              </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
