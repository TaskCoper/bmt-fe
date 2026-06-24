import { useTranslations } from 'next-intl';
import { ArrowUpRight, ImageIcon } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { LANDING_SECTIONS } from '../constants/landing.constants';
import { SectionHeading } from './section-heading';

type ProjectKey = 'item1' | 'item2' | 'item3';

const PROJECTS: ProjectKey[] = ['item1', 'item2', 'item3'];

/**
 * Featured reference projects. Uses a neutral image placeholder so the layout
 * is correct before real assets exist (swap the placeholder for <Image/>).
 */
export function FeaturedProjects() {
  const t = useTranslations('landing.projects');

  return (
    <section id={LANDING_SECTIONS.projects} className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROJECTS.map((key) => (
            <Card key={key} className="group overflow-hidden p-0">
              <div className="bg-muted text-muted-foreground flex aspect-[4/3] items-center justify-center">
                <ImageIcon className="size-8" />
              </div>
              <div className="flex items-start justify-between gap-3 p-5">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {t(`${key}.category`)}
                  </Badge>
                  <h3 className="text-sm font-semibold">{t(`${key}.name`)}</h3>
                </div>
                <ArrowUpRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href={ROUTES.PROJECTS}>{t('viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
