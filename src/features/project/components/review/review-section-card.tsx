'use client'

import { Card, CardContent, Checkbox } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import type { ReactNode } from 'react'

interface ReviewSectionCardProps {
  index: number
  title: string
  description: string
  included: boolean
  onToggle: (next: boolean) => void
  actions?: ReactNode
  children: ReactNode
}

export function ReviewSectionCard({
  index,
  title,
  description,
  included,
  onToggle,
  actions,
  children
}: ReviewSectionCardProps) {
  const checkboxId = `review-section-${index}`
  return (
    <Card
      className={cn('border-border/70 gap-4 transition-opacity', !included && 'bg-muted/40 opacity-60 grayscale-[35%]')}
    >
      <CardContent className='space-y-4'>
        <header className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <Checkbox
              id={checkboxId}
              checked={included}
              onCheckedChange={(checked) => onToggle(checked === true)}
              className='mt-1'
            />
            <label htmlFor={checkboxId} className='cursor-pointer space-y-0.5'>
              <p className='text-sm font-semibold'>
                <span className='text-muted-foreground mr-2 font-mono text-xs'>{String(index).padStart(2, '0')}</span>
                {title}
              </p>
              <p className='text-muted-foreground text-xs'>{description}</p>
            </label>
          </div>
          {actions && <div className='flex items-center gap-2'>{actions}</div>}
        </header>
        <div className={cn(!included && 'pointer-events-none')}>{children}</div>
      </CardContent>
    </Card>
  )
}
