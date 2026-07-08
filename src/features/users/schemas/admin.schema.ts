import { z } from 'zod'

/** Localized messages for the add-admin form. */
export interface AdminSchemaMessages {
  required: string
  email: string
}

/** Schema for creating a new admin account (admins create admins only). */
export function createAdminSchema(m: AdminSchemaMessages) {
  return z.object({
    name: z.string().min(1, { message: m.required }),
    email: z.string().min(1, { message: m.required }).email({ message: m.email })
  })
}

export type AdminFormValues = z.infer<ReturnType<typeof createAdminSchema>>
