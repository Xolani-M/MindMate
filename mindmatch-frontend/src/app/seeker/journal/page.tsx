/**
 * @fileoverview Journal Entry Management Page Component
 * @description Provides comprehensive journal entry interface with mood tracking, emotion selection, and authentication protection
 * @author MINDMATE Development Team
 * @version 1.0.0
 */

"use client";
import React, { useEffect, useState } from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { JournalProvider, useJournalState, useJournalActions } from "@/providers/journal";
import { MoodSelector, EnhancedEmotionInput } from "@/components/MoodSelector";
import { EnhancedJournalFeedback, FeedbackState } from "@/components/EnhancedJournalFeedback";
import { useAuthGuard } from '@/hooks/useAuthGuard';
import './mood-indicators.css';
import './journal-styles.css';

//#region Type Definitions

/**
 * Journal entry creation payload interface
 * Defines the structure for creating new journal entries
 */
interface IJournalEntryPayload {
    /** The text content of the journal entry */
    entryText: string;
    /** Mood score on a scale of 1-10 */
    moodScore: number;
    /** Current emotion description */
    emotion: string;
}

//#endregion Type Definitions

/**
 * Journal Content Component
 * 
 * Provides journal entry management functionality including:
 * - Authentication protection with session loading
 * - Mood tracking and emotion selection
 * - Real-time entry creation and retrieval
 * - Professional feedback interface
 * - Responsive design with loading states
 * 
 * @returns Rendered journal content component
 */
function JournalContent(): React.ReactElement {
    
    //#region Hooks
    
    /**
     * Authentication guard hook for protecting journal access
     */
    const { isLoading: isAuthLoading } = useAuthGuard();
    
    /**
     * Journal state management hooks
     */
    const { entries, isPending, isError, error, isSuccess } = useJournalState();
    const { getEntries, create, reset } = useJournalActions();
    
    //#endregion Hooks
    
    //#region State Variables
    
    /**
     * Current feedback display state
     */
    const [feedbackState, setFeedbackState] = useState<FeedbackState>(FeedbackState.NONE);
    
    /**
     * Tracks the current operation type to control feedback display
     */
    const [isCreatingEntry, setIsCreatingEntry] = useState<boolean>(false);
    
    /**
     * Journal entry text content
     */
    const [text, setText] = useState<string>("");
    
    /**
     * Current mood score (1-10 scale)
     */
    const [moodScore, setMoodScore] = useState<number>(5);
    
    /**
     * Current emotion description
     */
    const [emotion, setEmotion] = useState<string>("");
    
    //#endregion State Variables
    
    //#region Hooks Effects
    
    /**
     * Load journal entries on component mount
     * Only executes after authentication is verified
     */
    useEffect(() => {
        if (!isAuthLoading) {
            getEntries();
        }
    }, [getEntries, isAuthLoading]);

    /**
     * Handle feedback state based on API response
     * Only shows feedback for journal entry creation operations, not for loading entries
     */
    useEffect(() => {
        // Only show feedback if we're in the process of creating an entry
        if (isCreatingEntry) {
            if (isPending) {
                setFeedbackState(FeedbackState.LOADING);
            } else if (isSuccess) {
                setFeedbackState(FeedbackState.SUCCESS);
                setIsCreatingEntry(false); // Reset the creation flag
            } else if (isError) {
                setFeedbackState(FeedbackState.ERROR);
                setIsCreatingEntry(false); // Reset the creation flag
            }
        }
    }, [isPending, isSuccess, isError, isCreatingEntry]);
    
    //#endregion Hooks Effects
    
    // Show loading state while authentication is being verified
    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading journal...</p>
                </div>
            </div>
        );
    }

    /**
     * Handle journal entry form submission
     * Creates new journal entry with current mood and emotion data
     * 
     * @param e - Form submission event
     */
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        
        // Set flag to indicate we're creating an entry (for feedback control)
        setIsCreatingEntry(true);
        setFeedbackState(FeedbackState.LOADING);
        
        const payload: IJournalEntryPayload = { entryText: text, moodScore, emotion };
        await create(payload);
        
        // Clear form only after successful submission
        setText("");
        setMoodScore(5);
        setEmotion("");
        getEntries();
    };

    /**
     * Handle feedback dismissal
     * Resets feedback state and journal provider state
     */
    const handleFeedbackDismiss = (): void => {
        setFeedbackState(FeedbackState.NONE);
        reset(); // Reset the journal provider state
    };

    //#endregion Event Handlers

    //#region Main Render

    return (
    <>
      {/* CSS for button spinner */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600&family=Georgia:wght@300;400;500&display=swap');
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <SeekerNavBar />
      <div className="journal-container">
      {/* Enhanced Feedback System */}
      <EnhancedJournalFeedback
        state={feedbackState}
        errorMessage={error || undefined}
        onDismiss={handleFeedbackDismiss}
        dismissible={true}
      />
      
      <main style={{ maxWidth: 800, width: "100%", margin: "0 auto", position: "relative" }}>
        <div className="journal-card">
          <h1 className="journal-title">My Journal</h1>
          <p className="journal-subtitle">A space for your thoughts, reflections, and growth</p>
          
          <form onSubmit={handleSubmit} className="journal-form">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Dear diary... What's on your mind today? Share your thoughts, feelings, dreams, or simply how your day went. This is your safe space to express yourself freely."
              rows={6}
              className="journal-textarea"
              required
            />
            
            <div style={{ marginBottom: 20 }}>
              <MoodSelector
                value={moodScore}
                onChange={setMoodScore}
              />
            </div>
            
            <div className="journal-input-group">
              <EnhancedEmotionInput
                value={emotion}
                onChange={setEmotion}
                placeholder="How are you feeling? (e.g., grateful, contemplative, hopeful)"
              />
              <button
                type="submit"
                disabled={feedbackState === FeedbackState.LOADING || !text.trim()}
                className="journal-submit-btn"
                style={{
                  opacity: feedbackState === FeedbackState.LOADING || !text.trim() ? 0.6 : 1,
                  cursor: feedbackState === FeedbackState.LOADING || !text.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {feedbackState === FeedbackState.LOADING && (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }} />
                )}
                {feedbackState === FeedbackState.LOADING ? "Saving..." : "Capture Moment"}
              </button>
            </div>
          </form>
          
          <div className="journal-entries-section">
            <h2 className="journal-entries-title">Previous Entries</h2>
          
          {/* Journal Statistics */}
          {entries && entries.length > 0 && (
            <div className="journal-stats">
              <div className="journal-stat-item">
                <span className="journal-stat-value">{entries.length}</span>
                <span className="journal-stat-label">Total Entries</span>
              </div>
              <div className="journal-stat-item">
                <span className="journal-stat-value">
                  {entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + (entry.moodScore || 0), 0) / entries.length) : 0}
                </span>
                <span className="journal-stat-label">Avg Mood</span>
              </div>
              <div className="journal-stat-item">
                <span className="journal-stat-value">
                  {entries.filter(entry => entry.createdAt && new Date(entry.createdAt).toDateString() === new Date().toDateString()).length}
                </span>
                <span className="journal-stat-label">Today</span>
              </div>
            </div>
          )}
          
          {isPending && <div style={{ textAlign: 'center', padding: '24px', color: '#6366f1' }}>Loading your journal entries...</div>}
          {isError && <div style={{ color: "#ef4444", textAlign: 'center', padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
            <strong>Error loading entries:</strong> {error}
          </div>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {entries && entries.length > 0 ? (
              entries.map(entry => (
                <div key={entry.id} className="journal-entry">
                  <div className="journal-entry-text">{entry.entryText}</div>
                  <div className="journal-entry-meta">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="journal-mood-indicator">
                        <span>Mood: {entry.moodScore ?? "-"}</span>
                      </div>
                      {entry.emotion && (
                        <span className="journal-emotion-tag">{entry.emotion}</span>
                      )}
                    </div>
                    <div className="journal-timestamp">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ""}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="journal-empty-state">
                <div className="journal-empty-state-icon">✍️</div>
                <h3 style={{ fontSize: '22px', fontWeight: '300', marginBottom: '12px', color: '#2c3e50', fontFamily: "'Playfair Display', serif" }}>
                  Your Journal Awaits
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#7f8c8d', fontStyle: 'italic' }}>
                  Every great story begins with a single word.<br />
                  Share your thoughts, capture your moments, and begin your journey of self-reflection.
                </p>
              </div>
            )}
          </div>
          </div> {/* Close journal-entries-section */}
        </div> {/* Close journal-card */}
      </main>
      </div> {/* Close journal-container */}
    </>
  );

  //#endregion Main Render
}

/**
 * Journal Page Component
 * 
 * Root component that provides journal context and renders journal content
 * Wraps JournalContent with JournalProvider for state management
 * 
 * @returns Rendered journal page with provider context
 */
const JournalPage = (): React.ReactElement => (
  <JournalProvider>
    <JournalContent />
  </JournalProvider>
);

export default JournalPage;
