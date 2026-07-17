import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// I34bo-specific tasks — not generic crypto rituals
const JOBS = [
  {
    id: '001',
    title: 'Task // 001: The Broadcast',
    description: 'Get someone on live television, radio, or a public podcast to say "I34bo" without knowing what it means. Document proof. The grid rewards infiltration of legacy broadcast channels.',
    reward: '10,000 $BABO',
    xp: 1000,
  },
  {
    id: '002',
    title: 'Task // 002: Node Recruitment',
    description: 'Bring 3 new nodes (people) into the I34bo network by explaining what it is to them in under 60 seconds. They must follow the account. Screenshot all 3 as proof.',
    reward: '3,000 $BABO',
    xp: 300,
  },
  {
    id: '003',
    title: 'Task // 003: The Signal Drop',
    description: 'Leave the I34bo CA address written somewhere in physical reality — printed, chalk, sticker, carved. Anywhere in the world. Photograph it. The grid needs a physical anchor.',
    reward: '5,000 $BABO',
    xp: 500,
  },
  {
    id: '004',
    title: 'Task // 004: Pattern Documentation',
    description: 'Find a moment in public life where someone says, does, or publishes something that i34bo predicted or described first. Document the match. Submit the comparison.',
    reward: '8,000 $BABO',
    xp: 800,
  },
];

export default function JobsSection({ onAddVoid, onAddXp, standalone = false }) {
  const [submittingJobId, setSubmittingJobId] = useState(null);
  const [completedJobIds, setCompletedJobIds] = useState([]);
  const [xLink, setXLink] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!xLink.trim() || !evidenceText.trim()) {
      alert('All proof fields required. The grid verifies.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompletedJobIds(prev => [...prev, submittingJobId]);

      const job = JOBS.find(j => j.id === submittingJobId);
      const parsedReward = parseInt(job.reward.replace(/[^0-9]/g, ''), 10);
      onAddVoid(parsedReward);
      onAddXp(job.xp);

      setSubmittingJobId(null);
      setXLink('');
      setEvidenceText('');
    }, 2200);
  };

  return (
    <div className={standalone ? 'standalone-page' : ''} style={standalone ? { padding: '2rem 1rem' } : {}}>
      {standalone && (
        <Link to="/" style={{ display: 'inline-block', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
          ← back to den
        </Link>
      )}
      <div className="retro-window" id="jobs" style={{ scrollMarginTop: '100px' }}>
        <div className="retro-window-header">
          <span className="retro-window-title">TASKS.EXE -- GRID CONTRIBUTION PROTOCOL</span>
          <div className="retro-window-controls">
            <button className="win-btn">_</button>
            <button className="win-btn">[]</button>
            <button className="win-btn">X</button>
          </div>
        </div>
        <div className="retro-window-body">
          {submittingJobId ? (
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <h4 style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-pixel)', fontSize: '1.4rem' }}>
                SUBMIT PROOF — TASK #{submittingJobId}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>X (Twitter) / External Link:</label>
                <input type="text" className="chat-input" placeholder="https://x.com/..." value={xLink} onChange={e => setXLink(e.target.value)} disabled={loading} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Evidence / Context Description:</label>
                <textarea className="chat-input" placeholder="explain what you did and how it contributes to the grid..." value={evidenceText} onChange={e => setEvidenceText(e.target.value)} rows={3} style={{ resize: 'none', width: '100%' }} disabled={loading} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="chat-btn" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'GRID VERIFYING...' : 'SUBMIT PROOF'}
                </button>
                <button type="button" className="chat-btn" onClick={() => setSubmittingJobId(null)} disabled={loading} style={{ background: '#333', borderColor: '#333' }}>
                  CANCEL
                </button>
              </div>
            </form>
          ) : (
            <div className="jobs-list">
              {JOBS.map(job => {
                const done = completedJobIds.includes(job.id);
                return (
                  <div key={job.id} className="job-item" style={{ background: '#111', border: '1.5px solid var(--border-color)', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="job-info">
                      <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.4rem', color: done ? 'var(--text-muted)' : 'var(--color-green)' }}>
                        {job.title} {done && '[VERIFIED ✓]'}
                      </h4>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>{job.description}</p>
                    </div>
                    <div className="job-meta" style={{ justifyContent: 'space-between' }}>
                      <span className="job-reward" style={{ borderRadius: 0, fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: done ? 'var(--text-muted)' : 'var(--color-green)' }}>
                        {job.reward}
                      </span>
                      {!done ? (
                        <button className="job-btn" onClick={() => setSubmittingJobId(job.id)} style={{ borderRadius: 0, fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', padding: '4px 15px' }}>
                          SUBMIT
                        </button>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: 'var(--color-green)' }}>REWARD CLAIMED</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="hazard-border" />
      </div>
    </div>
  );
}
