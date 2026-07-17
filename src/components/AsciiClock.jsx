import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Big digit patterns for ASCII clock (5 rows each)
const DIGITS = {
  '0': [' ██ ', '█  █', '█  █', '█  █', ' ██ '],
  '1': [' █ ', '██ ', ' █ ', ' █ ', '███'],
  '2': ['███', '  █', '███', '█  ', '███'],
  '3': ['███', '  █', '███', '  █', '███'],
  '4': ['█ █', '█ █', '███', '  █', '  █'],
  '5': ['███', '█  ', '███', '  █', '███'],
  '6': ['███', '█  ', '███', '█ █', '███'],
  '7': ['███', '  █', '  █', '  █', '  █'],
  '8': ['███', '█ █', '███', '█ █', '███'],
  '9': ['███', '█ █', '███', '  █', '███'],
  ':': [' ', '█', ' ', '█', ' '],
};

function renderAsciiClock(h, m, s) {
  const timeStr = `${h}:${m}:${s}`;
  const rows = ['', '', '', '', ''];
  for (const ch of timeStr) {
    const d = DIGITS[ch] || DIGITS['0'];
    for (let r = 0; r < 5; r++) {
      rows[r] += d[r] + '  ';
    }
  }
  return rows.join('\n');
}

export default function AsciiClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const ascii = renderAsciiClock(h, m, s);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', padding: '2rem' }}>
      <div className="hazard-border" style={{ position: 'fixed', top: 0, left: 0, width: '100%' }} />

      <Link to="/" style={{ position: 'fixed', top: '24px', left: '24px', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', textDecoration: 'none' }}>
        ← home
      </Link>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', letterSpacing: '0.3em', marginBottom: '2rem', animation: 'blink 1.2s step-end infinite' }}>
          BABO GRID CLOCK // SOLANA MAINNET TIME
        </p>

        <pre style={{
          color: 'var(--color-accent)',
          fontSize: 'clamp(10px, 2.5vw, 22px)',
          lineHeight: 1.1,
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          textShadow: '0 0 20px var(--color-accent-glow)',
          letterSpacing: '0.05em',
          margin: '0 auto',
          whiteSpace: 'pre'
        }}>
          {ascii}
        </pre>

        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', letterSpacing: '0.2em', marginTop: '2rem', animation: 'blink 1.2s step-end infinite' }}>
          {`> the grid does not sleep. neither does babo.`}
        </p>
      </div>

      <div className="hazard-border" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }} />
    </div>
  );
}
