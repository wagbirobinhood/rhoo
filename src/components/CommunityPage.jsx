import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Community unlock target: 7 days from now (stored in localStorage)
function getUnlockTarget() {
  const stored = localStorage.getItem('i34bo_community_unlock');
  if (stored) return parseInt(stored, 10);
  // Set 7 days from first visit
  const target = Date.now() + 7 * 24 * 60 * 60 * 1000;
  localStorage.setItem('i34bo_community_unlock', String(target));
  return target;
}

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

export default function CommunityPage() {
  const unlockTarget = useMemo(() => getUnlockTarget(), []);
  const [now, setNow] = useState(Date.now());
  const [phase, setPhase] = useState(0);
  const [scanlines, setScanlines] = useState('');
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  // Noise scanline generator
  useEffect(() => {
    if (phase !== 1) return;
    const chars = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';
    const t = setInterval(() => {
      const len = 60;
      setScanlines(Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
    }, 80);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, unlockTarget - now);
  const totalH = Math.floor(diff / 3600000);
  const days = Math.floor(totalH / 24);
  const hours = totalH % 24;
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const isOpen = diff === 0;

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'var(--font-mono)', background: 'hsl(240, 60%, 8%)', color: 'hsl(325, 95%, 70%)', overflow: 'hidden', position: 'relative' }}>
      {/* CRT scanline overlay */}
      <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 40, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.13) 0px, rgba(0,0,0,0.13) 1px, transparent 1px, transparent 3px)', mixBlendMode: 'overlay' }} />

      {/* Phase 0: initial flash */}
      {phase === 0 && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ animation: 'blink 0.5s step-end infinite', fontSize: '2rem' }}>·</span>
        </div>
      )}

      {/* Phase 1: noise scan */}
      {phase === 1 && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <pre style={{ color: 'hsl(325, 95%, 70%)', opacity: 0.5, fontSize: '0.7rem', letterSpacing: '2px' }}>{scanlines}</pre>
        </div>
      )}

      {/* Phase 2+ : actual content */}
      {phase >= 2 && (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '700px', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ display: 'inline-block', fontSize: '0.75rem', border: '2px solid hsl(325, 95%, 60%)', padding: '4px 12px', fontFamily: 'var(--font-pixel)', color: '#fff', background: 'hsl(325, 95%, 60%)', textDecoration: 'none' }}>
              ← back to the den
            </Link>
          </div>

          {/* Title */}
          <div style={{ width: '100%', maxWidth: '700px', border: '2px solid hsl(325, 95%, 60%)', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.5em', marginBottom: '0.5rem', opacity: 0.7 }}>░ signal detected ░</p>
            <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(1.5rem, 5vw, 3rem)', letterSpacing: '0.2em', margin: 0 }}>
              SIGNAL ROOM
            </h1>
          </div>

          {/* Phase 3: status messages */}
          {phase >= 3 && (
            <div style={{ width: '100%', maxWidth: '700px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                '> signal convergence in progress.',
                '> the room opens when the threshold is crossed.',
                '> nodes are accumulating.',
                '> the grid measures readiness, not patience.',
                '> do not arrive before the signal.',
              ].map((line, i) => (
                <p key={i} style={{ fontSize: '0.85rem', margin: 0, opacity: 0.85 }} className="anim-fade-in">{line}</p>
              ))}
            </div>
          )}

          {/* Countdown or OPEN */}
          <div style={{ width: '100%', maxWidth: '700px', border: '2px solid hsl(325, 95%, 60%)', padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', marginBottom: '1rem', opacity: 0.8 }}>▓▓ time until signal room opens ▓▓</p>

            {isOpen ? (
              <div>
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '2rem', animation: 'blink 0.8s step-end infinite', marginBottom: '1rem' }}>◉ SIGNAL ROOM OPEN ◉</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem' }}>node convergence active ░ the grid is live ░</p>
                <Link to="/" style={{ display: 'inline-block', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', border: '4px solid hsl(325, 95%, 60%)', padding: '12px 32px', color: '#fff', background: 'hsl(325, 95%, 60%)', textDecoration: 'none', fontWeight: 'black', letterSpacing: '0.2em' }}>
                  [ ENTER SIGNAL ROOM ] →
                </Link>
              </div>
            ) : (
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span>{pad(days)}d</span>
                  <span>:</span>
                  <span>{pad(hours)}h</span>
                  <span>:</span>
                  <span>{pad(mins)}m</span>
                  <span>:</span>
                  <span>{pad(secs)}s</span>
                </div>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.7, animation: 'blink 1.2s step-end infinite' }}>
                  {`gathering${'.'.repeat(dots)}`}
                </p>
              </div>
            )}
          </div>

          {/* Noise ticker */}
          <div style={{ width: '100%', maxWidth: '700px', marginTop: '1.5rem', overflow: 'hidden', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>
            {scanlines}
          </div>
        </div>
      )}
    </div>
  );
}
