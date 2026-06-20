"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./Sections.module.css";
import pageStyles from "@/app/page.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  num: string;
  title: string;
  thesis: string;
  description: string;
  keywords: string;
  image: string;
  github?: string;
  live?: string;
}

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "ARCHON",
    thesis: "Turning code into knowledge.",
    description: "A system designed to transform repositories into structured intelligence, making complex software easier to understand, navigate, and extend.",
    keywords: "Knowledge Systems · RAG · Developer Intelligence",
    image: "/images/projects/archon.png",
  },
  {
    num: "02",
    title: "SHADOW",
    thesis: "A second brain for execution.",
    description: "An intelligent multi-agent system designed to remember, organize, plan, and act — extending human capability through automation and memory.",
    keywords: "Agents · Memory · Automation",
    image: "/images/projects/shadow.png",
  },
  {
    num: "03",
    title: "BOLO BHARAT",
    thesis: "AI that speaks everyone's language.",
    description: "A multilingual assistant focused on making information more accessible through natural conversation, voice interaction, and regional language support.",
    keywords: "Voice AI · Accessibility · Human-Centered Design",
    image: "/images/projects/bolo_bharat.png",
    github: "https://github.com/Mukull-s/Bolo-Bharat",
    live: "https://bolo-bharat.vercel.app/",
  },
  {
    num: "04",
    title: "VERQ",
    thesis: "Practice beyond preparation.",
    description: "An AI-powered interview platform designed to simulate realistic conversations, identify weaknesses, and accelerate learning through intelligent feedback.",
    keywords: "AI Evaluation · Learning Systems · Career Growth",
    image: "/images/projects/verq.png",
    github: "https://github.com/Mukull-s/verq",
    live: "https://verq-yj1x.vercel.app/",
  },
  {
    num: "05",
    title: "DEVPULSE",
    thesis: "Designed for builders.",
    description: "A unified ecosystem connecting students, projects, learning opportunities, and communities into a single platform built for growth.",
    keywords: "Community Systems · Education · Platform Design",
    image: "/images/projects/devpulse.png",
  },
];

export default function SelectedWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const section = containerRef.current;
    const thread = threadRef.current;
    if (!list || !section || !thread) return;

    const cards = list.children;
    if (cards.length === 0) return;

    const cardsArray = Array.from(cards) as HTMLDivElement[];

    const scrollRunway = 300;
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollRunway}%`,
      pin: true,
      scrub: true,
      pinSpacing: true,
      refreshPriority: 10,
    });

    const threadTrigger = gsap.fromTo(
      thread,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollRunway}%`,
          scrub: true,
          refreshPriority: 10,
        },
      }
    );

    // Timeline for stacking visual project card transitions
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollRunway}%`,
        scrub: true,
        refreshPriority: 10,
      },
    });

    gsap.set(cardsArray.slice(1), { opacity: 0, y: 30, pointerEvents: "none" });
    gsap.set(cardsArray[0], { opacity: 1, y: 0, pointerEvents: "auto" });

    tl.to(cardsArray[0], {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[0], { pointerEvents: "none" }),
      onReverseComplete: () => gsap.set(cardsArray[0], { pointerEvents: "auto" }),
    }, 2);

    tl.to(cardsArray[1], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[1], { pointerEvents: "auto" }),
      onReverseComplete: () => gsap.set(cardsArray[1], { pointerEvents: "none" }),
    }, 2);

    tl.to(cardsArray[1], {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[1], { pointerEvents: "none" }),
      onReverseComplete: () => gsap.set(cardsArray[1], { pointerEvents: "auto" }),
    }, 5);

    tl.to(cardsArray[2], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[2], { pointerEvents: "auto" }),
      onReverseComplete: () => gsap.set(cardsArray[2], { pointerEvents: "none" }),
    }, 5);

    tl.to(cardsArray[2], {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[2], { pointerEvents: "none" }),
      onReverseComplete: () => gsap.set(cardsArray[2], { pointerEvents: "auto" }),
    }, 8);

    tl.to(cardsArray[3], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[3], { pointerEvents: "auto" }),
      onReverseComplete: () => gsap.set(cardsArray[3], { pointerEvents: "none" }),
    }, 8);

    tl.to(cardsArray[3], {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[3], { pointerEvents: "none" }),
      onReverseComplete: () => gsap.set(cardsArray[3], { pointerEvents: "auto" }),
    }, 11);

    tl.to(cardsArray[4], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.inOut",
      onStart: () => gsap.set(cardsArray[4], { pointerEvents: "auto" }),
      onReverseComplete: () => gsap.set(cardsArray[4], { pointerEvents: "none" }),
    }, 11);

    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimeout);
      pinTrigger.kill();
      threadTrigger.scrollTrigger?.kill();
      threadTrigger.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Handle image hover animations via GSAP for fine control
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const targetImage = imageRefs.current[index];
    if (targetImage) {
      gsap.to(targetImage, {
        scale: 1.04,
        opacity: 1,
        filter: "brightness(1.05)",
        duration: 0.4,
        ease: "power2.out",
      });
    }

    const isHoverDevice = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
    if (isHoverDevice) {
      const targetIcons = iconsRefs.current[index];
      if (targetIcons) {
        gsap.fromTo(
          targetIcons,
          { opacity: 0, y: 5 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            delay: 0.1,
            ease: "power2.out",
            overwrite: "auto",
          }
        );
      }
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    const targetImage = imageRefs.current[index];
    if (targetImage) {
      gsap.to(targetImage, {
        scale: 1,
        opacity: 0.75,
        filter: "brightness(0.9)",
        duration: 0.4,
        ease: "power2.out",
      });
    }

    const isHoverDevice = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
    if (isHoverDevice) {
      const targetIcons = iconsRefs.current[index];
      if (targetIcons) {
        gsap.to(targetIcons, {
          opacity: 0,
          y: 5,
          duration: 0.2,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      id="selected-works"
      className={`${styles.worksSection} ${pageStyles.mainGrid}`}
      style={{ gridRow: 5, gridColumn: "1 / -1" }}
    >
      {/* Background Watermark Kanji '作品' */}
      <div className={styles.watermarkKanjiDouble} aria-hidden="true">
        作品
      </div>

      {/* Content Column aligned with The Path and The Craft */}
      <div className={styles.worksContentColumn}>
        {/* Torii Red Thread Accent */}
        <div ref={threadRef} className={styles.redThread} />

        {/* Header Block */}
        <header className={styles.worksHeader}>
          <h2 className={styles.worksTitle}>
            <span className={styles.titleKanji}>作品</span> — Selected Works
          </h2>
          <p className={styles.worksSub}>
            A collection of systems exploring different ideas about intelligence, automation, knowledge, and human interaction.
          </p>
        </header>

        {/* Works Directory */}
        <div ref={listRef} className={styles.worksDirectory}>
          {PROJECTS.map((project, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <div
                key={project.num}
                className={`${styles.projectRow} ${isDimmed ? styles.dimmed : ""}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                {/* Project Title and Number */}
                <div className={styles.projectRowHeader}>
                  <div className={styles.projectTitleContainer}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    {(project.github || project.live) && (
                      <div
                        ref={(el) => {
                          iconsRefs.current[index] = el;
                        }}
                        className={styles.projectIconsContainer}
                      >
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectIconButton}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`View ${project.title} GitHub repository`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={styles.projectIconSvg}
                            >
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectIconButton}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`View ${project.title} live deployment`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={styles.projectIconSvg}
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className={styles.projectNumber}>{project.num}</span>
                </div>

                {/* Powerful Thesis Statement */}
                <h4 className={styles.projectThesis}>{project.thesis}</h4>

                {/* Keywords (Always Visible) */}
                <p className={styles.projectKeywords}>{project.keywords}</p>

                {/* Visual Preview Image */}
                <div className={styles.projectImageContainer}>
                  <div
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    className={styles.projectImageWrapper}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} Preview`}
                      fill
                      sizes="610px"
                      priority={index < 2}
                      className={styles.projectImage}
                    />
                  </div>
                </div>

                {/* Supporting Description Revealed on Hover */}
                <div
                  className={styles.projectExpandable}
                  style={{
                    gridTemplateRows: isHovered ? "1fr" : "0fr",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <div className={styles.projectExpandableInner}>
                    <p className={styles.projectDescription}>{project.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
