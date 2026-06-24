'use client';

import { create } from 'zustand';
import type { ProjectFilters } from '../types/project.types';

interface ProjectFiltersStore {
  filters: ProjectFilters;
  setSearch: (search: string) => void;
  setStatus: (status: ProjectFilters['status']) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const INITIAL_FILTERS: ProjectFilters = {
  search: '',
  status: 'all',
  page: 1,
};

/**
 * Feature-scoped client state: project list filters.
 * Each feature owns its own store — there is no global app store.
 */
export const useProjectFiltersStore = create<ProjectFiltersStore>((set) => ({
  filters: INITIAL_FILTERS,
  // Changing search/status resets pagination to page 1.
  setSearch: (search) =>
    set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
  setStatus: (status) =>
    set((s) => ({ filters: { ...s.filters, status, page: 1 } })),
  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
  reset: () => set({ filters: INITIAL_FILTERS }),
}));
