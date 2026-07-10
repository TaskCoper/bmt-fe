'use client'

import { useRouter } from '@/i18n/navigation'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FormProvider, type SubmitHandler } from 'react-hook-form'
import { useCreateProject } from '../../hooks/use-create-project'
import { type CreateProjectFormValues } from '../../schemas/project.schema'
import { buildProjectId, getProjectFlowUrls, useProjectStore } from '../../store/project.store'
import CreateProjectForm from './create-project-form'

interface CreateProjectDialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateProjectDialog({
  children,
  open: controlledOpen,
  onOpenChange
}: CreateProjectDialogProps) {
  const t = useTranslations('project')
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
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
    setOpen(false)
    methods.reset()
    router.push(`/dashboard/projects/${slug}`)
  }

  const onClose = () => {
    methods.reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          methods.reset()
        }
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent position='top-center' className='min-w-xl' showCloseButton={false} onInteractOutside={onClose}>
        <DialogHeader className='-space-y-1'>
          <DialogTitle>{t('dialog.title')}</DialogTitle>
          <DialogDescription>{t('dialog.description')}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CreateProjectForm />

            <div className='flex items-center justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type='submit'>{t('create')}</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
