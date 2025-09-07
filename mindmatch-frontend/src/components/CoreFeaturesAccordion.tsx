import React, { useState } from "react";
import styles from "./mindmate-landing.module.css";

const features = [
  {
    title: "Empathic Expression Measurement",
    content:
      "Real-time analysis of emotion-related behaviors—facial cues, vocal bursts, speech prosody, and language—grounded in emotion science. Our empathic AI adapts to cultural and individual differences in expressive patterns.",
  },
  {
    title: "Real-time Expression Analytics",
    content:
      "Process expressive data in real-time with pattern recognition, mood tracking, and actionable insights. Designed for immediate, context-aware support and intervention.",
  },
  {
    title: "Empathic Conversational AI",
    content:
      "Voice-to-voice and text-based AI that generates emotionally aware, supportive responses. Natural language processing with empathic intelligence for more human-like interactions.",
  },
  {
    title: "Enterprise Integration",
    content:
      "Seamless API integrations with HR platforms, EHR systems, CRM software, and learning management systems. Customizable to fit existing workflows and infrastructure.",
  },
  {
    title: "Security & Compliance",
    content:
      "End-to-end encryption, HIPAA and GDPR compliance, and enterprise-grade security protocols. Regular audits and transparency reports to ensure data privacy and ethical AI practices.",
  },
];

export default function CoreFeaturesAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className={styles.coreFeatures} id="core-features">
      <div className={styles.coreFeaturesContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>🛠️</span> Technical Foundation
          </div>
          <h2 className={styles.sectionTitle}>Core Features & Capabilities</h2>
          <p className={styles.sectionSubtitle}>
            Powered by advanced AI and designed for seamless integration across platforms
          </p>
        </div>
        <div className={styles.featuresAccordion}>
          {features.map((feature, idx) => (
            <div className={styles.accordionItem} key={feature.title}>
              <button
                className={styles.accordionHeader}
                aria-expanded={activeIndex === idx}
                aria-controls={`accordion-content-${idx}`}
                id={`accordion-header-${idx}`}
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                type="button"
              >
                <span>{feature.title}</span>
                <span className={
                  activeIndex === idx
                    ? `${styles.accordionIcon} ${styles.active}`
                    : styles.accordionIcon
                }>▼</span>
              </button>
              <section
                className={
                  activeIndex === idx
                    ? `${styles.accordionContent} ${styles.active}`
                    : styles.accordionContent
                }
                id={`accordion-content-${idx}`}
                aria-labelledby={`accordion-header-${idx}`}
                aria-label={feature.title + " Content"}
              >
                <p>{feature.content}</p>
              </section>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
