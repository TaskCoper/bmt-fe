/** Leads (contact-form submissions) constants. */

export const LEAD_STATUS = {
  NEW: 'new',
  HANDLED: 'handled',
} as const

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS]

/** Need types — mirror of the public lead form's options. */
export const LEAD_NEED_TYPES = [
  'design',
  'estimate',
  'consult',
  'construction',
  'other',
] as const

export type LeadNeedType = (typeof LEAD_NEED_TYPES)[number]

export const DEFAULT_LEADS_PAGE_SIZE = 10
