import type { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  /** Highlight the value (e.g. unhandled leads shown in red). */
  accent?: 'destructive';
}

/** Compact KPI card for dashboard overviews. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        <Icon
          className={cn(
            'size-4',
            accent === 'destructive'
              ? 'text-destructive'
              : 'text-muted-foreground',
          )}
        />
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-2xl font-semibold tracking-tight',
            accent === 'destructive' && 'text-destructive',
          )}
        >
          {value}
        </div>
        {hint ? (
          <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
