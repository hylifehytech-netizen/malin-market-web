import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://staging-malin-market.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'staging-anon-key-placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client สำหรับฝั่ง Frontend (ใช้อ่านข้อมูลสาธารณะ เช่น ผังตลาด)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client สำหรับฝั่ง Backend API Routes (มีสิทธิ์ Admin ในการจัดการ User & OTP)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
