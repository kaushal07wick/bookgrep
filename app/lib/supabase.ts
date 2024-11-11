// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktkaxgnmxdkzzoqostzj.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const Supabase = createClient(supabaseUrl!, supabaseKey!)
console.log("connected to supabase")
