'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui'
import { RefreshCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AIDesignResultCtasProps {
  prevUrl: string | null
  nextUrl: string | null
  onRegenerate: () => void
}

export function AIDesignResultCtas({ prevUrl, nextUrl, onRegenerate }: AIDesignResultCtasProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const tc = useTranslations('common')

  return (
    <div className='flex flex-wrap items-center justify-between gap-2 pt-2'>
      <div>
        {prevUrl && (
          <Button type='button' variant='outline' asChild>
            <Link href={prevUrl}>{tc('back')}</Link>
          </Button>
        )}
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button type='button' variant='outline' onClick={onRegenerate}>
          <RefreshCcw />
          {t('ctas.regenerate')}
        </Button>

        {nextUrl && (
          <Button type='button'>
            <Link href={nextUrl}>{t('ctas.nextStep')}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
