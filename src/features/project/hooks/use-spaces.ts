'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { spacesSchema, type SpacesFormValues } from '../schemas/project.schema'

const defaultValues: SpacesFormValues = {
  spaces: {
    description: '',
    floors: []
  }
}

export const useSpaces = () => {
  const tv = useTranslations('validation')

  const resolver = useMemo(
    () =>
      zodResolver(
        spacesSchema({
          required: tv('required')
        })
      ),
    [tv]
  )

  const methods = useForm<SpacesFormValues>({ resolver, defaultValues })

  return { methods }
}
