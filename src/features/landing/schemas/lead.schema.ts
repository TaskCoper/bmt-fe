import { z } from 'zod';

import { LEAD_NEED_TYPES } from '../constants/landing.constants';

/** Resolved, localized validation messages for the contact/lead form. */
export interface LeadSchemaMessages {
  required: string;
  email: string;
  phone: string;
}

/**
 * Contact/lead form schema (stakeholder Q&A §3.2.1): name + phone required,
 * email optional, need-type from a fixed list, free-text description.
 */
export function createLeadSchema(m: LeadSchemaMessages) {
  return z.object({
    name: z.string().min(1, { message: m.required }),
    phone: z
      .string()
      .min(1, { message: m.required })
      .regex(/^[0-9+\s().-]{8,15}$/, { message: m.phone }),
    email: z.string().email({ message: m.email }).optional().or(z.literal('')),
    needType: z.enum(LEAD_NEED_TYPES),
    message: z.string().max(2000).optional().or(z.literal('')),
  });
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadSchema>>;
