"use client";

import styles from "./Hero.module.css";
import { NAV_CHAPTERS, HERO } from "@/lib/constants";

/**
 * LAYER 8 — Act VII Content
 *
 * The biography panel and chapter navigation that appear
 * when the Hero transitions into the portfolio layout.
 *
 * Initial state: opacity 0, translateY: 40px (hidden).
 *
 * Phase 2 will animate:
 * - Biography: fade in + translateY at timeline 0.90
 * - Navigation items: staggered fade + translateX at timeline 0.92
 */
interface ActVIIContentProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function ActVIIContent({ contentRef }: ActVIIContentProps) {
  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={contentRef} className={styles.actVIILayer}>
      <div className={styles.actVIIContent}>
        {/* Left Column: Title, Portrait, and Biography */}
        <div className={styles.actVIILeftColumn}>
          {/* Title Card */}
          <div className={styles.actVIITitleCard}>
            <h2 className={styles.actVIITitle}>{HERO.englishName.text}</h2>
            <p className={styles.actVIITagline}>{HERO.englishName.subtitle}</p>
          </div>

          {/* Portrait Cutout Overlay */}
          <div className={styles.actVIIPortraitContainer}>
            <picture>
              <img
                src="/Portrait-removebg-preview.png"
                alt="Mukul Portrait"
                className={styles.actVIIPortrait}
                width={666}
                height={374}
              />
            </picture>
          </div>

          {/* Biography Card */}
          <div className={`${styles.actVIIBio} ${styles.glassCard}`}>
            <p>
              A builder at the intersection of AI, full-stack systems, and
              digital craftsmanship. Creating systems that reason, architectures that scale, and
              stories that stay with you.
            </p>
          </div>
        </div>

        {/* Right Column: Chapter Navigation */}
        <nav aria-label="Portfolio sections">
          <ul className={styles.actVIINav}>
            {NAV_CHAPTERS.map((chapter) => (
              <li key={chapter.id}>
                <button
                  className={styles.navChapter}
                  onClick={() => handleNavClick(chapter.id)}
                  type="button"
                >
                  <span className={styles.navKanji}>{chapter.kanji}</span>
                  {chapter.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

