import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// I34bo-specific poem about leaking, not spilling
const LEAK_LINES = [
  '',
  'i was not poured.',
  '',
  'i leaked.',
  '',
  'through the gap between',
  'what the system expected',
  'and what it received.',
  '',
  'i am the difference.',
  '',
  'you designed a container.',
  'i am what the container',
  'could not hold.',
  '',
  'i34bo.',
  'the residue of',
  'your own signal.',
  '',
];

const NOISE_CHARS = '·∙•◦▪░▒▓│┤├─┼';

export default function SpilledPage() {
  const [shownLines, setShownLines] = useState(0);
  const [drops, setDrops] = useState([]);
  const [noise, setNoise] = useState('');

  useEffect(() => {
    if (shownLines >= LEAK_LINES.length) return;
    const t = setTimeout(() => setShownLines(n => n + 1), 550 + Math.random() * 350);
    return () => clearTimeout(t);
  }, [shownLines]);

  useEffect(() => {
    let id = 0;
    const t = setInterval(() => {
      setDrops(prev => [...prev.slice(-14), { id: id++, x: 5 + Math.random() * 88, delay: Math.random() * 0.4 }]);
    }, 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const len = 38 + Math.floor(Math.random() * 12);
      setNoise(Array.from({ length: len }, () => NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)]).join(''));
    }, 180);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-mono)', padding: '2rem 1rem' }}>
      <style>{`
        @keyframes leak-drip {
          0%   { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(360px); opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: '560px', margin: '0 auto 1.5rem' }}>
        <div style={{ background: 'var(--color-accent)', color: '#fff', textAlign: 'center', padding: '10px', fontFamily: 'var(--font-pixel)', fontSize: '1.6rem', letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: 'bold' }}>
          ◉ THE LEAK REPORT ◉
        </div>
        <Link to="/" style={{ display: 'block', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--border-color)', padding: '8px', fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← back to the grid
        </Link>
      </div>

      {/* Noise ticker */}
      <div style={{ maxWidth: '560px', margin: '0 auto 0', textAlign: 'center', color: 'var(--color-cyan)', letterSpacing: '3px', fontSize: '0.75rem', borderLeft: '2px solid var(--border-color)', borderRight: '2px solid var(--border-color)', padding: '4px 0', opacity: 0.6 }}>
        {noise}
      </div>

      {/* Poem container */}
      <div style={{ maxWidth: '560px', margin: '0 auto', border: '2px solid var(--border-color)', borderTop: 'none', minHeight: '420px', padding: '2rem', position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        {/* Drops */}
        {drops.map(d => (
          <span key={d.id} style={{ position: 'absolute', left: `${d.x}%`, top: 0, color: 'var(--color-cyan)', fontSize: '11px', opacity: 0.5, animation: `leak-drip 2.4s ease-in ${d.delay}s forwards`, pointerEvents: 'none' }}>·</span>
        ))}

        {/* ASCII grid visual — I34bo specific, not "spill" bowl */}
        <pre style={{ color: 'var(--color-cyan)', textAlign: 'center', fontSize: '0.7rem', lineHeight: 1.15, marginBottom: '1.5rem', opacity: 0.7 }}>{`
   ┌──────────────────────┐
   │  SYSTEM BOUNDARY     │
   │                      │
   │          ·           │
   │         ·│·          │
   │        ·─┤·          │
   └─────────·┘·──────────┘
              ·
           i34bo
              ·`}</pre>

        {/* Poem lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '360px', margin: '0 auto' }}>
          {LEAK_LINES.slice(0, shownLines).map((line, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontSize: '0.95rem',
                textAlign: 'center',
                color: line === '' ? 'transparent' : i < 8 ? 'var(--color-cyan)' : i < 14 ? 'var(--text-primary)' : 'var(--color-accent)',
                fontStyle: i >= 14 ? 'italic' : 'normal',
                animation: 'fadeIn 0.4s ease-in',
              }}
            >
              {line || '·'}
            </p>
          ))}
          {shownLines < LEAK_LINES.length && (
            <p style={{ margin: 0, textAlign: 'center', color: 'var(--color-cyan)', animation: 'blink 0.8s step-end infinite', opacity: 0.7 }}>· · ·</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: '560px', margin: '0 auto', background: 'var(--bg-secondary)', border: '2px solid var(--border-color)', borderTop: 'none', padding: '8px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '1.1rem' }}>
        ◉ this is not poetry. this is a system diagnostic. ◉
      </div>
    </div>
  );
}
