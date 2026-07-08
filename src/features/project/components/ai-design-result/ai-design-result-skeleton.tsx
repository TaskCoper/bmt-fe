'use client'

import { Skeleton } from '@/shared/components/ui'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function AIDesignResultSkeleton() {
  const t = useTranslations('project.form.aiDesignResult')

  return (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-2/3' />
        <Skeleton className='h-4 w-1/3' />
      </div>

      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <Loader2 className='size-4 animate-spin' />
        {t('loading')}
      </div>

      <Skeleton className='h-32 w-full rounded-md' />

      <div className='space-y-3'>
        <Skeleton className='h-6 w-40' />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-20' />
          ))}
        </div>
        <Skeleton className='h-[420px] w-full rounded-md' />
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-14 w-full' />
        ))}
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-40 w-full' />
        ))}
      </div>

      <Skeleton className='h-72 w-full' />

      <Skeleton className='h-48 w-full' />
    </div>
  )
}
