'use client'

import { useRouter } from '@/i18n'
import { Button } from '@/shared/components/ui'
import { Field, FieldDescription, FieldLabel } from '@/shared/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/shared/components/ui/input-group'
import { useEffect } from 'react'
import { Controller, FormProvider, type SubmitHandler } from 'react-hook-form'
import { useDesignRequest } from '../../hooks/use-design-request'
import { type DesignRequestFormValues } from '../../schemas/project.schema'
import { useProjectStore } from '../../store/project.store'

export default function DesignRequestForm({ slug }: { slug: string }) {
  const projects = useProjectStore((s) => s.projects)
  const router = useRouter()
  const { methods } = useDesignRequest()

  const updateProject = useProjectStore((s) => s.updateProject)
  const nextStep = useProjectStore((s) => s.nextStep)

  const project = projects[slug]

  const onSubmit: SubmitHandler<DesignRequestFormValues> = (body) => {
    updateProject({ slug, patch: body })
    nextStep(slug)
    router.push(`/projects/${slug}/spaces`)
  }

  useEffect(() => {
    methods.setValue('designRequest', project?.designRequest ?? '')
  }, [slug, project?.designRequest, methods])

  if (!project) {
    return <p>Không tìm thấy dự án</p>
  }

  if (project.step !== 2 && project.designRequest) {
    return null
  }

  return (
    <div className='space-y-8'>
      <div>
        <p className='font-semibold text-2xl'>Yêu cầu thiết kế</p>
        <p className='text-sm text-muted-foreground'>
          Mô tả chi tiết về ngôi nhà của bạn. Càng chi tiết thì bảng vẽ càng đẹp
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='designRequest'
            control={methods.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='gap-1'>
                <FieldLabel htmlFor={field.name} className='gap-0.5'>
                  Yêu cầu thiết kế
                  <span className='text-destructive font-semibold'>*</span>
                </FieldLabel>

                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id={field.name}
                    placeholder='Nhập mô tả yêu cầu thiết kế'
                    rows={6}
                    className='min-h-24 resize-none wrap-break-word'
                    aria-invalid={fieldState.invalid}
                  />

                  <InputGroupAddon align='block-end'>
                    <InputGroupText className='text-xs tabular-nums'>{field.value?.length}/10.000 ký tự</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <FieldDescription>Càng chi tiết bảng vẽ càng đẹp</FieldDescription>
              </Field>
            )}
          />

          <div className='flex items-center justify-end gap-2'>
            <Button variant='outline'>Quay lại</Button>
            <Button>Tiếp tục</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
