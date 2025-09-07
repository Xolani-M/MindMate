import React from "react";
import styles from "./mindmate-landing.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroOrb}></div>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.emoji}>🌟</span> The Future of Empathic AI
        </div>
        <h1>Transform Human<br />Connection Through<br />Empathic AI</h1>
        <p className={styles.heroSubtitle}>
          MindMate is built on the latest emotion science—creating empathic AI that understands how people express themselves, not just &quot;detecting&quot; emotions. Our platform measures and responds to real, observable patterns in voice, face, language, and non-verbal sound, supporting well-being and meaningful interactions across every industry.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>10+</span>
            <span className={styles.statLabel}>Industries</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>99.9%</span>
            <span className={styles.statLabel}>Science-Based</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>Support</span>
          </div>
        </div>
        <div className={styles.heroButtons}>
          <a href="#" className={styles.btnPrimary}>Transform Your Organization</a>
          <a href="#demo" className={styles.btnSecondary}>See Live Demo</a>
        </div>
      </div>
    </section>
  );
}
