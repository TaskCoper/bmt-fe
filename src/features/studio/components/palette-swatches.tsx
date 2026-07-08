'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Label } from '@/shared/components/ui/label'
import { PALETTE_SWATCHES } from '../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'

/** Multi-select accent-color swatches for the design brief. */
export function PaletteSwatches() {
  const t = useTranslations('studio.extra')
  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)
  const colors = project?.data.primaryColors ?? []

  const toggle = (hex: string) => {
    const next = colors.includes(hex)
      ? colors.filter((c) => c !== hex)
      : [...colors, hex]
    patch({ primaryColors: next })
  }

  return (
    <div className="space-y-2">
      <Label>{t('colorLabel')}</Label>
      <div className="flex flex-wrap gap-2">
        {PALETTE_SWATCHES.map((hex) => {
          const active = colors.includes(hex)
          return (
            <button
              key={hex}
              type="button"
              onClick={() => toggle(hex)}
              aria-pressed={active}
              title={hex}
              style={{ backgroundColor: hex }}
              className={cn(
                'border-glass-border flex size-8 items-center justify-center rounded-full border transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
                active
                  ? 'ring-primary/70 ring-offset-background scale-110 ring-2 ring-offset-2'
                  : 'hover:scale-105',
              )}
            >
              {active ? (
                <Check className="size-4 text-white drop-shadow" />
              ) : null}
            </button>
          )
        })}
      </div>
      <p className="text-muted-foreground text-xs">{t('colorHint')}</p>
    </div>
  )
}
