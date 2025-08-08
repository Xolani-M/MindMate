import React, { useEffect } from 'react';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';



const SeekerDashboard: React.FC = () => {
  const { seekerDashboard, seekerDashboardPending, seekerDashboardError } = useSeekerState();
  const { getMyDashboard } = useSeekerActions();

  useEffect(() => {
    getMyDashboard();
  }, [getMyDashboard]);

  if (seekerDashboardPending) return <div>Loading dashboard...</div>;
  if (seekerDashboardError) return <div style={{ color: 'red' }}>{seekerDashboardError}</div>;
  if (!seekerDashboard) return null;

  const welcomeName = seekerDashboard.displayName || seekerDashboard.name || 'N/A';

  return (
    <div
      style={{
        padding: 32,
        borderRadius: 18,
        background: '#f8fafc',
        boxShadow: '0 4px 24px rgba(99,102,241,0.10)',
        maxWidth: 700,
        margin: '40px auto 80px auto',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center', color: '#6366f1', fontWeight: 700, letterSpacing: 0.5 }}>Welcome, {welcomeName}!</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
          margin: '0 auto',
          maxWidth: 600,
        }}
      >
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e0e7ef', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>😊</div>
          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Latest Mood</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#1e293b' }}>{seekerDashboard.latestMood || 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e0e7ef', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Avg Mood (7d)</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#1e293b' }}>{seekerDashboard.averageMoodLast7Days ?? 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e0e7ef', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Risk Level</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#1e293b' }}>{seekerDashboard.riskLevel ?? 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e0e7ef', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Latest PHQ-9</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#1e293b' }}>{seekerDashboard.latestPhq9Score ?? 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e0e7ef', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Latest GAD-7</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#1e293b' }}>{seekerDashboard.latestGad7Score ?? 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e0e7ef', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📓</div>
          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Journal Entries</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#1e293b' }}>{seekerDashboard.totalJournalEntries ?? 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
