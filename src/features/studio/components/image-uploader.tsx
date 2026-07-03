'use client'

import { useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ImagePlus, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import {
  ACCEPTED_IMAGE_MIME,
  IMAGE_ACCEPT_ATTR,
  MAX_IMAGES_PER_FLOOR,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from '../constants/studio.constants'
import { useWizardStore } from '../store/wizard.store'

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'heic', 'heif']

/**
 * Drag-and-drop image dropzone for a single floor (UI mock — captures file
 * names only, no real upload). Shows placeholder thumbnails with remove.
 */
export function ImageUploader({
  floor,
  label,
}: {
  floor: number
  label: string
}) {
  const t = useTranslations('studio.space')
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  // Select the stable array reference, then derive the floor subset with
  // useMemo — returning `.filter(...)` straight from the selector creates a
  // new array every render and trips Zustand's getSnapshot cache (infinite loop).
  const allImages = useWizardStore((s) => s.data.images)
  const images = useMemo(
    () => allImages.filter((i) => i.floor === floor),
    [allImages, floor],
  )
  const addImages = useWizardStore((s) => s.addImages)
  const removeImage = useWizardStore((s) => s.removeImage)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Validate type + size; collect the ones that pass.
    const valid: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      const typeOk =
        (ACCEPTED_IMAGE_MIME as readonly string[]).includes(file.type) ||
        ACCEPTED_EXTENSIONS.includes(ext)
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

    // Enforce the per-floor cap.
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
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>
      <div
        role="button"
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
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'hover:border-primary/50 hover:bg-muted/40',
        )}
      >
        <ImagePlus className="text-muted-foreground size-6" />
        <p className="text-sm font-medium">{t('dropTitle')}</p>
        <p className="text-muted-foreground text-xs">{t('dropHint')}</p>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT_ATTR}
          multiple
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <li
              key={img.id}
              className="group bg-muted relative aspect-square overflow-hidden rounded-md border"
            >
              <div className="from-primary/20 to-primary/5 flex size-full items-center justify-center bg-gradient-to-br p-2">
                <span className="text-muted-foreground line-clamp-3 text-center text-[10px] break-all">
                  {img.name}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(img.id)
                }}
                aria-label={t('remove')}
                className="bg-background/80 absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
