'use client'

import type { Locale } from '@/i18n/routing'
import { Badge } from '@/shared/components/ui'
import { formatNumber } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { DesignRequestPayload } from '../../schemas/project.schema'
import type { HouseType } from '../../types/project.types'

interface AIDesignResultInputSummaryProps {
  designRequest: DesignRequestPayload
  houseType: HouseType
  spacesFloors: Array<{ floorIndex: number; description: string }>
}

export function AIDesignResultInputSummary({
  designRequest,
  houseType,
  spacesFloors
}: AIDesignResultInputSummaryProps) {
  const t = useTranslations('project.form')
  const locale = useLocale() as Locale

  const prefs = [
    { label: t('houseType'), value: t(`aiDesignResult.houseTypeValue.${houseType}` as never) },
    { label: t('styleLabel'), value: t(`style.${designRequest.style}` as never) },
    { label: t('directionLabel'), value: t(`direction.${designRequest.direction}` as never) },
    ...(designRequest.roofStyle
      ? [{ label: t('roofStyleLabel'), value: t(`roofStyle.${designRequest.roofStyle}` as never) }]
      : []),
    { label: t('tumLabel'), value: t(`tum.${designRequest.hasTum ? 'yes' : 'no'}` as never) }
  ]

  return (
    <section className='space-y-3'>
      <h3 className='text-lg font-semibold'>{t('aiDesignResult.inputSummary.title' as never)}</h3>

      <div className='flex flex-wrap gap-2'>
        {prefs.map(({ label, value }) => (
          <div key={label} className='bg-card flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm'>
            <span className='text-muted-foreground text-xs'>{label}</span>
            <span className='font-medium'>{value}</span>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
        {designRequest.floors.map((floor, i) => {
          const floorLabel = floor.isSpecial
            ? t('specialFloorTitle' as never)
            : i === 0
              ? t('spaces.groundFloor' as never)
              : t('spaces.upperFloor' as never, { index: i } as never)
          const description = spacesFloors.find((f) => f.floorIndex === i)?.description.trim() ?? ''

          return (
            <div key={i} className='bg-card rounded-md border px-3 py-2 text-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground w-20 shrink-0 text-xs'>{floorLabel}</span>
                <span className='font-semibold tabular-nums'>{formatNumber(floor.area, locale)} m²</span>
                <Badge variant='outline' className='text-xs'>
                  {t(`layout.${floor.layout}` as never)}
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  {t(`lighting.${floor.lighting}` as never)}
                </Badge>
                <span className='ml-auto h-4 w-4 shrink-0 rounded-sm border' style={{ backgroundColor: floor.color }} />
              </div>
              {description && <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>{description}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
