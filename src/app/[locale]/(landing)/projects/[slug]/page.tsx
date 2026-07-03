import { setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PortfolioDetail } from '@/features/portfolio';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 lg:px-8 lg:py-16">
      <PortfolioDetail slug={slug} />
    </div>
  );
}
