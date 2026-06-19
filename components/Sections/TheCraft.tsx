"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Sections.module.css";
import pageStyles from "@/app/page.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Domain {
  num: string;
  title: string;
  capability: string;
  tools: string;
}

const DOMAINS: Domain[] = [
  {
    num: "01",
    title: "Intelligent Systems",
    capability: "Building AI-powered systems that reason, retrieve knowledge, and automate complex workflows.",
    tools: "Python · LangChain · RAG Architectures · Vector Databases · AI Agents · Workflow Automation",
  },
  {
    num: "02",
    title: "Full-Stack Engineering",
    capability: "Transforming ideas into scalable products through modern web technologies and backend systems.",
    tools: "React · Next.js · TypeScript · Node.js · Express · SQL · REST APIs",
  },
  {
    num: "03",
    title: "Design Engineering",
    capability: "Crafting interfaces and experiences that balance usability, performance, and visual clarity.",
    tools: "Figma · Tailwind CSS · GSAP · UI Systems · Motion Design",
  },
  {
    num: "04",
    title: "Systems & Deployment",
    capability: "Building reliable foundations that keep products maintainable, deployable, and production-ready.",
    tools: "Git · GitHub · Vercel · PostgreSQL · Prisma · Docker",
  },
];

export default function TheCraft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const thread = threadRef.current;
    if (!list || !thread) return;

    // 1. Staggered fade-in on scroll intersection
    const rows = list.children;
    gsap.fromTo(
      rows,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: list,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 2. Animate vertical red thread
    gsap.fromTo(
      thread,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      id="the-craft"
      className={`${styles.craftSection} ${pageStyles.mainGrid}`}
    >
      {/* Background Watermark Kanji '技' */}
      <div className={styles.watermarkKanji} aria-hidden="true">
        技
      </div>

      {/* Content Column aligned with The Path */}
      <div className={styles.craftContentColumn}>
        {/* Torii Red Thread Accent (runs parallel down the left) */}
        <div ref={threadRef} className={styles.redThread} />

        {/* Header Block */}
        <header className={styles.craftHeader}>
          <h2 className={styles.craftTitle}>
            <span className={styles.titleKanji}>技</span> — The Craft
          </h2>
          <div className={styles.craftThesis}>
            <p className={styles.thesisBig}>
              Technology changes. The ability to solve problems does not.
            </p>
            <p className={styles.thesisSmall}>
              These are the domains where I spend most of my time—building intelligent systems, designing products, and turning ideas into software that people can actually use.
            </p>
          </div>
        </header>

        {/* Capability Domains Directory */}
        <div ref={listRef} className={styles.domainsDirectory}>
          {DOMAINS.map((domain, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <div
                key={domain.num}
                className={`${styles.domainRow} ${isDimmed ? styles.dimmed : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={styles.domainRowHeader}>
                  <h3 className={styles.domainTitle}>{domain.title}</h3>
                  <span className={styles.domainNumber}>{domain.num}</span>
                </div>

                {/* Capability Statement revealed on hover */}
                <div
                  className={styles.domainCapabilityWrapper}
                  style={{
                    gridTemplateRows: isHovered ? "1fr" : "0fr",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <div className={styles.domainCapabilityInner}>
                    <p className={styles.domainCapability}>{domain.capability}</p>
                  </div>
                </div>

                {/* Tools/Skills (always visible) */}
                <p className={styles.toolsList}>{domain.tools}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
