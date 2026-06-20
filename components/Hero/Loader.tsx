"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Hero.module.css";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  if (typeof window !== "undefined") {
    (window as any).__loaderActive = true;
  }

  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // States for visual effects
  const [kanjiVisible, setKanjiVisible] = useState(false);
  const [grainSeed, setGrainSeed] = useState(0);

  // References for particles and progress
  const dustRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressObj = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Determine dynamic statement based on progress
  const getStatement = (value: number) => {
    if (value >= 100) return "The journey begins.";
    if (value >= 75) return "Systems become stories.";
    if (value >= 50) return "Structures become systems.";
    if (value >= 25) return "Ideas become structures.";
    return "Every system begins as an idea.";
  };

  // Scroll locking and keyboard tab-blocking
  useEffect(() => {
    if (isFadingOut) return;

    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }

    return () => {
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", handleKeyDown);
      
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.start();
      }
      (window as any).__loaderActive = false;
    };
  }, [isFadingOut]);

  // Asset preloading (include dragon background image)
  useEffect(() => {
    let fontsReady = false;
    let imagesReady = false;

    const checkAssetsReady = () => {
      if (fontsReady && imagesReady) {
        setAssetsLoaded(true);
      }
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready
        .then(() => {
          fontsReady = true;
          checkAssetsReady();
        })
        .catch(() => {
          fontsReady = true;
          checkAssetsReady();
        });
    } else {
      fontsReady = true;
      checkAssetsReady();
    }

    const imageList = [
      "/images/Dragon-background.png",
      "/Portrait.png",
      "/Portrait-removebg-preview.png",
      "/Bg.png"
    ];
    let loadedCount = 0;
    
    if (typeof window !== "undefined") {
      imageList.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === imageList.length) {
            imagesReady = true;
            checkAssetsReady();
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === imageList.length) {
            imagesReady = true;
            checkAssetsReady();
          }
        };
      });
    } else {
      imagesReady = true;
      checkAssetsReady();
    }
  }, []);

  // Slowly reveal the Kanji character 序 on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setKanjiVisible(true);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // Update animated SVG film grain seed on an 8 FPS cycle
  useEffect(() => {
    let frameId: number;
    let lastTime = 0;
    const fps = 8;
    const interval = 1000 / fps;

    const updateGrain = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > interval) {
        setGrainSeed((prev) => (prev + 1) % 100);
        lastTime = timestamp;
      }
      frameId = requestAnimationFrame(updateGrain);
    };

    frameId = requestAnimationFrame(updateGrain);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // GSAP Floating Dust Particles upward drift
  useEffect(() => {
    dustRefs.current.forEach((particle) => {
      if (!particle) return;

      const resetParticle = (p: HTMLDivElement) => {
        gsap.set(p, {
          x: gsap.utils.random(0, window.innerWidth),
          y: window.innerHeight + gsap.utils.random(10, 100),
          opacity: gsap.utils.random(0.12, 0.48),
          scale: gsap.utils.random(0.4, 1.2),
        });
      };

      // Set initial positions scattered across the screen height
      gsap.set(particle, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight),
        opacity: gsap.utils.random(0.12, 0.48),
        scale: gsap.utils.random(0.4, 1.2),
      });

      const anim = () => {
        gsap.to(particle, {
          y: -100,
          x: `+=${gsap.utils.random(-60, 60)}`,
          duration: gsap.utils.random(25, 45),
          ease: "none",
          onComplete: () => {
            resetParticle(particle);
            anim();
          },
        });
      };

      anim();
    });

    return () => {
      dustRefs.current.forEach((particle) => {
        if (particle) gsap.killTweensOf(particle);
      });
    };
  }, []);

  // Smooth progress count simulation using GSAP
  useEffect(() => {
    // Phase 1: Animate smoothly to 90% over 2.8 seconds
    tweenRef.current = gsap.to(progressObj.current, {
      value: 90,
      duration: 2.8,
      ease: "power1.out",
      onUpdate: () => {
        setProgress(progressObj.current.value);
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  // Phase 2: Once progress reaches at least 90% AND assets are fully preloaded, proceed to 100%
  useEffect(() => {
    if (progress >= 90 && assetsLoaded) {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      tweenRef.current = gsap.to(progressObj.current, {
        value: 100,
        duration: 1.2, // 1.2 seconds final stretch
        ease: "power2.out",
        onUpdate: () => {
          setProgress(progressObj.current.value);
        },
      });
    }
  }, [progress >= 90, assetsLoaded]);

  // Trigger fade-out immediately once progress is 100
  useEffect(() => {
    if (progress === 100) {
      setIsFadingOut(true);
      onComplete();

      const mountTimeout = setTimeout(() => {
        setIsMounted(false);
      }, 800); // 800ms CSS transition duration

      return () => {
        clearTimeout(mountTimeout);
      };
    }
  }, [progress, onComplete]);

  if (!isMounted) return null;

  const statement = getStatement(progress);

  return (
    <div
      className={styles.loaderScreen}
      style={{
        opacity: isFadingOut ? 0 : 1,
        visibility: isFadingOut ? "hidden" : "visible",
      }}
      aria-live="polite"
      aria-busy={progress < 100}
    >
      {/* Layer 1: Crimson Dragon Background */}
      <div className={styles.loaderBg} />

      {/* Layer 2: Dark atmospheric overlay */}
      <div className={`${styles.loaderOverlay} ${progress >= 100 ? styles.darken : ""}`} />

      {/* Layer 3: Animated film grain */}
      <div className={styles.grainLayer}>
        <svg className={styles.grainSvg}>
          <filter id="loader-grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.80"
              numOctaves={3}
              stitchTiles="stitch"
              seed={grainSeed}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className={styles.grainTexture} />
      </div>

      {/* Layer 4: Floating dust particles */}
      <div className={styles.dustContainer}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={styles.dustParticle}
            ref={(el) => {
              dustRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* Loader Content */}
      <div className={styles.loaderContent}>
        {/* Japanese Character: 序 (Prelude) */}
        <div className={`${styles.loaderKanji} ${kanjiVisible ? styles.visible : ""}`}>
          序
        </div>

        {/* Progress Line: Thin editorial line */}
        <div className={styles.loaderLineWrapper}>
          <div
            className={styles.loaderLine}
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        {/* Progress Number */}
        <div className={styles.loaderText}>
          {Math.floor(progress)}%
        </div>

        {/* Dynamic Philosophy Statement */}
        <div
          key={statement}
          className={styles.loaderSubtext}
        >
          {statement}
        </div>
      </div>
    </div>
  );
}
