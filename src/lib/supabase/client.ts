import { createBrowserClient } from "@supabase/ssr";

// TODO: Replace with generated types once Supabase project is connected
// npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
// Then add: import type { Database } from "@/types/database";
// And use: createBrowserClient<Database>(...)

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
