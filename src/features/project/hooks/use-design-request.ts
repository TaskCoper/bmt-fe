'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  DESIGN_REQUEST_BUDGET_DEFAULT,
  designRequestSchema,
  type DesignRequestFormValues
} from '../schemas/project.schema'
import { COLOR_PRESETS, Direction, FloorLayout, FloorLighting, HouseStyle } from '../types/project.types'

const defaultValues: DesignRequestFormValues = {
  designRequest: {
    style: HouseStyle.Modern,
    roofStyle: undefined,
    hasTum: false,
    budgetAmount: DESIGN_REQUEST_BUDGET_DEFAULT,
    direction: Direction.South,
    address: '',
    city: '',
    cityCode: -1,
    ward: '',
    wardCode: -1,
    floors: [
      {
        area: 0,
        layout: FloorLayout.Open,
        lighting: FloorLighting.Natural,
        color: COLOR_PRESETS[0]
      }
    ]
  }
}

export const useDesignRequest = () => {
  const tv = useTranslations('validation')

  const resolver = useMemo(
    () =>
      zodResolver(
        designRequestSchema({
          required: tv('required'),
          invalidArea: tv('positiveNumber')
        })
      ),
    [tv]
  )

  const methods = useForm<DesignRequestFormValues>({ resolver, defaultValues })

  return { methods }
}
