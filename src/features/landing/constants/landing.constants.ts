/** Section anchors on the public landing page (used by the navbar links). */
export const LANDING_SECTIONS = {
  home: 'home',
  services: 'services',
  process: 'process',
  projects: 'projects',
  about: 'about',
  contact: 'contact'
} as const

export type LandingSectionId = (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS]

/**
 * Lead "need type" options for the contact form (stakeholder Q&A §3.2.1).
 * Labels resolve under `landing.lead.needType.*`.
 */
export const LEAD_NEED_TYPES = ['design', 'estimate', 'consult', 'construction', 'other'] as const

export type LeadNeedType = (typeof LEAD_NEED_TYPES)[number]
