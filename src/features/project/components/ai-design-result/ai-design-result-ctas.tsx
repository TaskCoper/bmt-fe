'use client'

import { Link } from '@/i18n/navigation'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui'
import { ArrowRight, FileDown, RefreshCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface AIDesignResultCtasProps {
  prevUrl: string | null
  onRegenerate: () => void
}

export function AIDesignResultCtas({ prevUrl, onRegenerate }: AIDesignResultCtasProps) {
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
        <Button type='button' variant='ghost' onClick={onRegenerate} className='gap-1.5'>
          <RefreshCcw className='size-4' />
          {t('ctas.regenerate')}
        </Button>
        <Button type='button' variant='outline' onClick={() => toast.info(t('ctas.pdfComingSoon'))} className='gap-1.5'>
          <FileDown className='size-4' />
          {t('ctas.exportPdf')}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button type='button' disabled className='gap-1.5'>
                {t('ctas.nextStep')}
                <ArrowRight className='size-4' />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side='top'>{t('ctas.nextStepDisabled')}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
