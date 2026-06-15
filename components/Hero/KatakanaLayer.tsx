"use client";

import { useRef } from "react";
import styles from "./Hero.module.css";
import { HERO } from "@/lib/constants";

interface KatakanaLayerProps {
  layerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * LAYER 3 — Katakana Typography
 *
 * Renders ム ク ル in Yuji Syuku at massive scale.
 * Initial state: opacity 0 (invisible in Act I).
 *
 * Phase 2 will animate:
 * - opacity: 0 → 0.05 (ghost traces, Act II)
 * - opacity: 0.05 → 0.85 (full manifestation, Act III)
 * - color: Temple Black → Washi (stone grey)
 * - opacity: 0.85 → 0 (dissolution, Act IV)
 *
 * Mobile: characters stack vertically (kakejiku scroll arrangement).
 */
export default function KatakanaLayer({ layerRef }: KatakanaLayerProps) {
  return (
    <div
      ref={layerRef}
      className={styles.katakanaLayer}
      aria-hidden="true"
    >
      <div className={styles.katakanaWrapper}>
        <span className={styles.katakanaChar}>ム</span>
        <span className={styles.katakanaChar}>ル</span>
      </div>
    </div>
  );
}
