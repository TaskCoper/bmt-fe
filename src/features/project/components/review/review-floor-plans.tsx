'use client'

import { useTranslations } from 'next-intl'
import type { FloorId } from '../../types/ai-design-result.types'
import { MockFloorPlanSvg } from '../ai-design-result/mock-floor-plan-svg'

interface ReviewFloorPlansProps {
  floors: readonly FloorId[]
}

export function ReviewFloorPlans({ floors }: ReviewFloorPlansProps) {
  const t = useTranslations('project.form.aiDesignResult.floorTabs')

  return (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
      {floors.map((floor) => (
        <figure key={floor} className='bg-card overflow-hidden rounded-md border'>
          <div className='bg-muted/30 aspect-video'>
            <MockFloorPlanSvg floorId={floor} />
          </div>
          <figcaption className='border-t px-3 py-2 text-xs font-medium'>{t(floor)}</figcaption>
        </figure>
      ))}
    </div>
  )
}
