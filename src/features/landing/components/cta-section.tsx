import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LANDING_SECTIONS } from '../constants/landing.constants'

/** Conversion band with a high-contrast surface. */
export function CtaSection() {
  const t = useTranslations('landing.cta')

  return (
    <section className='relative py-20 lg:py-28'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-8'>
        <div className='glass-panel relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20'>
          {/* warm glow so the final call still pops, in glass */}
          <div
            aria-hidden
            className='absolute inset-0'
            style={{
              background:
                'radial-gradient(60% 120% at 50% 0%, oklch(0.82 0.15 72 / 0.28), transparent 70%), radial-gradient(50% 120% at 50% 100%, oklch(0.68 0.13 46 / 0.2), transparent 72%)'
            }}
          />
          <div className='relative'>
            <span className='text-primary/85 border-primary/25 bg-primary/5 mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur'>
              <Sparkles className='size-3.5' />
              BMT Decor AI
            </span>
            <h2 className='font-display mx-auto max-w-2xl text-3xl leading-[1.08] font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-[2.7rem]'>
              {t('title')}
            </h2>
            <p className='text-muted-foreground mx-auto mt-4 max-w-xl text-pretty'>{t('subtitle')}</p>
            <div className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <Button asChild size='lg' className='shadow-[0_14px_30px_-10px_oklch(0.77_0.155_65_/_0.75)]'>
                <Link href={ROUTES.LOGIN}>
                  {t('primary')}
                  <ArrowRight className='size-4' />
                </Link>
              </Button>
              <Button asChild size='lg' variant='ghost' className='glass-inset rounded-xl'>
                <a href={`#${LANDING_SECTIONS.contact}`}>{t('secondary')}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
