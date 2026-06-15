"use client";

import { useRef } from "react";
import styles from "./Hero.module.css";

/**
 * LAYER 7 — Horizon Line
 *
 * A thin horizontal line that extends across the viewport center.
 * Represents the threshold between journey and destination (Act V).
 *
 * Initial state: width 0%, opacity 0 (invisible).
 *
 * Phase 2 will animate:
 * - width: 0% → 100% (linear, Act V)
 * - opacity: 0 → 0.15 (Act V)
 * - opacity: 0.15 → 0 (fades at Act VI, 0.84)
 */
interface HorizonLineProps {
  lineRef: React.RefObject<HTMLDivElement | null>;
}

export default function HorizonLine({ lineRef }: HorizonLineProps) {
  return (
    <div className={styles.horizonLineLayer} aria-hidden="true">
      <div ref={lineRef} className={styles.horizonLine} />
    </div>
  );
}
