'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createProjectSchema, type CreateProjectFormValues } from '../schemas/project.schema'
import { HouseType } from '../types/project.types'

export const NAME_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 255

const defaultValues: CreateProjectFormValues = {
  name: '',
  description: '',
  houseType: HouseType.Appartment
}

export const useCreateProject = () => {
  const tv = useTranslations('validation')

  const resolver = useMemo(
    () =>
      zodResolver(
        createProjectSchema({
          required: tv('required'),
          maxName: tv('maxLength', { max: NAME_MAX_LENGTH })
        })
      ),
    [tv]
  )

  const methods = useForm<CreateProjectFormValues>({
    resolver,
    defaultValues
  })

  return { methods }
}
