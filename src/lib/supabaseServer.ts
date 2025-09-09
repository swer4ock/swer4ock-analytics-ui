import { createClient } from '@supabase/supabase-js';

// IMPORTANT: This client is for server-side use only.
// It uses the SERVICE_ROLE_KEY, which should never be exposed to the client.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
