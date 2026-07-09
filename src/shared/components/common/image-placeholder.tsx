import { ImageIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

/**
 * Neutral image placeholder — a faint blueprint grid + centered icon. Used
 * wherever real photos aren't wired yet, instead of coloured gradients.
 */
export function ImagePlaceholder({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div
      className={cn(
        'bg-muted/40 text-muted-foreground/40 relative flex items-center justify-center overflow-hidden',
        className
      )}
    >
      <div
        aria-hidden
        className='absolute inset-0 opacity-70'
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--grid-line) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 22px)'
        }}
      />
      <ImageIcon className={cn('relative size-8', iconClassName)} />
    </div>
  )
}
