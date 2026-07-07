import { z } from 'zod'
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '../hooks/use-create-project'
import { Direction, FloorLayout, FloorLighting, HouseStyle, HouseType, RoofStyle } from '../types/project.types'

export interface ProjectSchemaMessages {
  required: string
  maxName: string
}

export const createProjectSchema = (m: ProjectSchemaMessages) => {
  return z.object({
    name: z.string().min(1, { message: m.required }).max(NAME_MAX_LENGTH, { message: m.maxName }),
    description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
    houseType: z.enum(HouseType)
  })
}

export interface DesignRequestSchemaMessages {
  required: string
  invalidArea: string
}

export const designRequestSchema = (m: DesignRequestSchemaMessages) => {
  const floorSchema = z.object({
    area: z.number({ message: m.invalidArea }).positive({ message: m.invalidArea }),
    layout: z.enum(FloorLayout),
    lighting: z.enum(FloorLighting),
    color: z.string().min(1, { message: m.required })
  })

  return z.object({
    designRequest: z.object({
      style: z.enum(HouseStyle),
      roofStyle: z.enum(RoofStyle).optional(),
      hasTum: z.boolean().optional(),
      direction: z.enum(Direction),
      address: z.string().min(1, { message: m.required }),
      city: z.string().min(1, { message: m.required }),
      cityCode: z.number().refine((v) => v > 0, { message: m.required }),
      ward: z.string().min(1, { message: m.required }),
      wardCode: z.number().refine((v) => v > 0, { message: m.required }),
      floors: z.array(floorSchema).min(1, { message: m.required })
    })
  })
}

export type CreateProjectFormValues = z.infer<ReturnType<typeof createProjectSchema>>
export type DesignRequestFormValues = z.infer<ReturnType<typeof designRequestSchema>>
export type DesignRequestPayload = DesignRequestFormValues['designRequest']
export type FloorPayload = DesignRequestPayload['floors'][number]

export interface SpacesSchemaMessages {
  required: string
}

const spaceImageSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().nonnegative(),
  previewUrl: z.string().min(1)
})

export const spacesSchema = (m: SpacesSchemaMessages) => {
  return z.object({
    spaces: z.object({
      description: z.string().min(1, { message: m.required }),
      floors: z
        .array(
          z.object({
            floorIndex: z.number().int().nonnegative(),
            layoutImage: spaceImageSchema.nullable().refine((image) => Boolean(image), { message: m.required })
          })
        )
        .min(1, { message: m.required })
    })
  })
}

export type SpacesFormValues = z.infer<ReturnType<typeof spacesSchema>>
export type SpacesPayload = SpacesFormValues['spaces']
export type SpaceImagePayload = NonNullable<SpacesPayload['floors'][number]['layoutImage']>
