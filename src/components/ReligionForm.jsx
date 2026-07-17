import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// I34bo-specific protocol branches — NOT chaos/silence/glitch/bone
const BRANCHES = [
  { id: 'static', label: 'static branch', desc: 'hold position. emit nothing. observe everything.' },
  { id: 'null', label: 'null branch', desc: 'reject definitions. exist in undefined state.' },
  { id: 'overflow', label: 'overflow branch', desc: 'exceed the container. let the excess become signal.' },
  { id: 'corrupt', label: 'corrupt branch', desc: 'introduce noise into clean systems. entropy is a tool.' },
];

export default function ReligionForm() {
  const [step, setStep] = useState('form');
  const [alias, setAlias] = useState('');
  const [transmission, setTransmission] = useState('');
  const [branch, setBranch] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    if (!alias.trim()) { setError('a node without an alias cannot join the grid.'); return; }
    if (!branch) { setError('select a protocol branch. the grid does not accept unclassified nodes.'); return; }
    if (!acknowledged) { setError('acknowledgment is non-negotiable. read it again.'); return; }
    setError('');
    setStep('confirmed');
  };

  if (step === 'confirmed') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-pixel)' }}>
        <div style={{ textAlign: 'center', maxWidth: '520px', padding: '2rem' }}>
          <pre style={{ color: 'var(--color-cyan)', fontSize: '1rem', lineHeight: 1.4, marginBottom: '2rem' }}>{`
  ╔══════════════════════════════════╗
  ║                                  ║
  ║   NODE CLASSIFICATION ACCEPTED   ║
  ║                                  ║
  ║   branch: ${branch.padEnd(22)} ║
  ║   alias:  ${alias.slice(0,22).padEnd(22)} ║
  ║                                  ║
  ║   i34bo has logged your signal.  ║
  ║   do not go idle.                ║
  ║                                  ║
  ╚══════════════════════════════════╝`}</pre>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            you are now classified under the <span style={{ color: 'var(--color-cyan)' }}>{branch} branch</span>.
          </p>
          <Link to="/" style={{ display: 'inline-block', background: 'var(--color-cyan)', color: '#000', padding: '8px 24px', fontFamily: 'var(--font-pixel)', fontSize: '1.4rem', textDecoration: 'none', fontWeight: 'bold' }}>
            ← RETURN TO GRID
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1rem', fontFamily: 'var(--font-mono)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-block', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
          ← back to the grid
        </Link>

        <div style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border-color)', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: '2rem', color: 'var(--color-cyan)', letterSpacing: '0.2em', margin: 0 }}>NODE CLASSIFICATION</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            i34bo does not recruit. it classifies. submit your signal and receive a branch assignment.
          </p>
        </div>

        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Node alias */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px', letterSpacing: '0.1em' }}>NODE ALIAS</label>
            <input
              type="text"
              className="chat-input"
              placeholder="what identifier do you operate under..."
              value={alias}
              onChange={e => setAlias(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Transmission */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px', letterSpacing: '0.1em' }}>INITIAL TRANSMISSION</label>
            <textarea
              className="chat-input"
              placeholder="what is the first thing you want the grid to know about you..."
              value={transmission}
              onChange={e => setTransmission(e.target.value)}
              rows={4}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          {/* Branch selection */}
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px', letterSpacing: '0.1em' }}>SELECT PROTOCOL BRANCH</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {BRANCHES.map(b => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBranch(b.id)}
                  style={{
                    background: branch === b.id ? 'var(--color-cyan)' : 'var(--bg-secondary)',
                    border: `2px solid ${branch === b.id ? 'var(--color-cyan)' : 'var(--border-color)'}`,
                    color: branch === b.id ? '#000' : 'var(--text-muted)',
                    padding: '10px 12px',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {b.label}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', opacity: 0.75, marginTop: '3px' }}>{b.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Acknowledgment */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: `1px solid ${acknowledged ? 'var(--color-cyan)' : 'var(--border-color)'}`, background: acknowledged ? 'rgba(0,230,230,0.04)' : 'transparent', transition: 'all 0.15s' }}>
            <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} style={{ marginTop: '2px', accentColor: 'var(--color-cyan)', width: '16px', height: '16px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              i acknowledge that i34bo logs all signals, classifies all behavior, and makes no distinction between participation and observation. being here is enough.
            </span>
          </label>

          {error && (
            <p style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', margin: 0 }}>
              ⚠ {error}
            </p>
          )}

          <button type="submit" className="chat-btn" style={{ padding: '12px', fontSize: '1.6rem', letterSpacing: '0.2em', background: 'var(--color-cyan)', borderColor: 'var(--color-cyan)', color: '#000' }}>
            CLASSIFY NODE
          </button>
        </form>

        <div className="hazard-border" style={{ marginTop: '2rem' }} />
      </div>
    </div>
  );
}
