'use client'

import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState, ImagePlaceholder } from '@/shared/components/common'
import { usePortfolioItem } from '../hooks/use-portfolio'

/** Public portfolio detail — a blog-style project article (CMS rich text). */
export function PortfolioDetail({ slug }: { slug: string }) {
  const t = useTranslations('portfolio')
  const { data, isLoading } = usePortfolioItem(slug)

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
      <header className='space-y-4'>
        <Badge variant='outline' className='border-primary/30 text-primary'>
          {t(`category.${data.category}`)}
        </Badge>
        <h1 className='font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
          {data.title}
        </h1>
        <p className='text-muted-foreground text-lg text-pretty'>{data.subtitle}</p>
      </header>

      {/* Meta — horizontal table-style row */}
      <dl className='grid grid-cols-2 gap-x-6 gap-y-5 border-y py-6 sm:grid-cols-4'>
        {meta.map((m) => (
          <div key={m.label}>
            <dt className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>{m.label}</dt>
            <dd className='mt-1 font-semibold'>{m.value}</dd>
          </div>
        ))}
      </dl>

      {/* Lead image */}
      <ImagePlaceholder className='aspect-[16/9] w-full rounded-2xl border' iconClassName='size-10' />

      {/* Article body (rich text from the CMS) */}
      <div className='prose-content' dangerouslySetInnerHTML={{ __html: data.body }} />
    </article>
  )
}
