"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Sections.module.css";
import pageStyles from "@/app/page.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Principle {
  num: string;
  title: string;
  statement: string;
}

const PRINCIPLES: Principle[] = [
  {
    num: "01",
    title: "Start With The Problem",
    statement: "Technology is a tool, not the destination. I prefer understanding the problem deeply before deciding what should be built.",
  },
  {
    num: "02",
    title: "Build Systems, Not Features",
    statement: "I focus on creating foundations that can evolve, scale, and support future ideas rather than solving only a single use case.",
  },
  {
    num: "03",
    title: "Clarity Over Complexity",
    statement: "The best systems often feel simple from the outside. Complexity should exist in the architecture, not in the user experience.",
  },
];

export default function Principles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const thread = threadRef.current;
    const title = titleRef.current;
    const list = listRef.current;
    if (!container || !thread || !title || !list) return;

    // 1. Torii Red Thread scroll scaling
    gsap.fromTo(
      thread,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      }
    );

    // 2. Title fade-in and scroll reveal
    gsap.fromTo(
      title,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 3. Staggered fade-in of the principles
    const rows = Array.from(list.children);
    gsap.fromTo(
      rows,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 4. Divider growth animation (horizontal line scaleX 0 -> 1)
    dividerRefs.current.forEach((divider) => {
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: divider,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="principles"
      className={`${styles.principlesSection} ${pageStyles.mainGrid}`}
    >
      {/* Background Watermark Kanji '思考' */}
      <div className={styles.watermarkKanjiDouble} aria-hidden="true">
        思考
      </div>

      {/* Content Column */}
      <div className={styles.principlesContentColumn}>
        {/* Torii Red Thread Accent */}
        <div ref={threadRef} className={styles.redThread} />

        {/* Section Header */}
        <header ref={titleRef} className={styles.principlesHeader}>
          <h2 className={styles.principlesTitle}>
            <span className={styles.titleKanji}>思考</span> — Principles
          </h2>
        </header>

        {/* Principles Stack */}
        <div ref={listRef} className={styles.principlesList}>
          {PRINCIPLES.map((principle, index) => (
            <div key={principle.num} className={styles.principleRow}>
              {/* Subtle Horizontal Divider Above Each (except first) */}
              {index > 0 && (
                <div
                  ref={(el) => {
                    dividerRefs.current[index - 1] = el;
                  }}
                  className={styles.principlesDivider}
                />
              )}
              
              <div className={styles.principleContent}>
                {/* Number & Title */}
                <div className={styles.principleRowHeader}>
                  <span className={styles.principleNumber}>{principle.num}</span>
                  <h3 className={styles.principleRowTitle}>{principle.title}</h3>
                </div>
                {/* Statement */}
                <p className={styles.principleStatement}>{principle.statement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
