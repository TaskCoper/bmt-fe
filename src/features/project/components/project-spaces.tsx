'use client'

import { Link, useRouter } from '@/i18n/navigation'
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Textarea
} from '@/shared/components/ui'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { cn } from '@/shared/lib/utils'
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useFieldArray, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useSpaces } from '../hooks/use-spaces'
import { type SpaceImagePayload, type SpacesFormValues } from '../schemas/project.schema'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'

interface ProjectSpacesProps {
  slug: string
}

const ACCEPTED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'] as const
const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'heic', 'heif'] as const
const IMAGE_ACCEPT_ATTR = [...ACCEPTED_IMAGE_MIME, ...ACCEPTED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`)].join(',')

function getFloorLabel(t: ReturnType<typeof useTranslations<'project.form'>>, index: number) {
  return index === 0 ? t('spaces.groundFloor') : t('spaces.upperFloor', { index })
}

function isLayoutImage(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return (
    (ACCEPTED_IMAGE_MIME as readonly string[]).includes(file.type) ||
    (ACCEPTED_IMAGE_EXTENSIONS as readonly string[]).includes(ext)
  )
}

export default function ProjectSpaces({ slug }: ProjectSpacesProps) {
  const t = useTranslations('project.form')
  const tc = useTranslations('common')
  const projects = useProjectStore((s) => s.projects)
  const updateProject = useProjectStore((s) => s.updateProject)
  const router = useRouter()

  const { methods } = useSpaces()

  useSetProjectFlow(slug, 'spaces')

  const project = projects[slug]

  const { control, getValues, handleSubmit, reset, setValue } = methods
  const { fields } = useFieldArray({ control, name: 'spaces.floors' })

  const floorCount = project?.designRequest?.floors.length ?? 0

  useEffect(() => {
    if (!project?.designRequest) return

    reset({
      spaces: {
        description: project.spaces?.description ?? '',
        floors: Array.from({ length: floorCount }, (_, index) => ({
          floorIndex: index,
          layoutImage: project.spaces?.floors.find((floor) => floor.floorIndex === index)?.layoutImage ?? null
        }))
      }
    })
  }, [floorCount, project?.designRequest, project?.spaces, reset])

  const onSubmit: SubmitHandler<SpacesFormValues> = (body) => {
    updateProject({ slug, patch: { spaces: body.spaces } })
    router.push(project?.nextUrl ?? `/dashboard/projects/${slug}/ai-design-result`)
  }

  const persistSpacesDraft = (spaces: SpacesFormValues['spaces']) => {
    updateProject({ slug, patch: { spaces } })
  }

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  if (!project.designRequest) {
    return (
      <div className='space-y-6'>
        <div>
          <p className='font-semibold text-2xl'>{t('spaces.title')}</p>
          <p className='text-sm text-muted-foreground'>{t('spaces.missingDesignRequest')}</p>
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
        <p className='font-semibold text-2xl'>{t('spaces.title')}</p>
        <p className='text-sm text-muted-foreground'>{t('spaces.subtitle')}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='spaces.description'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='gap-1'>
                <FieldLabel htmlFor={field.name} className='gap-0.5'>
                  {t('spaces.descriptionLabel')}
                  <span className='text-destructive font-semibold'>*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={5}
                  placeholder={t('spaces.descriptionPlaceholder')}
                  aria-invalid={fieldState.invalid}
                  className='min-h-32 resize-y'
                  onChange={(e) => {
                    field.onChange(e)
                    persistSpacesDraft({
                      ...getValues('spaces'),
                      description: e.target.value
                    })
                  }}
                />
                <div className='min-h-4'>
                  {fieldState.invalid && <FieldError className='text-xs' errors={[fieldState.error]} />}
                </div>
              </Field>
            )}
          />

          <Separator />

          <div className='space-y-3'>
            <div>
              <FieldLabel className='gap-0.5'>
                {t('spaces.uploadTitle')}
                <span className='text-destructive font-semibold'>*</span>
              </FieldLabel>
              <p className='text-sm text-muted-foreground'>{t('spaces.uploadHint')}</p>
            </div>

            <div className='space-y-4'>
              {fields.map((floor, index) => (
                <Controller
                  key={floor.id}
                  name={`spaces.floors.${index}.layoutImage`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <LayoutImageCard
                      label={getFloorLabel(t, index)}
                      value={field.value}
                      invalid={fieldState.invalid}
                      error={fieldState.error}
                      onChange={(image) => {
                        const nextFloors = getValues('spaces.floors').map((item, itemIndex) =>
                          itemIndex === index ? { ...item, layoutImage: image } : item
                        )

                        setValue(`spaces.floors.${index}.layoutImage`, image, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                        persistSpacesDraft({
                          description: getValues('spaces.description'),
                          floors: nextFloors
                        })
                      }}
                    />
                  )}
                />
              ))}
            </div>
          </div>

          <div className='flex items-center justify-end gap-2'>
            {project.prevUrl && (
              <Button type='button' variant='outline' asChild>
                <Link href={project.prevUrl}>{tc('back')}</Link>
              </Button>
            )}
            <Button type='submit'>{tc('next')}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

interface LayoutImageCardProps {
  label: string
  value: SpaceImagePayload | null
  invalid: boolean
  error?: { message?: string }
  onChange: (image: SpaceImagePayload | null) => void
}

function LayoutImageCard({ label, value, invalid, error, onChange }: LayoutImageCardProps) {
  const t = useTranslations('project.form')
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    if (!isLayoutImage(file)) {
      toast.error(t('spaces.unsupportedImage', { name: file.name }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const previewUrl = typeof reader.result === 'string' ? reader.result : ''
      if (!previewUrl) return

      onChange({
        name: file.name,
        type: file.type || 'image/*',
        size: file.size,
        previewUrl
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card data-invalid={invalid} className={cn('overflow-hidden', invalid && 'border-destructive')}>
      <CardHeader>
        <CardTitle className='text-sm'>{label}</CardTitle>
        <CardDescription>{value ? t('spaces.replaceImage') : t('spaces.dropHint')}</CardDescription>
        {value && (
          <CardAction>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => {
                onChange(null)
              }}
              aria-label={t('spaces.removeImage')}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className='space-y-3'>
        <div
          role='button'
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            'grid min-h-56 cursor-pointer place-items-center rounded-md border border-dashed p-4 text-center transition-colors',
            dragging ? 'border-primary bg-primary/5' : 'hover:border-primary/50 hover:bg-muted/40',
            invalid && 'border-destructive'
          )}
        >
          {value ? (
            <div className='w-full space-y-3'>
              <div className='relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-md border bg-muted'>
                <Image src={value.previewUrl} alt={value.name} fill className='object-contain' unoptimized />
              </div>
              <p className='text-sm font-medium break-all'>{value.name}</p>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2'>
              <ImagePlus className='size-7 text-muted-foreground' />
              <p className='text-sm font-medium'>{t('spaces.dropTitle')}</p>
              <p className='text-xs text-muted-foreground'>{t('spaces.dropHint')}</p>
            </div>
          )}
          <input
            ref={inputRef}
            type='file'
            accept={IMAGE_ACCEPT_ATTR}
            className='sr-only'
            onChange={(e) => {
              handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
        <div className='flex min-h-4 items-center gap-2'>
          <UploadCloud className='size-3.5 text-muted-foreground' />
          <span className='text-xs text-muted-foreground'>{t('spaces.uploadHint')}</span>
        </div>
        <div className='min-h-4'>{invalid && <FieldError className='text-xs' errors={[error]} />}</div>
      </CardContent>
    </Card>
  )
}
