/** Library (unit-price catalogue) constants. */

export const LIBRARY_CATEGORY = {
  MATERIAL: 'material',
  LABOR: 'labor',
  EQUIPMENT: 'equipment',
} as const;

export type LibraryCategory =
  (typeof LIBRARY_CATEGORY)[keyof typeof LIBRARY_CATEGORY];

export const DEFAULT_LIBRARY_PAGE_SIZE = 10;
