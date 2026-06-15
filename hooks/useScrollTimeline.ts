"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO, COLORS, EASING } from "@/lib/constants";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ScrollTimelineParams {
  containerRef: React.RefObject<HTMLElement | null>;
  pinnedRef: React.RefObject<HTMLDivElement | null>;
  portraitBgRef: React.RefObject<HTMLDivElement | null>;
  portraitBgImgRef: React.RefObject<HTMLImageElement | null>;
  portraitFgRef: React.RefObject<HTMLDivElement | null>;
  portraitFgImgRef: React.RefObject<HTMLImageElement | null>;
  portraitCornerImgRef: React.RefObject<HTMLImageElement | null>;
  katakanaRef: React.RefObject<HTMLDivElement | null>;
  englishNameRef: React.RefObject<HTMLDivElement | null>;
  subtitleRef: React.RefObject<HTMLDivElement | null>;
  horizonLineRef: React.RefObject<HTMLDivElement | null>;
  actVIIContentRef: React.RefObject<HTMLDivElement | null>;
}

export default function useScrollTimeline({
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
 }: ScrollTimelineParams) {
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pinned = pinnedRef.current;
    const portraitBg = portraitBgRef.current;
    const portraitBgImg = portraitBgImgRef.current;
    const portraitFg = portraitFgRef.current;
    const portraitFgImg = portraitFgImgRef.current;
    const portraitCornerImg = portraitCornerImgRef.current;
    const katakana = katakanaRef.current;
    const englishName = englishNameRef.current;
    const subtitle = subtitleRef.current;
    const horizonLine = horizonLineRef.current;
    const actVIIContent = actVIIContentRef.current;

    // Guard against unmounted elements
    if (
      !container ||
      !pinned ||
      !portraitBg ||
      !portraitBgImg ||
      !portraitFg ||
      !portraitFgImg ||
      !portraitCornerImg ||
      !katakana ||
      !englishName ||
      !subtitle ||
      !horizonLine ||
      !actVIIContent
    ) {
      return;
    }


    // Query inner elements for staggered reveals and layout updates
    const katakanaChars = gsap.utils.toArray<HTMLSpanElement>(
      katakana.querySelectorAll("span")
    );
    const navItems = gsap.utils.toArray<HTMLButtonElement>(
      actVIIContent.querySelectorAll("button")
    );
    const bioText = actVIIContent.querySelector("p");

    // English name sub-spans for split gap animation
    const nameHeading = englishName.querySelector("h1");
    const nameCenterChar = englishName.querySelector("h1 span:nth-child(2)");

    // Initialize starting states (Act I Presence)
    gsap.set(portraitBg, { opacity: 1 });
    gsap.set(portraitFg, { opacity: 1 });
    gsap.set([portraitBg, portraitFg], { scale: 1.0, y: 0, x: 0, filter: "contrast(1) brightness(1) saturate(1)" });
    gsap.set(portraitCornerImg, { opacity: 0 });
    gsap.set(katakana, { opacity: 0, y: 0 });
    katakanaChars.forEach((char) => gsap.set(char, { filter: "blur(0px)", x: 0, y: 0 }));
    
    gsap.set(englishName, { opacity: 0, scale: 1, x: 0, y: 0, filter: "blur(0px)" });
    if (nameHeading) gsap.set(nameHeading, { gap: "35vw" });
    if (nameCenterChar) gsap.set(nameCenterChar, { opacity: 0, width: 0 });
    
    gsap.set(subtitle, { opacity: 0, scale: 1, x: 0, y: 0 });
    gsap.set(horizonLine, { width: "0%", opacity: 0 });
    gsap.set(actVIIContent, { opacity: 0, y: 40 });
    gsap.set(pinned, {
      backgroundColor: COLORS.templeBlack,
    });

    // Create the master scrub timeline (total normalized duration: 1.0)
    const tl = gsap.timeline({
      defaults: { ease: "none" }, // ScrollTrigger drives interpolation linearly
    });
    masterTimelineRef.current = tl;

    // ScrollTrigger pinning and timeline linkage
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: pinned,
      pinSpacing: false, // Explicit 700vh runway
      scrub: HERO.scrubSmoothing, // 1s smoothing lag for cinematic feel
      animation: tl,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    // =========================================================================
    // 1. Act I: The Presence (0.00 -> 0.25 scroll)
    // =========================================================================
    // Portrait dominates center; scales up slightly for dollied push-in
    tl.to([portraitBg, portraitFg], {
      scale: 1.10,
      ease: EASING.scaleDecel,
      duration: 0.25,
    }, 0);

    // =========================================================================
    // 2. Act II: Calligraphy Integration (0.25 -> 0.55 scroll)
    // =========================================================================
    // Monumental Katakana characters surface and overlap/blend with portrait
    tl.to(katakana, {
      opacity: HERO.katakana.peakOpacity, // 0.85
      ease: EASING.gentle,
      duration: 0.30,
    }, 0.25);

    // =========================================================================
    // 3. Act III: Metamorphosis & Flow (0.55 -> 0.80 scroll)
    // =========================================================================
    // Calligraphy disintegrates organically (blur + gravity sink + edge spread)
    tl.to(katakana, {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
    }, 0.55);

    // Dissolve individual characters by scattering their paths under gravity (ash-like fragments)
    if (katakanaChars[0]) {
      tl.to(katakanaChars[0], { x: "-10vw", y: "12vh", filter: "blur(24px)", scale: 0.8, duration: 0.20, ease: "power2.in" }, 0.55);
    }
    if (katakanaChars[1]) {
      tl.to(katakanaChars[1], { x: "10vw", y: "12vh", filter: "blur(24px)", scale: 0.8, duration: 0.20, ease: "power2.in" }, 0.55);
    }

    // Portrait remains centered and majestic (scale 1.05, no vertical offset)
    tl.to([portraitBg, portraitFg], {
      scale: 1.05,
      y: 0,
      filter: "contrast(1.15) brightness(1.02)",
      ease: EASING.smooth,
      duration: 0.25,
    }, 0.55);

    // Background warms to deep burgundy-black
    tl.to(pinned, {
      backgroundColor: COLORS.burgundyBlack,
      duration: 0.25,
    }, 0.55);

    // Coalescing: English Name materializes as a soft blurred shape directly in the flow
    tl.fromTo(englishName, {
      opacity: 0,
      filter: "blur(24px)",
      scale: 0.95,
    }, {
      opacity: 0.3,
      filter: "blur(6px)",
      scale: 1.0,
      duration: 0.20,
    }, 0.60);

    // Stillness (Ma) horizon line draws at bottom-center of the emerging name (0.65 -> 0.75)
    tl.fromTo(horizonLine, {
      width: "0%",
      opacity: 0,
    }, {
      width: "100%",
      opacity: 0.15,
      duration: 0.10,
      ease: EASING.linear,
    }, 0.65);

    // =========================================================================
    // 4. Act IV: The Snap Reveal (0.80 -> 0.90 scroll)
    // =========================================================================
    // The primary payoff: English Name snaps decisively to crisp focus
    tl.to(englishName, {
      opacity: 1,
      filter: "blur(0px)",
      ease: EASING.snap,
      duration: 0.04, // Very short span
    }, 0.78);

    // Portrait remains centered and majestic at the snap reveal (scale 1.05, no vertical offset)
    tl.to([portraitBg, portraitFg], {
      scale: 1.05,
      y: 0,
      filter: "contrast(1.2) brightness(1.0)",
      ease: EASING.snap,
      duration: 0.05,
    }, 0.78);

    // Background reaches Lacquer
    tl.to(pinned, {
      backgroundColor: COLORS.lacquer,
      duration: 0.08,
    }, 0.78);

    // Horizon line fades out
    tl.to(horizonLine, {
      opacity: 0,
      duration: 0.04,
    }, 0.82);

    // Subtitle fades in after name is revealed (spawns after some time)
    tl.fromTo(subtitle, {
      opacity: 0,
      y: 15,
    }, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 0.08,
    }, 0.83);

    // =========================================================================
    // 5. Act V: The World Opens (0.93 -> 1.00 scroll)
    // =========================================================================
    // Portrait shrinks and slides to left side for navigation layout
    tl.to([portraitBg, portraitFg], {
      scale: HERO.portrait.cornerScale, // 0.35
      x: "-30vw",
      y: "-15vh",
      ease: EASING.smooth,
      duration: 0.07,
    }, 0.93);

    // Fade out the portrait background image and center silhouette, fade in the corner cutout
    tl.to(portraitBg, {
      opacity: 0,
      ease: EASING.smooth,
      duration: 0.07,
    }, 0.93);

    tl.to(portraitFgImg, {
      opacity: 0,
      ease: EASING.smooth,
      duration: 0.07,
    }, 0.93);

    tl.to(portraitCornerImg, {
      opacity: 1,
      ease: EASING.smooth,
      duration: 0.07,
    }, 0.93);

    tl.to(englishName, {
      scale: 0.35,
      x: "-26vw",
      y: "-40vh",
      ease: EASING.smooth,
      duration: 0.07,
    }, 0.93);

    // Subtitle shrinks and moves underneath the name header
    tl.to(subtitle, {
      scale: 0.85,
      x: "-26vw",
      y: "-36.5vh",
      ease: EASING.smooth,
      duration: 0.07,
    }, 0.93);

    // Biography panel and vertical nav chapters fade in
    tl.to(actVIIContent, {
      opacity: 1,
      y: 0,
      duration: 0.07,
    }, 0.93);

    if (bioText) {
      tl.fromTo(bioText, {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.05,
      }, 0.95);
    }

    if (navItems.length > 0) {
      tl.fromTo(navItems, {
        opacity: 0,
        x: -15,
      }, {
        opacity: 1,
        x: 0,
        stagger: 0.008,
        ease: "power2.out",
        duration: 0.05,
      }, 0.95);
    }

    // Cleanup on unmount
    return () => {
      st.kill();
      tl.kill();
    };
  }, [
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
  ]);

  return masterTimelineRef;
}
