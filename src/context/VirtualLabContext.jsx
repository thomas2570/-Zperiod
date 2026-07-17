import React, { createContext, useContext, useState, useEffect } from 'react';

const VirtualLabContext = createContext();

export const useVirtualLab = () => useContext(VirtualLabContext);

export const VirtualLabProvider = ({ children }) => {
  const [completedExperiments, setCompletedExperiments] = useState([]);
  const [badges, setBadges] = useState([]);
  const [activeExperiment, setActiveExperiment] = useState(null);

  useEffect(() => {
    // Load from local storage
    const savedExp = localStorage.getItem('vlab_experiments');
    const savedBadges = localStorage.getItem('vlab_badges');
    if (savedExp) setCompletedExperiments(JSON.parse(savedExp));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
  }, []);

  const saveProgress = (exp, bgs) => {
    localStorage.setItem('vlab_experiments', JSON.stringify(exp));
    localStorage.setItem('vlab_badges', JSON.stringify(bgs));
  };

  const completeExperiment = (experimentId) => {
    if (!completedExperiments.includes(experimentId)) {
      const updatedExp = [...completedExperiments, experimentId];
      setCompletedExperiments(updatedExp);
      
      const newBadges = [...badges];
      if (updatedExp.length === 1 && !newBadges.includes('First Experiment')) {
        newBadges.push('First Experiment');
      }
      if (updatedExp.length >= 5 && !newBadges.includes('Chemistry Pro')) {
        newBadges.push('Chemistry Pro');
      }
      
      setBadges(newBadges);
      saveProgress(updatedExp, newBadges);
    }
  };

  return (
    <VirtualLabContext.Provider value={{
      completedExperiments,
      badges,
      activeExperiment,
      setActiveExperiment,
      completeExperiment
    }}>
      {children}
    </VirtualLabContext.Provider>
  );
};
