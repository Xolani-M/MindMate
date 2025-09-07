import React from "react";
import styles from "./mindmate-landing.module.css";

export default function CapabilitiesGrid() {
  return (
    <section className={styles.capabilities} id="capabilities">
      <div className={styles.capabilitiesContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>🚀</span> Platform Capabilities
          </div>
          <h2 className={styles.sectionTitle}>What MindMate Enables</h2>
          <p className={styles.sectionSubtitle}>
            Transforming how organizations understand and respond to human emotions
          </p>
        </div>
        <div className={styles.capabilitiesGrid}>
          {/* Capability Cards */}
          { [
            {
              icon: "📈",
              title: "Detect & Analyze Emotions",
              desc: "Identify emotional states across multiple modalities with precision and contextual understanding."
            },
            {
              icon: "🔄",
              title: "Track Trends & Patterns",
              desc: "Monitor emotional patterns over time to identify triggers, improvements, and intervention opportunities."
            },
            {
              icon: "🎯",
              title: "Provide Actionable Insights",
              desc: "Transform raw emotional data into practical recommendations for individuals and organizations."
            },
            {
              icon: "🔌",
              title: "Seamless Integration",
              desc: "Connect with existing enterprise systems through flexible APIs and custom integration options."
            },
            {
              icon: "⚡",
              title: "Proactive Intervention",
              desc: "Identify at-risk individuals and situations before they escalate with early warning systems."
            },
            {
              icon: "🌱",
              title: "Foster Engagement",
              desc: "Create environments that promote psychological safety, resilience, and well-being."
            }
          ].map((item) => (
            <div className={styles.capabilityCard} key={item.title}>
              <div className={styles.capabilityIcon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
