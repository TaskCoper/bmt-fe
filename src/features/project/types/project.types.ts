import type { ProjectStatus } from '../constants/project.constants'

/** A construction project as returned by the backend. */
export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

/** Payload for creating a project. */
export interface CreateProjectPayload {
  name: string
  description?: string
}

/** Client-side list filters (mirrors `PaginationParams` plus status). */
export interface ProjectFilters {
  search: string
  status: ProjectStatus | 'all'
  page: number
}

export const HouseType = {
  Appartment: 'Appartment',
  Villa: 'Villa',
  Townhouse: 'Townhouse'
} as const

export type HouseType = (typeof HouseType)[keyof typeof HouseType]

export const HouseStyle = {
  Roof: 'roof',
  Modern: 'modern',
  Neoclassical: 'neoclassical'
} as const

export type HouseStyle = (typeof HouseStyle)[keyof typeof HouseStyle]

export const RoofStyle = {
  Thai: 'thai',
  Japanese: 'japanese',
  Traditional: 'traditional',
  Other: 'other'
} as const

export type RoofStyle = (typeof RoofStyle)[keyof typeof RoofStyle]

export const Direction = {
  East: 'east',
  West: 'west',
  South: 'south',
  North: 'north'
} as const

export type Direction = (typeof Direction)[keyof typeof Direction]

export const FloorLayout = {
  Open: 'open',
  Separated: 'separated'
} as const

export type FloorLayout = (typeof FloorLayout)[keyof typeof FloorLayout]

export const FloorLighting = {
  Natural: 'natural',
  Artificial: 'artificial'
} as const

export type FloorLighting = (typeof FloorLighting)[keyof typeof FloorLighting]

export const COLOR_PRESETS = [
  '#f5f0e8',
  '#d4b896',
  '#8b6f47',
  '#c8d0d8',
  '#6b7280',
  '#166534',
  '#c2410c',
  '#7c2d12'
] as const
