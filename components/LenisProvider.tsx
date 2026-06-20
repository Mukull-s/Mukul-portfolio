"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS } from "@/lib/constants";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Prevent browser auto-scroll restoration on refresh
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    // Initialize Lenis with cinematic configuration
    const lenis = new Lenis({
      duration: LENIS.duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: LENIS.touchMultiplier,
    });

    // Share Lenis instance globally
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
      
      // If loader is active, freeze scrolling immediately
      if ((window as any).__loaderActive) {
        lenis.stop();
      }
    }

    // Force Lenis to start at 0, 0
    lenis.scrollTo(0, { immediate: true });

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    const updateGsap = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGsap);
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateGsap);
    };
  }, []);

  return <>{children}</>;
}
