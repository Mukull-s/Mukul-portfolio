"use client";

import styles from "./Sections.module.css";

export default function Threshold() {
  return (
    <section id="threshold" className={styles.thresholdSection}>
      <div className={styles.thresholdContent}>
        <p className={styles.thresholdText}>The story begins here.</p>
        <div className={styles.chevronWrapper}>
          <svg
            className={styles.breathingChevron}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
