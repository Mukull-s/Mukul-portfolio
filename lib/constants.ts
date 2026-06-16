// ================================================================
// 墨 — INK REVEALS — Constants
// All magic numbers, colors, easing curves, breakpoints, and
// configuration values in one place.
// ================================================================

// ---- Color Palette (HSL strings for GSAP tween targets) ----
export const COLORS = {
  templeBlack: "hsl(0, 15%, 4%)",
  lacquer: "hsl(355, 30%, 7%)",
  burgundyBlack: "hsl(350, 25%, 6%)",
  vermillion: "hsl(355, 65%, 18%)",
  torii: "hsl(355, 45%, 28%)",
  washi: "hsl(30, 8%, 72%)",
  ivory: "hsl(35, 15%, 88%)",
  sumi: "hsl(0, 0%, 12%)",

  // Section backgrounds
  bgHero: "hsl(0, 15%, 4%)",
  bgThreshold: "hsl(355, 22%, 8%)",
  bgPath: "hsl(355, 22%, 8%)",
  bgCraft: "hsl(355, 18%, 9%)",
  bgWorks: "hsl(355, 15%, 10%)",
  bgProcess: "hsl(355, 12%, 10%)",
  bgHorizon: "hsl(350, 10%, 9%)",
  bgConversation: "hsl(355, 30%, 7%)",
} as const;

// ---- Easing Curves (GSAP format) ----
export const EASING = {
  /** Acts I–III: Gentle, unhurried */
  gentle: "power2.out",
  /** Act IV: Slight overshoot — dissolution energy */
  overshoot: "back.out(1.2)",
  /** Act V: Linear — stillness has no curve */
  linear: "none",
  /** Act VI: Sharp attack, long settle — the snap */
  snap: "power3.out",
  /** Act VII: Smooth, professional */
  smooth: "power2.inOut",
  /** Portrait scale deceleration */
  scaleDecel: "power2.out",
  /** Hover transitions */
  hover: "power2.out",
} as const;

// ---- Breakpoints ----
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
} as const;

// ---- Hero Scroll Configuration ----
export const HERO = {
  /** Total height of the scroll runway */
  containerHeight: "700vh",
  /** ScrollTrigger scrub smoothing (seconds) */
  scrubSmoothing: 1,

  /** Act boundaries as timeline positions (0–1) */
  acts: {
    I: { start: 0, end: 0.15 },
    II: { start: 0.15, end: 0.3 },
    III: { start: 0.3, end: 0.5 },
    IV: { start: 0.5, end: 0.65 },
    V: { start: 0.65, end: 0.75 },
    VI: { start: 0.75, end: 0.88 },
    VII: { start: 0.88, end: 1.0 },
  },

  /** Portrait animation values */
  portrait: {
    /** Initial scale (Act I) */
    initialScale: 1.0,
    /** Peak scale (Act II–III) */
    peakScale: 1.17,
    /** Post-dissolution scale (Act IV–V) */
    reducedScale: 0.92,
    /** Name reveal scale (Act VI) */
    revealScale: 0.75,
    /** Final corner scale (Act VII) */
    cornerScale: 0.35,
    /** Fade-in duration on page load (seconds) */
    fadeInDuration: 1.8,
    /** Fade-in delay (seconds) */
    fadeInDelay: 0.3,
    /** Mouse parallax max displacement (px) */
    parallaxX: 4,
    parallaxY: 3,
  },

  /** Vignette configuration */
  vignette: {
    initialRadius: "40%",
    peakRadius: "65%",
    finalRadius: "80%",
    flareIntensity: 1.0,
    settledIntensity: 0.5,
  },

  /** Typography */
  katakana: {
    text: "ムクル",
    ghostOpacity: 0.05,
    peakOpacity: 0.85,
  },

  englishName: {
    text: "MUKUL",
    subtitle: "Developer. AI Architect. Storyteller.",
  },
} as const;

// ---- Particle Configuration ----
export const PARTICLES = {
  ambient: {
    high: 80,
    medium: 50,
    low: 30,
    sizeRange: [1, 3] as [number, number],
    opacityRange: [0.15, 0.4] as [number, number],
    mouseRepelRadius: 80,
    mouseRepelForce: 0.3,
  },
  typography: {
    high: 2000,
    medium: 1200,
    low: 600,
    snapDuration: 0.4, // seconds
  },
  /** Density multipliers per portfolio section */
  sectionDensity: {
    hero: 1.0,
    threshold: 0.4,
    path: 0.4,
    craft: 0.35,
    works: 0.3,
    process: 0.35,
    horizon: 0.4,
    conversation: 0.6,
  },
} as const;

// ---- Film Grain ----
export const GRAIN = {
  heroOpacity: 0.035,
  portfolioOpacity: 0.02,
  /** Seed animation FPS by device tier */
  fpsHigh: 5,
  fpsMedium: 2,
  fpsLow: 0, // static — no animation
} as const;

// ---- Lenis Configuration ----
export const LENIS = {
  duration: 1.8,
  touchMultiplier: 1.5,
  touchInertiaMultiplier: 25,
} as const;

// ---- Section IDs (for navigation anchors) ----
export const SECTION_IDS = {
  hero: "hero-container",
  heroPinned: "hero-pinned",
  threshold: "threshold",
  path: "the-path",
  craft: "the-craft",
  works: "selected-works",
  process: "the-process",
  horizon: "the-horizon",
  conversation: "begin-conversation",
} as const;

// ---- Navigation Chapters ----
export const NAV_CHAPTERS = [
  { id: SECTION_IDS.path, kanji: "序", label: "The Path" },
  { id: SECTION_IDS.craft, kanji: "技", label: "The Craft" },
  { id: SECTION_IDS.works, kanji: "作品", label: "Selected Works" },
  { id: SECTION_IDS.process, kanji: "思考", label: "The Process" },
  { id: SECTION_IDS.horizon, kanji: "先", label: "The Horizon" },
  { id: SECTION_IDS.conversation, kanji: "対話", label: "Begin a Conversation" },
] as const;
