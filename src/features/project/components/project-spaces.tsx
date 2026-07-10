'use client'

import { useRouter } from '@/i18n/navigation'
import { Button, Card, Textarea } from '@/shared/components/ui'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, Circle, ImagePlus, Trash2Icon, UploadCloud } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useFieldArray, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useSpaces } from '../hooks/use-spaces'
import { MAX_LAYOUT_IMAGES, type SpaceImagePayload, type SpacesFormValues } from '../schemas/project.schema'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'

interface ProjectSpacesProps {
  slug: string
}

const ACCEPTED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'] as const
const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'heic', 'heif'] as const
const IMAGE_ACCEPT_ATTR = [...ACCEPTED_IMAGE_MIME, ...ACCEPTED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`)].join(',')

function getFloorLabel(t: ReturnType<typeof useTranslations<'project.form'>>, index: number, isSpecial = false) {
  if (isSpecial) return t('specialFloorTitle')
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
        floors: Array.from({ length: floorCount }, (_, index) => {
          const saved = project.spaces?.floors.find((floor) => floor.floorIndex === index)
          return {
            floorIndex: index,
            description: saved?.description ?? '',
            layoutImages: saved?.layoutImages ?? []
          }
        })
      }
    })
  }, [floorCount, project?.designRequest, reset])

  const onSubmit: SubmitHandler<SpacesFormValues> = (body) => {
    updateProject({ slug, patch: { spaces: body.spaces } })
    window.scrollTo({ top: 0, behavior: 'instant' })
    router.push(project?.nextUrl ?? `/dashboard/projects/${slug}/ai-design-result`)
  }

  const persistSpacesDraft = (spaces: SpacesFormValues['spaces']) => {
    updateProject({ slug, patch: { spaces } })
  }

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        <div className='space-y-3'>
          <div className='space-y-4'>
            {fields.map((floor, index) => {
              const isSpecial = project?.designRequest?.floors[index]?.isSpecial ?? false
              return (
                <div key={floor.id} className='space-y-3'>
                  <Controller
                    name={`spaces.floors.${index}.description`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className='gap-3'>
                        <div className='-space-y-0.5'>
                          <FieldLabel className='text-base font-semibold'>
                            {getFloorLabel(t, index, isSpecial)} - {t('spaces.descriptionLabel')}
                          </FieldLabel>
                          <p className='text-sm text-muted-foreground'>{t('spaces.descriptionSubtitle')}</p>
                        </div>

                        <Textarea
                          {...field}
                          id={field.name}
                          rows={5}
                          placeholder={t('spaces.descriptionPlaceholder')}
                          aria-invalid={fieldState.invalid}
                          className='min-h-32 resize-y bg-card'
                          onChange={(e) => {
                            field.onChange(e)
                            const nextFloors = getValues('spaces.floors').map((item, itemIndex) =>
                              itemIndex === index ? { ...item, description: e.target.value } : item
                            )
                            persistSpacesDraft({ floors: nextFloors })
                          }}
                        />
                        <div className='min-h-4'>
                          {fieldState.invalid && <FieldError className='text-xs' errors={[fieldState.error]} />}
                        </div>
                      </Field>
                    )}
                  />

                  <Controller
                    name={`spaces.floors.${index}.layoutImages`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <LayoutImageCard
                        label={getFloorLabel(t, index, isSpecial)}
                        value={field.value}
                        invalid={fieldState.invalid}
                        error={fieldState.error}
                        onChange={(images) => {
                          const nextFloors = getValues('spaces.floors').map((item, itemIndex) =>
                            itemIndex === index ? { ...item, layoutImages: images } : item
                          )

                          setValue(`spaces.floors.${index}.layoutImages`, images, {
                            shouldDirty: true,
                            shouldValidate: true
                          })
                          persistSpacesDraft({ floors: nextFloors })
                        }}
                      />
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className='flex items-center justify-end gap-2'>
          {project.prevUrl && (
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' })
                router.push(project.prevUrl!)
              }}
            >
              {tc('back')}
            </Button>
          )}
          <Button type='submit'>{tc('next')}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

interface LayoutImageCardProps {
  label: string
  value: SpaceImagePayload[]
  invalid: boolean
  error?: { message?: string }
  onChange: (images: SpaceImagePayload[]) => void
}

function LayoutImageCard({ label, value, invalid, error, onChange }: LayoutImageCardProps) {
  const t = useTranslations('project.form')
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const slots = MAX_LAYOUT_IMAGES - value.length
    if (slots <= 0) {
      toast.error(t('spaces.maxImagesReached'))
      return
    }

    const validFiles: File[] = []
    Array.from(files).forEach((file) => {
      if (!isLayoutImage(file)) {
        toast.error(t('spaces.unsupportedImage', { name: file.name }))
      } else {
        validFiles.push(file)
      }
    })

    const toProcess = validFiles.slice(0, slots)
    if (toProcess.length < validFiles.length) {
      toast.warning(t('spaces.maxImagesReached'))
    }

    if (toProcess.length === 0) return

    const hasLayout = value.some((img) => img.isLayout)
    const readers = toProcess.map(
      (file, i) =>
        new Promise<SpaceImagePayload>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            const previewUrl = typeof reader.result === 'string' ? reader.result : ''
            if (!previewUrl) return
            resolve({
              name: file.name,
              type: file.type || 'image/*',
              size: file.size,
              previewUrl,
              isLayout: !hasLayout && i === 0
            })
          }
          reader.readAsDataURL(file)
        })
    )

    void Promise.all(readers).then((newImages) => onChange([...value, ...newImages]))
  }

  const removeImage = (index: number) => {
    const wasLayout = value[index]?.isLayout ?? false
    const next = value.filter((_, i) => i !== index)
    onChange(wasLayout && next.length > 0 ? next.map((img, i) => ({ ...img, isLayout: i === 0 })) : next)
  }

  const setAsLayout = (index: number) => {
    onChange(value.map((img, i) => ({ ...img, isLayout: i === index })))
  }

  return (
    <Card data-invalid={invalid} className={cn('overflow-hidden p-4 gap-3', invalid && 'border-destructive')}>
      <div className='-space-y-0.5'>
        <p className='font-semibold'>{label}</p>
        <p className='text-xs text-muted-foreground'>{t('spaces.dropHint')}</p>
      </div>

      {value.length > 0 && (
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
          {value.map((img, i) => (
            <div
              key={i}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-md border bg-muted',
                img.isLayout && 'ring-2 ring-primary'
              )}
            >
              <Image src={img.previewUrl} alt={img.name} fill className='object-contain' unoptimized />
              {img.isLayout && (
                <span className='absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground'>
                  {t('spaces.layoutBadge')}
                </span>
              )}
              <div className='absolute right-1 top-1 flex flex-col gap-1'>
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='size-6'
                  onClick={() => removeImage(i)}
                  aria-label={t('spaces.removeImage')}
                >
                  <Trash2Icon className='size-3' />
                </Button>
                <Button
                  type='button'
                  variant={img.isLayout ? 'default' : 'secondary'}
                  size='icon'
                  className='size-6'
                  onClick={() => setAsLayout(i)}
                  aria-label={t('spaces.setAsLayout')}
                  aria-pressed={img.isLayout}
                >
                  {img.isLayout ? <CheckCircle2 className='size-3' /> : <Circle className='size-3' />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
          'grid cursor-pointer place-items-center rounded-md border border-dashed p-4 text-center transition-colors',
          value.length === 0 ? 'min-h-56' : 'min-h-20',
          dragging ? 'border-primary bg-primary/5' : 'hover:border-primary/50 hover:bg-muted/40',
          invalid && value.length === 0 && 'border-destructive'
        )}
      >
        <div className='flex flex-col items-center gap-2'>
          <ImagePlus className={cn('text-muted-foreground', value.length === 0 ? 'size-7' : 'size-5')} />
          <p className={cn('font-medium', value.length === 0 ? 'text-sm' : 'text-xs')}>
            {value.length === 0 ? t('spaces.dropTitle') : t('spaces.addMore')}
          </p>
          {value.length === 0 && <p className='text-xs text-muted-foreground'>{t('spaces.dropHint')}</p>}
        </div>

        <input
          ref={inputRef}
          type='file'
          accept={IMAGE_ACCEPT_ATTR}
          multiple
          className='sr-only'
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <div className='min-h-4'>{invalid && error?.message && <FieldError className='text-xs' errors={[error]} />}</div>

      <div className='flex items-center gap-2'>
        <UploadCloud className='size-3.5 text-muted-foreground' />
        <span className='text-xs text-muted-foreground'>{t('spaces.uploadHint')}</span>
      </div>
    </Card>
  )
}
