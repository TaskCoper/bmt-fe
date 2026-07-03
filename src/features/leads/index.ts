/** Public API of the `leads` feature (admin lead management). */
export { LeadsTable } from './components/leads-table'
export { useLeads, useMarkLeadHandled } from './hooks/use-leads'
export { leadsApi } from './api/leads.api'
export { leadsKeys } from './api/leads.keys'
export {
  LEAD_STATUS,
  LEAD_NEED_TYPES,
  type LeadStatus,
  type LeadNeedType,
} from './constants/leads.constants'
export type { LeadRecord, LeadFilters } from './types/lead.types'
