import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";

/** Cliente do Supabase para componentes do navegador (login, logout). */
export function createClient() {
  const { url, anonKey } = supabaseConfig();
  return createBrowserClient(url, anonKey);
}
