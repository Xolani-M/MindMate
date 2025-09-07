import React from "react";
import styles from "./mindmate-landing.module.css";

export default function UseCasesGrid() {
  return (
    <section className={styles.useCases} id="use-cases">
      <div className={styles.useCasesContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>🚀</span> Revolutionary Applications
          </div>
          <h2 className={styles.sectionTitle}>Empowering Every Industry</h2>
          <p className={styles.sectionSubtitle}>
            From healthcare to education, MindMate transforms how organizations understand and support human emotions
          </p>
        </div>
        <div className={styles.useCasesGrid}>
          {/* Use case cards, copy from HTML as JSX */}
          <div className={styles.useCaseCard}>
            <div className={styles.cardIcon}>💼</div>
            <h3>Employee Wellness</h3>
            <p>Track workplace well-being, prevent burnout, and create thriving teams with AI-powered insights.</p>
            <ul className={styles.cardFeatures}>
              <li>Real-time stress monitoring</li>
              <li>Anonymous mood check-ins</li>
              <li>Personalized wellness recommendations</li>
              <li>HR platform integrations</li>
            </ul>
          </div>
          <div className={styles.useCaseCard}>
            <div className={styles.cardIcon}>🏥</div>
            <h3>Mental Health & Therapy</h3>
            <p>Transform teletherapy with emotion analytics and intelligent support systems.</p>
            <ul className={styles.cardFeatures}>
              <li>Real-time emotion detection</li>
              <li>Therapist dashboards</li>
              <li>Risk alerts & intervention</li>
              <li>EHR integrations</li>
            </ul>
          </div>
          <div className={styles.useCaseCard}>
            <div className={styles.cardIcon}>🎓</div>
            <h3>Education</h3>
            <p>Support student mental health and create safer, more empathetic learning environments.</p>
            <ul className={styles.cardFeatures}>
              <li>Student mood tracking</li>
              <li>Early warning systems</li>
              <li>Teacher support tools</li>
              <li>Peer support forums</li>
            </ul>
          </div>
          <div className={styles.useCaseCard}>
            <div className={styles.cardIcon}>🤝</div>
            <h3>Customer Service</h3>
            <p>Enhance customer interactions with real-time emotion detection and empathetic responses.</p>
            <ul className={styles.cardFeatures}>
              <li>Real-time sentiment analysis</li>
              <li>Empathetic chatbot assistance</li>
              <li>Priority routing for distressed customers</li>
              <li>Service quality analytics</li>
            </ul>
          </div>
          <div className={styles.useCaseCard}>
            <div className={styles.cardIcon}>👨‍👩‍👧‍👦</div>
            <h3>Healthcare Integration</h3>
            <p>Connect emotional data with EHRs for comprehensive patient care and support.</p>
            <ul className={styles.cardFeatures}>
              <li>EHR/EMR integration</li>
              <li>Chronic illness support</li>
              <li>Patient engagement tracking</li>
              <li>Caregiver support tools</li>
            </ul>
          </div>
          <div className={styles.useCaseCard}>
            <div className={styles.cardIcon}>📊</div>
            <h3>HR & Recruitment</h3>
            <p>Transform hiring and employee experience with emotional intelligence insights.</p>
            <ul className={styles.cardFeatures}>
              <li>Candidate well-being assessment</li>
              <li>Onboarding mood tracking</li>
              <li>Team culture analytics</li>
              <li>Employee retention insights</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
