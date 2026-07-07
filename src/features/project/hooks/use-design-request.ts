import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { designRequestSchema, type DesignRequestFormValues } from '../schemas/project.schema'

export const useDesignRequest = () => {
  const methods = useForm<DesignRequestFormValues>({ resolver: zodResolver(designRequestSchema()) })

  return { methods }
}
