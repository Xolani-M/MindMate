import React, { useEffect, useState, FC } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import UseCasesGrid from "./UseCasesGrid";
import IndustriesGrid from "./IndustriesGrid";
import CoreFeaturesAccordion from "./CoreFeaturesAccordion";
import CapabilitiesGrid from "./CapabilitiesGrid";
import InnovativeIdeasGrid from "./InnovativeIdeasGrid";
import NextStepsTimeline from "./NextStepsTimeline";
import DemoSection from "./DemoSection";
import FeaturesGrid from "./FeaturesGrid";
import Footer from "./Footer";
import styles from "./mindmate-landing.module.css";

const EmotionalParticles: FC = () => {
  const [particles, setParticles] = useState<React.ReactElement[]>([]);
  useEffect(() => {
    const emotions = ["happy", "calm", "focused"];
    function randomParticle(i: number) {
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 8;
      const delay = Math.random() * 5;
      return (
        <div
          key={i}
          className={`${styles.emotionParticle} ${styles["emotion" + emotion.charAt(0).toUpperCase() + emotion.slice(1)]}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s`,
          }}
        />
      );
    }
    setParticles(Array.from({ length: 30 }, (_, i) => randomParticle(i)));
  }, []);
  return <div className={styles.emotionalParticles}>{particles}</div>;
};

const MindMateLanding: FC = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        const targetId = target.getAttribute("href");
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId!);
        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: (targetElement as HTMLElement).getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth",
          });
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div>
      <div className={styles.bgAnimation}></div>
      <EmotionalParticles />
      <Navbar />
      <HeroSection />
      <UseCasesGrid />
      <IndustriesGrid />
      <CoreFeaturesAccordion />
      <CapabilitiesGrid />
      <InnovativeIdeasGrid />
      <NextStepsTimeline />
      <DemoSection />
      <FeaturesGrid />
      <Footer />
    </div>
  );
};

export default MindMateLanding;
