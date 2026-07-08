'use client'

import { cn } from '@/shared/lib/utils'

/** A compact segmented choice control built from buttons. */
export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  render,
  className,
}: {
  value: T
  options: readonly T[]
  onChange: (v: T) => void
  render: (v: T) => string
  className?: string
}) {
  return (
    <div
      className={cn(
        'glass-inset inline-flex flex-wrap gap-1 rounded-xl p-1',
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
            value === opt
              ? 'bg-background/90 text-foreground border-glass-border border shadow-sm backdrop-blur'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {render(opt)}
        </button>
      ))}
    </div>
  )
}
