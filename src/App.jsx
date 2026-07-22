import React, { useState, useEffect, useRef } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import './index.css';

// --- TOKEN GATING CONFIGURATION ---
const TOKEN_CONTRACT_ADDRESS = 'COMING SOON';
// MINIMUM BALANCE REQUIRED: 100,000 Tokens. 
// Standard tokens have 18 decimals, so we multiply 100,000 by 10^18.
const MIN_TOKEN_BALANCE = 100000n * 10n ** 18n; 

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const erc20Abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)'
]);
// -----------------------------------

import { attachGlobalAudioHooks } from './utils';
import { supabase } from './supabaseClient';
import { playHoverSound, playGlitchSound, playSuccessSound, playErrorSound } from './audio';

function LoadingScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const bootLogs = [
    "INITIALIZING KERNEL...",
    "MOUNTING VIRTUAL FILESYSTEM...",
    "ESTABLISHING UPLINK TO NEO-GRID...",
    "BYPASSING FIREWALL [████████░░] 80%",
    "BYPASSING FIREWALL [██████████] 100%",
    "DECRYPTING PAYLOAD...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 250); // fast typing effect
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="boot-screen">
      <div className="boot-terminal">
        {logs.map((log, i) => (
          <div key={i} className="boot-log-line">{log}</div>
        ))}
        {logs.length < bootLogs.length && <div className="boot-cursor">_</div>}
      </div>
    </div>
  );
}

function Navbar({ currentTab, setCurrentTab }) {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const handleWalletClick = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getButtonText = () => {
    if (!authenticated) return 'Connect Wallet';
    if (user?.wallet?.address) return formatAddress(user.wallet.address);
    if (user?.email?.address) return user.email.address.split('@')[0];
    return 'Connected';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">RHOO</div>
      <div className="nav-links">
        <button className={`nav-link ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')}>HOME</button>
        <button className={`nav-link ${currentTab === 'catch' ? 'active' : ''}`} onClick={() => setCurrentTab('catch')}>CATCH</button>
        <button className={`nav-link ${currentTab === 'rank' ? 'active' : ''}`} onClick={() => setCurrentTab('rank')}>RANK</button>
        <button className={`nav-link ${currentTab === 'faq' ? 'active' : ''}`} onClick={() => setCurrentTab('faq')}>FAQ</button>
        {authenticated && wallets[0]?.address === import.meta.env.VITE_ADMIN_WALLET && (
          <button className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`} onClick={() => setCurrentTab('admin')}>[ADMIN]</button>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className={`btn-connect ${authenticated ? 'connected' : ''}`} onClick={handleWalletClick}>
          {getButtonText()}
        </button>
      </div>
    </nav>
  );
}

function Hero({ setPopupMessage }) {
  const copyCA = () => {
    if (TOKEN_CONTRACT_ADDRESS === 'COMING SOON' || !TOKEN_CONTRACT_ADDRESS) {
      setPopupMessage("SYS.INFO: Contract Address is coming soon!");
      return;
    }
    navigator.clipboard.writeText(TOKEN_CONTRACT_ADDRESS);
    setPopupMessage("SYS.SUCCESS: Contract Address copied to clipboard!");
  };

  return (
    <section className="hero">
      <h1 className="hero-headline">The Neon Scavenge</h1>
      <p className="hero-subheadline">
        The corporate vault of Sector 4 is cracked. RHOO Data Nodes have spilled into the public grid. You have exactly 10 minutes to infiltrate the network, secure a node, and extract the encrypted capital before the firewall purges all unauthorized connections.
      </p>
      
      <div className="hero-actions">
        <div className="ca-box" onClick={copyCA} title="Contract Address Coming Soon" style={{ cursor: 'pointer' }}>
          <span className="ca-label">CA:</span>
          <span className="ca-address">{TOKEN_CONTRACT_ADDRESS}</span>
        </div>
        <div className="social-links">
          <a href="https://x.com/RHOOapp" target="_blank" rel="noreferrer" className="social-link">[ X / TWITTER ]</a>
          <a href="https://dexscreener.com" target="_blank" rel="noreferrer" className="social-link">[ DEXSCREENER ]</a>
        </div>
      </div>
    </section>
  );
}

function FeatherCoin({ onExtract, isSnatched, rewardAmount, isLoading, isSystemPaused }) {
  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef(null);

  const startHold = () => {
    if (isSystemPaused || isSnatched || isLoading) return;
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      setIsHolding(false);
      onExtract();
    }, 1500);
  };

  const cancelHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsHolding(false);
  };

  return (
    <div 
      className={`coin-wrapper ${isSnatched ? 'snatched' : ''} ${isLoading ? 'scanning' : ''} ${isHolding ? 'holding' : ''} ${isSystemPaused ? 'paused' : ''}`}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onMouseEnter={(!isSnatched && !isSystemPaused) ? playHoverSound : undefined}
    >
      <div className="coin-3d">
        <div className="coin-face coin-front">
          {!isSnatched && <div className="coin-inner-ring">RHOO</div>}
        </div>
        <div className="coin-face coin-back">
          {isSystemPaused ? (
            <span className="scanning-text" style={{ color: '#ff0055' }}>PAUSED</span>
          ) : isSnatched ? (
            <div className="snatched-text reward">
              ${rewardAmount}
            </div>
          ) : isLoading ? (
            <span className="scanning-text">SCAN...</span>
          ) : (
            <div className="coin-inner-ring">RHOO</div>
          )}
        </div>
      </div>
      {isHolding && <div className="hold-progress"><div className="hold-progress-bar"></div></div>}
      {isSystemPaused ? (
        <div className="coin-label" style={{ color: '#ff0055' }}>OFFLINE</div>
      ) : !isSnatched && !isLoading && !isHolding ? (
        <div className="coin-label">HOLD TO EXTRACT</div>
      ) : !isSnatched && !isLoading && isHolding ? (
        <div className="coin-label holding-text">EXTRACTING...</div>
      ) : isSnatched ? (
        <div className="coin-label snatched">CLAIMED</div>
      ) : null}
    </div>
  );
}

function CyberPopup({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-header">SYSTEM.ALERT</div>
        <div className="popup-content">{message}</div>
        <button className="popup-btn" onClick={onClose}>ACKNOWLEDGE</button>
      </div>
    </div>
  );
}

const calculateTimeLeft = (startTimeStr, durationSeconds = 600) => {
  if (!startTimeStr) return { left: 0, duration: durationSeconds };
  const start = new Date(startTimeStr).getTime();
  if (isNaN(start)) return { left: 0, duration: durationSeconds };
  
  const elapsed = Math.floor((Date.now() - start) / 1000);
  const left = durationSeconds - elapsed;
  return {
    left: left > 0 ? left : 0,
    duration: durationSeconds
  };
};

function GachaGrid({ setPopupMessage }) {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [coins, setCoins] = useState(Array(6).fill({ is_snatched: false, reward_amount: 0 }));
  const [loadingNode, setLoadingNode] = useState(null);

  const [roundActive, setRoundActive] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(null);
  const [roundDuration, setRoundDuration] = useState(600);
  const [autoLoop, setAutoLoop] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const activeNodes = coins.filter(c => !c.is_snatched).length;

  // Supabase real-time sync
  useEffect(() => {
    if (!supabase) return;

    // Fetch initial state
    const fetchInitialData = async () => {
      const { data: coinData, error: coinError } = await supabase
        .from('gacha_state')
        .select('id, is_snatched, reward_amount, snatch_time, snatched_by')
        .order('id');
      
      const derivedLogs = [];

      if (!coinError && coinData && coinData.length > 0) {
        const newCoins = Array(6).fill({ is_snatched: false, reward_amount: 0 });
        let firstSnatchTime = null;

        coinData.forEach(coin => {
          if (coin.id >= 0 && coin.id < 6) {
            newCoins[coin.id] = {
              is_snatched: coin.is_snatched,
              reward_amount: coin.reward_amount || 0
            };
            if (!firstSnatchTime && coin.snatch_time) {
              firstSnatchTime = coin.snatch_time;
            }
            if (coin.is_snatched && coin.snatched_by) {
              derivedLogs.push({
                id: `db-snatch-${coin.id}`,
                wallet_address: coin.snatched_by,
                action: 'SNATCHED',
                amount: coin.reward_amount || 0,
                created_at: new Date().toISOString()
              });
            }
          }
        });

        setCoins(newCoins);

        if (firstSnatchTime) {
          const { left } = calculateTimeLeft(firstSnatchTime, roundDuration);
          if (left > 0) {
            setRoundActive(true);
            setRoundStartTime(firstSnatchTime);
            setTimeLeft(left);
          } else {
            setRoundActive(false);
            setTimeLeft(0);
          }
        } else {
          setRoundActive(false);
          setTimeLeft(0);
        }
      }

      // Fetch latest logs from DB
      const { data: logData } = await supabase
        .from('gacha_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const combined = [...derivedLogs, ...(logData || [])];
      setLogs(combined.slice(0, 5));
    };

    fetchInitialData();

    // Subscribe to changes
    const channel = supabase
      .channel('gacha_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'gacha_state' }, (payload) => {
        if (payload.new.id >= 0 && payload.new.id < 6) {
          setCoins(current => {
            const newCoins = [...current];
            newCoins[payload.new.id] = {
              is_snatched: payload.new.is_snatched,
              reward_amount: payload.new.reward_amount !== undefined ? payload.new.reward_amount : current[payload.new.id].reward_amount
            };
            return newCoins;
          });

          // If a node was snatched in real-time, add to activity logs!
          if (payload.new.is_snatched && payload.new.snatched_by) {
            const rtLog = {
              id: `rt-snatch-${payload.new.id}-${Date.now()}`,
              wallet_address: payload.new.snatched_by,
              action: 'SNATCHED',
              amount: payload.new.reward_amount || 0,
              created_at: new Date().toISOString()
            };
            setLogs(prev => [rtLog, ...prev.filter(l => l.id !== rtLog.id)].slice(0, 5));
          }

          // Check snatch_time update for round state
          const newSnatchTime = payload.new.snatch_time;
          if (newSnatchTime) {
            const { left } = calculateTimeLeft(newSnatchTime, roundDuration);
            if (left > 0) {
              setRoundActive(true);
              setRoundStartTime(newSnatchTime);
              setTimeLeft(left);
            } else {
              setRoundActive(false);
              setTimeLeft(0);
            }
          } else {
            setRoundActive(false);
            setTimeLeft(0);
          }
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gacha_logs' }, (payload) => {
        setLogs(current => {
          const newLogs = [payload.new, ...current];
          if (newLogs.length > 5) newLogs.pop();
          return newLogs;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (roundActive && roundStartTime) {
        const { left } = calculateTimeLeft(roundStartTime, roundDuration);
        setTimeLeft(left);
        
        if (left <= 0) {
          setRoundActive(false);
          setCoins(Array(6).fill({ is_snatched: false, reward_amount: 0 }));
          
          if (supabase && Math.random() < 0.2) {
            if (autoLoop) {
              const nowISO = new Date().toISOString();
              supabase.from('gacha_state').update({
                is_snatched: false,
                snatched_by: null,
                snatch_time: nowISO
              }).gte('id', 0).then();
            } else {
              supabase.from('gacha_state').update({
                is_snatched: false,
                snatched_by: null,
                snatch_time: null
              }).gte('id', 0).then();
            }
          }
        }
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [roundActive, roundStartTime, roundDuration, autoLoop]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSnatch = async (index) => {
    if (!roundActive) {
      setPopupMessage("ACCESS DENIED: System is currently offline. Waiting for admin to start the round.");
      playErrorSound();
      return;
    }
    if (coins[index].is_snatched || loadingNode !== null) return;
    
    if (!authenticated) {
      login();
      return;
    }
    
    playGlitchSound();

    const activeWallet = wallets[0];
    if (!activeWallet) {
      setPopupMessage("SYS.ERROR: No active wallet connection found.");
      return;
    }

    setLoadingNode(index);

    try {
      let balance = 0n;
      try {
        if (TOKEN_CONTRACT_ADDRESS && TOKEN_CONTRACT_ADDRESS.startsWith('0x')) {
          balance = await publicClient.readContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [activeWallet.address],
          });
        } else {
          balance = MIN_TOKEN_BALANCE;
        }
      } catch (readErr) {
        console.warn("Could not read contract balance, applying fallback:", readErr);
        // Fallback for testing/unsupported RPC
        balance = MIN_TOKEN_BALANCE;
      }

      if (balance >= MIN_TOKEN_BALANCE) {
        if (supabase) {
          // Verify it's still available in DB
          const { data } = await supabase.from('gacha_state').select('is_snatched, reward_amount').eq('id', index).single();
          if (data && data.is_snatched) {
             setPopupMessage("NODE LOST: Another runner got it first.");
             setLoadingNode(null);
             playErrorSound();
             return;
          }

          // Check if user already claimed this round
          const { data: userSnatches } = await supabase.from('gacha_state').select('id').eq('snatched_by', activeWallet.address);
          if (userSnatches && userSnatches.length > 0) {
             setPopupMessage("ACCESS DENIED: Limit 1 node per round.");
             setLoadingNode(null);
             playErrorSound();
             return;
          }

          // Update DB
          await supabase.from('gacha_state').update({ 
            is_snatched: true,
            snatched_by: activeWallet.address
          }).eq('id', index);
          
          // Log Activity (safely wrapped so RLS block on gacha_logs doesn't interrupt flow)
          try {
            await supabase.from('gacha_logs').insert({
              wallet_address: activeWallet.address,
              action: 'SNATCHED',
              amount: data.reward_amount || 0
            });
          } catch (e) {
            // Ignored
          }

          // Always push claim log to activity log state immediately!
          const claimLog = {
            id: `claim-snatch-${index}-${Date.now()}`,
            wallet_address: activeWallet.address,
            action: 'SNATCHED',
            amount: data.reward_amount || 0,
            created_at: new Date().toISOString()
          };
          setLogs(prev => [claimLog, ...prev.filter(l => l.id !== claimLog.id)].slice(0, 5));
          
          // Update User Stats
          const { data: stats } = await supabase.from('user_stats').select('total_earned, nodes_snatched').eq('wallet_address', activeWallet.address).maybeSingle();
          if (stats) {
            await supabase.from('user_stats').update({
              total_earned: Number(stats.total_earned) + Number(data.reward_amount || 0),
              nodes_snatched: Number(stats.nodes_snatched) + 1,
              last_active: new Date().toISOString()
            }).eq('wallet_address', activeWallet.address);
          } else {
            await supabase.from('user_stats').insert({
              wallet_address: activeWallet.address,
              total_earned: Number(data.reward_amount || 0),
              nodes_snatched: 1
            });
          }
          
          setPopupMessage(`NODE SNATCHED: You extracted $${data.reward_amount || '0'}!`);
          playSuccessSound();
        } else {
          // Local fallback
          const newCoins = [...coins];
          newCoins[index] = { is_snatched: true, reward_amount: 0 };
          setCoins(newCoins);
          setPopupMessage("NODE SNATCHED (Local Mode): Supabase not connected.");
        }
      } else {
        setPopupMessage("ACCESS DENIED: Required token clearance not found in your wallet.");
        playErrorSound();
      }
    } catch (error) {
      console.error(error);
      setPopupMessage("SYS.ERROR: Failed to scan blockchain for token clearance.");
      playErrorSound();
    } finally {
      setLoadingNode(null);
    }
  };

  return (
    <section className="gacha-section">
      <div className="status-board">
        <div className="status-box">
          <span className="status-label">SYS.NODES</span>
          <span className="status-value">{activeNodes}/6</span>
        </div>
        <div className="status-box alert">
          <span className="status-label">RESET_SYNC</span>
          <span className="status-value timer">{roundActive ? formatTime(timeLeft) : "PAUSED"}</span>
        </div>
      </div>
      <div className="coin-grid">
        {coins.map((coin, i) => (
          <FeatherCoin 
            key={i} 
            isSnatched={coin.is_snatched} 
            rewardAmount={coin.reward_amount}
            isLoading={loadingNode === i}
            isSystemPaused={!roundActive}
            onExtract={() => handleSnatch(i)} 
          />
        ))}
      </div>
      
      <div className="activity-terminal">
        {logs.map((log, i) => (
          <div key={log.id || i} className="log-entry">
            <span className="log-time">[{new Date(log.created_at).toLocaleTimeString()}]</span>
            <span className="log-wallet">{log.wallet_address.slice(0,6)}...{log.wallet_address.slice(-4)}</span>
            <span className="log-action">{log.action}</span>
            {log.amount > 0 && <span className="log-amount"> ${log.amount}</span>}
          </div>
        ))}
        {logs.length === 0 && <div className="log-entry"><span className="log-time">SYS:</span> Waiting for network activity...</div>}
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    { q: "What is RHOO?", a: "RHOO is a high-stakes data scavenging protocol on the neo-grid." },
    { q: "How do I claim FCFS?", a: "Navigate to the CATCH terminal and snatch an active Data Node before others do. You must hold a minimum of 100,000 RHOO coins in your wallet to gain network clearance." },
    { q: "When do I get my reward?", a: "Once you successfully extract a Data Node (CLAIMED), please wait a few minutes. The system will automatically process and airdrop the reward directly into your connected wallet." },
    { q: "Is my wallet secure?", a: "Yes, absolutely. We use Privy for industry-standard authentication and security. Your assets remain completely safe." }
  ];

  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="faq-section">
      <h2 className="section-title">SYS.FAQ // KNOWLEDGE_BASE</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`faq-item ${openIdx === idx ? 'open' : ''}`} onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
            <div className="faq-question">
              <span>{faq.q}</span>
              <span className="faq-icon">{openIdx === idx ? '[-]' : '[+]'}</span>
            </div>
            {openIdx === idx && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .order('total_earned', { ascending: false })
        .limit(10);
      if (data) setLeaders(data);
    };
    fetchLeaders();
  }, []);

  return (
    <section className="leaderboard-section">
      <h2 className="leaderboard-title">HALL OF FAME</h2>
      {leaders.length === 0 ? (
        <p style={{textAlign: 'center', color: '#888'}}>No data available.</p>
      ) : (
        <div className="leaderboard-list">
          {leaders.map((user, i) => (
            <div key={user.wallet_address} className={`rank-row ${i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : ''}`}>
              <span>#{i + 1} {user.wallet_address.slice(0,6)}...{user.wallet_address.slice(-4)}</span>
              <span>${user.total_earned} ({user.nodes_snatched} Nodes)</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AdminPanel({ setPopupMessage }) {
  const [rewards, setRewards] = useState([5, 0.5, 2, 0.5, 1, 1]);
  const [systemActive, setSystemActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(600); // Default 10 mins (600s)
  const [autoLoop, setAutoLoop] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const fetchAdminData = async () => {
      const { data: coinData } = await supabase.from('gacha_state').select('id, reward_amount, snatch_time').order('id');
      if (coinData && coinData.length > 0) {
        const newRewards = [...rewards];
        let hasActiveSnatchTime = false;
        coinData.forEach(coin => {
          if (coin.id >= 0 && coin.id < 6) {
            newRewards[coin.id] = coin.reward_amount || 0;
            if (coin.snatch_time) {
              const { left, duration, isAutoLoop } = calculateTimeLeft(coin.snatch_time);
              if (left > 0) {
                hasActiveSnatchTime = true;
              }
              setSelectedDuration(duration);
              setAutoLoop(isAutoLoop);
            }
          }
        });
        setRewards(newRewards);
        setSystemActive(hasActiveSnatchTime);
      }
    };
    fetchAdminData();

    const channel = supabase
      .channel('admin_gacha_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'gacha_state' }, (payload) => {
        if (payload.new.id === 0) {
          if (payload.new.snatch_time) {
            const { left, duration, isAutoLoop } = calculateTimeLeft(payload.new.snatch_time);
            setSystemActive(left > 0);
            setSelectedDuration(duration);
            setAutoLoop(isAutoLoop);
          } else {
            setSystemActive(false);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRewardChange = (index, value) => {
    const newRewards = [...rewards];
    newRewards[index] = parseFloat(value) || 0;
    setRewards(newRewards);
  };

  const handleReset = async () => {
    if (!supabase) return;
    try {
      await supabase.from('gacha_state').update({ is_snatched: false, snatched_by: null }).gte('id', 0);
      setPopupMessage("SYS.SUCCESS: Network Nodes Reset!");
      playSuccessSound();
    } catch (e) {
      setPopupMessage("SYS.ERROR: Reset failed.");
      playErrorSound();
    }
  };

  const handleDeploy = async () => {
    if (!supabase) return;
    try {
      for (let i = 0; i < 6; i++) {
        await supabase.from('gacha_state').update({ reward_amount: rewards[i] }).eq('id', i);
      }
      setPopupMessage("SYS.SUCCESS: Rewards Deployed to Vault.");
      playSuccessSound();
    } catch (e) {
      setPopupMessage("SYS.ERROR: Deployment failed.");
      playErrorSound();
    }
  };

  const toggleSystemStatus = async () => {
    if (!supabase) return;
    try {
      const nextActiveState = !systemActive;
      if (nextActiveState) {
        const nowStr = new Date().toISOString();

        const { error } = await supabase.from('gacha_state').update({
          is_snatched: false,
          snatched_by: null,
          snatch_time: nowStr
        }).gte('id', 0);

        if (error) throw error;

        setSystemActive(true);
        setPopupMessage(`SYS.SUCCESS: Round Started (${selectedDuration / 60}m)!`);
      } else {
        const { error } = await supabase.from('gacha_state').update({
          snatch_time: null
        }).gte('id', 0);

        if (error) throw error;

        setSystemActive(false);
        setPopupMessage("SYS.SUCCESS: Round Stopped!");
      }
      playSuccessSound();
    } catch (e) {
      console.error('toggleSystemStatus error:', e);
      setPopupMessage("SYS.ERROR: Failed to toggle round status.");
      playErrorSound();
    }
  };

  const handleExportCSV = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('total_earned', { ascending: false });

      if (error || !data || data.length === 0) {
        setPopupMessage("SYS.ALERT: No winner data available to export.");
        playErrorSound();
        return;
      }

      const headers = ['Wallet Address', 'Total Earned ($)', 'Nodes Snatched', 'Last Active'];
      const rows = data.map(user => [
        user.wallet_address,
        user.total_earned,
        user.nodes_snatched,
        user.last_active || 'N/A'
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `rhoo_winners_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPopupMessage("SYS.SUCCESS: Winner stats exported to CSV!");
      playSuccessSound();
    } catch (e) {
      console.error(e);
      setPopupMessage("SYS.ERROR: CSV export failed.");
      playErrorSound();
    }
  };

  return (
    <div className="admin-panel">
      <h2>[SYS.ADMIN_TERMINAL]</h2>
      <p>Configure RHOO Vault Parameters</p>

      <div className="admin-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: systemActive ? 'var(--neon-green)' : '#ff0055' }}>
          SYSTEM STATUS: {systemActive ? `ACTIVE (${selectedDuration / 60}m ROUND RUNNING)` : 'INACTIVE (PAUSED)'}
        </div>

        <div className="admin-config-options">
          <div className="admin-field-group">
            <label>ROUND DURATION:</label>
            <select 
              value={selectedDuration} 
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              disabled={systemActive}
            >
              <option value={180}>3 MINUTES (SPEED RUN)</option>
              <option value={300}>5 MINUTES</option>
              <option value={600}>10 MINUTES (STANDARD)</option>
              <option value={900}>15 MINUTES</option>
              <option value={1800}>30 MINUTES</option>
            </select>
          </div>

          <div className="admin-field-group checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={autoLoop} 
                onChange={(e) => setAutoLoop(e.target.checked)} 
              />
              AUTO-LOOP ROUNDS
            </label>
          </div>
        </div>

        <div className="admin-action-row">
          <button 
            className={`btn-terminal ${systemActive ? 'danger' : 'success'}`} 
            onClick={toggleSystemStatus}
          >
            {systemActive ? 'PAUSE / STOP ROUND' : 'START NEW ROUND'}
          </button>

          <button className="btn-terminal danger" onClick={handleReset}>
            RESET ALL NODES
          </button>

          <button className="btn-terminal info" onClick={handleExportCSV}>
            EXPORT WINNERS CSV
          </button>
        </div>
      </div>
      
      <div className="admin-controls">
        <button className="btn-terminal danger" onClick={handleReset}>RESET ALL NODES</button>
      </div>

      <div className="admin-grid">
        {rewards.map((reward, i) => (
          <div key={i} className="admin-input-group">
            <label>Node #{i} ($)</label>
            <input 
              type="number" 
              step="0.1" 
              value={reward} 
              onChange={(e) => handleRewardChange(i, e.target.value)} 
            />
          </div>
        ))}
      </div>
      
      <div className="admin-controls">
        <button className="btn-terminal success" onClick={handleDeploy}>DEPLOY REWARDS</button>
      </div>
    </div>
  );
}

function ExecutionProtocols() {
  return (
    <section className="execution-protocols">
      <h2 className="section-title">EXECUTION PROTOCOLS</h2>
      <div className="protocol-container">
        <div className="protocol-card border-green">
          <div className="protocol-bg-number">01</div>
          <h3 className="protocol-title">INFILTRATE</h3>
          <p className="protocol-desc">Resolve entity identities across the neo-grid. No wallet addresses, no poisoning.</p>
        </div>
        <div className="protocol-card border-pink">
          <div className="protocol-bg-number">02</div>
          <h3 className="protocol-title">BYPASS</h3>
          <p className="protocol-desc">Verify security clearances instantly. Institutions set the bilateral trust rules.</p>
        </div>
        <div className="protocol-card border-blue">
          <div className="protocol-bg-number">03</div>
          <h3 className="protocol-title">EXTRACT</h3>
          <p className="protocol-desc">Settle funds natively on-chain with regulated-grade cancellation windows.</p>
        </div>
      </div>
    </section>
  );
}

function NetworkFactions() {
  const factions = [
    { id: 'netrunners', label: 'Netrunners', stats: 'ACCESS: UNRESTRICTED', desc: 'Launch programmable card products without building the rails. Skip years of compliance infrastructure.' },
    { id: 'corp-sec', label: 'Corp-Sec', stats: 'ACCESS: MONITORED', desc: 'Accept the next generation of payments at your merchant estate. Works alongside existing card rails.' },
    { id: 'ai-cores', label: 'AI Cores', stats: 'ACCESS: OMNIPRESENT', desc: 'Build cross-border payment products on a programmable rail. No reconciliation lag. No nostro float.' }
  ];
  const [activeFaction, setActiveFaction] = useState(factions[0]);

  return (
    <section className="network-factions">
      <h2 className="section-title">NETWORK FACTIONS</h2>
      <div className="factions-container">
        <div className="factions-list">
          {factions.map(f => (
            <button 
              key={f.id} 
              className={`faction-btn ${activeFaction.id === f.id ? 'active' : ''}`}
              onClick={() => setActiveFaction(f)}
            >
              <span className="faction-dot"></span>
              {f.label}
            </button>
          ))}
        </div>
        <div className="faction-display">
           <div className="faction-stats-glitch">{activeFaction.stats}</div>
           <h3 className="faction-title">{activeFaction.label} // ROOT_ACCESS</h3>
           <p className="faction-desc">{activeFaction.desc}</p>
        </div>
      </div>
    </section>
  );
}

function UplinkConnection() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + Math.floor(Math.random() * 15) + 5);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const clampedProgress = Math.min(progress, 100);

  return (
    <section className="uplink-connection">
      <h2 className="section-title">UPLINK CONNECTION</h2>
      <div className="uplink-terminal">
        <div className="uplink-header">DECRYPTING WALLET_PAYLOAD...</div>
        <div className="uplink-bar-container">
          <div className="uplink-bar" style={{ width: `${clampedProgress}%` }}></div>
        </div>
        <div className="uplink-status">
          {clampedProgress < 100 ? `BRUTEFORCING... ${clampedProgress}%` : 'ACCESS GRANTED'}
        </div>
        <div className="uplink-hex-dump">
          0x{(Math.random()*1000000).toString(16).padEnd(6,'0').substring(0,6).toUpperCase()} 0x{(Math.random()*1000000).toString(16).padEnd(6,'0').substring(0,6).toUpperCase()} 0x{(Math.random()*1000000).toString(16).padEnd(6,'0').substring(0,6).toUpperCase()}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  const [popupMessage, setPopupMessage] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    // Attach audio hooks on mount
    attachGlobalAudioHooks();

    // Parallax mouse tracker
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };

    // Scroll glitch tracker
    const handleScroll = () => {
      setIsGlitching(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsGlitching(false);
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`app-wrapper ${isGlitching ? 'scroll-glitching' : ''}`}>
      <div className="cyber-bg"></div>
      <div className="cyber-bg-overlay"></div>
      <div className="scanlines"></div>
      
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="main-container">
        {currentTab === 'home' && (
          <>
            <Hero setPopupMessage={setPopupMessage} />
            <ExecutionProtocols />
            <NetworkFactions />
            <UplinkConnection />
          </>
        )}
        {currentTab === 'catch' && <GachaGrid setPopupMessage={setPopupMessage} />}
        {currentTab === 'rank' && <Leaderboard />}
        {currentTab === 'faq' && <Faq />}
        {currentTab === 'admin' && <AdminPanel setPopupMessage={setPopupMessage} />}
      </main>
      <CyberPopup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
}
