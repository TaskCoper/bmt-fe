'use client'

import { useTranslations } from 'next-intl'
import { Check, Home } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { HOUSE_STYLE_LIST } from '../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'
import { TumToggle } from './tum-toggle'

/** Single-select style cards; reveals the tum toggle for eligible styles. */
export function StyleRadioCard() {
  const t = useTranslations('studio.style')
  const project = useCurrentProject()
  const setStyle = useWizardStore((s) => s.setStyle)
  const style = project?.data.style

  const selectedOption = HOUSE_STYLE_LIST.find((o) => o.id === style)

  return (
    <div className='space-y-4'>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {HOUSE_STYLE_LIST.map((opt) => {
          const selected = style === opt.id
          return (
            <button
              key={opt.id}
              type='button'
              onClick={() => setStyle(opt.id)}
              className={cn('glass-card p-4 text-left', selected && 'glass-selected')}
            >
              {selected ? (
                <span className='bg-primary text-primary-foreground absolute top-3 right-3 flex size-5 items-center justify-center rounded-full shadow-sm'>
                  <Check className='size-3' />
                </span>
              ) : null}
              <span
                className={cn(
                  'mb-3 flex size-9 items-center justify-center rounded-xl border transition-colors',
                  selected
                    ? 'border-primary/30 bg-primary/15 text-primary'
                    : 'border-border bg-background/50 text-muted-foreground'
                )}
              >
                <Home className='size-4.5' />
              </span>
              <div className='text-sm font-medium'>{t(`name.${opt.id}`)}</div>
              <div className='text-muted-foreground mt-1 text-xs'>{t(`desc.${opt.id}`)}</div>
            </button>
          )
        })}
      </div>

      {selectedOption?.hasTumOption ? <TumToggle /> : null}
    </div>
  )
}
