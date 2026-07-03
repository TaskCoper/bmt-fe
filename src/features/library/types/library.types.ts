import type {
  LibraryCategory,
  PriceRegion,
} from '../constants/library.constants';

/** A historical unit-price point (kept so old projects pin their price). */
export interface PricePoint {
  date: string;
  price: number;
}

/** A unit-price catalogue entry (material, labour or equipment). */
export interface LibraryItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  category: LibraryCategory;
  region: PriceRegion;
  unitPrice: number;
  updatedAt: string;
  /** Most-recent-last price-change history. */
  priceHistory: PricePoint[];
}

/** Client-side list filters. */
export interface LibraryFilters {
  search: string;
  category: LibraryCategory | 'all';
  region: PriceRegion | 'all';
  page: number;
}
