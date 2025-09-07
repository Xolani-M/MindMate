import React from "react";
import styles from "./mindmate-landing.module.css";

export default function FeaturesGrid() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>✨</span> Platform Features
          </div>
          <h2 className={styles.sectionTitle}>Comprehensive Emotional Intelligence</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to understand and support human emotions at scale
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconLarge}>🧩</div>
            <h3>Multi-Modal Analysis</h3>
            <p>Text, voice, and video emotion recognition in one unified platform.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconLarge}>📊</div>
            <h3>Advanced Dashboards</h3>
            <p>Customizable analytics and reporting for every use case.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconLarge}>🤖</div>
            <h3>AI Coaching</h3>
            <p>Empathetic virtual assistants that provide personalized support.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconLarge}>🔒</div>
            <h3>Enterprise Security</h3>
            <p>End-to-end encryption and compliance with industry standards.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconLarge}>📱</div>
            <h3>Mobile Access</h3>
            <p>Full functionality on iOS and Android devices.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconLarge}>🌐</div>
            <h3>Global Support</h3>
            <p>Multi-language and cross-cultural emotion recognition.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
