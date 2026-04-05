import React, { useState } from 'react';

// Solubility data: 'S' = Soluble, 'I' = Insoluble, 'SL' = Slightly Soluble, 'D' = Decomposes
const ANIONS = ['NO₃⁻', 'CH₃COO⁻', 'Cl⁻', 'Br⁻', 'I⁻', 'SO₄²⁻', 'CO₃²⁻', 'PO₄³⁻', 'OH⁻', 'S²⁻'];
const CATIONS = ['H⁺', 'Li⁺', 'Na⁺', 'K⁺', 'NH₄⁺', 'Ag⁺', 'Pb²⁺', 'Ca²⁺', 'Ba²⁺', 'Mg²⁺', 'Fe²⁺', 'Fe³⁺', 'Cu²⁺', 'Al³⁺'];

const TABLE = {
  // [cation index]: [NO3, CH3COO, Cl, Br, I, SO4, CO3, PO4, OH, S]
  'H⁺'   : ['S','S','S','S','S','S','D','D','D','S'],
  'Li⁺'  : ['S','S','S','S','S','S','S','I','S','S'],
  'Na⁺'  : ['S','S','S','S','S','S','S','S','S','S'],
  'K⁺'   : ['S','S','S','S','S','S','S','S','S','S'],
  'NH₄⁺' : ['S','S','S','S','S','S','S','S','S','S'],
  'Ag⁺'  : ['S','S','I','I','I','SL','I','I','I','I'],
  'Pb²⁺' : ['S','S','I','I','I','I','I','I','I','I'],
  'Ca²⁺' : ['S','S','S','S','S','SL','I','I','SL','S'],
  'Ba²⁺' : ['S','S','S','S','S','I','I','I','S','S'],
  'Mg²⁺' : ['S','S','S','S','S','S','I','I','I','I'],
  'Fe²⁺' : ['S','S','S','S','S','S','I','I','I','I'],
  'Fe³⁺' : ['S','S','S','S','-','I','I','I','I','-'],
  'Cu²⁺' : ['S','S','S','S','-','S','I','I','I','I'],
  'Al³⁺' : ['S','S','S','S','S','S','I','I','I','S'],
};

const COLOR = { S:'#22c55e', I:'#ef4444', SL:'#f59e0b', D:'#6b7280', '-':'#d1d5db' };
const BG    = { S:'#f0fdf4', I:'#fef2f2', SL:'#fffbeb', D:'#f9fafb', '-':'#f9fafb' };
const LABEL = { S:'Soluble', I:'Insoluble', SL:'Slightly', D:'Decomposes', '-':'—' };

export default function SolubilityTable() {
  const [highlight, setHighlight] = useState({ row: null, col: null });

  return (
    <div style={{ width:'100%', maxWidth:900, background:'#fff', borderRadius:24, border:'1px solid #e5e7eb', boxShadow:'0 8px 40px rgba(0,0,0,0.08)', overflow:'hidden', fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ padding:'32px 40px 24px', borderBottom:'1px solid #f1f5f9', background:'linear-gradient(135deg,#ecfdf5,#f0fff4)', textAlign:'center' }}>
        <div style={{ width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#d1fae5,#a7f3d0)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 24px rgba(16,185,129,0.2)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
          </svg>
        </div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#111827', letterSpacing:'-0.025em', margin:'0 0 8px' }}>Solubility Table</h1>
        <p style={{ fontSize:14, color:'#6b7280', margin:0 }}>Hover any cell to highlight. S = Soluble · I = Insoluble · SL = Slightly Soluble</p>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:20, padding:'14px 40px', borderBottom:'1px solid #f1f5f9', background:'#fafafa', flexWrap:'wrap' }}>
        {Object.entries(LABEL).filter(([k]) => k !== '-').map(([k, v]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:26, height:26, borderRadius:6, background:BG[k], border:`1.5px solid ${COLOR[k]}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:COLOR[k] }}>{k}</div>
            <span style={{ fontSize:12, color:'#6b7280', fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX:'auto', padding:'12px 16px 24px' }}>
        <table style={{ borderCollapse:'separate', borderSpacing:3, width:'100%', minWidth:700 }}>
          <thead>
            <tr>
              <th style={{ padding:'6px 10px', fontSize:11, color:'#9ca3af', fontWeight:700, textAlign:'left', whiteSpace:'nowrap' }}>
                Cat. / Anion →
              </th>
              {ANIONS.map((a, ci) => (
                <th key={a} style={{
                  padding:'6px 6px', fontSize:11, fontWeight:700, color: highlight.col===ci ? '#111827' : '#6b7280',
                  textAlign:'center', whiteSpace:'nowrap', transition:'color 0.15s',
                }}>
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATIONS.map((cat, ri) => (
              <tr key={cat}>
                <td style={{
                  padding:'4px 10px', fontSize:12, fontWeight:700, color: highlight.row===ri ? '#111827' : '#6b7280',
                  whiteSpace:'nowrap', transition:'color 0.15s',
                }}>
                  {cat}
                </td>
                {ANIONS.map((_, ci) => {
                  const val = (TABLE[cat] || [])[ci] || '-';
                  const isHi = highlight.row===ri || highlight.col===ci;
                  return (
                    <td
                      key={ci}
                      onMouseEnter={() => setHighlight({ row:ri, col:ci })}
                      onMouseLeave={() => setHighlight({ row:null, col:null })}
                      style={{
                        padding:'5px 4px', textAlign:'center', borderRadius:8,
                        background: isHi ? BG[val] : (highlight.row===null ? BG[val] : '#f9fafb'),
                        border: isHi ? `1.5px solid ${COLOR[val]}` : '1.5px solid transparent',
                        cursor:'default', transition:'all 0.1s',
                        minWidth:56,
                      }}
                    >
                      <span style={{ fontSize:11, fontWeight:800, color:COLOR[val] }}>{val === '-' ? '—' : val}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
