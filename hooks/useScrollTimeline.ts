"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO, COLORS, EASING } from "@/lib/constants";

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
  bgTextureRef: React.RefObject<HTMLDivElement | null>;
  scrollProgressRef: React.MutableRefObject<number>;
  isLoaded: boolean;
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
  bgTextureRef,
  scrollProgressRef,
  isLoaded,
 }: ScrollTimelineParams) {
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

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
    const bgTexture = bgTextureRef.current;

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
      !bgTexture
    ) {
      return;
    }

    const katakanaChars = gsap.utils.toArray<HTMLSpanElement>(
      katakana.querySelectorAll("span")
    );

    const nameHeading = englishName.querySelector("h1");
    const nameCenterChar = englishName.querySelector("h1 span:nth-child(2)");

    // Initialize initial visual states
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
    gsap.set(bgTexture, { opacity: 0 });
    gsap.set(horizonLine, { width: "0%", opacity: 0 });
    gsap.set(pinned, {
      backgroundColor: COLORS.templeBlack,
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
    });
    masterTimelineRef.current = tl;

    const progressObj = { value: 0 };
    tl.to(progressObj, {
      value: 1,
      ease: "none",
      onUpdate: () => {
        scrollProgressRef.current = progressObj.value;
      },
      duration: 1.0,
    }, 0);

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: pinned,
      pinSpacing: false,
      scrub: HERO.scrubSmoothing,
      animation: tl,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // Build scroll-bound timeline animations (Acts I-V)
    tl.to([portraitBg, portraitFg], {
      scale: 1.10,
      ease: EASING.scaleDecel,
      duration: 0.25,
    }, 0);

    tl.to(katakana, {
      opacity: HERO.katakana.peakOpacity,
      ease: EASING.gentle,
      duration: 0.30,
    }, 0.25);

    tl.to(katakana, {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
    }, 0.55);

    if (katakanaChars[0]) {
      tl.to(katakanaChars[0], { x: "-10vw", y: "12vh", filter: "blur(24px)", scale: 0.8, duration: 0.20, ease: "power2.in" }, 0.55);
    }
    if (katakanaChars[1]) {
      tl.to(katakanaChars[1], { x: "10vw", y: "12vh", filter: "blur(24px)", scale: 0.8, duration: 0.20, ease: "power2.in" }, 0.55);
    }

    tl.to([portraitBg, portraitFg], {
      scale: 1.05,
      y: 0,
      filter: "contrast(1.15) brightness(1.02)",
      ease: EASING.smooth,
      duration: 0.25,
    }, 0.55);

    tl.to(pinned, {
      backgroundColor: COLORS.burgundyBlack,
      duration: 0.25,
    }, 0.55);

    tl.fromTo(englishName, {
      opacity: 0,
      filter: "blur(24px)",
      scale: 0.95,
      y: "-20vh",
    }, {
      opacity: 0.3,
      filter: "blur(6px)",
      scale: 1.0,
      y: "-30vh",
      duration: 0.20,
    }, 0.60);

    tl.fromTo(horizonLine, {
      width: "0%",
      opacity: 0,
    }, {
      width: "100%",
      opacity: 0.15,
      duration: 0.10,
      ease: EASING.linear,
    }, 0.65);

    tl.to(englishName, {
      opacity: 1,
      y: "-30vh",
      filter: "blur(0px)",
      ease: EASING.snap,
      duration: 0.04,
    }, 0.78);

    tl.to([portraitBg, portraitFg], {
      scale: 1.05,
      y: 0,
      filter: "contrast(1.2) brightness(1.0)",
      ease: EASING.snap,
      duration: 0.05,
    }, 0.78);

    tl.to(pinned, {
      backgroundColor: COLORS.lacquer,
      duration: 0.08,
    }, 0.78);

    tl.to(horizonLine, {
      opacity: 0,
      duration: 0.04,
    }, 0.82);

    tl.fromTo(subtitle, {
      opacity: 0,
    }, {
      opacity: 1,
      ease: "power2.out",
      duration: 0.08,
    }, 0.83);

    tl.to(bgTexture, {
      opacity: 1,
      ease: "power2.out",
      duration: 0.12,
    }, 0.88);

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
    bgTextureRef,
    isLoaded,
  ]);

  return masterTimelineRef;
}
