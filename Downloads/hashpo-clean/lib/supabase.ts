import { createClient } from "@supabase/supabase-js";
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const safeStorage = typeof window !== "undefined" ? window.localStorage : {
  getItem: () => null, setItem: () => {}, removeItem: () => {},
};
export const supabase = createClient(URL, KEY, {
  auth: { storage: safeStorage, persistSession: true, autoRefreshToken: true }
});
