import { createClient } from "@supabase/supabase-js";

const superBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const superBaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const superbase = createClient(superBaseUrl, superBaseAnonKey);
