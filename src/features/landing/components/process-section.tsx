import { useTranslations } from 'next-intl';

import { LANDING_SECTIONS } from '../constants/landing.constants';
import { SectionHeading } from './section-heading';

type StepKey = 'step1' | 'step2' | 'step3' | 'step4';

const STEPS: StepKey[] = ['step1', 'step2', 'step3', 'step4'];

/** "How it works" — the 4-step reference-estimate flow. */
export function ProcessSection() {
  const t = useTranslations('landing.process');

  return (
    <section
      id={LANDING_SECTIONS.process}
      className="bg-muted/40 border-y py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <ol className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step} className="relative">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </div>
              <h3 className="mt-5 text-base font-semibold">
                {t(`${step}.title`)}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {t(`${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
