import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PageHeader } from '@/shared/components/common';
import {
  DashboardOverview,
  RecentProjects,
  ActivityFeed,
} from '@/features/dashboard';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  return { title: t('title') };
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('overview')} />
      <DashboardOverview />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentProjects />
        <ActivityFeed />
      </div>
    </div>
  );
}
