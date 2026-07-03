import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

/** Titled section block used to group fields within a wizard step. */
export function StepSection({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
