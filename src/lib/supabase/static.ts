import { createClient } from "@supabase/supabase-js";

// Client for use in generateStaticParams and other build-time contexts
// where cookies() is not available
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
