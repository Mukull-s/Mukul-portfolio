"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Sections.module.css";
import pageStyles from "@/app/page.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function ThePath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thread = threadRef.current;
    const content = contentRef.current;
    if (!thread || !content) return;

    // 1. Draw the red thread from top to bottom as the section scrolls into view
    gsap.fromTo(
      thread,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", // when the top of the section enters the bottom of the viewport
          end: "bottom center", // when the bottom of the section reaches the center of the viewport
          scrub: true,
        },
      }
    );

    // 2. Fade in the editorial content blocks sequentially on scroll intersection
    const blocks = content.children;
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: content,
          start: "top 85%", // triggers when the top of content enters 85% of viewport
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      id="the-path"
      className={`${styles.pathSection} ${pageStyles.mainGrid}`}
    >
      {/* Background Watermark Kanji '道' */}
      <div className={styles.watermarkKanji} aria-hidden="true">
        道
      </div>

      {/* Content Column: Placed in Column 2 of the main page grid */}
      <div className={styles.pathContentColumn}>
        {/* Torii Red Thread Accent (vertical line on the left) */}
        <div ref={threadRef} className={styles.redThread} />

        {/* Editorial Text Container */}
        <div ref={contentRef} className={styles.editorialContent}>
          {/* Block 1: The Opening Line */}
          <h2 className={styles.openingLine}>
            Some people are drawn to technology because of the tools. I was drawn to it because of the possibility.
          </h2>

          {/* Block 2: The Narrative Biography */}
          <p className={styles.narrativeParagraph}>
            What started as curiosity gradually became an obsession with understanding how systems work, how ideas become products, and how software can transform the way people interact with information. That pursuit eventually led me into computer science, where I discovered a deeper fascination: intelligence itself.
          </p>

          <p className={styles.narrativeParagraph}>
            The emergence of AI agents, retrieval systems, and autonomous workflows changed the way I viewed software. Applications no longer had to simply execute instructions—they could reason, retrieve knowledge, adapt to context, and assist in meaningful ways.
          </p>

          {/* Block 3: The Credentials (Subtle Footnote) */}
          <div className={styles.credentials}>
            <p>
              Today, I am pursuing a B.Tech in Computer Science Engineering while building at the intersection of artificial intelligence and full-stack development. My focus is creating systems that are not only functional, but capable of turning information into action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
