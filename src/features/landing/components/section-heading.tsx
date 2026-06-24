import { Badge } from '@/shared/components/ui/badge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

/** Centered section header shared across landing sections for consistency. */
export function SectionHeading({
  badge,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      {badge ? (
        <Badge variant="secondary" className="mb-4">
          {badge}
        </Badge>
      ) : null}
      <h2 className="text-heading text-balance">{title}</h2>
      {subtitle ? (
        <p className="text-muted-foreground mt-4 text-base text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
