import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PageHeader } from '@/shared/components/common';
import { AdminGuard } from '@/shared/auth';
import { UserTable } from '@/features/users';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'users' });
  return { title: t('title') };
}

export default async function UsersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'users' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('subtitle')} />
      <AdminGuard>
        <UserTable />
      </AdminGuard>
    </div>
  );
}
