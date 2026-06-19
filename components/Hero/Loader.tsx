"use client";

import { useEffect, useState } from "react";
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

  // Scroll locking and keyboard interaction blocking
  useEffect(() => {
    if (isFadingOut) {
      // If we are fading out, clean up has already run/should run, so we do nothing
      return;
    }

    // 1. Apply scroll blocking classes
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    // 2. Prevent keyboard focus navigation to the background
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 3. If lenis is already initialized, stop it
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }

    return () => {
      // Cleanup: Restore scroll and interactivity
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

  // 1. Asset Preloading
  useEffect(() => {
    let fontsReady = false;
    let imagesReady = false;

    const checkAssetsReady = () => {
      if (fontsReady && imagesReady) {
        setAssetsLoaded(true);
      }
    };

    // Monitor Font loading
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

    // Preload critical images
    const imageList = ["/Portrait.png", "/Portrait-removebg-preview.png", "/Bg.png"];
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

  // 2. Progress Simulation Loop
  useEffect(() => {
    if (progress >= 100) return;

    const timer = setTimeout(() => {
      setProgress((prev) => {
        if (prev < 90) {
          const step = Math.floor(Math.random() * 4) + 1; // 1 to 4%
          return Math.min(prev + step, 90);
        } else if (assetsLoaded) {
          const step = Math.floor(Math.random() * 8) + 5; // 5 to 12%
          return Math.min(prev + step, 100);
        }
        return prev;
      });
    }, 45);

    return () => clearTimeout(timer);
  }, [progress, assetsLoaded]);

  // Handle completion sequence once progress is 100
  useEffect(() => {
    if (progress === 100) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
        // Let parent know to trigger reveals
        onComplete();
      }, 350);

      const mountTimeout = setTimeout(() => {
        setIsMounted(false);
      }, 1150); // fadeTimeout (350ms) + CSS transition (800ms)

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(mountTimeout);
      };
    }
  }, [progress, onComplete]);

  if (!isMounted) return null;

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
      <div className={styles.loaderContent}>
        <div className={styles.loaderText}>{Math.floor(progress)}%</div>
        <div className={styles.loaderBarWrapper}>
          <div
            className={styles.loaderBar}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.loaderSubtext}>INITIALIZING SYSTEM</div>
      </div>
    </div>
  );
}
