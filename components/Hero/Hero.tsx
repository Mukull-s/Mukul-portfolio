"use client";

import { useRef } from "react";
import styles from "./Hero.module.css";
import { SECTION_IDS } from "@/lib/constants";
import useScrollTimeline from "@/hooks/useScrollTimeline";

import AtmosphericEffects from "./AtmosphericEffects";
import KatakanaLayer from "./KatakanaLayer";
import { PortraitBackgroundLayer, PortraitForegroundLayer } from "./PortraitLayer";
import EnglishNameLayer from "./EnglishNameLayer";
import HorizonLine from "./HorizonLine";
import ActVIIContent from "./ActVIIContent";

/**
 * HERO — Main Container
 *
 * Architecture:
 * - Outer section (#hero-container): 700vh tall scroll runway
 * - Inner div (#hero-pinned): 100vh sticky viewport
 * - All visual layers stacked absolutely inside the pinned viewport
 *
 * Stacking context (back to front):
 *   0  — Background + Vignette (AtmosphericEffects)
 *   2  — Three.js Canvas (Phase 3)
 *   3  — Portrait Background Layer (red background + silhouette behind text)
 *   4  — Katakana Typography (KatakanaLayer)
 *   5  — English Name (EnglishNameLayer)
 *   6  — Portrait Foreground Layer (silhouette cutout on top of text)
 *   7  — Subtitle
 *   8  — Horizon Line
 *   9  — Act VII Content
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const atmosphericRef = useRef<HTMLDivElement>(null);
  const katakanaRef = useRef<HTMLDivElement>(null);
  
  // Split portrait layers
  const portraitBgRef = useRef<HTMLDivElement>(null);
  const portraitBgImgRef = useRef<HTMLImageElement>(null);
  const portraitFgRef = useRef<HTMLDivElement>(null);
  const portraitFgImgRef = useRef<HTMLImageElement>(null);
  const portraitCornerImgRef = useRef<HTMLImageElement>(null);
  
  const englishNameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const horizonLineRef = useRef<HTMLDivElement>(null);
  const actVIIContentRef = useRef<HTMLDivElement>(null);

  // Bind the master scroll timeline hook
  useScrollTimeline({
    containerRef,
    pinnedRef,
    portraitBgRef,
    portraitBgImgRef,
    portraitFgRef,
    portraitFgImgRef,
    portraitCornerImgRef,
    katakanaRef,
    englishNameRef,
    subtitleRef,
    horizonLineRef,
    actVIIContentRef,
  });

  return (
    <section
      ref={containerRef}
      id={SECTION_IDS.hero}
      className={styles.heroContainer}
    >
      <div
        ref={pinnedRef}
        id={SECTION_IDS.heroPinned}
        className={styles.heroPinned}
      >
        {/* LAYER 0: Background + Vignette */}
        <AtmosphericEffects layerRef={atmosphericRef} />

        {/* LAYER 2: Three.js Canvas — Phase 3 placeholder */}
        <div className={styles.canvasLayer} aria-hidden="true" />

        {/* LAYER 3: Portrait Background (red background + silhouette behind text) */}
        <PortraitBackgroundLayer
          portraitRef={portraitBgRef}
          portraitImgRef={portraitBgImgRef}
        />

        {/* LAYER 4: Katakana Typography (hidden in Act I) */}
        <KatakanaLayer layerRef={katakanaRef} />

        {/* LAYER 5: English Name (hidden in Act I) */}
        <EnglishNameLayer nameRef={englishNameRef} subtitleRef={subtitleRef} />

        {/* LAYER 6: Portrait Foreground (silhouette only, in front of text) */}
        <PortraitForegroundLayer
          portraitRef={portraitFgRef}
          portraitImgRef={portraitFgImgRef}
          portraitCornerImgRef={portraitCornerImgRef}
        />


        {/* LAYER 8: Horizon Line (hidden in Act I) */}
        <HorizonLine lineRef={horizonLineRef} />

        {/* LAYER 9: Act VII Content (hidden in Act I) */}
        <ActVIIContent contentRef={actVIIContentRef} />
      </div>
    </section>
  );
}
