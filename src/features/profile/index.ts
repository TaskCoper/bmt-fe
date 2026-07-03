/**
 * Public API of the `profile` feature — the authenticated user's account
 * profile view + editable details (UI-first, mock save).
 */
export { ProfilePanel } from './components/profile-panel'
export {
  createProfileSchema,
  type ProfileFormValues,
  type ProfileSchemaMessages,
} from './schemas/profile.schema'
