import React from "react";
import styles from "./mindmate-landing.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>MindMate</div>
        <ul className={styles.navLinks}>
          <li><a href="#use-cases">Use Cases</a></li>
          <li><a href="#industries">Industries</a></li>
          <li><a href="#core-features">Features</a></li>
          <li><a href="#innovative-ideas">Innovation</a></li>
          <li><a href="#next-steps">Roadmap</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="/auth/login" className={styles.navCta}>Sign In</a>
          <a href="/auth/seeker-signup" className={styles.navCta}>Sign Up</a>
        </div>
      </div>
    </nav>
  );
}
