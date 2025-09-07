import React from "react";
import styles from "./mindmate-landing.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContainer}>
        <div className={styles.footerCta}>
          <h3>Ready to Transform Emotional Intelligence?</h3>
          <p className={styles.sectionSubtitle}>Join thousands of organizations using MindMate to create healthier, more empathetic environments.</p>
          <div className={styles.heroButtons}>
            <a href="#" className={styles.btnPrimary}>Get Started Today</a>
            <a href="#" className={styles.btnSecondary}>Contact Sales</a>
          </div>
        </div>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h4>Product</h4>
            <div className={styles.footerLinks}>
              <a href="#use-cases">Use Cases</a>
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <a href="#">Pricing</a>
              <a href="#">API</a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <div className={styles.footerLinks}>
              <a href="#">Documentation</a>
              <a href="#">Case Studies</a>
              <a href="#">Blog</a>
              <a href="#">Webinars</a>
              <a href="#">White Papers</a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <div className={styles.footerLinks}>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Partners</a>
              <a href="#">Press</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <div className={styles.footerLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
              <a href="#">Compliance</a>
              <a href="#">GDPR</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 MindMate. All rights reserved. The future of emotional intelligence is here.</p>
        </div>
      </div>
    </footer>
  );
}
