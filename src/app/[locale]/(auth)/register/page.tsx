import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { RegisterForm } from '@/features/auth';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });
  return { title: t('title') };
}

export default async function RegisterPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterForm />;
}
