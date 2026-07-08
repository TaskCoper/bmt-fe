interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
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
        <span className="text-primary/85 border-primary/25 bg-primary/5 mb-4 inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
          {badge}
        </span>
      ) : null}
      <h2 className="text-heading text-balance">{title}</h2>
      {subtitle ? (
        <p className="text-muted-foreground mt-4 text-base text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
