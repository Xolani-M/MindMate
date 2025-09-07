import React from "react";
import styles from "./mindmate-landing.module.css";

export default function NextStepsTimeline() {
  return (
    <section className={styles.nextSteps} id="next-steps">
      <div className={styles.stepsContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>📅</span> Implementation Roadmap
          </div>
          <h2 className={styles.sectionTitle}>Our Path Forward</h2>
          <p className={styles.sectionSubtitle}>
            The strategic plan to make MindMate the leading emotional intelligence platform
          </p>
        </div>
        <div className={styles.stepsTimeline}>
          <div className={styles.step}>
            <div className={styles.stepCircle}>1</div>
            <div className={styles.stepText}>Build & refine core features for MVP</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>2</div>
            <div className={styles.stepText}>Develop key enterprise integrations</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>3</div>
            <div className={styles.stepText}>Pilot in healthcare, education & HR</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>4</div>
            <div className={styles.stepText}>Gather feedback & iterate rapidly</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>5</div>
            <div className={styles.stepText}>Expand use cases & partnerships</div>
          </div>
        </div>
        <a href="#contact" className={styles.btnPrimary}>Partner With Us</a>
      </div>
    </section>
  );
}
