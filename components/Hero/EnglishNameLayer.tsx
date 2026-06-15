"use client";

import { useRef } from "react";
import styles from "./Hero.module.css";
import { HERO } from "@/lib/constants";

/**
 * LAYER 5 — English Name + LAYER 6 — Subtitle
 *
 * Renders "MUKUL" in Cormorant Garamond Bold Italic
 * and "Developer. Designer. Storyteller." as subtitle.
 *
 * Both start at opacity: 0 (hidden in Acts I–V).
 *
 * Phase 2 will animate:
 * - Name: opacity 0 → 1, letter-spacing 0.15em → 0.08em (Act VI snap)
 * - Name: repositions to header scale in Act VII
 * - Subtitle: time-driven fade-in triggered at 84% scroll
 */
interface EnglishNameLayerProps {
  nameRef: React.RefObject<HTMLDivElement | null>;
  subtitleRef: React.RefObject<HTMLDivElement | null>;
}

export default function EnglishNameLayer({
  nameRef,
  subtitleRef,
}: EnglishNameLayerProps) {
  return (
    <>
      {/* LAYER 5 — The Name */}
      <div ref={nameRef} className={styles.englishNameLayer}>
        <h1 className={styles.englishName} aria-label="Mukul">
          MUKUL
        </h1>
      </div>

      {/* LAYER 6 — The Subtitle */}
      <div ref={subtitleRef} className={styles.subtitleLayer}>
        <p className={styles.subtitle}>
          {HERO.englishName.subtitle}
        </p>
      </div>
    </>
  );
}

