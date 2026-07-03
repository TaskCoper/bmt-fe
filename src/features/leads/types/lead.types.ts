import type { LeadNeedType, LeadStatus } from '../constants/leads.constants'

/** A contact/lead submission as shown in the admin leads table. */
export interface LeadRecord {
  id: string
  name: string
  phone: string
  email: string
  needType: LeadNeedType
  message: string
  status: LeadStatus
  createdAt: string
}

/** Client-side list filters. */
export interface LeadFilters {
  search: string
  status: LeadStatus | 'all'
  page: number
}
