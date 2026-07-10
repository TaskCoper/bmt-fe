'use client'

import { Link, useRouter } from '@/i18n/navigation'
import {
  CreateProjectForm,
  buildProjectId,
  getProjectFlowUrls,
  useCreateProject,
  useProjectStore
} from '@/features/project'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/components/ui'
import { useTranslations } from 'next-intl'
import { FormProvider, type SubmitHandler } from 'react-hook-form'
import type { CreateProjectFormValues } from '@/features/project'

export default function CreateProjectPage() {
  const t = useTranslations('project')
  const router = useRouter()
  const { methods } = useCreateProject()
  const addProject = useProjectStore((s) => s.addProject)

  const onSubmit: SubmitHandler<CreateProjectFormValues> = (body) => {
    const { id, slug, createdAt } = buildProjectId(body.name)
    const flow = getProjectFlowUrls(slug, 'detail')
    addProject({
      ...body,
      id,
      slug,
      createdAt,
      designRequest: null,
      spaces: null,
      aiDesignResult: null,
      galleries: {},
      ...flow
    })
    methods.reset()
    router.push(`/dashboard/projects/${slug}`)
  }

  return (
    <div className='mx-auto w-full max-w-2xl space-y-6'>
      <div className='-space-y-0.5'>
        <h1 className='text-2xl font-semibold'>{t('dialog.title')}</h1>
        <p className='text-muted-foreground text-sm'>{t('dialog.description')}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <CreateProjectForm />

          <div className='flex items-center justify-end gap-2'>
            <Button type='button' variant='outline' asChild>
              <Link href={ROUTES.PROJECTS}>{t('cancel')}</Link>
            </Button>
            <Button type='submit'>{t('create')}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
