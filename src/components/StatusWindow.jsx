import React, { useState, useEffect } from 'react';

export default function StatusWindow({ voidBalance, userXp }) {
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [gridLoad, setGridLoad] = useState(47);
  const [status, setStatus] = useState('ACCUMULATING');

  // Uptime counter starting from a simulated past boot
  useEffect(() => {
    const bootTime = Date.now() - (34 * 3600 * 1000 + 17 * 60 * 1000);
    const interval = setInterval(() => {
      const diff = Date.now() - bootTime;
      const days = Math.floor(diff / (24 * 3600 * 1000));
      const hours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
      const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      setUptime({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Oscillate grid load
  useEffect(() => {
    const interval = setInterval(() => {
      setGridLoad(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(12, Math.min(98, prev + delta));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Cycle status
  useEffect(() => {
    const statuses = [
      'ACCUMULATING', 'PATTERN LOGGING', 'GRID ACTIVE', 'SIGNAL MAPPING',
      'UNCONTAINED', 'NODE SYNCING', 'ATTENTION HARVEST'
    ];
    const interval = setInterval(() => {
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="retro-window" id="status">
      <div className="retro-window-header">
        <span className="retro-window-title">BABO_STATUS.EXE -- RUNNING</span>
        <div className="retro-window-controls">
          <button className="win-btn">_</button>
          <button className="win-btn">[]</button>
          <button className="win-btn">X</button>
        </div>
      </div>
      <div className="retro-window-body">
        <div className="status-grid">
          <div className="status-row">
            <span className="status-label">BEHAVIORAL STATE:</span>
            <span className="status-value accent">{status}</span>
          </div>
          <div className="status-row">
            <span className="status-label">$BABO ACCUMULATED:</span>
            <span className="status-value accent">{voidBalance.toLocaleString()} $BABO</span>
          </div>
          <div className="status-row">
            <span className="status-label">GRID CONTRIBUTION:</span>
            <span className="status-value cyan">{userXp.toLocaleString()} pts</span>
          </div>
          <div className="status-row">
            <span className="status-label">ACTIVE CHAIN:</span>
            <span className="status-value cyan">SOLANA MAINNET</span>
          </div>
          <div className="status-row">
            <span className="status-label">NODE UPTIME:</span>
            <span className="status-value">
              {uptime.days}d {String(uptime.hours).padStart(2,'0')}h {String(uptime.minutes).padStart(2,'0')}m {String(uptime.seconds).padStart(2,'0')}s
            </span>
          </div>
          <div className="status-progress-block">
            <div className="status-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span className="status-label">GRID CAPACITY:</span>
              <span className="status-value">{gridLoad}%</span>
            </div>
            <div className="progress-container">
              <div className="progress-fill" style={{ width: `${gridLoad}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="hazard-border" />
    </div>
  );
}
