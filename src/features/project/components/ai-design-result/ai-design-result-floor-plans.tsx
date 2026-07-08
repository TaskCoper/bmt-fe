'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui'
import { useTranslations } from 'next-intl'
import { FloorId } from '../../types/ai-design-result.types'
import { InfoTooltip } from './info-tooltip'
import { MockFloorPlanSvg } from './mock-floor-plan-svg'
import { ZoomPanCanvas } from './zoom-pan-canvas'

interface AIDesignResultFloorPlansProps {
  floors: readonly FloorId[]
}

const SPECIAL_FLOOR_IDS: readonly FloorId[] = [FloorId.Roof, FloorId.Tum]

export function AIDesignResultFloorPlans({ floors }: AIDesignResultFloorPlansProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const defaultValue = floors[0] ?? FloorId.Ground

  return (
    <section className='space-y-3'>
      <h3 className='text-lg font-semibold'>{t('section4A')}</h3>
      <Tabs defaultValue={defaultValue}>
        <TabsList className='flex-wrap'>
          {floors.map((id) => (
            <TabsTrigger key={id} value={id} className='gap-1'>
              {t(`floorTabs.${id}`)}
              {SPECIAL_FLOOR_IDS.includes(id) && <InfoTooltip labelKey='tooltips.tum' side='bottom' />}
            </TabsTrigger>
          ))}
        </TabsList>
        {floors.map((id) => (
          <TabsContent key={id} value={id} className='pt-2'>
            <ZoomPanCanvas>
              <MockFloorPlanSvg floorId={id} />
            </ZoomPanCanvas>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
