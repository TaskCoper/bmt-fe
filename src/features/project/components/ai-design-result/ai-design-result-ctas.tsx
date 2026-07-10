'use client'

import { useRouter } from '@/i18n/navigation'
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
  const router = useRouter()

  const navigate = (url: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    router.push(url)
  }

  return (
    <div className='flex flex-wrap items-center justify-between gap-2 pt-2'>
      <div>
        {prevUrl && (
          <Button type='button' variant='outline' onClick={() => navigate(prevUrl)}>
            {tc('back')}
          </Button>
        )}
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button type='button' variant='outline' onClick={onRegenerate}>
          <RefreshCcw />
          {t('ctas.regenerate')}
        </Button>

        {nextUrl && (
          <Button type='button' onClick={() => navigate(nextUrl)}>
            {t('ctas.nextStep')}
          </Button>
        )}
      </div>
    </div>
  )
}
