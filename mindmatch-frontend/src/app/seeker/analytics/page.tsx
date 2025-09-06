"use client";
import React from "react";
import styles from "./AnalyticsComingSoon.module.css";
import SeekerNavBar from "@/components/SeekerNavBar";

export default function AnalyticsPage() {
  return (
    <>
      <SeekerNavBar />
      <div className={styles.container}>
        <svg className={styles.icon} width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#6366f1" opacity="0.15"/>
          <path d="M8 12h8M12 8v8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className={styles.title}>Coming Soon</div>
        <div className={styles.subtitle}>Analytics Dashboard</div>
        <div className={styles.description}>
          We&apos;re crafting a beautiful analytics experience for you.<br />
          Soon you&apos;ll be able to visualize your progress, discover insights, and track your journey with MindMate.
        </div>
      </div>
    </>
  );
}
