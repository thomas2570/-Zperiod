import React from 'react';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = [
  { id: 'all',                    label: 'All',              color: '#6366f1' },
  { id: 'alkali metal',           label: 'Alkali Metal',     color: '#f87171' },
  { id: 'alkaline earth metal',   label: 'Alkaline Earth',   color: '#fb923c' },
  { id: 'transition metal',       label: 'Transition Metal', color: '#86efac' },
  { id: 'metalloid',              label: 'Metalloid',        color: '#a78bfa' },
  { id: 'halogen',                label: 'Halogen',          color: '#fde047' },
  { id: 'noble gas',              label: 'Noble Gas',        color: '#f9a8d4' },
  { id: 'lanthanide',             label: 'Lanthanides',      color: '#fca5a5' },
  { id: 'actinide',               label: 'Actinides',        color: '#c084fc' },
  { id: 'diatomic nonmetal',      label: 'Other Nonmetal',   color: '#6ee7b7' },
  { id: 'post-transition metal',  label: 'Post-Transition',  color: '#93c5fd' },
];

export default function FilterBar() {
  const { state, dispatch } = useAppContext();

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Legend — inline multi-column, matches reference site */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '6px 20px',
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        backdropFilter: 'blur(8px)',
        marginBottom: 12,
      }}>
        {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
          const isActive = state.activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: isActive ? 'all' : cat.id })}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '3px 0', textAlign: 'left',
                opacity: state.activeFilter !== 'all' && !isActive ? 0.4 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: 3, flexShrink: 0,
                background: cat.color,
                boxShadow: isActive ? `0 0 0 2px ${cat.color}50` : 'none',
                transition: 'box-shadow 0.15s',
              }} />
              <span style={{
                fontSize: 12, color: isActive ? '#111827' : '#4b5563',
                fontWeight: isActive ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
              }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 10, padding: '8px 14px',
          flex: 1, maxWidth: 320,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="element-search"
            type="text"
            placeholder="Search by name or symbol…"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: '#374151', width: '100%',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          {state.searchQuery && (
            <button
              onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Reset filter */}
        {state.activeFilter !== 'all' && (
          <button
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
            style={{
              padding: '8px 14px', borderRadius: 9, border: '1px solid #e2e8f0',
              background: '#fff', fontSize: 12, fontWeight: 600, color: '#6b7280',
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
