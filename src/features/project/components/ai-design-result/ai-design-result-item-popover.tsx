'use client'

import type { Locale } from '@/i18n/routing'
import { formatCurrency } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import { resolveDealer } from '../../constants/ai-design-result.constants'
import type { EstimateItem, EstimatePart, PackageTier } from '../../types/ai-design-result.types'

interface AIDesignResultItemPopoverProps {
  item: EstimateItem
  part: EstimatePart
  tier: PackageTier
  city: string
}

export function AIDesignResultItemPopover({ item, part, tier, city }: AIDesignResultItemPopoverProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const locale = useLocale() as Locale
  const dealer = resolveDealer(city)
  const unitPrice = item.unitPricePerTier[tier]
  const amount = unitPrice * item.quantity

  return (
    <div className='space-y-3 text-xs'>
      <div className='space-y-1'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold'>{t(`items.${part}.${item.code}.name` as never)}</span>
          <span className='bg-muted text-muted-foreground rounded-sm px-1.5 py-0.5 font-mono text-[10px]'>
            {item.code}
          </span>
        </div>
        <p className='text-muted-foreground'>
          {t('itemDetail.packageLabel', { tier: t(`packages.${tier}.name` as never) })}
        </p>
      </div>

      <div className='space-y-2'>
        <div>
          <p className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
            {t('itemDetail.material')}
          </p>
          <p className='leading-relaxed'>{t(`items.${part}.${item.code}.material` as never)}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
            {t('itemDetail.method')}
          </p>
          <p className='leading-relaxed'>{t(`items.${part}.${item.code}.method` as never)}</p>
        </div>
      </div>

      <div className='bg-muted/40 space-y-1 rounded-md p-2'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{t('itemDetail.quantityRow')}</span>
          <span className='tabular-nums'>
            {item.quantity} {t(`units.${item.unit}` as never)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{t('itemDetail.unitPriceRow')}</span>
          <span className='tabular-nums'>{formatCurrency(unitPrice, locale)}</span>
        </div>
        <div className='flex justify-between border-t pt-1 font-semibold'>
          <span>{t('itemDetail.totalRow')}</span>
          <span className='tabular-nums'>{formatCurrency(amount, locale)}</span>
        </div>
      </div>

      <div>
        <p className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>{t('itemDetail.note')}</p>
        <p className='leading-relaxed'>{t(`items.${part}.${item.code}.note` as never)}</p>
      </div>

      <div className='space-y-0.5 border-t pt-2'>
        <p className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
          {t('itemDetail.nearestDealer')}
        </p>
        <p className='font-semibold'>{dealer.name}</p>
        <p className='text-muted-foreground'>{dealer.addressPreMerger}</p>
        {dealer.phone && <p className='text-muted-foreground'>☎ {dealer.phone}</p>}
      </div>
    </div>
  )
}
