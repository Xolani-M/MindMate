import React from "react";
import styles from "./mindmate-landing.module.css";

export default function InnovativeIdeasGrid() {
  return (
    <section className={styles.innovativeIdeas} id="innovative-ideas">
      <div className={styles.ideasContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>💡</span> Future Applications
          </div>
          <h2 className={styles.sectionTitle}>Innovative Ideas & Expansion</h2>
          <p className={styles.sectionSubtitle}>
            Exploring new frontiers for emotional intelligence technology
          </p>
        </div>
        <div className={styles.ideasGrid}>
          <div className={styles.ideaCard}>
            <div className={styles.ideaIcon}>👪</div>
            <h3>Family Wellness</h3>
            <p>Track and support emotional health across family members with shared goals and alerts.</p>
          </div>
          <div className={styles.ideaCard}>
            <div className={styles.ideaIcon}>💑</div>
            <h3>Dating & Relationships</h3>
            <p>Emotion analytics for relationship coaching, compatibility, and conflict resolution.</p>
          </div>
          <div className={styles.ideaCard}>
            <div className={styles.ideaIcon}>🏨</div>
            <h3>Travel & Hospitality</h3>
            <p>Guest mood tracking, personalized experiences, and service recovery solutions.</p>
          </div>
          <div className={styles.ideaCard}>
            <div className={styles.ideaIcon}>🏛️</div>
            <h3>Government & Public Sector</h3>
            <p>Population wellness tracking, crisis response, and policy impact analysis.</p>
          </div>
          <div className={styles.ideaCard}>
            <div className={styles.ideaIcon}>👵</div>
            <h3>Elder Care</h3>
            <p>Monitor and support emotional health in assisted living and home care environments.</p>
          </div>
          <div className={styles.ideaCard}>
            <div className={styles.ideaIcon}>🌪️</div>
            <h3>Disaster Response</h3>
            <p>Real-time emotional impact tracking and support during crises and emergencies.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
