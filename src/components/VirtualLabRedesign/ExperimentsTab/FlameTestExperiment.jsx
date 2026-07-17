import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const SALTS = [
  { id: 'li', name: 'Lithium Chloride', symbol: 'LiCl', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' },
  { id: 'na', name: 'Sodium Chloride', symbol: 'NaCl', color: '#facc15', glow: 'rgba(250, 204, 21, 0.8)' },
  { id: 'k', name: 'Potassium Chloride', symbol: 'KCl', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.8)' },
  { id: 'cu', name: 'Copper(II) Chloride', symbol: 'CuCl₂', color: '#10b981', glow: 'rgba(16, 185, 129, 0.8)' },
  { id: 'ba', name: 'Barium Chloride', symbol: 'BaCl₂', color: '#84cc16', glow: 'rgba(132, 204, 22, 0.8)' },
];

export default function FlameTestExperiment({ onBack }) {
  const [step, setStep] = useState(1);
  const [activeSalt, setActiveSalt] = useState(null);
  const [isHeating, setIsHeating] = useState(false);
  
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleHeat = (salt) => {
    setActiveSalt(salt);
    setIsHeating(true);
    setTimeout(() => setIsHeating(false), 3000);
  };

  const submitQuiz = () => {
    let s = 0;
    if (answers.q1 === 'na') s++;
    if (answers.q2 === 'cu') s++;
    if (answers.q3 === 'electrons') s++;
    setScore(s);
    setShowResults(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Lab Report: Flame Test", 20, 20);
    
    doc.setFontSize(14);
    doc.text("Student Name: ___________________________", 20, 40);
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 50);
    
    doc.setFontSize(16);
    doc.text("Observations", 20, 70);
    doc.setFontSize(12);
    doc.text("- Lithium (Li+) produced a red flame.", 20, 80);
    doc.text("- Sodium (Na+) produced a yellow flame.", 20, 90);
    doc.text("- Potassium (K+) produced a violet/purple flame.", 20, 100);
    doc.text("- Copper (Cu2+) produced a green flame.", 20, 110);
    
    doc.setFontSize(16);
    doc.text("Quiz Results", 20, 130);
    doc.setFontSize(12);
    doc.text(`Score: ${score}/3 (${Math.round((score/3)*100)}%)`, 20, 140);
    
    doc.save("Flame_Test_Report.pdf");
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-3xl font-extrabold font-['Space_Grotesk'] text-[var(--text-primary)]">Flame Test Analysis</h2>
          <p className="text-[var(--text-secondary)]">Identify metal ions by the color they emit when heated.</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-slate-800'}`} />
        ))}
      </div>

      <div className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Introduction */}
          {step === 1 && (
            <motion.div key="intro" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="max-w-3xl mx-auto py-10">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Introduction</h3>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                When metal ions are heated in a flame, their electrons absorb energy and jump to higher energy levels. 
                As they fall back down to their ground state, they release that energy as visible light. 
                Because each element has a unique electron configuration, they emit unique colors!
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex gap-4 items-start">
                <span className="text-2xl">⚠️</span>
                <p className="text-amber-400 text-sm">Safety First: In a real lab, you would use nichrome wire loops dipped in concentrated HCl to clean them between tests. Never look directly down into a lit Bunsen burner.</p>
              </div>
              <button onClick={() => setStep(2)} className="px-8 py-3 bg-[#00e5ff] text-slate-900 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">
                Enter Simulation →
              </button>
            </motion.div>
          )}

          {/* STEP 2: Interactive Simulation */}
          {step === 2 && (
            <motion.div key="sim" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Simulation Area</h3>
                <button onClick={() => setStep(3)} className="px-6 py-2 bg-[#7c3aed] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
                  Proceed to Quiz →
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chemicals */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Metal Salts</h4>
                  {SALTS.map(salt => (
                    <button
                      key={salt.id}
                      onClick={() => handleHeat(salt)}
                      disabled={isHeating}
                      className="w-full flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl hover:border-sky-400 disabled:opacity-50 transition-all text-left"
                    >
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{salt.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{salt.symbol}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center">🔥</div>
                    </button>
                  ))}
                </div>

                {/* Burner Visualizer */}
                <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-2xl border-2 border-[var(--border)] flex flex-col items-center justify-end pb-12 relative overflow-hidden">
                   {/* Background ambient glow based on flame */}
                   <div 
                     className="absolute inset-0 transition-colors duration-500 opacity-20"
                     style={{ backgroundColor: isHeating ? activeSalt?.color : 'transparent' }}
                   />
                   
                   {/* Flame */}
                   <div className="relative w-16 h-40 flex justify-center items-end mb-4">
                     {/* Base blue flame */}
                     <motion.div 
                       animate={{ scaleY: [0.95, 1.05, 1], scaleX: [0.98, 1.02, 1] }}
                       transition={{ repeat: Infinity, duration: 0.1 }}
                       className="absolute bottom-0 w-12 h-32 bg-blue-500 rounded-t-[100%] blur-[4px] opacity-80"
                       style={{ transformOrigin: 'bottom' }}
                     />
                     
                     {/* Colored emission flame */}
                     <AnimatePresence>
                       {isHeating && activeSalt && (
                         <motion.div 
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: '140%' }}
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute bottom-10 w-20 rounded-t-[100%] blur-[8px]"
                           style={{ backgroundColor: activeSalt.color, boxShadow: `0 0 40px ${activeSalt.glow}`, transformOrigin: 'bottom' }}
                         />
                       )}
                     </AnimatePresence>

                     {/* Wire loop */}
                     {isHeating && (
                       <motion.div 
                         initial={{ x: 100, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         exit={{ x: 100, opacity: 0 }}
                         className="absolute bottom-20 left-10 w-32 h-1 bg-slate-400"
                       >
                         <div className="absolute left-[-10px] top-[-4px] w-3 h-3 border-[2px] border-slate-400 rounded-full" />
                       </motion.div>
                     )}
                   </div>

                   {/* Burner Base */}
                   <div className="w-8 h-24 bg-gradient-to-r from-slate-400 to-slate-600 rounded-t-sm z-10" />
                   <div className="w-16 h-4 bg-slate-500 rounded-t-lg z-10" />
                   
                   {isHeating && (
                     <div className="absolute top-6 text-2xl font-bold font-['Space_Grotesk'] tracking-widest uppercase" style={{ color: activeSalt.color, textShadow: `0 0 20px ${activeSalt.color}` }}>
                       {activeSalt.symbol} emits {activeSalt.color}
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Quiz & Report */}
          {step === 3 && (
            <motion.div key="quiz" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="max-w-2xl mx-auto py-10">
              {!showResults ? (
                <>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Observation Quiz</h3>
                  
                  <div className="space-y-8 mb-8">
                    <div>
                      <p className="text-slate-300 mb-3">1. Which metal ion produced a bright yellow flame?</p>
                      <div className="flex gap-4">
                        {['Li', 'Na', 'K', 'Cu'].map(opt => (
                          <button 
                            key={`q1-${opt}`}
                            onClick={() => setAnswers({...answers, q1: opt.toLowerCase()})}
                            className={`px-4 py-2 rounded-lg border ${answers.q1 === opt.toLowerCase() ? 'bg-sky-500/20 border-sky-500 text-sky-500' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-sky-300'}`}
                          >{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-300 mb-3">2. Copper(II) chloride produced which color flame?</p>
                      <div className="flex gap-4">
                        {['Red', 'Green', 'Yellow', 'Purple'].map(opt => (
                          <button 
                            key={`q2-${opt}`}
                            onClick={() => setAnswers({...answers, q2: opt === 'Green' ? 'cu' : opt.toLowerCase()})}
                            className={`px-4 py-2 rounded-lg border ${answers.q2 === (opt === 'Green' ? 'cu' : opt.toLowerCase()) ? 'bg-sky-500/20 border-sky-500 text-sky-500' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-sky-300'}`}
                          >{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-300 mb-3">3. What subatomic particle is responsible for the emission of light?</p>
                      <div className="flex flex-col gap-2">
                        {['Protons', 'Neutrons', 'Electrons', 'Nucleus'].map(opt => (
                          <button 
                            key={`q3-${opt}`}
                            onClick={() => setAnswers({...answers, q3: opt.toLowerCase()})}
                            className={`text-left px-4 py-2 rounded-lg border ${answers.q3 === opt.toLowerCase() ? 'bg-sky-500/20 border-sky-500 text-sky-500' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-sky-300'}`}
                          >{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button onClick={submitQuiz} disabled={Object.keys(answers).length < 3} className="w-full py-4 bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] text-white font-bold rounded-xl disabled:opacity-50">
                    Submit Answers
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">{score === 3 ? '🏆' : '👍'}</div>
                  <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Quiz Complete!</h3>
                  <p className="text-xl text-[var(--text-secondary)] mb-8">You scored {score} out of 3.</p>
                  
                  <div className="flex justify-center gap-4">
                    <button onClick={generatePDF} className="px-6 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] font-bold rounded-xl flex items-center gap-2 hover:bg-[var(--border)]">
                      📄 Download PDF Lab Report
                    </button>
                    <button onClick={onBack} className="px-6 py-3 bg-sky-500 text-slate-900 font-bold rounded-xl">
                      Return to Experiments
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
