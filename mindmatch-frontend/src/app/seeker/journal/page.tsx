"use client";
import React, { useEffect, useState } from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import Image from "next/image";
import { JournalProvider, useJournalState, useJournalActions } from "@/providers/journal";
import assessmentStyles from "../assessment/assessmentstyles";

function JournalContent() {
  const { entries, isPending, isError, error, isSuccess } = useJournalState();
  const { getEntries, create, reset } = useJournalActions();
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [text, setText] = useState("");
  const [moodScore, setMoodScore] = useState(5);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    getEntries();
  }, [getEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    const payload = { entryText: text, moodScore, emotion };
    await create(payload);
    setText("");
    setMoodScore(5);
    setEmotion("");
    getEntries();
    setShowFeedback(true);
  };

  // Auto-hide feedback on state change
  useEffect(() => {
    if (!hasSubmitted) return;
    if (isSuccess || isError || isPending) {
      setShowFeedback(true);
      const timer = setTimeout(() => {
        setShowFeedback(false);
        reset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, isPending, reset, hasSubmitted]);

  // Helper functions for styling
  const getFeedbackBackground = () => {
    if (isError) return '#fee2e2';
    if (isSuccess) return '#d1fae5';
    return '#e0e7ff';
  };

  const getFeedbackColor = () => {
    if (isError) return '#991b1b';
    if (isSuccess) return '#065f46';
    return '#3730a3';
  };

  const getFeedbackMessage = () => {
    if (isError) return `Failed to add journal entry. ${error || 'Please try again.'}`;
    if (isSuccess) return 'Your journal entry was added successfully! Keep nurturing your mind.';
    if (isPending) return 'Adding your journal entry...';
    return '';
  };

  return (
    <>
      <SeekerNavBar />
      <div
        style={{
          ...(assessmentStyles.container as React.CSSProperties),
          background: 'linear-gradient(135deg, #fafbff, #f0f4ff)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
      {showFeedback && hasSubmitted && (
        <div style={{
          position: 'absolute',
          top: 32,
          left: 0,
          right: 0,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{
            background: getFeedbackBackground(),
            color: getFeedbackColor(),
            padding: 16,
            borderRadius: 12,
            minWidth: 320,
            maxWidth: 500,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 17,
            boxShadow: '0 4px 24px rgba(99,102,241,0.10)',
            opacity: showFeedback ? 1 : 0,
            transition: 'opacity 0.3s',
          }}>
            {getFeedbackMessage()}
          </div>
        </div>
      )}
      <div style={assessmentStyles.orbTop as React.CSSProperties} />
      <div style={assessmentStyles.orbBottom as React.CSSProperties} />
      <main style={{ maxWidth: 600, width: "100%", zIndex: 2, position: "relative" }}>
        <div
          style={{
            ...(assessmentStyles.card as React.CSSProperties),
            background: '#fff',
            color: '#1e293b',
            zIndex: 10,
            position: 'relative',
          }}
        >
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: 8, textAlign: "center", color: "#6366f1" }}>Journal</h1>
          <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write your thoughts..."
              rows={4}
              style={{ width: "100%", borderRadius: 10, border: "1px solid #ccc", padding: 12, fontSize: 16, marginBottom: 12 }}
              required
            />
            <div style={{ marginBottom: 8 }}>
              <label htmlFor="moodScoreRange" style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>How was your mood today?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Image src="https://twemoji.maxcdn.com/v/latest/svg/1f61e.svg" alt="Very Low" width={22} height={22} style={{ width: 22, height: 22 }} />
                <input
                  id="moodScoreRange"
                  type="range"
                  min={1}
                  max={10}
                  value={moodScore}
                  onChange={e => setMoodScore(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <Image src="https://twemoji.maxcdn.com/v/latest/svg/1f604.svg" alt="Very High" width={22} height={22} style={{ width: 22, height: 22 }} />
                <span style={{ minWidth: 24, fontWeight: 600, color: '#6366f1' }}>{moodScore}</span>
              </div>
              <div style={{ fontSize: 13, color: '#888', marginLeft: 2 }}>
                1 = Very Low, 5 = Neutral, 10 = Very High
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <input
                type="text"
                value={emotion}
                onChange={e => setEmotion(e.target.value)}
                placeholder="Emotion (e.g. happy, sad)"
                style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: 6 }}
                required
              />
            <button
              type="submit"
              disabled={isPending || !text}
              style={isPending || !text ? { ...assessmentStyles.buttonPrimary, ...assessmentStyles.buttonDisabled } : assessmentStyles.buttonPrimary}
            >
              {isPending ? "Saving..." : "Add Entry"}
            </button>
            </div>
          </form>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 12 }}>Your Entries</h2>
          {isPending && <div>Loading...</div>}
          {isError && <div style={{ color: "#ef4444" }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {entries && entries.length > 0 ? (
              entries.map(entry => (
                <div key={entry.id} style={{ background: "#f8fafc", borderRadius: 10, padding: 16, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>{entry.entryText}</div>
                  <div style={{ fontSize: 14, color: "#6366f1" }}>Mood: {entry.moodScore ?? "-"} | Emotion: {entry.emotion ?? "-"}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}</div>
                </div>
              ))
            ) : (
              <div style={{ color: "#888" }}>No journal entries yet.</div>
            )}
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

const JournalPage = () => (
  <JournalProvider>
    <JournalContent />
  </JournalProvider>
);

export default JournalPage;
