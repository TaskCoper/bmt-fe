'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui'
import { useTranslations } from 'next-intl'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'

interface ProjectSpacesProps {
  slug: string
}

export default function ProjectSpaces({ slug }: ProjectSpacesProps) {
  const t = useTranslations('project.form')
  const tc = useTranslations('common')
  const projects = useProjectStore((s) => s.projects)

  useSetProjectFlow(slug, 'spaces')

  const project = projects[slug]

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='font-semibold text-2xl'>{project.name}</p>
        <p className='text-sm text-muted-foreground'>{t('spaces.subtitle')}</p>
      </div>

      {project.prevUrl && (
        <Button type='button' variant='outline' asChild>
          <Link href={project.prevUrl}>{tc('back')}</Link>
        </Button>
      )}
    </div>
  )
}
