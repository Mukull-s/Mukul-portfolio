"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SakuraCanvas from "@/components/SakuraCanvas";
import Navbar from "@/components/Navbar";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const japaneseNameRef = useRef<HTMLDivElement>(null);
  const englishNameRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const hankoRef = useRef<HTMLDivElement>(null);

  // About/Story section refs
  const storySectionRef = useRef<HTMLDivElement>(null);
  const storyTitleRef = useRef<HTMLHeadingElement>(null);
  const storyBodyRef = useRef<HTMLDivElement>(null);
  const disciplinesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ----------------------------------------------------
    // 1. PAGE LOAD / INTRO ANIMATION
    // ----------------------------------------------------
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Clear initial states to prevent flash
      gsap.set([japaneseNameRef.current, englishNameRef.current], {
        opacity: 0,
        filter: "blur(15px)",
      });
      gsap.set(imageContainerRef.current, {
        opacity: 0,
        y: 60,
        rotateX: 18,
        rotateY: -12,
        scale: 0.9,
      });
      gsap.set(hankoRef.current, {
        opacity: 0,
        scale: 3,
        rotate: -30,
      });
      gsap.set(heroContentRef.current, {
        opacity: 0,
        y: 30,
      });
      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: 10,
      });

      // Intro sequence
      tl.to(japaneseNameRef.current, {
        opacity: 0.15,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "power3.out",
      })
        .to(
          imageContainerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.6,
            ease: "power4.out",
          },
          "-=1.2"
        )
        .to(
          hankoRef.current,
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          "-=0.8"
        )
        .to(
          heroContentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 0.5,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // ----------------------------------------------------
      // 2. HERO PIN & SCROLL ANIMATIONS (3D Tilt & Name Morph)
      // ----------------------------------------------------
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Name Morph: Japanese fades/blurs out, English fades/unblurs in
      heroScrollTl
        .to(
          japaneseNameRef.current,
          {
            opacity: 0,
            filter: "blur(25px)",
            scale: 1.1,
            duration: 0.5,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          englishNameRef.current,
          {
            opacity: 0.08,
            filter: "blur(0px)",
            letterSpacing: "0.2em",
            scale: 1.05,
            duration: 0.6,
            ease: "power2.inOut",
          },
          0.1
        )
        // 3D Image Scroll: straightens, zooms slightly, and moves forward
        .to(
          imageContainerRef.current,
          {
            rotateX: 0,
            rotateY: 0,
            scale: 1.05,
            z: 40,
            duration: 1,
            ease: "power1.inOut",
          },
          0
        )
        // Parallax scroll on the actual image within its frame
        .to(
          imageRef.current,
          {
            yPercent: 8,
            duration: 1,
            ease: "none",
          },
          0
        )
        // Fade out overlay texts as we scroll down
        .to(
          [heroContentRef.current, scrollIndicatorRef.current, hankoRef.current],
          {
            opacity: 0,
            y: -50,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
          },
          0
        );

      // ----------------------------------------------------
      // 3. STORY SECTION ANIMATION
      // ----------------------------------------------------
      gsap.fromTo(
        storyTitleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        storyBodyRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: storyBodyRef.current,
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        disciplinesRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          scrollTrigger: {
            trigger: disciplinesRef.current,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-ink text-ivory overflow-x-hidden min-h-screen">
      {/* Falling Sakura Canvas (particle overlay) */}
      <SakuraCanvas />

      {/* Global Navigation */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden perspective-1200"
      >
        {/* Background Name: Japanese Calligraphy (Starts visible, fades on scroll) */}
        <div
          ref={japaneseNameRef}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none"
          style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "MS Mincho", serif' }}
        >
          <span className="text-[16vw] md:text-[14vw] font-bold text-ivory tracking-[0.2em] opacity-0 transition-opacity duration-300">
            ムクル
          </span>
        </div>

        {/* Background Name: English Typography (Reveals on scroll) */}
        <div
          ref={englishNameRef}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none font-display"
        >
          <span className="text-[16vw] md:text-[14vw] font-extrabold text-ivory tracking-[0.8em] opacity-0">
            MUKUL
          </span>
        </div>

        {/* 3D Framed Hero Image Container */}
        <div className="relative z-10 flex flex-col items-center justify-center preserve-3d">
          <div
            ref={imageContainerRef}
            className="relative w-[75vw] max-w-[320px] md:max-w-[380px] aspect-[3/4] rounded-sm overflow-hidden bg-charcoal border border-gold/25 p-2 shadow-2xl preserve-3d"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Elegant Inner Frame */}
            <div className="relative w-full h-full overflow-hidden border border-outline/30 rounded-[1px]">
              <Image
                ref={imageRef}
                src="/Hero.jpg"
                alt="Mukul"
                fill
                priority
                sizes="(max-width: 768px) 75vw, (max-width: 1200px) 40vw, 380px"
                className="object-cover scale-110"
                style={{ willChange: "transform" }}
              />
              {/* Rice-paper gradient tint for photographic styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Hanko Seal / Signature Stamp */}
            <div
              ref={hankoRef}
              className="absolute -bottom-4 -right-4 z-20 w-14 h-14 md:w-16 md:h-16 seal opacity-0 shadow-lg"
              id="hanko-stamp"
            >
              <span
                className="text-white text-[10px] md:text-[11px] font-bold tracking-tighter leading-none select-none text-center transform -rotate-6"
                style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "MS Mincho", serif' }}
              >
                牟久
                <br />
                留印
              </span>
            </div>
          </div>
        </div>

        {/* Hero Text Overlays */}
        <div
          ref={heroContentRef}
          className="absolute bottom-20 z-20 text-center flex flex-col items-center px-4"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold mb-2 block">
            Crafting Digital Experiences
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-light tracking-wide text-ivory">
            Mukul Singhal
          </h1>
          <p className="text-xs md:text-sm font-body text-ash mt-3 max-w-[280px] md:max-w-[400px] leading-relaxed">
            Building autonomous systems and full-stack software with the precision of traditional craftsmanship.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 z-20 flex flex-col items-center opacity-0 pointer-events-none"
        >
          <span className="text-[9px] tracking-[0.3em] font-mono text-ash uppercase mb-1">
            Scroll to Enter
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-ash to-transparent animate-pulse" />
        </div>
      </section>

      {/* ================= STORY / NARRATIVE SECTION ================= */}
      <section
        id="story"
        ref={storySectionRef}
        className="relative min-h-screen py-24 px-6 md:px-24 flex flex-col justify-center bg-surface-card border-t border-outline-faint z-10"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Watermark / Accent column */}
          <div className="hidden md:flex md:col-span-4 justify-center relative select-none">
            <span
              className="text-[18vw] font-bold text-outline-faint opacity-15"
              style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "MS Mincho", serif' }}
            >
              創造
            </span>
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-outline-faint via-red/30 to-outline-faint" />
          </div>

          {/* Right Narrative Copy */}
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-red tracking-[0.3em] uppercase block">
                The Philosophy — 哲学
              </span>
              <h2
                ref={storyTitleRef}
                className="text-3xl md:text-5xl font-display font-light text-ivory tracking-wide leading-tight"
              >
                In Pursuit of Digital Perfection
              </h2>
            </div>

            <div
              ref={storyBodyRef}
              className="text-base md:text-lg font-body text-ash leading-relaxed space-y-6 max-w-2xl"
            >
              <p>
                In the design of modern systems, I write code like a blacksmith forging steel—with deliberate intent, patience, and meticulous focus on the final edge. I believe technology should not just solve problems, but tell a story.
              </p>
              <p>
                As a developer, I specialize in the intersection of <strong className="text-ivory font-medium">AI-native application engineering</strong> and <strong className="text-ivory font-medium">high-performance full-stack architectures</strong>. I build software designed to adapt, perform, and inspire.
              </p>
            </div>

            {/* Disciplines Grid */}
            <div
              ref={disciplinesRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-outline-faint"
            >
              {/* Card 1 */}
              <div className="relative group p-6 bg-surface rounded-[2px] border border-outline-faint overflow-hidden hover:border-red/40 transition-all duration-500 paper-texture">
                <div className="absolute top-0 left-0 w-1 h-0 bg-red group-hover:h-full transition-all duration-500" />
                <span className="text-[10px] font-mono text-gold tracking-widest block mb-2">01 / ARTIFICIAL INTELLIGENCE</span>
                <h3 className="text-lg font-display text-ivory mb-2 group-hover:text-red transition-colors">AI & Autonomy</h3>
                <p className="text-xs text-ash leading-relaxed">
                  Designing custom LLM frameworks, agentic workflows, and semantic search systems.
                </p>
              </div>

              {/* Card 2 */}
              <div className="relative group p-6 bg-surface rounded-[2px] border border-outline-faint overflow-hidden hover:border-red/40 transition-all duration-500 paper-texture">
                <div className="absolute top-0 left-0 w-1 h-0 bg-red group-hover:h-full transition-all duration-500" />
                <span className="text-[10px] font-mono text-gold tracking-widest block mb-2">02 / ARCHITECTURE</span>
                <h3 className="text-lg font-display text-ivory mb-2 group-hover:text-red transition-colors">Full-Stack Craft</h3>
                <p className="text-xs text-ash leading-relaxed">
                  Building responsive, low-latency, and modular web structures using React, Next.js, and Node.
                </p>
              </div>

              {/* Card 3 */}
              <div className="relative group p-6 bg-surface rounded-[2px] border border-outline-faint overflow-hidden hover:border-red/40 transition-all duration-500 paper-texture">
                <div className="absolute top-0 left-0 w-1 h-0 bg-red group-hover:h-full transition-all duration-500" />
                <span className="text-[10px] font-mono text-gold tracking-widest block mb-2">03 / CREATIVITY</span>
                <h3 className="text-lg font-display text-ivory mb-2 group-hover:text-red transition-colors">Creative Dev</h3>
                <p className="text-xs text-ash leading-relaxed">
                  Animating visual narratives with GSAP, interactive shaders, and custom physics canvases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 border-t border-outline-faint bg-ink text-center z-10 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-display text-sm tracking-wider text-ivory">MUKUL SINGHAL</span>
          <span className="text-[10px] font-mono text-ash tracking-widest uppercase">
            © {new Date().getFullYear()} — Handcrafted in India.
          </span>
        </div>
      </footer>
    </div>
  );
}
