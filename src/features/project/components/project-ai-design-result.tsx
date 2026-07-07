'use client'

import { Link } from '@/i18n/navigation'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { FileText, ImageIcon, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'

interface ProjectAiDesignResultProps {
  slug: string
}

export default function ProjectAIDesignResult({ slug }: ProjectAiDesignResultProps) {
  const t = useTranslations('project.form')
  const tc = useTranslations('common')
  const projects = useProjectStore((s) => s.projects)

  useSetProjectFlow(slug, 'ai-design-result')

  const project = projects[slug]

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  if (!project.spaces) {
    return (
      <div className='space-y-6'>
        <div>
          <p className='font-semibold text-2xl'>{t('aiDesignResult.title')}</p>
          <p className='text-sm text-muted-foreground'>{t('aiDesignResult.missingSpaces')}</p>
        </div>

        {project.prevUrl && (
          <Button type='button' variant='outline' asChild>
            <Link href={project.prevUrl}>{tc('back')}</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div>
        <p className='font-semibold text-2xl'>{t('aiDesignResult.title')}</p>
        <p className='text-sm text-muted-foreground'>{t('aiDesignResult.subtitle')}</p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <Sparkles className='size-5 text-primary' />
            <CardTitle className='text-base'>{t('aiDesignResult.readyTitle')}</CardTitle>
            <CardDescription>{t('aiDesignResult.readyDescription')}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <ImageIcon className='size-5 text-primary' />
            <CardTitle className='text-base'>{t('aiDesignResult.designOutputTitle')}</CardTitle>
            <CardDescription>{t('aiDesignResult.designOutputDescription')}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <FileText className='size-5 text-primary' />
            <CardTitle className='text-base'>{t('aiDesignResult.estimateProfileTitle')}</CardTitle>
            <CardDescription>{t('aiDesignResult.estimateProfileDescription')}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='font-medium'>{project.name}</p>
            <p className='text-sm text-muted-foreground'>{t('aiDesignResult.summary')}</p>
          </div>
          <Button type='button'>
            <Sparkles className='size-4' />
            {t('aiDesignResult.generate')}
          </Button>
        </CardContent>
      </Card>

      <div className='flex items-center justify-end gap-2'>
        {project.prevUrl && (
          <Button type='button' variant='outline' asChild>
            <Link href={project.prevUrl}>{tc('back')}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
