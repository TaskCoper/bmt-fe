import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { LANDING_SECTIONS } from '../constants/landing.constants';

/**
 * Marketing hero. Server-rendered, fully translated, restrained accents —
 * a subtle radial backdrop keeps it premium without flashy gradients.
 */
export function LandingHero() {
  const t = useTranslations('landing.hero');

  return (
    <section
      id={LANDING_SECTIONS.home}
      className="relative overflow-hidden border-b"
    >
      {/* Subtle background: soft grid + radial fade. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] [background-size:56px_56px] opacity-40"
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-24 text-center lg:py-32">
        <Badge variant="secondary" className="mb-6">
          {t('badge')}
        </Badge>
        <h1 className="text-display max-w-3xl text-balance">{t('title')}</h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-pretty">
          {t('subtitle')}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={ROUTES.LOGIN}>
              {t('primaryCta')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`#${LANDING_SECTIONS.projects}`}>{t('secondaryCta')}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
