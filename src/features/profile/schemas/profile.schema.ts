import { z } from 'zod'

/** Resolved, localized validation messages for the profile form. */
export interface ProfileSchemaMessages {
  required: string
  maxBio: string
}

/** Builds the profile-edit schema with localized messages. */
export function createProfileSchema(m: ProfileSchemaMessages) {
  return z.object({
    name: z.string().min(1, { message: m.required }),
    phone: z.string().optional(),
    company: z.string().optional(),
    bio: z.string().max(500, { message: m.maxBio }).optional()
  })
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
