import React, { useEffect } from 'react';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';


interface SeekerDashboardProps {
  seekerId: string;
}



const SeekerDashboard: React.FC<SeekerDashboardProps> = ({ seekerId }) => {
  const { seekerDashboard, seekerDashboardPending, seekerDashboardError } = useSeekerState();
  const { getDashboard } = useSeekerActions();

  useEffect(() => {
    getDashboard(seekerId);
    
  }, [seekerId, getDashboard]);

  if (seekerDashboardPending) return <div>Loading dashboard...</div>;
  if (seekerDashboardError) return <div style={{ color: 'red' }}>{seekerDashboardError}</div>;
  if (!seekerDashboard) return null;

  const welcomeName = seekerDashboard.displayName || seekerDashboard.name || 'N/A';

  return (
    <div style={{ padding: 24, borderRadius: 12, background: '#f8fafc', boxShadow: '0 2px 8px #e0e7ef' }}>
      <h2>Welcome, {welcomeName}!</h2>
      <div style={{ margin: '16px 0' }}>
        <strong>Latest Mood:</strong> {seekerDashboard.latestMood || 'N/A'}<br />
        <strong>Average Mood (7 days):</strong> {seekerDashboard.averageMoodLast7Days ?? 'N/A'}<br />
        <strong>Risk Level:</strong> {seekerDashboard.riskLevel ?? 'N/A'}<br />
        <strong>Latest PHQ-9:</strong> {seekerDashboard.latestPhq9Score ?? 'N/A'}<br />
        <strong>Latest GAD-7:</strong> {seekerDashboard.latestGad7Score ?? 'N/A'}<br />
        <strong>Total Journal Entries:</strong> {seekerDashboard.totalJournalEntries ?? 'N/A'}
      </div>
    </div>
  );
};

export default SeekerDashboard;
