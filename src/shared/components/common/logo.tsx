import { Building2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { siteConfig } from '@/shared/config/site';

interface LogoProps {
  className?: string;
  /** Hide the wordmark, showing only the icon. */
  iconOnly?: boolean;
}

/** App wordmark + icon. Pair with a locale-aware <Link> at call sites. */
export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2 font-semibold', className)}>
      <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
        <Building2 className="size-4" />
      </span>
      {!iconOnly ? (
        <span className="text-sm tracking-tight">{siteConfig.name}</span>
      ) : null}
    </span>
  );
}
