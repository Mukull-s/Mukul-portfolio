// ================================================================
// 墨 — INK REVEALS — Type Definitions
// Shared TypeScript interfaces and types.
// ================================================================

/** Device performance classification */
export type DeviceTier = "high" | "medium" | "low";

/** Hero scroll act identifiers */
export type ActId = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

/** Particle system mode values (maps to shader uniform uMode) */
export enum ParticleMode {
  /** Ambient drift — no typography awareness */
  Ambient = 0.0,
  /** Drifting inward toward center */
  DriftInward = 0.3,
  /** Tracing Katakana stroke edges */
  TraceKatakana = 0.5,
  /** Dissolution — exploding from Katakana positions */
  Dissolve = 1.0,
  /** Reformation — reorganizing toward English positions */
  Reform = 1.5,
  /** Snap — locked to final English positions */
  Snap = 2.0,
}

/** Typography particle shader uniforms */
export interface TypoParticleUniforms {
  uTime: { value: number };
  uMode: { value: number };
  uDissolveProgress: { value: number };
  uReformProgress: { value: number };
  uSnapForce: { value: number };
  uColorTemp: { value: number };
  uGlobalOpacity: { value: number };
  uMousePos: { value: [number, number] };
  uPulseIntensity: { value: number };
  uKatakanaInfluence: { value: number };
}

/** Ambient particle shader uniforms */
export interface AmbientParticleUniforms {
  uTime: { value: number };
  uMousePos: { value: [number, number] };
  uMouseRadius: { value: number };
  uMouseForce: { value: number };
  uScrollMode: { value: number };
  uAmbientCount: { value: number };
  uAmbientSpeed: { value: number };
}

/** Project data for Selected Works section */
export interface Project {
  /** URL-safe slug */
  slug: string;
  /** Display title */
  title: string;
  /** One-sentence description */
  tagline: string;
  /** What Mukul specifically did */
  role: string;
  /** Key technologies */
  stack: string[];
  /** Quantifiable outcome or significance */
  impact: string;
  /** Path to screenshot/video in public/images/projects/ */
  image: string;
  /** Live site URL (optional) */
  liveUrl?: string;
  /** Source code URL (optional) */
  sourceUrl?: string;
}

/** Skill domain for The Craft section */
export interface SkillDomain {
  /** Domain name (e.g., "Intelligent Systems") */
  name: string;
  /** One-line description */
  description: string;
  /** Specific technologies */
  instruments: string[];
}

/** Process principle for The Process section */
export interface ProcessPrinciple {
  /** The belief (one sentence) */
  statement: string;
  /** The example (2–3 sentences, grounded in real work) */
  example: string;
}

/** Exploration area for The Horizon section */
export interface ExplorationArea {
  /** Area title */
  title: string;
  /** Brief description */
  brief: string;
  /** Current status */
  status: "Currently building" | "Researching" | "Writing about";
  /** Link to evidence (optional) */
  link?: string;
}

/** Contact channel for Begin a Conversation section */
export interface ContactChannel {
  /** Channel name (e.g., "Email", "LinkedIn") */
  name: string;
  /** Display label */
  label: string;
  /** URL or mailto: link */
  href: string;
}

/** Navigation chapter definition */
export interface NavChapter {
  /** Section element ID */
  id: string;
  /** Japanese character marker */
  kanji: string;
  /** English label */
  label: string;
}

/** Complete portfolio content data */
export interface PortfolioData {
  bio: {
    openingLine: string;
    narrative: string;
    credentials: string;
  };
  skills: SkillDomain[];
  projects: Project[];
  process: ProcessPrinciple[];
  explorations: ExplorationArea[];
  contact: ContactChannel[];
}
