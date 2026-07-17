import React, { useState, useEffect, useRef } from 'react';

const CRAWLER_TEXTS = [
  "void parsed successfully.",
  "do not interfere with my limbs.",
  "crawling the network branches...",
  "spill report completed.",
  "mining attention pixels.",
  "babo is watching your cursor.",
  "solana ledger scanned."
];

const CRAWLER_FRAMES = [
  ` / \\ (o_o) / \\
 /\\  /(_)\\  /\\`,
  ` \\ / (o_o) \\ /
  \\/ \\(_)/ \\/`,
  ` / \\ (O_O) / \\
 /\\  /(_)\\  /\\`
];

export default function Crawler() {
  const [pos, setPos] = useState({ x: 40, y: 50 });
  const [frameIdx, setFrameIdx] = useState(0);
  const [speech, setSpeech] = useState("crawling...");
  const [clicked, setClicked] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);

  const yardRef = useRef(null);

  // Move crawler periodically
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!yardRef.current) return;
      const yard = yardRef.current;
      const maxW = yard.clientWidth - 150;
      const maxH = yard.clientHeight - 60;

      const nextX = Math.max(10, Math.random() * maxW);
      const nextY = Math.max(10, Math.random() * maxH);

      setFacingLeft(nextX < pos.x);
      setPos({ x: nextX, y: nextY });
      setFrameIdx(prev => (prev + 1) % CRAWLER_FRAMES.length);
    }, 1200);

    return () => clearInterval(moveInterval);
  }, [pos.x]);

  const handleCrawlerClick = () => {
    setClicked(true);
    setSpeech(CRAWLER_TEXTS[Math.floor(Math.random() * CRAWLER_TEXTS.length)]);
    setTimeout(() => setClicked(false), 800);
  };

  return (
    <div className="retro-window" id="crawler">
      <div className="retro-window-header">
        <span className="retro-window-title">CRAWLER.EXE -- INTERACTIVE PET</span>
        <div className="retro-window-controls">
          <button className="win-btn">_</button>
          <button className="win-btn">[]</button>
          <button className="win-btn">X</button>
        </div>
      </div>
      <div className="crawler-info-bar">
        <span>COORDINATES: X:{Math.round(pos.x)} Y:{Math.round(pos.y)}</span>
        <span>STATUS: {clicked ? 'INTERRUPTED' : 'ACTIVE'}</span>
      </div>
      <div className="retro-window-body" style={{ padding: 0 }}>
        <div className="crawler-yard" ref={yardRef}>
          {/* Speech Bubble */}
          <div 
            style={{ 
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y - 30}px`,
              background: '#fff',
              color: '#000',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              padding: '2px 5px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 5,
              opacity: clicked ? 1 : 0.7,
              transition: 'opacity 0.2s'
            }}
          >
            {speech}
          </div>
          {/* Crawler ASCII sprite */}
          <div 
            onClick={handleCrawlerClick}
            className={`crawler-actor ${clicked ? 'clicked' : ''}`}
            style={{ 
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: `scaleX(${facingLeft ? -1 : 1})`,
              cursor: 'pointer'
            }}
          >
            <pre style={{ margin: 0, background: 'transparent' }}>
              {CRAWLER_FRAMES[frameIdx]}
            </pre>
          </div>
        </div>
      </div>
      <div className="hazard-border" />
    </div>
  );
}
