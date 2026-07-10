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
  maxFloors: string
}

export const DESIGN_REQUEST_NORMAL_FLOORS_MAX = 4
// ground(1) + normal(max 4) + special(max 1) = 6
const DESIGN_REQUEST_FLOORS_TOTAL_MAX = 6

export const DESIGN_REQUEST_BUDGET_MIN = 300_000_000
export const DESIGN_REQUEST_BUDGET_MAX = 1_000_000_000_000
export const DESIGN_REQUEST_BUDGET_STEP = 100_000_000
export const DESIGN_REQUEST_BUDGET_DEFAULT = 2_000_000_000

export const designRequestSchema = (m: DesignRequestSchemaMessages) => {
  const floorSchema = z.object({
    area: z.number({ message: m.invalidArea }).positive({ message: m.invalidArea }),
    layout: z.enum(FloorLayout),
    lighting: z.enum(FloorLighting),
    color: z.string().min(1, { message: m.required }),
    isSpecial: z.boolean().optional()
  })

  return z.object({
    designRequest: z.object({
      style: z.enum(HouseStyle),
      roofStyle: z.enum(RoofStyle).optional(),
      hasTum: z.boolean().optional(),
      budgetAmount: z.number({ message: m.invalidArea }).min(DESIGN_REQUEST_BUDGET_MIN, { message: m.invalidArea }),
      direction: z.enum(Direction),
      address: z.string().min(1, { message: m.required }),
      city: z.string().min(1, { message: m.required }),
      cityCode: z.number().refine((v) => v > 0, { message: m.required }),
      ward: z.string().min(1, { message: m.required }),
      wardCode: z.number().refine((v) => v > 0, { message: m.required }),
      floors: z
        .array(floorSchema)
        .min(1, { message: m.required })
        .max(DESIGN_REQUEST_FLOORS_TOTAL_MAX, { message: m.maxFloors })
    })
  })
}

export type CreateProjectFormValues = z.infer<ReturnType<typeof createProjectSchema>>
export type DesignRequestFormValues = z.infer<ReturnType<typeof designRequestSchema>>
export type DesignRequestPayload = DesignRequestFormValues['designRequest']
export type FloorPayload = DesignRequestPayload['floors'][number]

export interface SpacesSchemaMessages {
  required: string
  maxImages: string
}

export const MAX_LAYOUT_IMAGES = 5

const spaceImageSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().nonnegative(),
  previewUrl: z.string().min(1),
  isLayout: z.boolean()
})

export const spacesSchema = (m: SpacesSchemaMessages) => {
  return z.object({
    spaces: z.object({
      floors: z
        .array(
          z.object({
            floorIndex: z.number().int().nonnegative(),
            description: z.string().min(1, { message: m.required }),
            layoutImages: z
              .array(spaceImageSchema)
              .min(1, { message: m.required })
              .max(MAX_LAYOUT_IMAGES, { message: m.maxImages })
          })
        )
        .min(1, { message: m.required })
    })
  })
}

export type SpacesFormValues = z.infer<ReturnType<typeof spacesSchema>>
export type SpacesPayload = SpacesFormValues['spaces']
export type SpaceImagePayload = z.infer<typeof spaceImageSchema>
