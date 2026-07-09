'use client'

import { useTranslations } from 'next-intl'

export function ReviewFooterPreview() {
  const t = useTranslations('project.form.review.sections.footer')

  return (
    <div className='bg-card border-border/70 flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-xs'>
      <div className='flex items-center gap-2'>
        <div className='bg-primary text-primary-foreground grid size-6 place-items-center rounded text-[9px] font-bold tracking-widest'>
          BMT
        </div>
        <span className='text-muted-foreground'>{t('preview')}</span>
      </div>
      <span className='text-muted-foreground tabular-nums'>{t('pageNumber', { current: 4, total: 12 })}</span>
    </div>
  )
}
