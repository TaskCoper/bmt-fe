export const REVIEW_SECTION_KEYS = ['cover', 'projectInfo', 'floorPlans', 'estimate', 'renders'] as const

export type ReviewSectionKey = (typeof REVIEW_SECTION_KEYS)[number]

export interface ReviewSection {
  key: ReviewSectionKey
  title: string
  description: string
}
