import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Plus } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { PageHeader } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { ProjectList } from '@/features/project';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('projects') };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const t = await getTranslations({ locale, namespace: 'project' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={tNav('projects')}
        description={t('subtitle')}
        actions={
          <Button asChild>
            <Link href={ROUTES.PROJECT_NEW}>
              <Plus className="size-4" />
              {t('createNew')}
            </Link>
          </Button>
        }
      />
      <ProjectList />
    </div>
  );
}
