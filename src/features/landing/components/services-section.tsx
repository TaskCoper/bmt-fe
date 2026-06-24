import { useTranslations } from 'next-intl';
import {
  MessagesSquare,
  Calculator,
  LayoutTemplate,
  FolderKanban,
  Library,
  Bot,
  type LucideIcon,
} from 'lucide-react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { LANDING_SECTIONS } from '../constants/landing.constants';
import { SectionHeading } from './section-heading';

type ServiceKey =
  | 'consult'
  | 'estimate'
  | 'design'
  | 'manage'
  | 'library'
  | 'support';

const SERVICES: { key: ServiceKey; icon: LucideIcon }[] = [
  { key: 'consult', icon: MessagesSquare },
  { key: 'estimate', icon: Calculator },
  { key: 'design', icon: LayoutTemplate },
  { key: 'manage', icon: FolderKanban },
  { key: 'library', icon: Library },
  { key: 'support', icon: Bot },
];

/** Services grid — six cards composed from shadcn Card primitives. */
export function ServicesSection() {
  const t = useTranslations('landing.services');

  return (
    <section id={LANDING_SECTIONS.services} className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className="transition-shadow duration-[--duration-normal] hover:shadow-md"
            >
              <CardHeader>
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="mt-4 text-base">
                  {t(`${key}.title`)}
                </CardTitle>
                <CardDescription>{t(`${key}.description`)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
