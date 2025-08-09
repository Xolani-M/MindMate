/**
 * @fileoverview Enhanced Seeker Dashboard
 * Modern therapeutic design with cool icon alternatives to emojis
 * Features consistent green color scheme and welcoming interface
 * Follows MINDMATE coding standards with proper documentation
 */
"use client";

import React, { useEffect } from 'react';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useRouter } from 'next/navigation';
import dashboardStyles from './dashboardstyles';
import SeekerNavBar from '@/components/SeekerNavBar';
import { ChatProvider } from '@/providers/chat';
import ChatWidget from '@/components/ChatWidget';
import Icons from '@/components/Icons';
import { ModernLoadingState, ModernErrorState } from '@/components/LoadingStates';

// #region Icons - Now using external Icons component with Lucide icons
// All icons are now imported from @/components/Icons for better maintainability
// #endregion

// #region Main Dashboard Component
export default function DashboardPage() {
  const { seekerDashboard, seekerDashboardPending, seekerDashboardError } = useSeekerState();
  const { getMyDashboard } = useSeekerActions();
  const { isAuthenticated, isLoading } = useAuthGuard();
  const router = useRouter();

  // Helper for friendly fallback display
  const friendly = (value: unknown, fallback = <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span>) => {
    if (value === null || value === undefined || value === '' || value === 'N/A') return fallback;
    return value as React.ReactNode;
  };

  // Extract welcome name
  let welcomeName = '';
  if (seekerDashboard) {
    const displayName = seekerDashboard.displayName;
    const name = seekerDashboard.name;
    welcomeName = displayName || name || 'Seeker';
  }

  // #region Effects
  useEffect(() => {
    if (isLoading) {
      console.log('🔄 Auth still loading, waiting before loading dashboard...');
      return;
    }

    if (isAuthenticated) {
      console.log('✅ Authenticated, loading dashboard');
      getMyDashboard();
    }
  }, [isAuthenticated, isLoading, getMyDashboard]);
  // #endregion

  // #region Loading States
  if (isLoading) {
    return <ModernLoadingState type="dashboard" message="Loading your wellness dashboard..." />;
  }

  if (seekerDashboardPending) {
    return <ModernLoadingState type="data" message="Preparing your wellness data..." />;
  }

  if (seekerDashboardError) {
    return (
      <ModernErrorState 
        message={`Failed to load dashboard: ${seekerDashboardError}`}
        onRetry={() => getMyDashboard()}
      />
    );
  }

  if (!seekerDashboard) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
        <h2>Dashboard data not available</h2>
        <p>We couldn&apos;t load your dashboard data. Please check the console for debug info and try refreshing the page.</p>
      </div>
    );
  }
  // #endregion

  return (
    <ChatProvider>
      <SeekerNavBar />
      <div style={dashboardStyles.container}>
        {/* Decorative floating orbs for ambiance */}
        <div style={dashboardStyles.orbTop} />
        <div style={dashboardStyles.orbMiddle} />
        <div style={dashboardStyles.orbBottom} />
        
        <main style={dashboardStyles.main}>
          <div style={{
            ...dashboardStyles.card,
            margin: '80px auto 40px auto',
          }}>
            {/* Welcome Header with Wellness Icon */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Icons.WellnessIcon />
              </div>
              <h1 style={dashboardStyles.heading}>
                Welcome Home, {welcomeName}
              </h1>
              <p style={dashboardStyles.subheading}>
                Your wellness journey continues here. Take a moment to breathe, reflect, and nurture your mental health.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '24px', 
              marginBottom: '48px', 
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                className="dashboard-button"
                style={{
                  ...dashboardStyles.actionButton,
                  ...dashboardStyles.primaryButton,
                }}
                onClick={() => router.push('/seeker/assessment')}
              >
                <Icons.BrainIcon /> Take Assessment
              </button>
              <button
                className="dashboard-button"
                style={{
                  ...dashboardStyles.actionButton,
                  ...dashboardStyles.secondaryButton,
                }}
                onClick={() => router.push('/seeker/journal')}
              >
                <Icons.JournalIcon /> Write in Journal
              </button>
            </div>

            {/* Wellness Overview */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#374151',
                marginBottom: '16px',
              }}>
                Your Wellness Dashboard <Icons.SparkleIcon />
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                lineHeight: 1.6,
              }}>
                Here&apos;s a snapshot of your mental health journey. Every step counts toward your wellbeing.
              </p>
            </div>

            {/* Stats Grid with Modern Icons */}
            <div style={{
              ...dashboardStyles.grid,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: 24,
              padding: 32,
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08)',
              border: '1px solid #e2e8f0',
            }}>
              <div 
                className="dashboard-grid-item"
                style={{
                  ...dashboardStyles.gridItem,
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  border: '2px solid #10b981',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icons.WellnessIcon />
                </div>
                <strong style={{ color: '#059669', fontSize: '1.1rem' }}>Latest Mood</strong><br />
                <span style={{ ...dashboardStyles.value, color: '#065f46' }}>
                  {friendly(seekerDashboard.latestMood)}
                </span>
              </div>
              
              <div 
                className="dashboard-grid-item"
                style={{
                  ...dashboardStyles.gridItem,
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '2px solid #3b82f6',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icons.AnalyticsIcon />
                </div>
                <strong style={{ color: '#1d4ed8', fontSize: '1.1rem' }}>7-Day Average</strong><br />
                <span style={{ ...dashboardStyles.value, color: '#1e40af' }}>
                  {friendly(seekerDashboard.averageMoodLast7Days)}
                </span>
              </div>
              
              <div 
                className="dashboard-grid-item"
                style={{
                  ...dashboardStyles.gridItem,
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '2px solid #f59e0b',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icons.SecurityIcon />
                </div>
                <strong style={{ color: '#d97706', fontSize: '1.1rem' }}>Risk Level</strong><br />
                <span style={{ ...dashboardStyles.value, color: '#92400e' }}>
                  {friendly(seekerDashboard.riskLevel)}
                </span>
              </div>
              
              <div 
                className="dashboard-grid-item"
                style={{
                  ...dashboardStyles.gridItem,
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '2px solid #8b5cf6',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icons.BrainIcon />
                </div>
                <strong style={{ color: '#7c3aed', fontSize: '1.1rem' }}>PHQ-9 Score</strong><br />
                <span style={{ ...dashboardStyles.value, color: '#6b21a8' }}>
                  {friendly(seekerDashboard.latestPhq9Score)}
                </span>
              </div>
              
              <div 
                className="dashboard-grid-item"
                style={{
                  ...dashboardStyles.gridItem,
                  background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
                  border: '2px solid #f97316',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icons.MindfulnessIcon />
                </div>
                <strong style={{ color: '#ea580c', fontSize: '1.1rem' }}>GAD-7 Score</strong><br />
                <span style={{ ...dashboardStyles.value, color: '#c2410c' }}>
                  {friendly(seekerDashboard.latestGad7Score)}
                </span>
              </div>
              
              <div 
                className="dashboard-grid-item"
                style={{
                  ...dashboardStyles.gridItem,
                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                  border: '2px solid #ec4899',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icons.JournalIcon />
                </div>
                <strong style={{ color: '#db2777', fontSize: '1.1rem' }}>Journal Entries</strong><br />
                <span style={{ ...dashboardStyles.value, color: '#be185d' }}>
                  {friendly(seekerDashboard.totalJournalEntries)}
                </span>
              </div>
            </div>

            {/* Motivational Footer with Green Theme */}
            <div style={{
              textAlign: 'center',
              marginTop: '48px',
              padding: '32px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              borderRadius: 20,
              border: '2px solid #10b981',
            }}>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#065f46',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}>
                <Icons.SparkleIcon /> Remember: You&apos;re stronger than you think
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#047857',
                lineHeight: 1.6,
              }}>
                Every small step you take toward mental wellness matters. Your journey is unique and valuable.
              </p>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modern Chat Widget - positioned in bottom corner */}
      <ChatWidget />
    </ChatProvider>
  );
}
// #endregion
