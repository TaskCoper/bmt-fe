import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

/** Titled section block used to group fields within a wizard step. */
export function StepSection({
  title,
  description,
  className,
  children,
}: {
  title: string
  description?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span
            aria-hidden
            className="bg-primary/70 h-4 w-1 shrink-0 rounded-full"
          />
          {title}
        </h3>
        {description ? (
          <p className="text-muted-foreground pl-3 text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
