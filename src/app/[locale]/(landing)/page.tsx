import { setRequestLocale } from 'next-intl/server'

import {
  ContactSection,
  CtaSection,
  FeaturedProjects,
  LandingHero,
  ProcessSection,
  ServicesSection,
  StatsSection
} from '@/features/landing'
import type { Locale } from '@/i18n/routing'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <LandingHero />
      <ServicesSection />
      <ProcessSection />
      <FeaturedProjects />
      <StatsSection />
      <ContactSection />
      <CtaSection />
    </>
  )
}
