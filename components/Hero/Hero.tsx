"use client";

import { useRef, useState } from "react";
import styles from "./Hero.module.css";
import { SECTION_IDS } from "@/lib/constants";
import useScrollTimeline from "@/hooks/useScrollTimeline";

import AtmosphericEffects from "./AtmosphericEffects";
import KatakanaLayer from "./KatakanaLayer";
import { PortraitBackgroundLayer, PortraitForegroundLayer } from "./PortraitLayer";
import EnglishNameLayer from "./EnglishNameLayer";
import HorizonLine from "./HorizonLine";
import ActVIIContent from "./ActVIIContent";
import ParticleCanvas from "./ParticleCanvas";
import Loader from "./Loader";

/**
 * HERO — Main Container
 *
 * Architecture:
 * - Outer section (#hero-container): 700vh tall scroll runway
 * - Inner div (#hero-pinned): 100vh sticky viewport
 * - All visual layers stacked absolutely inside the pinned viewport
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const atmosphericRef = useRef<HTMLDivElement>(null);
  const bgTextureRef = useRef<HTMLDivElement>(null);
  const katakanaRef = useRef<HTMLDivElement>(null);
  
  // Loader status state
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Scroll progress ref to feed the particle canvas
  const scrollProgressRef = useRef(0);

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
    bgTextureRef,
    scrollProgressRef,
    isLoaded,
  });

  return (
    <>
      {/* Cinematic Loader Screen */}
      <Loader onComplete={() => setIsLoaded(true)} />

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
          <AtmosphericEffects layerRef={atmosphericRef} textureRef={bgTextureRef} />

          {/* LAYER 2: Particle Canvas */}
          <ParticleCanvas scrollProgressRef={scrollProgressRef} isLoaded={isLoaded} />

          {/* LAYER 3: Portrait Background (red background + silhouette behind text) */}
          <PortraitBackgroundLayer
            portraitRef={portraitBgRef}
            portraitImgRef={portraitBgImgRef}
            isLoaded={isLoaded}
          />

          {/* LAYER 4: Katakana Typography (hidden, rendered in Canvas) */}
          <KatakanaLayer layerRef={katakanaRef} />

          {/* LAYER 5: English Name (hidden in Act I) */}
          <EnglishNameLayer nameRef={englishNameRef} subtitleRef={subtitleRef} />

          {/* LAYER 6: Portrait Foreground (silhouette only, in front of text) */}
          <PortraitForegroundLayer
            portraitRef={portraitFgRef}
            portraitImgRef={portraitFgImgRef}
            portraitCornerImgRef={portraitCornerImgRef}
            isLoaded={isLoaded}
          />

          {/* LAYER 8: Horizon Line (hidden in Act I) */}
          <HorizonLine lineRef={horizonLineRef} />

          {/* LAYER 9: Act VII Content (hidden in Act I) */}
          <ActVIIContent contentRef={actVIIContentRef} />
        </div>
      </section>
    </>
  );
}
