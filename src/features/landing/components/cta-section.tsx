import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { LANDING_SECTIONS } from '../constants/landing.constants';

/** Conversion band with a high-contrast surface. */
export function CtaSection() {
  const t = useTranslations('landing.cta');

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-12">
          <h2 className="text-heading mx-auto max-w-2xl text-balance">
            {t('title')}
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-4 max-w-xl text-pretty">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href={ROUTES.LOGIN}>
                {t('primary')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground"
            >
              <a href={`#${LANDING_SECTIONS.contact}`}>{t('secondary')}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
