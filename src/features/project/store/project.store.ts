'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CreateProjectFormValues } from '../schemas/project.schema'

const STORAGE_KEY = 'bmt.projects'

export interface ProjectDraft extends CreateProjectFormValues {
  id: string
  slug: string
  createdAt: string
}

interface ProjectStore {
  projects: Record<string, ProjectDraft>
  addProject: (project: ProjectDraft) => void
  removeProject: (slug: string) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: {},
      addProject: (project) => set((s) => ({ projects: { ...s.projects, [project.slug]: project } })),
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
