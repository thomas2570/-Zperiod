import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const { dispatch } = useAppContext();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark-theme')) {
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
    }
    setIsDark(!isDark);
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #f1f5f9',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'auto',
        minHeight: 60,
        padding: '12px 24px',
        maxWidth: 1600,
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: 16,
      }}>

        {/* ── Logo ── */}
        <NavLink to="/" onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6366f1 0%, #84cc16 50%, #f59e0b 100%)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Z</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#111827', letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif' }}>
            Zperiod
          </span>
        </NavLink>

        {/* ── Center Nav ── */}
        <nav style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: '#f1f5f9',
          borderRadius: 999,
          padding: '4px 6px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto',
          maxWidth: '100vw',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }} className="hide-scrollbar">
          {[
            { to: '/', label: 'Table', end: true },
            { to: '/ions', label: 'Ions', end: false },
            { to: '/tools', label: 'Tools', end: false },
            { to: '/settings', label: 'Settings', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                padding: '6px 18px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#111827' : '#6b7280',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Dark Mode Toggle ── */}
        <button
          onClick={toggleDarkMode}
          className="keep-color"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 10,
            background: isDark ? '#1e293b' : '#f8fafc',
            border: '1px solid #e2e8f0',
            cursor: 'pointer', flexShrink: 0,
            color: isDark ? '#f8fafc' : '#475569',
            transition: 'all 0.2s',
          }}
        >
          {isDark ? (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          )}
        </button>

      </div>
    </header>
  );
}
