'use client'

import { useTranslations } from 'next-intl'
import { ArrowLeft, MapPin, Ruler, Calendar, Palette } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/common'
import { usePortfolioItem } from '../hooks/use-portfolio'

/** Public portfolio detail page for a single showcased project. */
export function PortfolioDetail({ slug }: { slug: string }) {
  const t = useTranslations('portfolio')
  const { data, isLoading } = usePortfolioItem(slug)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="aspect-[16/7] w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <EmptyState
        title={t('notFound.title')}
        description={t('notFound.description')}
      />
    )
  }

  const facts = [
    { icon: Calendar, label: t('facts.year'), value: String(data.year) },
    { icon: MapPin, label: t('facts.location'), value: data.location },
    { icon: Ruler, label: t('facts.area'), value: `${data.area} m²` },
    { icon: Palette, label: t('facts.style'), value: data.style },
  ]

  return (
    <article className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={ROUTES.PORTFOLIO}>
          <ArrowLeft className="size-4" />
          {t('backToList')}
        </Link>
      </Button>

      <header className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{t(`category.${data.category}`)}</Badge>
          <Badge variant="secondary">{data.style}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
        <p className="text-muted-foreground max-w-2xl">{data.summary}</p>
      </header>

      {/* Cover */}
      <div
        className="aspect-[16/7] w-full rounded-xl"
        style={{
          background: `linear-gradient(135deg, hsl(${data.coverHue} 65% 55%), hsl(${(data.coverHue + 45) % 360} 60% 38%))`,
        }}
      />

      {/* Facts */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="rounded-lg border p-4">
            <f.icon className="text-muted-foreground size-4" />
            <p className="text-muted-foreground mt-2 text-xs">{f.label}</p>
            <p className="font-medium">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="max-w-3xl">
        <h2 className="text-lg font-semibold">{t('about')}</h2>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Gallery */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">{t('gallery')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.gallery.map((img, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg"
              style={{
                background: `linear-gradient(135deg, hsl(${img.hue} 65% 55%), hsl(${(img.hue + 40) % 360} 60% 38%))`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-muted/40 flex flex-col items-start gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{t('cta.title')}</p>
          <p className="text-muted-foreground text-sm">{t('cta.subtitle')}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.PROJECT_NEW}>{t('cta.button')}</Link>
        </Button>
      </div>
    </article>
  )
}
