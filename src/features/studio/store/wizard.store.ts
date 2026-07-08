'use client'

import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CONSTRUCTION_TYPES,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SELECTION,
  HOUSE_STYLES,
  MAX_REGENERATIONS,
  type HouseStyle
} from '../constants/studio.constants'
import { generateResult } from '../services/studio.service'
import type {
  EstimateSelection,
  ExportOptions,
  ProjectSnapshot,
  UploadedImage,
  WizardData
} from '../types/studio.types'

const INITIAL_DATA: WizardData = {
  name: '',
  constructionType: CONSTRUCTION_TYPES.APARTMENT,
  note: '',
  address: '',
  region: 'south',
  floors: 1,
  area: 80,
  style: HOUSE_STYLES.MODERN_TOWNHOUSE,
  hasTum: false,
  openPlan: true,
  lighting: 'natural',
  direction: 'south',
  primaryColors: [DEFAULT_PRIMARY_COLOR],
  budget: 2_000_000_000,
  images: []
}

const INITIAL_EXPORT: ExportOptions = {
  coverPage: true,
  projectInfo: true,
  drawings: true,
  estimate: true,
  summary: true,
  renders: true,
  language: 'vi'
}

/** Stable unique id (crypto in the browser; predictable fallback otherwise). */
function makeId(prefix = 'p'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Math.abs(Math.floor(performance.now() * 1000)).toString(36)}`
}

/** Return a copy of `snap` with `patch` applied and `updatedAt` bumped. */
function touch(snap: ProjectSnapshot, patch: Partial<ProjectSnapshot>): ProjectSnapshot {
  return { ...snap, ...patch, updatedAt: new Date().toISOString() }
}

interface StudioState {
  /** All design projects, keyed by id — the persisted "autosave" substrate. */
  projects: Record<string, ProjectSnapshot>
  /** Currently-open project (route-driven; NOT persisted). */
  currentId: string | null
  isGenerating: boolean
  /** Pending navigation path awaiting edit-after-result confirmation. */
  pendingNav: string | null

  // lifecycle
  createProject: (input: { name: string; constructionType: WizardData['constructionType']; note: string }) => string
  openProject: (id: string) => boolean
  deleteProject: (id: string) => void

  // data mutation (operate on the current project)
  patch: (partial: Partial<WizardData>) => void
  setStyle: (style: HouseStyle) => void
  addImages: (floor: number, names: string[]) => void
  removeImage: (id: string) => void
  setSelection: (partial: Partial<EstimateSelection>) => void

  // generation (mock async)
  generate: () => Promise<void>
  regenerate: () => Promise<void>
  clearResult: () => void

  // step 5 — render gallery
  toggleFavorite: (id: string) => void
  setCaption: (id: string, caption: string) => void

  // step 6 — export
  setExportOption: <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => void

  // edit-after-result nav guard
  setPendingNav: (path: string | null) => void
}

/** Apply `mutate` to the current project's snapshot, if any. */
function withCurrent(
  state: StudioState,
  mutate: (snap: ProjectSnapshot) => Partial<ProjectSnapshot>
): Partial<StudioState> {
  const id = state.currentId
  if (!id) return {}
  const snap = state.projects[id]
  if (!snap) return {}
  return { projects: { ...state.projects, [id]: touch(snap, mutate(snap)) } }
}

export const useWizardStore = create<StudioState>()(
  persist(
    (set, get) => ({
      projects: {},
      currentId: null,
      isGenerating: false,
      pendingNav: null,

      createProject: (input) => {
        const id = makeId()
        const now = new Date().toISOString()
        const snapshot: ProjectSnapshot = {
          id,
          data: {
            ...INITIAL_DATA,
            name: input.name,
            constructionType: input.constructionType,
            note: input.note
          },
          selection: { ...DEFAULT_SELECTION },
          result: null,
          regenCount: 0,
          exportOptions: { ...INITIAL_EXPORT },
          createdAt: now,
          updatedAt: now
        }
        set((s) => ({
          projects: { ...s.projects, [id]: snapshot },
          currentId: id
        }))
        return id
      },

      openProject: (id) => {
        if (!get().projects[id]) return false
        set({ currentId: id })
        return true
      },

      deleteProject: (id) =>
        set((s) => {
          const next = { ...s.projects }
          delete next[id]
          return {
            projects: next,
            currentId: s.currentId === id ? null : s.currentId
          }
        }),

      patch: (partial) => set((s) => withCurrent(s, (snap) => ({ data: { ...snap.data, ...partial } }))),

      setStyle: (style) => set((s) => withCurrent(s, (snap) => ({ data: { ...snap.data, style } }))),

      addImages: (floor, names) =>
        set((s) =>
          withCurrent(s, (snap) => {
            const added: UploadedImage[] = names.map((name) => ({
              id: makeId('img'),
              name,
              floor
            }))
            return {
              data: { ...snap.data, images: [...snap.data.images, ...added] }
            }
          })
        ),

      removeImage: (id) =>
        set((s) =>
          withCurrent(s, (snap) => ({
            data: {
              ...snap.data,
              images: snap.data.images.filter((i) => i.id !== id)
            }
          }))
        ),

      setSelection: (partial) =>
        set((s) =>
          withCurrent(s, (snap) => ({
            selection: { ...snap.selection, ...partial }
          }))
        ),

      generate: async () => {
        const id = get().currentId
        if (!id || get().isGenerating) return
        set({ isGenerating: true })
        // Simulate AI processing latency (UI-only mock).
        await new Promise((r) => setTimeout(r, 1600))
        const snap = get().projects[id]
        if (!snap) {
          set({ isGenerating: false })
          return
        }
        const result = generateResult(snap.data, new Date().toISOString())
        set((s) => ({
          isGenerating: false,
          ...withCurrent({ ...s, currentId: id }, () => ({ result }))
        }))
      },

      regenerate: async () => {
        const id = get().currentId
        if (!id) return
        const snap = get().projects[id]
        if (!snap || snap.regenCount >= MAX_REGENERATIONS || get().isGenerating) return
        set((s) => withCurrent(s, (cur) => ({ regenCount: cur.regenCount + 1 })))
        await get().generate()
      },

      clearResult: () => set((s) => withCurrent(s, () => ({ result: null, regenCount: 0 }))),

      toggleFavorite: (rid) =>
        set((s) =>
          withCurrent(s, (snap) =>
            snap.result
              ? {
                  result: {
                    ...snap.result,
                    renders: snap.result.renders.map((r) => (r.id === rid ? { ...r, favorite: !r.favorite } : r))
                  }
                }
              : {}
          )
        ),

      setCaption: (rid, caption) =>
        set((s) =>
          withCurrent(s, (snap) =>
            snap.result
              ? {
                  result: {
                    ...snap.result,
                    renders: snap.result.renders.map((r) => (r.id === rid ? { ...r, caption } : r))
                  }
                }
              : {}
          )
        ),

      setExportOption: (key, value) =>
        set((s) =>
          withCurrent(s, (snap) => ({
            exportOptions: { ...snap.exportOptions, [key]: value }
          }))
        ),

      setPendingNav: (path) => set({ pendingNav: path })
    }),
    {
      name: 'bmt-studio',
      version: 1,
      // Persist only the project registry — currentId is route-driven.
      partialize: (s) => ({ projects: s.projects })
    }
  )
)

/** The currently-open project snapshot, or null. */
export function useCurrentProject(): ProjectSnapshot | null {
  return useWizardStore((s) => (s.currentId ? (s.projects[s.currentId] ?? null) : null))
}

/** All projects, newest-updated first (for the dashboard list). */
export function useProjectList(): ProjectSnapshot[] {
  const projects = useWizardStore((s) => s.projects)
  return useMemo(() => Object.values(projects).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [projects])
}
