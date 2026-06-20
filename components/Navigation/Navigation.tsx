"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_CHAPTERS } from "@/lib/constants";
import styles from "./Navigation.module.css";
import pageStyles from "@/app/page.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Fade-in navigation panel and manage persistent background texture timeline
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, { opacity: 0, pointerEvents: "none" });

    const st = ScrollTrigger.create({
      trigger: "#the-path",
      start: "top bottom",
      end: "top 40%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(nav, {
          opacity: progress,
          pointerEvents: progress > 0.1 ? "auto" : "none",
        });
      },
    });

    const bg = document.getElementById("persistent-page-bg");
    let bgTimeline: gsap.core.Timeline | null = null;

    if (bg) {
      gsap.set(bg, { opacity: 0 });

      bgTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-container",
          start: "90% top",
          endTrigger: "#the-craft",
          end: "bottom top",
          scrub: true,
        },
      });

      bgTimeline
        .fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.21, ease: "none" })
        .to(bg, { opacity: 1, duration: 0.05, ease: "none" })
        .to(bg, { opacity: 0.80, duration: 0.37, ease: "none" })
        .to(bg, { opacity: 0.80, duration: 0.37, ease: "none" });
    }

    return () => {
      st.kill();
      if (bgTimeline) {
        bgTimeline.scrollTrigger?.kill();
        bgTimeline.kill();
      }
    };
  }, []);

  // Monitor scroll bounds to highlight active chapters in navigation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let activeId = "";
          const viewportMiddle = window.innerHeight * 0.5;
          const scrollPosition = window.scrollY || window.pageYOffset;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
          
          const isAtBottom = scrollPosition + clientHeight >= scrollHeight - 120;

          if (isAtBottom) {
            activeId = NAV_CHAPTERS[NAV_CHAPTERS.length - 1].id;
          } else {
            for (let i = 0; i < NAV_CHAPTERS.length; i++) {
              const chapter = NAV_CHAPTERS[i];
              const element = document.getElementById(chapter.id);
              if (element) {
                const rect = element.getBoundingClientRect();
                const isLast = i === NAV_CHAPTERS.length - 1;
                
                if (isLast) {
                  if (rect.top <= viewportMiddle) {
                    activeId = chapter.id;
                    break;
                  }
                } else {
                  if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                    activeId = chapter.id;
                    break;
                  }
                }
              }
            }
          }
          
          if (activeId) {
            setActiveSection(activeId);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    setIsMenuOpen(false);
    
    if (element) {
      setTimeout(() => {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(element);
        } else {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const activeChapter = NAV_CHAPTERS.find((ch) => ch.id === activeSection);

  return (
    <>
      <div
        ref={navRef}
        className={`${pageStyles.stickyNavigation} ${styles.navContainer}`}
        aria-label="Chapter navigation"
      >
        <nav className={styles.desktopNav} aria-label="Desktop sections">
          <ul className={styles.navList}>
            {NAV_CHAPTERS.map((chapter) => {
              const isActive = activeSection === chapter.id;
              return (
                <li key={chapter.id}>
                  <button
                    className={`${styles.navChapter} ${
                      isActive ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick(chapter.id)}
                    type="button"
                  >
                    <span className={styles.navKanji}>{chapter.kanji}</span>
                    <span className={styles.navLabelWrapper}>
                      <span className={styles.navLine} />
                      <span className={styles.navLabel}>{chapter.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          className={`${styles.mobileMenuTrigger} ${
            isMenuOpen ? styles.triggerOpen : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <span className={styles.mobileCloseIcon}>閉</span>
          ) : (
            <span className={styles.mobileMenuIcon}>
              {activeChapter ? activeChapter.kanji : "三"}
            </span>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMenuOpen(false)}>
          <nav className={styles.mobileNav} aria-label="Mobile sections">
            <ul className={styles.mobileNavList}>
              {NAV_CHAPTERS.map((chapter) => {
                const isActive = activeSection === chapter.id;
                return (
                  <li key={chapter.id} className={styles.mobileNavItem}>
                    <button
                      className={`${styles.mobileNavLink} ${
                        isActive ? styles.mobileActiveLink : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavClick(chapter.id);
                      }}
                      type="button"
                    >
                      <span className={styles.mobileNavKanji}>{chapter.kanji}</span>
                      <span className={styles.mobileNavLabel}>{chapter.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
