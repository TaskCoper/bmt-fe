'use client'

import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { ImagePlus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  ACCEPTED_IMAGE_MIME,
  IMAGE_ACCEPT_ATTR,
  MAX_IMAGES_PER_FLOOR,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB
} from '../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'heic', 'heif']

/**
 * Drag-and-drop floor-plan dropzone for a single floor (UI mock — captures file
 * names only). Placeholder thumbnails with remove; enforces per-floor cap.
 */
export function FloorDropzone({ floor, label }: { floor: number; label: string }) {
  const t = useTranslations('studio.layouts')
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const project = useCurrentProject()
  const allImages = project?.data.images
  const images = useMemo(() => (allImages ?? []).filter((i) => i.floor === floor), [allImages, floor])
  const addImages = useWizardStore((s) => s.addImages)
  const removeImage = useWizardStore((s) => s.removeImage)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const valid: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      const typeOk = (ACCEPTED_IMAGE_MIME as readonly string[]).includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext)
      if (!typeOk) {
        toast.error(t('errorType', { name: file.name }))
        continue
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(t('errorSize', { name: file.name, max: MAX_IMAGE_SIZE_MB }))
        continue
      }
      valid.push(file.name)
    }
    if (valid.length === 0) return

    const remaining = MAX_IMAGES_PER_FLOOR - images.length
    if (remaining <= 0) {
      toast.error(t('errorMax', { max: MAX_IMAGES_PER_FLOOR }))
      return
    }
    if (valid.length > remaining) {
      toast.warning(t('errorMax', { max: MAX_IMAGES_PER_FLOOR }))
    }
    addImages(floor, valid.slice(0, remaining))
  }

  return (
    <div className='border-glass-border bg-background/40 space-y-3 rounded-xl border p-4 backdrop-blur-sm'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium'>{label}</p>
        {images.length > 0 ? <Badge variant='secondary'>{t('uploaded', { count: images.length })}</Badge> : null}
      </div>

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
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
          dragging
            ? 'border-primary/40 bg-primary/5'
            : 'border-glass-border hover:border-primary/40 hover:bg-background/60'
        )}
      >
        <ImagePlus className='text-muted-foreground size-6' />
        <p className='text-sm font-medium'>{t('dropTitle')}</p>
        <p className='text-muted-foreground text-xs'>{t('dropHint', { max: MAX_IMAGE_SIZE_MB })}</p>
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

      {images.length > 0 ? (
        <ul className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {images.map((img) => (
            <li
              key={img.id}
              className='group border-glass-border bg-background/40 relative aspect-square overflow-hidden rounded-xl border backdrop-blur-sm'
            >
              <div className='from-primary/20 to-primary/5 flex size-full items-center justify-center bg-gradient-to-br p-2'>
                <span className='text-muted-foreground line-clamp-3 text-center text-[10px] break-all'>{img.name}</span>
              </div>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(img.id)
                }}
                aria-label={t('remove')}
                className='bg-background/70 border-glass-border absolute top-1 right-1 rounded-full border p-1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100'
              >
                <X className='size-3.5' />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
