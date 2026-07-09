'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/constants/routes'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState, Reveal, StockImage } from '@/shared/components/common'
import { usePortfolio, usePortfolioItem } from '../hooks/use-portfolio'
import type { PortfolioItem } from '../types/portfolio.types'

/** Public portfolio detail — carousel → article body → related projects. */
export function PortfolioDetail({ slug }: { slug: string }) {
  const t = useTranslations('portfolio')
  const { data, isLoading } = usePortfolioItem(slug)
  const { data: relatedList } = usePortfolio({ category: data?.category ?? 'all', page: 1 })

  if (isLoading) {
    return (
      <div className='mx-auto max-w-4xl space-y-6'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-12 w-3/4' />
        <Skeleton className='aspect-video w-full rounded-2xl' />
        <Skeleton className='h-40 w-full' />
      </div>
    )
  }

  if (!data) {
    return <EmptyState title={t('notFound.title')} description={t('notFound.description')} />
  }

  const meta = [
    { label: t('facts.location'), value: data.location },
    { label: t('facts.year'), value: String(data.year) },
    { label: t('facts.area'), value: `${data.area} m²` },
    { label: t('facts.workType'), value: data.workType }
  ]

  const related = (relatedList?.items ?? []).filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <article className='mx-auto max-w-4xl space-y-10'>
      {/* Breadcrumb / back */}
      <Button asChild variant='ghost' size='sm' className='text-muted-foreground -ml-2'>
        <Link href={ROUTES.PORTFOLIO}>
          <ArrowLeft className='size-4' />
          {t('backToList')}
        </Link>
      </Button>

      {/* Category tag + title */}
      <Reveal>
        <header className='space-y-4'>
          <Badge variant='outline' className='border-primary/30 text-primary'>
            {t(`category.${data.category}`)}
          </Badge>
          <h1 className='font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
            {data.title}
          </h1>
          <p className='text-muted-foreground text-lg text-pretty'>{data.subtitle}</p>
        </header>
      </Reveal>

      {/* Meta — horizontal table-style row */}
      <Reveal delay={0.05}>
        <dl className='grid grid-cols-2 gap-x-6 gap-y-5 border-y py-6 sm:grid-cols-4'>
          {meta.map((m) => (
            <div key={m.label}>
              <dt className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>{m.label}</dt>
              <dd className='mt-1 font-semibold'>{m.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Image carousel */}
      <Reveal>
        <Carousel count={data.gallery.length} seed={data.slug} title={data.title} />
      </Reveal>

      {/* Article body — text only (rich text from the CMS) */}
      <Reveal>
        <div className='prose-content' dangerouslySetInnerHTML={{ __html: data.body }} />
      </Reveal>

      {/* Related projects */}
      {related.length > 0 ? (
        <Reveal>
          <section className='border-t pt-10'>
            <h2 className='mb-6 text-2xl font-bold tracking-tight'>{t('article.related')}</h2>
            <div className='grid gap-6 sm:grid-cols-3'>
              {related.map((p) => (
                <RelatedCard key={p.id} item={p} category={t(`category.${p.category}`)} />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </article>
  )
}

/** Horizontal scroll-snap image carousel with prev/next controls + dots. */
function Carousel({ count, seed, title }: { count: number; seed: string; title: string }) {
  const t = useTranslations('common')
  const ref = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const multiple = count > 1

  const scrollTo = (i: number) => {
    const el = ref.current
    if (el) el.scrollTo({ left: Math.max(0, Math.min(count - 1, i)) * el.clientWidth, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = ref.current
    if (el) setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <div
          ref={ref}
          onScroll={onScroll}
          className='scrollbar-none border-glass-border flex snap-x snap-mandatory overflow-x-auto rounded-2xl border'
        >
          {Array.from({ length: count }).map((_, i) => (
            <StockImage
              key={i}
              seed={`${seed}-${i}`}
              alt={title}
              width={1280}
              className='aspect-[16/9] w-full shrink-0 snap-center'
            />
          ))}
        </div>

        {multiple ? (
          <>
            <button
              type='button'
              aria-label={t('previous')}
              onClick={() => scrollTo(current - 1)}
              className='border-glass-border bg-background/85 hover:bg-background absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-colors'
            >
              <ChevronLeft className='size-5' />
            </button>
            <button
              type='button'
              aria-label={t('next')}
              onClick={() => scrollTo(current + 1)}
              className='border-glass-border bg-background/85 hover:bg-background absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-colors'
            >
              <ChevronRight className='size-5' />
            </button>
            <span className='absolute right-3 bottom-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md'>
              {current + 1}/{count}
            </span>
          </>
        ) : null}
      </div>

      {/* Dot indicators */}
      {multiple ? (
        <div className='flex justify-center gap-2'>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type='button'
              aria-label={`${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Related-project card. */
function RelatedCard({ item, category }: { item: PortfolioItem; category: string }) {
  return (
    <Link
      href={`${ROUTES.PORTFOLIO}/${item.slug}`}
      className='group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg'
    >
      <StockImage seed={item.slug} alt={item.title} width={600} className='aspect-[4/3] w-full' />
      <div className='space-y-1.5 p-4'>
        <Badge variant='outline'>{category}</Badge>
        <h3 className='group-hover:text-primary font-semibold transition-colors'>{item.title}</h3>
        <p className='text-muted-foreground text-sm'>{`${item.location} · ${item.year}`}</p>
      </div>
    </Link>
  )
}
