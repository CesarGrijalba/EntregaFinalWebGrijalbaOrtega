// lib/supabase.ts
"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para usar en componentes client-side (como tu login y el Home)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
