/** Section anchors on the public landing page (used by the navbar links). */
export const LANDING_SECTIONS = {
  home: 'home',
  services: 'services',
  process: 'process',
  projects: 'projects',
  about: 'about',
  contact: 'contact',
} as const;

export type LandingSectionId =
  (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS];

/** Translation keys under `landing.nav` for the navbar — type-safe for t(). */
export type LandingNavKey =
  | 'home'
  | 'services'
  | 'process'
  | 'projects'
  | 'about'
  | 'contact';

export interface LandingNavItem {
  labelKey: LandingNavKey;
  /** In-page anchor target. */
  sectionId: LandingSectionId;
}

/** Primary in-page navigation for the landing header. */
export const LANDING_NAV: readonly LandingNavItem[] = [
  { labelKey: 'services', sectionId: LANDING_SECTIONS.services },
  { labelKey: 'process', sectionId: LANDING_SECTIONS.process },
  { labelKey: 'projects', sectionId: LANDING_SECTIONS.projects },
  { labelKey: 'about', sectionId: LANDING_SECTIONS.about },
  { labelKey: 'contact', sectionId: LANDING_SECTIONS.contact },
];
