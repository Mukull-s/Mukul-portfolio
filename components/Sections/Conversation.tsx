"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Sections.module.css";
import pageStyles from "@/app/page.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Conversation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const endingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    const title = titleRef.current;
    const links = linksRef.current;
    const ending = endingRef.current;

    if (!container || !title || !links || !ending) return;

    // 1. Pulsating ambient crimson glow animation
    if (glow) {
      gsap.fromTo(
        glow,
        { scale: 0.95, opacity: 0.5 },
        {
          scale: 1.08,
          opacity: 0.85,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }

    // 2. Sequential reveal timeline on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      title,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
      .fromTo(
        links,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ending,
        { opacity: 0, scale: 0.95 },
        { opacity: 0.95, scale: 1, duration: 1.8, ease: "power2.out" },
        "-=0.3"
      );

    return () => {
      tl.kill();
    };
  }, []);

  // 3. Precise GSAP hover micro-interactions for editorial links
  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const underline = target.querySelector(`.${styles.linkUnderline}`);
    const text = target.querySelector(`.${styles.linkText}`);
    const detail = target.querySelector(`.${styles.linkDetail}`);

    gsap.to(target, { opacity: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    if (text) {
      gsap.to(text, { color: "var(--color-ivory)", y: -2, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    }
    if (detail) {
      gsap.to(detail, { opacity: 0.9, y: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    }
    if (underline) {
      gsap.to(underline, { scaleX: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    }
  };

  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const underline = target.querySelector(`.${styles.linkUnderline}`);
    const text = target.querySelector(`.${styles.linkText}`);
    const detail = target.querySelector(`.${styles.linkDetail}`);

    gsap.to(target, { opacity: 0.85, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
    if (text) {
      gsap.to(text, { color: "var(--color-washi)", y: 0, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
    }
    if (detail) {
      gsap.to(detail, { opacity: 0, y: 4, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
    }
    if (underline) {
      gsap.to(underline, { scaleX: 0, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="conversation"
      className={`${styles.conversationSection} ${pageStyles.mainGrid}`}
    >
      {/* Visual background reintroducing Hero atmosphere */}
      <div ref={glowRef} className={styles.conversationBgGlow} aria-hidden="true" />

      {/* Main content layer */}
      <div className={styles.conversationContentColumn}>
        <h2 ref={titleRef} className={styles.conversationStatement}>
          Every system begins with a conversation.
        </h2>

        {/* Contact Links */}
        <div ref={linksRef} className={styles.conversationLinks}>
          <a
            href="mailto:work.mukulsinghal@gmail.com"
            className={styles.conversationLink}
            onMouseEnter={handleLinkMouseEnter}
            onMouseLeave={handleLinkMouseLeave}
          >
            <span className={styles.linkText}>EMAIL</span>
            <span className={styles.linkDetail}>work.mukulsinghal@gmail.com</span>
            <div className={styles.linkUnderline} />
          </a>

          <a
            href="https://www.linkedin.com/in/mukul-singhal90/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.conversationLink}
            onMouseEnter={handleLinkMouseEnter}
            onMouseLeave={handleLinkMouseLeave}
          >
            <span className={styles.linkText}>LINKEDIN</span>
            <span className={styles.linkDetail}>mukul-singhal90</span>
            <div className={styles.linkUnderline} />
          </a>

          <a
            href="https://github.com/Mukull-s"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.conversationLink}
            onMouseEnter={handleLinkMouseEnter}
            onMouseLeave={handleLinkMouseLeave}
          >
            <span className={styles.linkText}>GITHUB</span>
            <span className={styles.linkDetail}>Mukull-s</span>
            <div className={styles.linkUnderline} />
          </a>
        </div>
      </div>

      {/* Final Scene Punctuation */}
      <div ref={endingRef} className={styles.finalMoment}>
        <span className={styles.endingKanji}>終</span>
        <span className={styles.endingSubtitle}>End.</span>
      </div>
    </section>
  );
}
