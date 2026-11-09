import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

/** Cliente do Supabase para Server Components, Server Actions e Route Handlers. */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = supabaseConfig();

  return createServerClient(url, anonKey, {
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
          // Em Server Components não dá para gravar cookies. O middleware
          // renova a sessão, então é seguro ignorar aqui.
        }
      },
    },
  });
}
