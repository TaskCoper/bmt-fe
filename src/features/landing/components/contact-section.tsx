import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';
import { LANDING_SECTIONS } from '../constants/landing.constants';
import { SectionHeading } from './section-heading';

type ContactKey = 'address' | 'phone' | 'email' | 'hours';

const CONTACT: { key: ContactKey; icon: LucideIcon }[] = [
  { key: 'address', icon: MapPin },
  { key: 'phone', icon: Phone },
  { key: 'email', icon: Mail },
  { key: 'hours', icon: Clock },
];

/** Contact details grid. */
export function ContactSection() {
  const t = useTranslations('landing.contact');

  return (
    <section
      id={LANDING_SECTIONS.contact}
      className="bg-muted/40 border-t py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT.map(({ key, icon: Icon }) => (
            <Card key={key}>
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {t(`${key}Label`)}
                </p>
                <p className="text-sm font-medium">{t(key)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
