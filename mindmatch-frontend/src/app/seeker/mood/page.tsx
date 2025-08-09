"use client";
import React, { useEffect, useState } from 'react';
import SeekerNavBar from '@/components/SeekerNavBar';
import { useMoodState, useMoodActions } from '@/providers/mood';
import { useAuthState } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import { MoodLevel } from '@/providers/mood/types';

export default function MoodPage() {
  const { moods, isPending, isError, error } = useMoodState();
  const { getRecent, create } = useMoodActions();
  const { user } = useAuthState();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<MoodLevel>(MoodLevel.Neutral);
  const [notes, setNotes] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Check both auth state and sessionStorage to handle page reloads
    const sessionToken = sessionStorage.getItem('token');
    
    if (!user?.token && !sessionToken) {
      router.push('/auth/login');
      return;
    }
    
    // Only fetch data if we have a user or valid session
    if (user?.token || sessionToken) {
      getRecent();
    }
  }, [user, getRecent, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await create({
        level: selectedMood,
        notes: notes.trim() || undefined
      });
      
      // Reset form
      setSelectedMood(MoodLevel.Neutral);
      setNotes('');
      setShowFeedback(true);
      
      // Refresh data
      getRecent();
      
      // Hide feedback after 3 seconds
      setTimeout(() => setShowFeedback(false), 3000);
    } catch (err) {
      console.error('Failed to create mood entry:', err);
    }
  };

  const getMoodLabel = (level: MoodLevel): string => {
    switch (level) {
      case MoodLevel.VerySad: return '😢 Very Sad';
      case MoodLevel.Sad: return '😔 Sad';
      case MoodLevel.Neutral: return '😐 Neutral';
      case MoodLevel.Happy: return '😊 Happy';
      case MoodLevel.VeryHappy: return '😄 Very Happy';
      default: return 'Unknown';
    }
  };

  const getMoodColor = (level: MoodLevel): string => {
    switch (level) {
      case MoodLevel.VerySad: return '#ef4444';
      case MoodLevel.Sad: return '#f97316';
      case MoodLevel.Neutral: return '#6b7280';
      case MoodLevel.Happy: return '#22c55e';
      case MoodLevel.VeryHappy: return '#10b981';
      default: return '#6b7280';
    }
  };

  if (isPending) {
    return (
      <div>
        <SeekerNavBar />
        <div style={{ padding: 32, textAlign: 'center' }}>
          Loading mood data...
        </div>
      </div>
    );
  }

  return (
    <div>
      <SeekerNavBar />
      <div style={{ 
        padding: 32, 
        maxWidth: 800, 
        margin: '0 auto',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <h1 style={{ 
          color: '#6366f1', 
          marginBottom: 24,
          fontSize: 28,
          fontWeight: 700
        }}>
          Mood Tracker
        </h1>

        {/* Feedback Message */}
        {showFeedback && (
          <div style={{
            padding: 16,
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: 8,
            marginBottom: 24,
            textAlign: 'center'
          }}>
            Mood entry saved successfully! 🎉
          </div>
        )}

        {/* Error Message */}
        {isError && error && (
          <div style={{
            padding: 16,
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: 8,
            marginBottom: 24,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Mood Entry Form */}
        <div style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(99,102,241,0.10)',
          marginBottom: 32
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: 20,
            fontSize: 20,
            fontWeight: 600
          }}>
            How are you feeling today?
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ 
                display: 'block', 
                marginBottom: 12,
                fontWeight: 500,
                color: '#374151'
              }}>
                Select your mood:
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 12
              }}>
                {Object.values(MoodLevel).filter(v => typeof v === 'number').map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedMood(level as MoodLevel)}
                    style={{
                      padding: 12,
                      border: selectedMood === level ? '2px solid #6366f1' : '2px solid #e5e7eb',
                      borderRadius: 8,
                      backgroundColor: selectedMood === level ? '#f0f4ff' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 500,
                      color: getMoodColor(level as MoodLevel),
                      transition: 'all 0.2s'
                    }}
                  >
                    {getMoodLabel(level as MoodLevel)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label htmlFor="mood-notes" style={{ 
                display: 'block', 
                marginBottom: 8,
                fontWeight: 500,
                color: '#374151'
              }}>
                Notes (optional):
              </label>
              <textarea
                id="mood-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? What's on your mind?"
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: 80
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1
              }}
            >
              {isPending ? 'Saving...' : 'Save Mood Entry'}
            </button>
          </form>
        </div>

        {/* Recent Mood Entries */}
        <div style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(99,102,241,0.10)'
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: 20,
            fontSize: 20,
            fontWeight: 600
          }}>
            Recent Mood Entries
          </h2>

          {!moods || moods.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No mood entries yet. Create your first entry above!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  style={{
                    padding: 16,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <span style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: getMoodColor(mood.level)
                    }}>
                      {getMoodLabel(mood.level)}
                    </span>
                    <span style={{ 
                      fontSize: 12, 
                      color: '#6b7280' 
                    }}>
                      {new Date(mood.entryDate).toLocaleDateString()}
                    </span>
                  </div>
                  {mood.notes && (
                    <p style={{ 
                      margin: 0, 
                      color: '#374151',
                      fontSize: 14 
                    }}>
                      {mood.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
