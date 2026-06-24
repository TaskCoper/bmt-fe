import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PageHeader } from '@/shared/components/common';
import { AdminGuard } from '@/shared/auth';
import { ContentTable } from '@/features/cms';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('cms') };
}

export default async function CmsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return (
    <div className="space-y-6">
      <PageHeader title={tNav('cms')} description={tPages('cms.subtitle')} />
      <AdminGuard>
        <ContentTable />
      </AdminGuard>
    </div>
  );
}
