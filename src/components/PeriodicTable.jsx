import React from 'react';
import ElementTile from './ElementTile';
import data from '../data/elements.json';

export default function PeriodicTable() {
  const elements = data.elements;

  // The Bowserinator dataset sometimes has 119 elements (including a placeholder).
  // We filter to 118 real elements.
  const validElements = elements.filter(e => e.number >= 1 && e.number <= 118);

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden pb-12 relative z-10 flex justify-center hide-scrollbar mt-4" style={{ perspective: '1000px' }}>
      <div 
        className="min-w-[1000px] w-max grid gap-1.5 md:gap-2 px-4 mx-auto"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(48px, 64px))',
          gridTemplateRows: 'repeat(10, minmax(48px, 64px))',
          transformStyle: 'preserve-3d'
        }}
      >
        {validElements.map((el) => (
          <ElementTile key={el.number} element={el} />
        ))}
        
        {/* Placeholder space for Lanthanides/Actinides labels */}
        <div style={{ gridColumn: '3', gridRow: '6' }} className="flex justify-center items-center text-xs opacity-50 font-bold">*</div>
        <div style={{ gridColumn: '3', gridRow: '7' }} className="flex justify-center items-center text-xs opacity-50 font-bold">**</div>
      </div>
    </div>
  );
}
