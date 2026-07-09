import { setRequestLocale } from 'next-intl/server'

import {
  ContactSection,
  FeatureSpotlights,
  FeaturedProjects,
  LandingHero,
  ProcessSection,
  ServicesSection,
  StatsSection
} from '@/features/landing'
import { AmbientAura, Reveal } from '@/shared/components/common'
import type { Locale } from '@/i18n/routing'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className='relative'>
      <AmbientAura className='fixed' />
      <LandingHero />
      <FeatureSpotlights />
      <ProcessSection />
      <ServicesSection />
      <FeaturedProjects />
      <StatsSection />
      <Reveal>
        <ContactSection />
      </Reveal>
    </div>
  )
}
