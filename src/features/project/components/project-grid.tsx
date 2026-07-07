'use client'

import { useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'
import { useProjectStore } from '../store/project.store'
import ProjectCard from './project-card'

const subscribeHydration = (cb: () => void) => useProjectStore.persist.onFinishHydration(cb)
const getHydrated = () => useProjectStore.persist.hasHydrated()
const getServerHydrated = () => false

export default function ProjectGrid() {
  const t = useTranslations('project')
  const hydrated = useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated)
  const projects = useProjectStore((s) => s.projects)

  if (!hydrated) return null

  const items = Object.values(projects).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  if (items.length === 0) {
    return (
      <div className='text-muted-foreground rounded-lg border border-dashed py-16 text-center text-sm'>
        <p className='font-medium'>{t('empty.title')}</p>
        <p className='mt-1'>{t('empty.description')}</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-6 gap-4'>
      {items.map((project) => (
        <div key={project.id} className='col-span-6 sm:col-span-3 md:col-span-2'>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}
