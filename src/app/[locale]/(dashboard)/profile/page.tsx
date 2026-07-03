import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PageHeader } from '@/shared/components/common';
import { ProfilePanel } from '@/features/profile';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'profile' });
  return { title: t('title') };
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'profile' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('subtitle')} />
      <ProfilePanel />
    </div>
  );
}
