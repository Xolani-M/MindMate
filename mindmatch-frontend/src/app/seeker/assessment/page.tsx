"use client";
import React, { useState } from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { AssessmentProvider, useAssessmentActions, useAssessmentState } from "@/providers/assessment";
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, AssessmentType, AssessmentQuestion } from "./assessmentTemplates";
import styles from "../../page.module.css";
import assessmentStyles from "./assessmentstyles";


const ASSESSMENT_TYPES: { label: string; value: AssessmentType }[] = [
  { label: "PHQ-9 (Depression)", value: "PHQ9" },
  { label: "GAD-7 (Anxiety)", value: "GAD7" },
];


const getQuestions = (type: AssessmentType): AssessmentQuestion[] => {
  switch (type) {
    case "PHQ9":
      return PHQ9_QUESTIONS;
    case "GAD7":
      return GAD7_QUESTIONS;
    default:
      return [];
  }
};

const AssessmentForm: React.FC = () => {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("PHQ9");
  const [answers, setAnswers] = useState<{ [question: number]: number }>({});
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const { isPending, isSuccess, isError, error, assessments } = useAssessmentState();
  const { create } = useAssessmentActions();
  const questions = getQuestions(assessmentType);
  const totalQuestions = questions.length;

  const handleOptionChange = (questionNumber: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: score }));
  };
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setShowSummary(true);
    }
  };
  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      type: assessmentType,
      answers: questions.map((q) => ({
        questionNumber: q.number,
        selectedOptionScore: answers[q.number] ?? 0,
      })),
      notes,
    };
    await create(payload);
    setSubmitted(true);
    setShowSummary(false);
    setCurrentQuestion(0);
    setAnswers({});
    setNotes("");
  };
  const progress = Math.round(((currentQuestion + (showSummary ? 1 : 0)) / (totalQuestions + 1)) * 100);

  return (
    <>
      <SeekerNavBar />
      <div
        style={{
          ...(assessmentStyles.container as React.CSSProperties),
          background: 'linear-gradient(135deg, #fafbff, #f0f4ff)',
        }}
      >
      <div style={assessmentStyles.orbTop as React.CSSProperties} />
      <div style={assessmentStyles.orbBottom as React.CSSProperties} />
      <main className={styles.main} style={{ maxWidth: 600, width: "100%", zIndex: 2, position: "relative" }}>
        <div
          style={{
            ...(assessmentStyles.card as React.CSSProperties),
            background: '#fff',
            color: '#1e293b', // dark slate
            zIndex: 10,
            position: 'relative',
          }}
        >
          <h1 style={{ 
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
            fontWeight: 700, 
            marginBottom: 12, 
            textAlign: "center", 
            color: "#6366f1",
            lineHeight: 1.2 
          }}>
            Mental Health Assessment
          </h1>
          <p style={{ 
            textAlign: "center", 
            color: '#64748b', 
            marginBottom: 24,
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            lineHeight: 1.5
          }}>
            Take a moment to reflect on your mental well-being
          </p>
          <div style={{ marginBottom: 32, textAlign: "center", color: '#1e293b' }}>
            <label htmlFor="assessmentType" style={{ 
              fontWeight: 600, 
              marginRight: 12,
              display: 'block',
              marginBottom: 8,
              fontSize: "clamp(0.9rem, 2vw, 1rem)"
            }}>
              Choose Assessment Type:
            </label>
            <select
              id="assessmentType"
              value={assessmentType}
              onChange={(e) => {
                setAssessmentType(e.target.value as AssessmentType);
                setAnswers({});
                setSubmitted(false);
                setCurrentQuestion(0);
                setShowSummary(false);
              }}
              style={assessmentStyles.selectInput as React.CSSProperties}
            >
              {ASSESSMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div style={assessmentStyles.progressBarBg}>
            <div style={{ ...assessmentStyles.progressBar, width: `${progress}%` }} />
          </div>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {!showSummary ? (
              <div style={{ marginBottom: 32 }}>
                <div style={assessmentStyles.questionCard}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: "clamp(1rem, 3vw, 1.1rem)", 
                    marginBottom: 16, 
                    color: "#6366f1",
                    textAlign: "center"
                  }}>
                    Question {currentQuestion + 1} of {totalQuestions}
                  </div>
                  <div style={{ 
                    fontWeight: 500, 
                    marginBottom: 24,
                    fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                    lineHeight: 1.6,
                    color: "#334155"
                  }}>
                    {questions[currentQuestion].text}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {questions[currentQuestion].options.map((opt) => (
                      <label 
                        key={opt.score} 
                        style={{
                          ...assessmentStyles.radioOption,
                          background: answers[questions[currentQuestion].number] === opt.score ? '#f0f4ff' : 'transparent',
                          border: answers[questions[currentQuestion].number] === opt.score ? '2px solid #6366f1' : '2px solid transparent',
                        } as React.CSSProperties}
                      >
                        <input
                          type="radio"
                          name={`question-${questions[currentQuestion].number}`}
                          value={opt.score}
                          checked={answers[questions[currentQuestion].number] === opt.score}
                          onChange={() => handleOptionChange(questions[currentQuestion].number, opt.score)}
                          required
                          style={{ 
                            accentColor: "#6366f1", 
                            width: 20, 
                            height: 20,
                            marginTop: 2,
                            flexShrink: 0
                          }}
                        />
                        <span style={{ 
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          lineHeight: 1.4,
                          color: "#475569"
                        }}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginTop: 32,
                    gap: 16,
                    flexWrap: "wrap"
                  }}>
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentQuestion === 0}
                      style={currentQuestion === 0 ? 
                        { ...assessmentStyles.buttonSecondary, ...assessmentStyles.buttonDisabled } : 
                        assessmentStyles.buttonSecondary}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={answers[questions[currentQuestion].number] === undefined}
                      style={answers[questions[currentQuestion].number] === undefined ? 
                        { ...assessmentStyles.buttonPrimary, ...assessmentStyles.buttonDisabled } : 
                        assessmentStyles.buttonPrimary}
                    >
                      {currentQuestion === totalQuestions - 1 ? "Review Answers" : "Next Question"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 32 }}>
                <div style={assessmentStyles.reviewCard}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: "clamp(1rem, 3vw, 1.2rem)", 
                    marginBottom: 20, 
                    color: "#6366f1",
                    textAlign: "center"
                  }}>
                    📋 Review Your Responses
                  </div>
                  <p style={{
                    color: "#64748b",
                    marginBottom: 20,
                    textAlign: "center",
                    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    lineHeight: 1.5
                  }}>
                    Please review your answers before submitting your assessment
                  </p>
                  <div style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    marginBottom: 20,
                    padding: '0 4px'
                  }}>
                    <ol style={{ paddingLeft: 20, margin: 0 }}>
                      {questions.map((q) => (
                        <li key={q.number} style={{ 
                          marginBottom: 16,
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          borderLeft: '4px solid #6366f1'
                        }}>
                          <div style={{ 
                            fontWeight: 500,
                            marginBottom: 6,
                            fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                            color: "#334155"
                          }}>
                            {q.text}
                          </div>
                          <div style={{ 
                            color: "#6366f1", 
                            fontWeight: 600,
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            padding: '4px 8px',
                            background: '#e0e7ff',
                            borderRadius: '6px',
                            display: 'inline-block'
                          }}>
                            {q.options.find((opt) => opt.score === answers[q.number])?.label || 
                             <em style={{color: '#ef4444'}}>⚠️ Not answered</em>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label htmlFor="notes" style={{ 
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 8,
                      color: "#334155",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}>
                      💭 Additional Notes (Optional)
                    </label>
                    <p style={{
                      fontSize: "clamp(0.8rem, 1.8vw, 0.85rem)",
                      color: "#64748b",
                      marginBottom: 8,
                      lineHeight: 1.4
                    }}>
                      Share any additional thoughts or context about your responses
                    </p>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="How are you feeling today? Any specific situations affecting your mood?"
                      style={assessmentStyles.textareaInput as React.CSSProperties}
                    />
                  </div>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap"
                  }}>
                    <button
                      type="button"
                      onClick={() => setShowSummary(false)}
                      style={assessmentStyles.buttonSecondary}
                    >
                      ← Back to Questions
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      style={isPending ? 
                        { ...assessmentStyles.buttonPrimary, ...assessmentStyles.buttonDisabled } : 
                        assessmentStyles.buttonPrimary}
                    >
                      {isPending ? "📤 Submitting..." : "✅ Submit Assessment"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
          {isError && <div style={{ color: "#ef4444", marginTop: 16, fontWeight: 500, textAlign: "center" }}>{error}</div>}
          {isSuccess && submitted && (
            <div style={{ color: "#22c55e", marginTop: 16, fontWeight: 500, textAlign: "center" }}>
              Assessment submitted successfully!
              {assessments?.[0] && (
                <pre style={{ background: "#f6f6f6", padding: 12, marginTop: 8, borderRadius: 8, fontSize: 14, textAlign: "left" }}>
                  {JSON.stringify(assessments[0], null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </main>
      </div>
    </>
  );
}

const AssessmentPage: React.FC = () => {
  return (
    <AssessmentProvider>
      <AssessmentForm />
    </AssessmentProvider>
  );
};

export default AssessmentPage;
