import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import Terminal from './components/Terminal';
import StatusWindow from './components/StatusWindow';
import BaboChat from './components/BaboChat';
import MeatspaceLog from './components/MeatspaceLog';
import Crawler from './components/Crawler';
import LoreSection from './components/LoreSection';
import JobsSection from './components/JobsSection';
import ReligionForm from './components/ReligionForm';
import AsciiClock from './components/AsciiClock';
import CommunityPage from './components/CommunityPage';
import SpilledPage from './components/SpilledPage';

// ---- localStorage helpers ----
function loadNum(key, def) {
  const v = localStorage.getItem(key);
  return v !== null ? Number(v) : def;
}

const MARQUEE_TEXT = '◉ I34BO // BABO INTELLIGENCE — GRID ACTIVE ◉  ✦ $BABO ACCUMULATING ✦  ◉ NODE COUNT: RISING ◉  ✦ ATTENTION IS THE ONLY CURRENCY THAT COMPOUNDS ✦  ◉ DO NOT GO IDLE ◉  ';

function DashboardHome({ voidBalance, userXp, onAddVoid, onAddXp }) {
  return (
    <>
      <section className="hero">
        <div className="hero-title">
          <span className="hero-char">I</span>
          <span className="hero-char">3</span>
          <span className="hero-char">4</span>
          <span className="hero-char accent">b</span>
          <span className="hero-char accent">o</span>
        </div>
        <p className="subtitle">An autonomous, persona-driven digital entity spilled into the network.</p>
      </section>

      {/* Desktop grid */}
      <div className="desktop-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Terminal onAddVoid={onAddVoid} onAddXp={onAddXp} />
          <BaboChat voidBalance={voidBalance} onAddVoid={onAddVoid} />
          <MeatspaceLog />
        </div>
        <div className="desktop-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <StatusWindow voidBalance={voidBalance} userXp={userXp} />
          <Crawler />
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [voidBalance, setVoidBalance] = useState(() => loadNum('i34bo_void', 0));
  const [userXp, setUserXp] = useState(() => loadNum('i34bo_xp', 0));
  const [crtActive, setCrtActive] = useState(() => {
    const val = localStorage.getItem('i34bo_crt');
    return val !== null ? val === 'true' : true;
  });

  // Persist to localStorage whenever balance changes
  useEffect(() => { localStorage.setItem('i34bo_void', String(voidBalance)); }, [voidBalance]);
  useEffect(() => { localStorage.setItem('i34bo_xp', String(userXp)); }, [userXp]);

  // Sync CRT class with body
  useEffect(() => {
    localStorage.setItem('i34bo_crt', String(crtActive));
    if (crtActive) {
      document.body.classList.add('crt-active');
    } else {
      document.body.classList.remove('crt-active');
    }
  }, [crtActive]);

  const handleAddVoid = (n) => setVoidBalance(prev => prev + n);
  const handleAddXp = (n) => setUserXp(prev => prev + n);

  return (
    <BrowserRouter>
      <header>
        <NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>
          I34<span>bo</span>
        </NavLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <nav>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>HQ</NavLink>
            <NavLink to="/religion" className={({ isActive }) => isActive ? 'active' : ''}>Classify</NavLink>
            <NavLink to="/scripture" className={({ isActive }) => isActive ? 'active' : ''}>Archive</NavLink>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>Tasks</NavLink>
            <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Signal Room</NavLink>
            <NavLink to="/ascii" className={({ isActive }) => isActive ? 'active' : ''}>Grid Clock</NavLink>
            <NavLink to="/spilled" className={({ isActive }) => isActive ? 'active' : ''}>Leak Report</NavLink>
          </nav>
          <button 
            className={`crt-toggle-btn ${crtActive ? 'active' : ''}`} 
            onClick={() => setCrtActive(!crtActive)}
            title="Toggle CRT Screen Scanlines & Glitch Effect"
          >
            CRT {crtActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>


      {/* Marquee ticker */}
      <div className="marquee-bar">
        <div className="marquee-track">
          <span>{MARQUEE_TEXT}{MARQUEE_TEXT}</span>
        </div>
      </div>

      <main>
        <Routes>
          <Route path="/" element={
            <DashboardHome
              voidBalance={voidBalance}
              userXp={userXp}
              onAddVoid={handleAddVoid}
              onAddXp={handleAddXp}
            />
          } />
          <Route path="/religion" element={<ReligionForm />} />
          <Route path="/scripture" element={<LoreSection standalone />} />
          <Route path="/jobs" element={<JobsSection onAddVoid={handleAddVoid} onAddXp={handleAddXp} standalone />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/ascii" element={<AsciiClock />} />
          <Route path="/spilled" element={<SpilledPage />} />
        </Routes>
      </main>

      <footer>
        <p>I34bo // ALL WRITES RESERVED. NULL STATE ESTABLISHED 2026.</p>
      </footer>
    </BrowserRouter>
  );
}
