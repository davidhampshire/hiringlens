import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// TODO: Replace with generated types once Supabase project is connected
// npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
// Then add: import type { Database } from "@/types/database";
// And use: createServerClient<Database>(...)

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
