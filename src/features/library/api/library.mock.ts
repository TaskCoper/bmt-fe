import type { PaginatedResponse } from '@/shared/types';
import { mockDelay, paginate } from '@/shared/lib';
import {
  LIBRARY_CATEGORY,
  DEFAULT_LIBRARY_PAGE_SIZE,
} from '../constants/library.constants';
import type { LibraryItem, LibraryFilters } from '../types/library.types';

const M = LIBRARY_CATEGORY;

/** Sample unit-price catalogue for local development without a backend. */
export const MOCK_LIBRARY: LibraryItem[] = [
  { id: 'l-01', code: 'VT-001', name: 'Xi măng PCB40 Hà Tiên', unit: 'bao', category: M.MATERIAL, unitPrice: 92_000, updatedAt: '2026-06-20T03:00:00Z' },
  { id: 'l-02', code: 'VT-002', name: 'Thép Pomina D10', unit: 'kg', category: M.MATERIAL, unitPrice: 18_500, updatedAt: '2026-06-20T03:00:00Z' },
  { id: 'l-03', code: 'VT-003', name: 'Gạch ống Tuynel 8x8x18', unit: 'viên', category: M.MATERIAL, unitPrice: 1_350, updatedAt: '2026-06-18T03:00:00Z' },
  { id: 'l-04', code: 'VT-004', name: 'Cát bê tông', unit: 'm³', category: M.MATERIAL, unitPrice: 420_000, updatedAt: '2026-06-15T03:00:00Z' },
  { id: 'l-05', code: 'VT-005', name: 'Đá 1x2', unit: 'm³', category: M.MATERIAL, unitPrice: 480_000, updatedAt: '2026-06-15T03:00:00Z' },
  { id: 'l-06', code: 'VT-006', name: 'Sơn nước Dulux nội thất', unit: 'thùng', category: M.MATERIAL, unitPrice: 1_280_000, updatedAt: '2026-06-12T03:00:00Z' },
  { id: 'l-07', code: 'VT-007', name: 'Gạch men Đồng Tâm 60x60', unit: 'm²', category: M.MATERIAL, unitPrice: 235_000, updatedAt: '2026-06-10T03:00:00Z' },
  { id: 'l-08', code: 'NC-001', name: 'Nhân công xây tô', unit: 'công', category: M.LABOR, unitPrice: 450_000, updatedAt: '2026-06-19T03:00:00Z' },
  { id: 'l-09', code: 'NC-002', name: 'Nhân công sơn bả', unit: 'công', category: M.LABOR, unitPrice: 400_000, updatedAt: '2026-06-19T03:00:00Z' },
  { id: 'l-10', code: 'NC-003', name: 'Nhân công ốp lát', unit: 'm²', category: M.LABOR, unitPrice: 120_000, updatedAt: '2026-06-17T03:00:00Z' },
  { id: 'l-11', code: 'NC-004', name: 'Nhân công điện nước', unit: 'công', category: M.LABOR, unitPrice: 550_000, updatedAt: '2026-06-17T03:00:00Z' },
  { id: 'l-12', code: 'TB-001', name: 'Máy trộn bê tông 350L', unit: 'ca', category: M.EQUIPMENT, unitPrice: 650_000, updatedAt: '2026-06-14T03:00:00Z' },
  { id: 'l-13', code: 'TB-002', name: 'Giàn giáo khung (thuê)', unit: 'bộ/tháng', category: M.EQUIPMENT, unitPrice: 85_000, updatedAt: '2026-06-14T03:00:00Z' },
  { id: 'l-14', code: 'TB-003', name: 'Máy cắt gạch', unit: 'ca', category: M.EQUIPMENT, unitPrice: 180_000, updatedAt: '2026-06-11T03:00:00Z' },
  { id: 'l-15', code: 'TB-004', name: 'Vận thăng nâng vật liệu', unit: 'ca', category: M.EQUIPMENT, unitPrice: 1_200_000, updatedAt: '2026-06-09T03:00:00Z' },
];

function applyFilters(filters: LibraryFilters): LibraryItem[] {
  let items = [...MOCK_LIBRARY];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q),
    );
  }
  if (filters.category !== 'all') {
    items = items.filter((i) => i.category === filters.category);
  }
  return items;
}

export const mockLibraryApi = {
  async list(filters: LibraryFilters): Promise<PaginatedResponse<LibraryItem>> {
    await mockDelay();
    return paginate(applyFilters(filters), filters.page, DEFAULT_LIBRARY_PAGE_SIZE);
  },
};
