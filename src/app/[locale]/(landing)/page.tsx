import { setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import {
  LandingHero,
  ServicesSection,
  ProcessSection,
  FeaturedProjects,
  StatsSection,
  CtaSection,
  ContactSection,
} from '@/features/landing';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

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
  );
}
