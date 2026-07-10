import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { PageHeader } from '@/shared/components/common'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ROUTES } from '@/shared/constants/routes'
import { ADMIN_NAV } from '../_components/admin-nav'
import { ADMIN_COPY } from '../_components/admin.copy'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export const metadata: Metadata = { title: ADMIN_COPY.pages.overview.title }

/** Admin landing: quick-access cards into every back-office section. */
export default async function AdminOverviewPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  // The overview card itself is not a destination on this page.
  const sections = ADMIN_NAV.filter((item) => item.href !== ROUTES.ADMIN)

  return (
    <div className='space-y-8'>
      <PageHeader title={ADMIN_COPY.pages.overview.title} description={ADMIN_COPY.pages.overview.subtitle} />

      <section className='space-y-4'>
        <h2 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
          {ADMIN_COPY.pages.overview.quickAccess}
        </h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {sections.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className='group'>
                <Card className='hover:border-primary/40 hover:bg-accent/40 h-full transition-colors'>
                  <CardHeader>
                    <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl'>
                      <Icon className='size-5' />
                    </div>
                    <CardTitle className='mt-3 text-base'>{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
