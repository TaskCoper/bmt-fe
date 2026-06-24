import { z } from 'zod';

/** Resolved, localized messages for the project form. */
export interface ProjectSchemaMessages {
  required: string;
  maxName: string;
}

/** Builds the create/edit project schema with localized messages. */
export function createProjectSchema(m: ProjectSchemaMessages) {
  return z.object({
    name: z
      .string()
      .min(1, { message: m.required })
      .max(120, { message: m.maxName }),
    description: z.string().max(2000).optional(),
  });
}

export type ProjectFormValues = z.infer<ReturnType<typeof createProjectSchema>>;
