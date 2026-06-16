"use client";

import { useRef } from "react";
import styles from "./Hero.module.css";

interface AtmosphericEffectsProps {
  layerRef: React.RefObject<HTMLDivElement | null>;
  textureRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * LAYER 0 — Background + Vignette
 *
 * Renders the crimson vignette via CSS ::before pseudo-element.
 * CSS custom properties (--vig-alpha, --vig-radius, etc.) are
 * registered as @property in globals.css for GPU-accelerated animation.
 *
 * Phase 2 will connect GSAP to animate these properties via the
 * hero-pinned container's style attribute.
 */
export default function AtmosphericEffects({
  layerRef,
  textureRef,
}: AtmosphericEffectsProps) {
  return (
    <div
      ref={layerRef}
      className={styles.atmosphericLayer}
      aria-hidden="true"
    >
      <div
        ref={textureRef}
        className={styles.bgTexture}
        style={{ opacity: 0 }}
      />
    </div>
  );
}
