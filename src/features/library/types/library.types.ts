import type { LibraryCategory } from '../constants/library.constants';

/** A unit-price catalogue entry (material, labour or equipment). */
export interface LibraryItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  category: LibraryCategory;
  unitPrice: number;
  updatedAt: string;
}

/** Client-side list filters. */
export interface LibraryFilters {
  search: string;
  category: LibraryCategory | 'all';
  page: number;
}
