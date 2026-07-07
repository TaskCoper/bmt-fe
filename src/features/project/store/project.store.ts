'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CreateProjectFormValues, DesignRequestPayload } from '../schemas/project.schema'

const STORAGE_KEY = 'bmt.projects'

export interface ProjectDraft extends CreateProjectFormValues {
  id: string
  slug: string
  designRequest: DesignRequestPayload | null
  prevUrl: string | null
  nextUrl: string | null
  createdAt: string
}

type ProjectUpdate = Partial<Omit<ProjectDraft, 'id' | 'slug' | 'createdAt'>>

interface ProjectStore {
  projects: Record<string, ProjectDraft>
  addProject: (project: ProjectDraft) => void
  updateProject: ({ slug, patch }: { slug: string; patch: ProjectUpdate }) => void
  removeProject: (slug: string) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: {},
      addProject: (project) => set((s) => ({ projects: { ...s.projects, [project.slug]: project } })),
      updateProject: ({ slug, patch }) =>
        set((s) => {
          const current = s.projects[slug]
          if (!current) return s

          return { projects: { ...s.projects, [slug]: { ...current, ...patch } } }
        }),
      removeProject: (slug) =>
        set((s) => {
          const { [slug]: _removed, ...rest } = s.projects
          return { projects: rest }
        })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
)

const DIACRITICS = /[̀-ͯ]/g

/** Slugify a project name into a URL-safe segment. */
export function slugifyProjectName(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(DIACRITICS, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'project'
  )
}

/** Build a unique id/slug pair from a project name and current time. */
export function buildProjectId(name: string): { id: string; slug: string; createdAt: string } {
  const now = new Date()
  const base = slugifyProjectName(name)
  const slug = `${base}-${now.getTime()}`
  return { id: slug, slug, createdAt: now.toISOString() }
}

/**
 * Linear flow of routes a project moves through. The order here is the source
 * of truth — prev/next URLs are always derived from it via `getProjectFlowUrls`.
 */
export type ProjectFlowStep = 'detail' | 'design-request' | 'spaces'

const PROJECT_FLOW: readonly (readonly [ProjectFlowStep, string])[] = [
  ['detail', ''],
  ['design-request', '/design-request'],
  ['spaces', '/spaces']
] as const

/** Prev/next URLs for a given flow position. `null` at either end of the flow. */
export function getProjectFlowUrls(
  slug: string,
  current: ProjectFlowStep
): { prevUrl: string | null; nextUrl: string | null } {
  const idx = PROJECT_FLOW.findIndex(([step]) => step === current)
  const buildUrl = (i: number) => {
    const entry = PROJECT_FLOW[i]
    return entry ? `/projects/${slug}${entry[1]}` : null
  }
  return { prevUrl: buildUrl(idx - 1), nextUrl: buildUrl(idx + 1) }
}

/** Sync a project's `prevUrl` / `nextUrl` with its current flow position. */
export function useSetProjectFlow(slug: string, current: ProjectFlowStep) {
  const updateProject = useProjectStore((s) => s.updateProject)
  const hasProject = useProjectStore((s) => Boolean(s.projects[slug]))

  useEffect(() => {
    if (!hasProject) return
    updateProject({ slug, patch: getProjectFlowUrls(slug, current) })
  }, [slug, current, hasProject, updateProject])
}
