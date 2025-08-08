"use client";
import React, { useState } from "react";
import SeekerNavBar from '@/components/SeekerNavBar';
import { AssessmentProvider, useAssessmentActions, useAssessmentState } from "@/providers/assessment";
import { useAuthState } from "@/providers/authProvider";
import { getId } from "@/utils/jwt";
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
  const { user } = useAuthState();
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
    const seekerIdStr = user?.token ? getId(user.token) : "";
    const seekerId = seekerIdStr ? Number(seekerIdStr) : undefined;
    const payload = {
      seekerId,
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: 8, textAlign: "center", color: "#6366f1" }}>Assessment</h1>
          <div style={{ marginBottom: 24, textAlign: "center", color: '#1e293b' }}>
            <label htmlFor="assessmentType" style={{ fontWeight: 500, marginRight: 8 }}>Assessment Type:</label>
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
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
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
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, color: "#6366f1" }}>
                    Question {currentQuestion + 1} of {totalQuestions}
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: 16 }}>{questions[currentQuestion].text}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {questions[currentQuestion].options.map((opt) => (
                      <label key={opt.score} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400, cursor: "pointer", padding: "8px 0" }}>
                        <input
                          type="radio"
                          name={`question-${questions[currentQuestion].number}`}
                          value={opt.score}
                          checked={answers[questions[currentQuestion].number] === opt.score}
                          onChange={() => handleOptionChange(questions[currentQuestion].number, opt.score)}
                          required
                          style={{ accentColor: "#6366f1", width: 20, height: 20 }}
                        />
                        <span style={{ fontSize: 16 }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentQuestion === 0}
                      style={currentQuestion === 0 ? { ...assessmentStyles.buttonSecondary, ...assessmentStyles.buttonDisabled } : assessmentStyles.buttonSecondary}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={answers[questions[currentQuestion].number] === undefined}
                      style={answers[questions[currentQuestion].number] === undefined ? { ...assessmentStyles.buttonPrimary, ...assessmentStyles.buttonDisabled } : assessmentStyles.buttonPrimary}
                    >
                      {currentQuestion === totalQuestions - 1 ? "Review" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 32 }}>
                <div style={assessmentStyles.reviewCard}>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, color: "#6366f1" }}>Review your answers</div>
                  <ol style={{ paddingLeft: 20, marginBottom: 16 }}>
                    {questions.map((q) => (
                      <li key={q.number} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 500 }}>{q.text}</span>
                        <br />
                        <span style={{ color: "#6366f1", fontWeight: 600 }}>
                          {q.options.find((opt) => opt.score === answers[q.number])?.label || <em>Not answered</em>}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="notes" style={{ fontWeight: 500 }}>Notes (optional):</label>
                    <br />
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      style={{ width: "100%", borderRadius: 8, border: "1px solid #ccc", padding: 8, fontSize: 16 }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      onClick={() => setShowSummary(false)}
                      style={assessmentStyles.buttonSecondary}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      style={isPending ? { ...assessmentStyles.buttonPrimary, ...assessmentStyles.buttonDisabled } : assessmentStyles.buttonPrimary}
                    >
                      {isPending ? "Submitting..." : "Submit"}
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
