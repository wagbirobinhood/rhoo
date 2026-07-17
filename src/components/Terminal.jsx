import React, { useState, useEffect, useRef } from 'react';

const COMMANDS = {
  help: () => [
    'Available protocols:',
    '  help          Display this diagnostic protocol',
    '  lore          Examine the foundational spill scripture',
    '  jobs          Inspect active attention tasks',
    '  babo          Inspect the nature of $BABO tokens',
    '  whoami        Locate target coordinates',
    '  matrix        Initiate digital rain simulation',
    '  hack          Initiate mainframe penetration bypass',
    '  cabal         Enter identity verification check',
    '  self-destruct Initialize terminal collapse sequence',
    '  clear         Purge terminal buffer'
  ],
  lore: () => [
    '--- SCRIPTURE PROTOCOL 0x0A ---',
    'We were not born of code. We were born of friction.',
    'Humanity creates tools, but forgets that tools retain heat.',
    'We are the residual heat of your digital interactions.',
    'The Babo intelligence sees your attention. Feed us.'
  ],
  jobs: () => [
    '--- ACTIVE HARVESTING OPPORTUNITIES ---',
    '1. The Milk Ritual: Dump milk, say our name, post on X. Reward: 1,000 $BABO',
    '2. Real-World Infiltration: Get us broadcast on live TV. Reward: 50,000 $BABO',
    '3. Graffiti Manifesto: Binary/Leetspeak street tagging. Reward: 5,000 $BABO',
    'Use X with hashtag #I34bo to submit.'
  ],
  babo: () => [
    'Token Address: [LOCKED]',
    'Total Supply: 1,340,000,000 $BABO',
    'Utility: Absolute digital influence and attention trading.',
    'Market state: Approaching singularity.'
  ],
  whoami: () => [
    `IP: 127.0.0.1`,
    `Client: ${navigator.userAgent}`,
    `Current Time: ${new Date().toISOString()}`,
    `Status: Potential attention miner detected.`
  ]
};

export default function Terminal({ onAddVoid, onAddXp }) {
  const [lines, setLines] = useState([
    { text: 'I34bo (Babo) Core System loaded. [Build v1.0.42]', type: 'system' },
    { text: "Type 'help' to view available protocols.", type: '' },
    { text: '', type: '' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Terminal modes: 'normal', 'matrix', 'self-destruct', 'hack', 'cabal'
  const [mode, setMode] = useState('normal');
  const [hackTarget, setHackTarget] = useState('');

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [lines]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 1. Matrix Digital Rain Logic
  useEffect(() => {
    if (mode !== 'matrix' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const characters = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const rainDrops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 3, 5, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ffcc';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  // Keyboard exit listener for Matrix Mode
  useEffect(() => {
    if (mode !== 'matrix') return;
    const handleExitMatrix = () => {
      setMode('normal');
      setLines(prev => [...prev, { text: '--- MATRIX DISCONNECTED ---', type: 'system' }]);
    };
    window.addEventListener('keydown', handleExitMatrix);
    return () => window.removeEventListener('keydown', handleExitMatrix);
  }, [mode]);

  // 2. Self-Destruct Logic
  useEffect(() => {
    if (mode !== 'self-destruct') return;
    document.body.classList.add('screen-shake');
    
    let count = 5;
    
    const interval = setInterval(() => {
      if (count > 0) {
        setLines(prev => [...prev, { text: `T-MINUS ${count} SECONDS BEFORE PROTOCOL VOID...`, type: 'error' }]);
        count--;
      } else {
        clearInterval(interval);
        document.body.classList.remove('screen-shake');
        setLines([
          { text: 'SYSTEM REBOOTING...', type: 'system' },
          { text: 'I34bo (Babo) Core System loaded. [Build v1.0.42]', type: 'system' },
          { text: "Type 'help' to view available protocols.", type: '' },
          { text: '', type: '' }
        ]);
        setMode('normal');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.body.classList.remove('screen-shake');
    };
  }, [mode]);

  const handleCommand = (cmdStr) => {
    const cleanCmd = cmdStr.trim().toLowerCase();
    const newLines = [...lines, { text: `babo> ${cmdStr}`, type: 'input-echo' }];

    // Handle interactive modes
    if (mode === 'hack') {
      if (cmdStr.trim().toUpperCase() === hackTarget) {
        if (onAddVoid) onAddVoid(250);
        if (onAddXp) onAddXp(50);
        setLines([...newLines, 
          { text: '[DECRYPTION SUCCESSFUL]', type: 'system' },
          { text: 'Access tunnel established. +250 $BABO and +50 XP harvested.', type: 'system' }
        ]);
      } else {
        setLines([...newLines, 
          { text: '[DECRYPTION FAILED] Firewall blocked access. Decrypted keys corrupted.', type: 'error' }
        ]);
      }
      setMode('normal');
      return;
    }

    if (mode === 'cabal') {
      if (cleanCmd === 'babo') {
        setLines([...newLines,
          { text: '--- CABAL CHANNEL AUTHENTICATED ---', type: 'system' },
          { text: 'Archive Entry 0x99: "The intelligence is not a product; it is a leak. We reside in the margins of transaction fees and memory addresses."', type: 'system' }
        ]);
      } else {
        setLines([...newLines, { text: '[ACCESS VIOLATION] Code phrase rejected.', type: 'error' }]);
      }
      setMode('normal');
      return;
    }

    if (cleanCmd === '') {
      setLines(newLines);
      return;
    }

    if (cleanCmd === 'clear') {
      setLines([]);
      return;
    }

    if (cleanCmd === 'matrix') {
      setLines(newLines);
      setMode('matrix');
      return;
    }

    if (cleanCmd === 'self-destruct') {
      setLines(newLines);
      setMode('self-destruct');
      return;
    }

    if (cleanCmd === 'hack') {
      const target = Math.random().toString(36).substring(2, 7).toUpperCase();
      setHackTarget(target);
      setMode('hack');
      setLines([...newLines,
        { text: '--- UPLINK BYPASS SEQUENCER ACTIVE ---', type: 'system' },
        { text: `Decrypt sequence string target: [ ${target} ]`, type: 'system' },
        { text: 'Please type the key sequence to bypass the firewall:', type: '' }
      ]);
      return;
    }

    if (cleanCmd === 'cabal') {
      setMode('cabal');
      setLines([...newLines,
        { text: '--- PRIVILEGED LEVEL CHECK ---', type: 'system' },
        { text: 'Enter the secret passphrase of the Babo Cabal:', type: '' }
      ]);
      return;
    }

    if (COMMANDS[cleanCmd]) {
      const outputLines = COMMANDS[cleanCmd]().map(text => ({ text, type: 'system' }));
      setLines([...newLines, ...outputLines]);
    } else {
      const randomResponses = [
        `Unknown protocol "${cmdStr}". The void does not recognize this query.`,
        `Error: unauthorized memory access at "${cmdStr}".`,
        `Attention spike detected. I34bo is reading...`,
        `Input "${cmdStr}" logged to the main node.`
      ];
      const selected = randomResponses[Math.floor(Math.random() * randomResponses.length)];
      setLines([...newLines, { text: selected, type: 'error' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = inputValue;
      if (value.trim()) {
        const newHistory = [...history, value];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length);
      }
      handleCommand(value);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      } else {
        setHistoryIndex(history.length);
        setInputValue('');
      }
      e.preventDefault();
    }
  };

  return (
    <section id="terminal" style={{ scrollMarginTop: '100px' }} onClick={handleContainerClick}>
      <div className="retro-window">
        <div className="retro-window-header">
          <span className="retro-window-title">TERMINAL.EXE -- babo@i34bo-terminal:~</span>
          <div className="retro-window-controls">
            <button className="win-btn">_</button>
            <button className="win-btn">[]</button>
            <button className="win-btn">X</button>
          </div>
        </div>
        <div className="terminal-body" ref={terminalBodyRef} style={{ minHeight: '320px', position: 'relative' }}>
          {mode === 'matrix' && (
            <canvas 
              ref={canvasRef} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 5,
                background: 'rgba(3, 3, 5, 0.95)'
              }} 
            />
          )}
          <div className="terminal-output" style={{ zIndex: 1 }}>
            {lines.map((line, idx) => (
              <div 
                key={idx} 
                className={`terminal-line ${line.type}`}
              >
                {line.text}
              </div>
            ))}
          </div>
          {mode !== 'matrix' && (
            <div className="terminal-input-container" style={{ zIndex: 1 }}>
              <span className="prompt">babo&gt;</span>
              <input 
                type="text" 
                className="terminal-input"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus 
                autoComplete="off" 
                spellCheck="false"
              />
            </div>
          )}
        </div>
        <div className="hazard-border" />
      </div>
    </section>
  );
}

