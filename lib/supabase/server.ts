import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

/**
 * Server-side Supabase client. Supports both standard cookies() and direct NextRequest.
 */
export function createClient(request?: NextRequest) {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (request) {
            return request.cookies.get(name)?.value;
          }
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignored in Server Components or API route handlers where cookies can't be set directly
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Ignored
          }
        }
      }
    }
  );
}

/**
 * Service-role client. NEVER import this in client components.
 */
export function createServiceClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
