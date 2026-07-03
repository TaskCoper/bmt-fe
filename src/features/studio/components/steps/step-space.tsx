'use client'

import { useTranslations } from 'next-intl'

import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useWizardStore } from '../../store/wizard.store'
import { StepSection } from '../step-section'
import { ImageUploader } from '../image-uploader'

/**
 * Floors rendered as ordered uploaders (ground → 1 → 2). MVP supports up to 3
 * floors and floor-plan images only — deed (sổ đỏ) uploads are not supported.
 */
const FLOORS = [
  { floor: 0, key: 'ground' },
  { floor: 1, key: 'first' },
  { floor: 2, key: 'second' },
] as const

/** Step 2 — upload space images per floor + optional space description. */
export function StepSpace() {
  const t = useTranslations('studio.space')

  const area = useWizardStore((s) => s.data.area)
  const rooms = useWizardStore((s) => s.data.rooms)
  const patch = useWizardStore((s) => s.patch)

  return (
    <div className="space-y-8">
      <StepSection title={t('uploadTitle')} description={t('uploadHint')}>
        <div className="space-y-6">
          {FLOORS.map((f) => (
            <ImageUploader
              key={f.floor}
              floor={f.floor}
              label={t(`floor.${f.key}`)}
            />
          ))}
        </div>
      </StepSection>

      <StepSection title={t('infoTitle')} description={t('infoHint')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="area">
              {t('areaLabel')} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="area"
                type="number"
                min={0}
                value={area || ''}
                onChange={(e) => patch({ area: Number(e.target.value) })}
                className="pr-12"
              />
              <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                m²
              </span>
            </div>
          </div>
          <div className="space-y-2 sm:row-span-2">
            <Label htmlFor="rooms">{t('roomsLabel')}</Label>
            <Textarea
              id="rooms"
              value={rooms}
              onChange={(e) => patch({ rooms: e.target.value })}
              placeholder={t('roomsPlaceholder')}
              rows={4}
            />
          </div>
        </div>
      </StepSection>
    </div>
  )
}
