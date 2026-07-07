/** Library (unit-price catalogue) constants. */

export const LIBRARY_CATEGORY = {
  MATERIAL: 'material',
  LABOR: 'labor',
  EQUIPMENT: 'equipment'
} as const

export type LibraryCategory = (typeof LIBRARY_CATEGORY)[keyof typeof LIBRARY_CATEGORY]

/**
 * Price regions (stakeholder Q&A §5.2.2): one price table split by macro-region
 * North / Central / South (not by province).
 */
export const PRICE_REGION = {
  NORTH: 'north',
  CENTRAL: 'central',
  SOUTH: 'south'
} as const

export type PriceRegion = (typeof PRICE_REGION)[keyof typeof PRICE_REGION]

export const DEFAULT_LIBRARY_PAGE_SIZE = 10
