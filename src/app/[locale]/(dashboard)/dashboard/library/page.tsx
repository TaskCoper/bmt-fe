import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PageHeader } from '@/shared/components/common';
import { LibraryTable } from '@/features/library';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('library') };
}

export default async function LibraryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={tNav('library')}
        description={tPages('library.subtitle')}
      />
      <LibraryTable />
    </div>
  );
}
