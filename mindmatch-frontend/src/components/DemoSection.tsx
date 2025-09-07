import React from "react";
import styles from "./mindmate-landing.module.css";

export default function DemoSection() {
  return (
    <section className={styles.demoSection} id="demo">
      <div className={styles.demoContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.emoji}>🔍</span> Live Demonstration
          </div>
          <h2 className={styles.sectionTitle}>See MindMate in Action</h2>
          <p className={styles.sectionSubtitle}>
            Experience how our emotion analytics transform human understanding in real-time
          </p>
        </div>
        <div className={styles.demoVisual}>
          <div className={styles.emotionNetwork}>
            <div className={`${styles.emotionNode} ${styles.emotionHappyNode}`}>😊</div>
            <div className={`${styles.emotionNode} ${styles.emotionSadNode}`}>😢</div>
            <div className={`${styles.emotionNode} ${styles.emotionAngryNode}`}>😠</div>
            <div className={`${styles.emotionNode} ${styles.emotionCalmNode}`}>😌</div>
            <div className={`${styles.emotionNode} ${styles.emotionExcitedNode}`}>🤩</div>
            <div className={`${styles.emotionNode} ${styles.emotionFocusedNode}`}>🧠</div>
            <div className={styles.connectionLine} style={{top: "70px", left: "110px", width: "180px", transform: "rotate(30deg)", animationDelay: "0s"}}></div>
            <div className={styles.connectionLine} style={{top: "170px", left: "70px", width: "220px", transform: "rotate(-20deg)", animationDelay: "0.5s"}}></div>
            <div className={styles.connectionLine} style={{top: "270px", left: "140px", width: "160px", transform: "rotate(10deg)", animationDelay: "1s"}}></div>
            <div className={styles.connectionLine} style={{top: "100px", right: "110px", width: "200px", transform: "rotate(-15deg)", animationDelay: "1.5s"}}></div>
            <div className={styles.connectionLine} style={{top: "200px", right: "80px", width: "180px", transform: "rotate(25deg)", animationDelay: "2s"}}></div>
            <div className={styles.connectionLine} style={{bottom: "100px", right: "170px", width: "140px", transform: "rotate(-30deg)", animationDelay: "2.5s"}}></div>
          </div>
        </div>
        <div className={styles.heroButtons}>
          <a href="#" className={styles.btnPrimary}>Request Personalized Demo</a>
          <a href="#" className={styles.btnSecondary}>View Case Studies</a>
        </div>
      </div>
    </section>
  );
}
