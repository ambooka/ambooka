import { isSupabaseConfigured } from '@/integrations/supabase/client'

const localModeSetting = process.env.NEXT_PUBLIC_ADMIN_LOCAL_MODE

export const isAdminLocalModeAvailable =
  process.env.NODE_ENV !== 'production' && localModeSetting !== 'false'

export const adminLocalModeMessage = isSupabaseConfigured
  ? 'Local development mode is enabled. Supabase sign-in is optional on this machine.'
  : 'Supabase is not configured, so the dashboard is running in local development mode.'
