/** Section anchors on the public landing page (used by the navbar links). */
export const LANDING_SECTIONS = {
  home: 'home',
  services: 'services',
  process: 'process',
  projects: 'projects',
  about: 'about',
  contact: 'contact',
} as const

export type LandingSectionId =
  (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS]

/** Translation keys under `landing.nav` for the navbar — type-safe for t(). */
export type LandingNavKey =
  | 'home'
  | 'services'
  | 'process'
  | 'projects'
  | 'about'
  | 'contact'

export interface LandingNavItem {
  labelKey: LandingNavKey
  /** In-page anchor target. */
  sectionId: LandingSectionId
}

/** Primary in-page navigation for the landing header. */
export const LANDING_NAV: readonly LandingNavItem[] = [
  { labelKey: 'about', sectionId: LANDING_SECTIONS.about },
  { labelKey: 'services', sectionId: LANDING_SECTIONS.services },
  { labelKey: 'projects', sectionId: LANDING_SECTIONS.projects },
  { labelKey: 'contact', sectionId: LANDING_SECTIONS.contact },
]

/**
 * Lead "need type" options for the contact form (stakeholder Q&A §3.2.1).
 * Labels resolve under `landing.lead.needType.*`.
 */
export const LEAD_NEED_TYPES = [
  'design',
  'estimate',
  'consult',
  'construction',
  'other',
] as const

export type LeadNeedType = (typeof LEAD_NEED_TYPES)[number]
