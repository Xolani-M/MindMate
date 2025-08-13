
"use client";

// Type for therapeutic goals
interface TherapeuticGoal {
  title: string;
  description: string;
  priority: number;
  estimatedDays: number;
}
/**
 * @fileoverview Advanced Analytics Dashboard for Seekers
 * Comprehensive mental health analytics with real-time monitoring,
 * emotional journey tracking, and crisis prevention insights
 */

import React, { useEffect, useState, useCallback } from 'react';
import SeekerNavBar from '@/components/SeekerNavBar';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ModernLoadingState, ModernErrorState } from '@/components/LoadingStates';
import Icons from '@/components/Icons';
import { EmotionalState, CrisisLevel } from '@/providers/seeker/types';


// Styling constants for consistent design
const analyticsStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  main: {
    padding: '120px 20px 60px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '48px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '32px',
    marginBottom: '48px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  emotionalStateDisplay: {
    textAlign: 'center' as const,
    padding: '24px',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  metricValue: {
    fontSize: '2.4rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '1rem',
    fontWeight: 500,
    opacity: 0.8,
  },
  insightsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    marginBottom: '12px',
  },
  recommendationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    marginBottom: '12px',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '6px',
    transition: 'width 0.3s ease',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
};

// Helper functions for emotional state visualization
const getEmotionalStateColor = (state: EmotionalState): string => {
  switch (state) {
    case EmotionalState.VeryNegative:
      return '#dc2626';
    case EmotionalState.Negative:
      return '#ea580c';
    case EmotionalState.SlightlyNegative:
      return '#f59e0b';
    case EmotionalState.Neutral:
      return '#6b7280';
    case EmotionalState.SlightlyPositive:
      return '#10b981';
    case EmotionalState.Positive:
      return '#059669';
    case EmotionalState.VeryPositive:
      return '#047857';
    default:
      return '#6b7280';
  }
};

const getEmotionalStateLabel = (state: EmotionalState): string => {
  switch (state) {
    case EmotionalState.VeryNegative:
      return 'Very Negative';
    case EmotionalState.Negative:
      return 'Negative';
    case EmotionalState.SlightlyNegative:
      return 'Slightly Negative';
    case EmotionalState.Neutral:
      return 'Neutral';
    case EmotionalState.SlightlyPositive:
      return 'Slightly Positive';
    case EmotionalState.Positive:
      return 'Positive';
    case EmotionalState.VeryPositive:
      return 'Very Positive';
    default:
      return 'Unknown';
  }
};

const getCrisisLevelColor = (level: CrisisLevel): string => {
  switch (level) {
    case CrisisLevel.None:
      return '#10b981';
    case CrisisLevel.Low:
      return '#f59e0b';
    case CrisisLevel.Medium:
      return '#ea580c';
    case CrisisLevel.High:
      return '#dc2626';
    case CrisisLevel.Critical:
      return '#7c2d12';
    default:
      return '#6b7280';
  }
};

const getCrisisLevelLabel = (level: CrisisLevel): string => {
  switch (level) {
    case CrisisLevel.None:
      return 'No Risk';
    case CrisisLevel.Low:
      return 'Low Risk';
    case CrisisLevel.Medium:
      return 'Medium Risk';
    case CrisisLevel.High:
      return 'High Risk';
    case CrisisLevel.Critical:
      return 'Critical Risk';
    default:
      return 'Unknown';
  }
};

export default function AnalyticsPage() {
  const { 
    realTimeAnalytics, 
    crisisPreventionAnalytics,
    therapeuticGoals,
    realTimeAnalyticsPending,
    realTimeAnalyticsError,
    crisisPreventionPending,
    therapeuticGoalsPending
  } = useSeekerState();
  
  const { 
    getRealTimeAnalytics,
    getCrisisPreventionAnalytics,
    getTherapeuticGoals
  } = useSeekerActions();
  
  const { isAuthenticated, isLoading } = useAuthGuard();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  


  // Load analytics data
  // #region Hooks

  // Load analytics data
  const loadAnalyticsData = useCallback(async () => {
    try {
      await Promise.all([
        getRealTimeAnalytics(),
        getCrisisPreventionAnalytics(7),
        getTherapeuticGoals()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
          // Intentionally left for analytics testing
          console.error('❌ Failed to load analytics data:', error);
    }
  }, [getRealTimeAnalytics, getCrisisPreventionAnalytics, getTherapeuticGoals]);



  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      loadAnalyticsData();
    }
  }, [isAuthenticated, isLoading, loadAnalyticsData]);
  // #endregion



  // Handle refresh button click
  const handleRefresh = () => {
    loadAnalyticsData();
  };

  // #region Loading States
  if (isLoading) {
    return <ModernLoadingState type="dashboard" message="Loading your analytics dashboard..." />;
  }

  if (realTimeAnalyticsPending || crisisPreventionPending || therapeuticGoalsPending) {
    return <ModernLoadingState type="data" message="Preparing your analytics data..." />;
  }

  if (realTimeAnalyticsError) {
    return (
      <ModernErrorState 
        message={`Failed to load analytics: ${realTimeAnalyticsError}`}
        onRetry={() => loadAnalyticsData()}
      />
    );
  }

  if (!realTimeAnalytics) {
    return (
      <ModernErrorState 
        message={"Analytics data is currently unavailable. This may be due to a temporary issue or connectivity problem. Please try refreshing, or check your connection. If the problem persists, contact support for assistance."}
        onRetry={() => loadAnalyticsData()}
      />
    );
  }
  // #endregion

  return (
    <div style={analyticsStyles.container}>
      <SeekerNavBar />
      <main style={analyticsStyles.main}>
          {/* Header Section */}
          <div style={analyticsStyles.header}>
            <h1 style={analyticsStyles.title}>
              Mental Health Analytics
            </h1>
            <p style={analyticsStyles.subtitle}>
              Comprehensive insights into your emotional wellbeing, progress tracking, and personalized recommendations.
            </p>
            <button 
              style={analyticsStyles.refreshButton}
              onClick={handleRefresh}
            >
              <Icons.AnalyticsIcon size="small" />
              Refresh Data
            </button>
            <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#94a3b8' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>

          {/* Real-Time Analytics Grid */}
          <div style={analyticsStyles.grid}>
            
            {/* Current Emotional State - Enhanced with AI */}
            <div style={analyticsStyles.card}>
              <div style={analyticsStyles.cardHeader}>
                <Icons.WellnessIcon />
                <h2 style={analyticsStyles.cardTitle}>
                  Current Emotional State
                </h2>
              </div>
              
              {realTimeAnalytics ? (
                <>
                  <div 
                    style={{
                      ...analyticsStyles.emotionalStateDisplay,
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #3b82f6',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <div 
                      style={{
                        ...analyticsStyles.metricValue,
                        color: '#1e293b',
                        fontWeight: 700,
                        fontSize: '2rem',
                      }}
                    >
                      {getEmotionalStateLabel(realTimeAnalytics.currentEmotionalState)}
                    </div>
                    <div style={{
                      ...analyticsStyles.metricLabel,
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      opacity: 1
                    }}>
                      Emotional Assessment
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      marginBottom: '16px', 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>
                      Recommendations
                    </h4>
                    <ul style={analyticsStyles.insightsList}>
                      {realTimeAnalytics.liveRecommendations?.slice(0, 3).map((recommendation) => (
                        <li 
                          key={`recommendation-${recommendation.slice(0, 20)}`} 
                          style={{
                            ...analyticsStyles.recommendationItem,
                            color: '#1e293b',
                            fontWeight: 500,
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #3b82f6',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                          }}
                        >
                          <Icons.SparkleIcon size="small" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                    

                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  <Icons.WellnessIcon size="large" />
                  <p style={{ marginTop: '16px' }}>Loading emotional state data...</p>
                </div>
              )}
            </div>            {/* Crisis Risk Assessment */}
            <div style={analyticsStyles.card}>
              <div style={analyticsStyles.cardHeader}>
                <Icons.SecurityIcon />
                <h2 style={analyticsStyles.cardTitle}>Risk Assessment</h2>
              </div>
              
              {realTimeAnalytics ? (
                <>
                  <div 
                    style={{
                      ...analyticsStyles.emotionalStateDisplay,
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #3b82f6',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <div 
                      style={{
                        ...analyticsStyles.metricValue,
                        color: '#1e293b',
                        fontWeight: 700,
                        fontSize: '2rem',
                      }}
                    >
                      {getCrisisLevelLabel(realTimeAnalytics.immediateRiskLevel)}
                    </div>
                    <div style={{
                      ...analyticsStyles.metricLabel,
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      opacity: 1
                    }}>
                      Current Risk Level
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      marginBottom: '16px', 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>
                      Monitoring Status: {realTimeAnalytics.monitoringActive ? '🟢 Active' : '⚪ Inactive'}
                    </h4>
                    <p style={{ 
                      fontSize: '1rem', 
                      color: '#1e293b',
                      fontWeight: 500
                    }}>
                      Alerts: {realTimeAnalytics.alertsActive ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  <Icons.SecurityIcon size="large" />
                  <p style={{ marginTop: '16px' }}>Loading risk assessment...</p>
                </div>
              )}
            </div>

            {/* Crisis Prevention Insights */}
            <div style={analyticsStyles.card}>
              <div style={analyticsStyles.cardHeader}>
                <Icons.BrainIcon />
                <h2 style={analyticsStyles.cardTitle}>Prevention Insights</h2>
              </div>
              
              {crisisPreventionAnalytics ? (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ 
                      marginBottom: '12px', 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>
                      Prediction Confidence
                    </h4>
                    <div style={{
                      ...analyticsStyles.progressBar,
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #3b82f6',
                      padding: '2px',
                    }}>
                      <div 
                        style={{
                          ...analyticsStyles.progressFill,
                          width: `${crisisPreventionAnalytics.predictionConfidence}%`,
                        }}
                      />
                    </div>
                    <p style={{ 
                      marginTop: '8px', 
                      fontSize: '1rem', 
                      color: '#1e293b',
                      fontWeight: 500
                    }}>
                      {crisisPreventionAnalytics.predictionConfidence.toFixed(1)}% accuracy
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      marginBottom: '16px', 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>Early Warning Signals</h4>
                    <ul style={analyticsStyles.insightsList}>
                      {crisisPreventionAnalytics.earlyWarningSignals?.slice(0, 3).map((signal, index) => (
                        <li 
                          key={`warning-signal-${index}-${signal.signalType}`} 
                          style={{
                            ...analyticsStyles.insightItem,
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #3b82f6',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                          }}
                        >
                          <Icons.AnalyticsIcon size="small" />
                          <div>
                            <strong style={{ 
                              color: '#1e293b',
                              fontSize: '1.1rem'
                            }}>{signal.signalType}</strong>
                            <p style={{ 
                              fontSize: '1rem', 
                              color: '#1e293b', 
                              margin: '4px 0 0 0',
                              fontWeight: 500
                            }}>
                              {signal.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  <Icons.BrainIcon size="large" />
                  <p style={{ marginTop: '16px' }}>Loading prevention insights...</p>
                </div>
              )}
            </div>

            {/* Therapeutic Goals - Enhanced with AI */}
            <div style={analyticsStyles.card}>
              <div style={analyticsStyles.cardHeader}>
                <Icons.MindfulnessIcon />
                <h2 style={analyticsStyles.cardTitle}>
                  Therapeutic Goals
                </h2>
              </div>
              
              {therapeuticGoals ? (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ 
                      marginBottom: '16px', 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>Short-term Goals</h4>
                    <ul style={analyticsStyles.insightsList}>
                      {therapeuticGoals.shortTermGoals?.slice(0, 2).map((goal: TherapeuticGoal, index: number) => (
                        <li 
                          key={`goal-${index}-${goal.title.replace(/\s+/g, '-')}`} 
                          style={{
                            ...analyticsStyles.insightItem,
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #3b82f6',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                          }}
                        >
                          <Icons.SparkleIcon size="small" />
                          <div>
                            <strong style={{
                              color: '#1e293b',
                              fontSize: '1.1rem'
                            }}>{goal.title}</strong>
                            <p style={{ 
                              fontSize: '1rem', 
                              color: '#1e293b', 
                              margin: '4px 0 0 0',
                              fontWeight: 500
                            }}>
                              {goal.description}
                            </p>
                            <p style={{ 
                              fontSize: '0.9rem', 
                              color: '#475569', 
                              margin: '4px 0 0 0',
                              fontWeight: 500
                            }}>
                              Priority: {goal.priority}/5 | {goal.estimatedDays} days
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      marginBottom: '16px', 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>Recommended Therapies</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {therapeuticGoals.recommendedTherapies?.slice(0, 3).map((therapy: string, index: number) => (
                        <span 
                          key={`therapy-${index}-${therapy.replace(/\s+/g, '-')}`}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #3b82f6',
                            borderRadius: '16px',
                            fontSize: '1rem',
                            color: '#1e293b',
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                          }}
                        >
                          {therapy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  <Icons.MindfulnessIcon size="large" />
                  <p style={{ marginTop: '16px' }}>Loading therapeutic goals...</p>
                </div>
              )}
            </div>

            {/* Mood Fluctuations */}
            <div style={analyticsStyles.card}>
              <div style={analyticsStyles.cardHeader}>
                <Icons.JournalIcon />
                <h2 style={analyticsStyles.cardTitle}>Recent Mood Patterns</h2>
              </div>
              
              {realTimeAnalytics?.moodFluctuations ? (
                <div>
                  <ul style={analyticsStyles.insightsList}>
                    {realTimeAnalytics.moodFluctuations.slice(0, 4).map((fluctuation, index) => {
                      let moodColor;
                      if (fluctuation.moodLevel >= 7) {
                        moodColor = '#10b981';
                      } else if (fluctuation.moodLevel >= 5) {
                        moodColor = '#f59e0b';
                      } else {
                        moodColor = '#dc2626';
                      }
                      
                      return (
                        <li 
                          key={`mood-${index}-${fluctuation.timestamp}`} 
                          style={{
                            ...analyticsStyles.insightItem,
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #3b82f6',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                          }}
                        >
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: moodColor,
                            flexShrink: 0,
                            marginTop: '6px',
                          }} />
                          <div>
                            <strong style={{
                              color: '#1e293b',
                              fontSize: '1.1rem'
                            }}>Mood Level: {fluctuation.moodLevel}/10</strong>
                            <p style={{ 
                              fontSize: '1rem', 
                              color: '#1e293b', 
                              margin: '4px 0 0 0',
                              fontWeight: 500
                            }}>
                              {fluctuation.context}
                            </p>
                            <p style={{ 
                              fontSize: '0.9rem', 
                              color: '#475569', 
                              margin: '4px 0 0 0',
                              fontWeight: 500
                            }}>
                              {new Date(fluctuation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  <Icons.JournalIcon size="large" />
                  <p style={{ marginTop: '16px' }}>Loading mood patterns...</p>
                </div>
              )}
            </div>

          </div>



          {/* Footer with encouragement */}
          <div style={{
            textAlign: 'center',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginTop: '48px',
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              color: '#047857',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}>
              <Icons.SparkleIcon /> Your mental health journey is unique and valuable
            </h3>
            <div style={{
              fontSize: '1rem',
              color: '#059669',
              lineHeight: 1.6,
            }}>
              These insights are designed to help you understand your patterns and support your wellbeing. 
              Remember to reach out for professional support when needed.
            </div>
          </div>
        </main>
      </div>
  );
}
