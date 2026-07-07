'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CreateProjectFormValues } from '../schemas/project.schema'

const STORAGE_KEY = 'bmt.projects'

export const INITIAL_PROJECT_STEP = 2

export interface ProjectDraft extends CreateProjectFormValues {
  id: string
  slug: string
  step: number
  designRequest: string | null
  createdAt: string
}

type ProjectUpdate = Partial<Omit<ProjectDraft, 'id' | 'slug' | 'createdAt'>>

interface ProjectStore {
  projects: Record<string, ProjectDraft>
  addProject: (project: ProjectDraft) => void
  updateProject: ({ slug, patch }: { slug: string; patch: ProjectUpdate }) => void
  removeProject: (slug: string) => void
  nextStep: (slug: string) => void
  prevStep: (slug: string) => void
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
        }),
      nextStep: (slug) => {
        set((s) => {
          const current = s.projects[slug]
          if (!current) return s

          const nextStep = Math.max(current.step + 1, 6)

          return {
            projects: {
              ...s.projects,
              [slug]: {
                ...current,
                step: nextStep
              }
            }
          }
        })
      },
      prevStep: (slug) => {
        set((s) => {
          const current = s.projects[slug]
          if (!current) return s

          const prevStep = Math.max(current.step - 1, 1)

          return {
            projects: {
              ...s.projects,
              [slug]: {
                ...current,
                step: prevStep
              }
            }
          }
        })
      }
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
