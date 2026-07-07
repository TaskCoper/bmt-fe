import { z } from 'zod'
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '../hooks/use-create-project'
import { HouseType } from '../types/project.types'

export interface ProjectSchemaMessages {
  required: string
  maxName: string
}

export function createProjectSchema(m: ProjectSchemaMessages) {
  return z.object({
    name: z.string().min(1, { message: m.required }).max(NAME_MAX_LENGTH, { message: m.maxName }),
    description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
    houseType: z.enum(HouseType)
  })
}

export type CreateProjectFormValues = z.infer<ReturnType<typeof createProjectSchema>>
