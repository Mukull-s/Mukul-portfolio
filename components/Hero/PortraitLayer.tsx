"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import styles from "./Hero.module.css";
import { HERO } from "@/lib/constants";

interface PortraitLayerProps {
  portraitRef: React.RefObject<HTMLDivElement | null>;
  portraitImgRef: React.RefObject<HTMLImageElement | null>;
  portraitCornerImgRef?: React.RefObject<HTMLImageElement | null>;
  isLoaded?: boolean;
}


export function PortraitBackgroundLayer({
  portraitRef,
  portraitImgRef,
  isLoaded = false,
}: PortraitLayerProps) {
  useEffect(() => {
    if (!portraitImgRef.current || !isLoaded) return;

    gsap.fromTo(
      portraitImgRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: HERO.portrait.fadeInDuration,
        delay: HERO.portrait.fadeInDelay,
        ease: "power2.out",
      }
    );
  }, [portraitImgRef, isLoaded]);

  return (
    <div ref={portraitRef} className={styles.portraitBgLayer} aria-hidden="true">
      <div className={styles.portraitWrapper}>
        <picture>
          <img
            ref={portraitImgRef}
            src="/Portrait.png"
            alt="Portrait Background"
            className={styles.portraitImage}
            width={1672}
            height={940}
            fetchPriority="high"
          />
        </picture>
      </div>
    </div>
  );
}

export function PortraitForegroundLayer({
  portraitRef,
  portraitImgRef,
  portraitCornerImgRef,
  isLoaded = false,
}: PortraitLayerProps) {
  useEffect(() => {
    if (!portraitImgRef.current || !isLoaded) return;

    gsap.fromTo(
      portraitImgRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: HERO.portrait.fadeInDuration,
        delay: HERO.portrait.fadeInDelay,
        ease: "power2.out",
      }
    );
  }, [portraitImgRef, isLoaded]);

  return (
    <div ref={portraitRef} className={styles.portraitFgLayer} aria-hidden="true">
      {/* SVG Mask Definition (keys out the red background and keeps the dark silhouette from high-quality Portrait.png) */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <defs>
          <filter id="invert-red-to-alpha">
            <feColorMatrix
              type="matrix"
              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                -2.5 0 0 0 1.2
              "
            />
          </filter>
          <mask id="silhouette-mask">
            <image
              href="/Portrait.png"
              width="100%"
              height="100%"
              filter="url(#invert-red-to-alpha)"
              preserveAspectRatio="xMidYMid slice"
            />
          </mask>
        </defs>
      </svg>

      {/* Main composition: high-quality silhouette overlay with SVG mask */}
      <div
        className={styles.portraitWrapper}
        style={{
          maskImage: "url(#silhouette-mask)",
          WebkitMaskImage: "url(#silhouette-mask)",
        }}
      >
        <picture>
          <img
            ref={portraitImgRef}
            src="/Portrait.png"
            alt="Portrait Foreground Silhouette"
            className={styles.portraitImage}
            width={1672}
            height={940}
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* Corner layout: pre-cut transparent PNG */}
      <div className={styles.portraitWrapper}>
        <picture>
          <img
            ref={portraitCornerImgRef}
            src="/Portrait-removebg-preview.png"
            alt="Portrait Foreground Corner Cutout"
            className={`${styles.portraitImage} ${styles.portraitCornerImage}`}
            width={666}
            height={374}
            fetchPriority="high"
            style={{ opacity: 0 }}
          />
        </picture>
      </div>
    </div>
  );
}


