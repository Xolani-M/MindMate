"use client";
import React, { useState } from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { AssessmentProvider, useAssessmentActions, useAssessmentState } from "@/providers/assessment";
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, AssessmentType, AssessmentQuestion } from "./assessmentTemplates";
import { Shield, Heart, Lock, UserCheck } from 'lucide-react';
import styles from "../../page.module.css";
import assessmentStyles from "./assessmentstyles";


//#region Constants

/**
 * Available assessment types configuration
 * Defines the supported mental health assessment options with user-friendly labels
 */
const ASSESSMENT_TYPES: { label: string; value: AssessmentType }[] = [
  { 
    label: "PHQ-9 Depression", 
    value: "PHQ9" 
  },
  { 
    label: "GAD-7 Anxiety", 
    value: "GAD7" 
  }
];

/**
 * Retrieves assessment questions based on assessment type
 * 
 * @param type - The type of assessment (PHQ9 or GAD7)
 * @returns Array of assessment questions for the specified type
 */
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

//#endregion Constants

/**
 * Assessment Form Component
 * 
 * Provides comprehensive mental health assessment functionality including:
 * - Multiple assessment types (PHQ-9, GAD-7)
 * - Authentication protection with session loading
 * - Progressive question navigation
 * - Real-time form validation and submission
 * - Professional feedback interface
 * - Responsive design with accessibility features
 * 
 * @returns Rendered assessment form component
 */
const AssessmentForm: React.FC = () => {
  // All hooks must be called at the top level
  const { isLoading } = useAuthGuard();
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("PHQ9");
  const [answers, setAnswers] = useState<{ [question: number]: number }>({});
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isPending, isSuccess, isError, error, assessments } = useAssessmentState();
  const { create } = useAssessmentActions();
  
  // Return loading state if authentication is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
          {/* Welcome Section */}
          {showWelcome && (
            <div style={{ marginBottom: 32 }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 12, 
                  marginBottom: 16 
                }}>
                  <Heart size={32} style={{ color: "#10b981" }} />
                  <h1 style={{ 
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
                    fontWeight: 700, 
                    margin: 0, 
                    color: "#10b981",
                    lineHeight: 1.2 
                  }}>
                    Your Wellness Check-In
                  </h1>
                </div>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: 0,
                  fontSize: "clamp(1rem, 2vw, 1.1rem)",
                  lineHeight: 1.5,
                  maxWidth: 480,
                  margin: "0 auto"
                }}>
                  Take a moment to reflect on your mental well-being in a safe, private space
                </p>
              </div>

              {/* Safety Assurances */}
              <div style={{ 
                background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                border: "1px solid #bbf7d0",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  marginBottom: 16 
                }}>
                  <Shield size={24} style={{ color: "#10b981" }} />
                  <h3 style={{ 
                    margin: 0, 
                    color: "#065f46", 
                    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                    fontWeight: 600 
                  }}>
                    Your Privacy & Safety
                  </h3>
                </div>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: 16 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Lock size={16} style={{ color: "#10b981" }} />
                    <span style={{ 
                      fontSize: "clamp(0.85rem, 2vw, 0.9rem)", 
                      color: "#047857" 
                    }}>
                      100% Confidential
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <UserCheck size={16} style={{ color: "#10b981" }} />
                    <span style={{ 
                      fontSize: "clamp(0.85rem, 2vw, 0.9rem)", 
                      color: "#047857" 
                    }}>
                      No Judgment Zone
                    </span>
                  </div>
                </div>
                <p style={{ 
                  margin: "12px 0 0 0", 
                  fontSize: "clamp(0.8rem, 1.8vw, 0.85rem)", 
                  color: "#065f46",
                  lineHeight: 1.4
                }}>
                  This assessment helps us understand how you&apos;re feeling so we can provide 
                  personalized support. Your responses are encrypted and only used to improve your care.
                </p>
              </div>

              {/* What to Expect */}
              <div style={{ 
                background: "linear-gradient(135deg, #fef7ff 0%, #faf5ff 100%)",
                border: "1px solid #e9d5ff",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24
              }}>
                <h3 style={{ 
                  margin: "0 0 16px 0", 
                  color: "#7c3aed", 
                  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                  fontWeight: 600 
                }}>
                  What to Expect
                </h3>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: 20, 
                  color: "#6b46c1",
                  fontSize: "clamp(0.85rem, 2vw, 0.9rem)",
                  lineHeight: 1.6
                }}>
                  <li style={{ marginBottom: 8 }}>
                    Simple questions about your recent feelings and experiences
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    Takes about 5-10 minutes to complete
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    No right or wrong answers - just honest reflection
                  </li>
                  <li>
                    Immediate insights to help guide your wellness journey
                  </li>
                </ul>
              </div>

              {/* Start Button */}
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setShowWelcome(false)}
                  style={{
                    padding: "16px 32px",
                    borderRadius: 25,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.25)",
                    transition: "all 0.3s ease",
                    minWidth: 200
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.25)";
                  }}
                >
                  Begin My Wellness Check-In
                </button>
              </div>
            </div>
          )}

          {/* Assessment Content */}
          {!showWelcome && (
            <>
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
            marginBottom: 16,
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            lineHeight: 1.5
          }}>
            Take a moment to reflect on your mental well-being
          </p>
          
          {/* Back to Welcome Button */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setShowWelcome(true)}
              style={{
                background: 'transparent',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ← Back
            </button>
          </div>
          
          <div style={{ 
            marginBottom: 32, 
            textAlign: "center", 
            color: '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <label htmlFor="assessmentType" style={{ 
              fontWeight: 600, 
              fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
              color: "#1e293b",
              textAlign: 'center'
            }}>
              Choose Assessment Type:
            </label>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px', 
              position: 'relative' 
            }}>
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
                style={{
                  ...assessmentStyles.selectInput as React.CSSProperties,
                  fontFamily: 'inherit'
                }}
              >
                {ASSESSMENT_TYPES.map((type) => (
                  <option 
                    key={type.value} 
                    value={type.value}
                    style={{
                      padding: '12px 16px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1e293b',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
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
          </>
          )}
        </div>
      </main>
    </div>
    </div>
  );
};

const AssessmentPage: React.FC = () => {
  return (
    <AssessmentProvider>
      <AssessmentForm />
    </AssessmentProvider>
  );
};

export default AssessmentPage;
