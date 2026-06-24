import { useTranslations } from 'next-intl';

import { Separator } from '@/shared/components/ui/separator';
import { LANDING_SECTIONS } from '../constants/landing.constants';

type StatKey = 'projects' | 'clients' | 'materials' | 'accuracy';

const STATS: StatKey[] = ['projects', 'clients', 'materials', 'accuracy'];

/** Trust/stats band — doubles as the "About" anchor. */
export function StatsSection() {
  const t = useTranslations('landing.stats');

  return (
    <section
      id={LANDING_SECTIONS.about}
      className="bg-muted/40 border-y py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((key, index) => (
            <div key={key} className="relative px-4 text-center">
              <dt className="text-3xl font-bold tracking-tight lg:text-4xl">
                {t(`${key}.value`)}
              </dt>
              <dd className="text-muted-foreground mt-2 text-sm">
                {t(`${key}.label`)}
              </dd>
              {index < STATS.length - 1 ? (
                <Separator
                  orientation="vertical"
                  className="absolute top-1/2 right-0 hidden h-12 -translate-y-1/2 lg:block"
                />
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
