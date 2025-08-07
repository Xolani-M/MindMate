"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { JournalProvider, useJournalState, useJournalActions } from "@/providers/journal";
import { useAuthState } from "@/providers/authProvider";
import { getId } from "@/utils/jwt";
import assessmentStyles from "../assessment/assessmentstyles";

function JournalContent() {
  const { entries, isPending, isError, error } = useJournalState();
  const { getEntries, create } = useJournalActions();
  const { user } = useAuthState();
  const [text, setText] = useState("");
  const [moodScore, setMoodScore] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getEntries();
  }, [getEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const seekerIdStr = user?.token ? getId(user.token) : "";
    const seekerId = seekerIdStr ? Number(seekerIdStr) : undefined;
    await create({ seekerId, content: text, moodScore, emotion });
    setText("");
    setMoodScore(5);
    setEmotion("");
    setSubmitting(false);
    getEntries();
  };

  return (
    <div
      style={{
        ...(assessmentStyles.container as React.CSSProperties),
        background: 'linear-gradient(135deg, #fafbff, #f0f4ff)',
      }}
    >
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
                <Image src="https://twemoji.maxcdn.com/v/latest/svg/1f61e.svg" alt="Very Low" style={{ width: 22, height: 22 }} />
                <input
                  id="moodScoreRange"
                  type="range"
                  min={1}
                  max={10}
                  value={moodScore}
                  onChange={e => setMoodScore(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <Image src="https://twemoji.maxcdn.com/v/latest/svg/1f604.svg" alt="Very High" style={{ width: 22, height: 22 }} />
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
                disabled={submitting || !text}
                style={submitting || !text ? { ...assessmentStyles.buttonPrimary, ...assessmentStyles.buttonDisabled } : assessmentStyles.buttonPrimary}
              >
                {submitting ? "Saving..." : "Add Entry"}
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
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>{entry.content}</div>
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
  );
}

const JournalPage = () => (
  <JournalProvider>
    <JournalContent />
  </JournalProvider>
);

export default JournalPage;
