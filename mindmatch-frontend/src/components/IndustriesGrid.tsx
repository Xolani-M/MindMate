import React from "react";
import styles from "./mindmate-landing.module.css";

export default function IndustriesGrid() {
  return (
    <section className={styles.industries} id="industries">
      <div className={styles.industriesContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>🌐</span> Industry Applications
          </div>
          <h2 className={styles.sectionTitle}>Transforming Diverse Sectors</h2>
          <p className={styles.sectionSubtitle}>
            MindMate&apos;s emotional intelligence platform delivers value across multiple industries and applications
          </p>
        </div>
        <div className={styles.industriesGrid}>
          <div className={styles.industryCard}>
            <div className={styles.industryIcon}>🔬</div>
            <h3>Research & Academia</h3>
            <p>Collect and analyze emotional data for studies with customizable research modules.</p>
          </div>
          <div className={styles.industryCard}>
            <div className={styles.industryIcon}>📱</div>
            <h3>Personal Development</h3>
            <p>Daily mood journaling, AI insights, and mindfulness training for personal growth.</p>
          </div>
          <div className={styles.industryCard}>
            <div className={styles.industryIcon}>🛡️</div>
            <h3>Insurance</h3>
            <p>Risk assessment based on emotional health and wellness program engagement tracking.</p>
          </div>
          <div className={styles.industryCard}>
            <div className={styles.industryIcon}>👥</div>
            <h3>Community Support</h3>
            <p>Peer support groups with emotion-aware moderation and crisis detection.</p>
          </div>
          <div className={styles.industryCard}>
            <div className={styles.industryIcon}>⚖️</div>
            <h3>Legal & Justice</h3>
            <p>Support for victims, witnesses, and legal professionals with stress analytics.</p>
          </div>
          <div className={styles.industryCard}>
            <div className={styles.industryIcon}>🏃‍♂️</div>
            <h3>Sports & Performance</h3>
            <p>Athlete mood tracking, team dynamics, and mental resilience training.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
