import { CreateProjectDialog, ProjectGrid } from '@/features/project'
import type { Locale } from '@/i18n/routing'
import { Button } from '@/shared/components/ui'
import { PlusCircleIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'project' })
  return { title: t('title') }
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'project' })

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:p-8'>
      <div className='flex items-center gap-2'>
        <div className='flex-1 -space-y-0.5'>
          <h1 className='text-2xl font-semibold'>{t('title')}</h1>
          <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
        </div>

        <CreateProjectDialog>
          <Button size='sm'>
            <PlusCircleIcon />
            {t('create')}
          </Button>
        </CreateProjectDialog>
      </div>

      <ProjectGrid />
    </div>
  )
}
