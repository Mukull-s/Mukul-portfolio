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
import ParticleCanvas from "./ParticleCanvas";
import Loader from "./Loader";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const atmosphericRef = useRef<HTMLDivElement>(null);
  const bgTextureRef = useRef<HTMLDivElement>(null);
  const katakanaRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  const portraitBgRef = useRef<HTMLDivElement>(null);
  const portraitBgImgRef = useRef<HTMLImageElement>(null);
  const portraitFgRef = useRef<HTMLDivElement>(null);
  const portraitFgImgRef = useRef<HTMLImageElement>(null);
  const portraitCornerImgRef = useRef<HTMLImageElement>(null);
  
  const englishNameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const horizonLineRef = useRef<HTMLDivElement>(null);

  const scrollProgressRef = useRef(0);

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
    bgTextureRef,
    scrollProgressRef,
    isLoaded,
  });

  return (
    <>
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
          {/* Main cinematic layout layers */}
          <AtmosphericEffects layerRef={atmosphericRef} textureRef={bgTextureRef} />
          <ParticleCanvas scrollProgressRef={scrollProgressRef} isLoaded={isLoaded} />
          <PortraitBackgroundLayer
            portraitRef={portraitBgRef}
            portraitImgRef={portraitBgImgRef}
            isLoaded={isLoaded}
          />
          <KatakanaLayer layerRef={katakanaRef} />
          <EnglishNameLayer nameRef={englishNameRef} subtitleRef={subtitleRef} />
          <PortraitForegroundLayer
            portraitRef={portraitFgRef}
            portraitImgRef={portraitFgImgRef}
            portraitCornerImgRef={portraitCornerImgRef}
            isLoaded={isLoaded}
          />
          <HorizonLine lineRef={horizonLineRef} />
        </div>
      </section>
    </>
  );
}
