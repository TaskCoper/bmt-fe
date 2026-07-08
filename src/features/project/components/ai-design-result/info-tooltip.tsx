'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Side = 'top' | 'right' | 'bottom' | 'left'

interface InfoTooltipProps {
  labelKey: string
  values?: Record<string, string | number>
  side?: Side
  className?: string
}

/**
 * Amber ? icon that pops a Radix Tooltip on hover/focus/tap.
 * Wraps around global TooltipProvider (mounted in shared/providers/app-providers.tsx).
 */
export function InfoTooltip({ labelKey, values, side = 'top', className }: InfoTooltipProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const content = t(labelKey as never, values as never)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            'text-primary hover:bg-primary/10 focus-visible:ring-primary/60 inline-flex size-4 items-center justify-center rounded-full outline-none focus-visible:ring-1',
            className
          )}
          aria-label={content}
          role='img'
        >
          <HelpCircle className='size-3.5' aria-hidden />
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className='bg-foreground text-background max-w-xs text-xs leading-relaxed'>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
