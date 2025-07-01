import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://oryfsnghuykquxsfkxcs.supabase.co"
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWZzbmdodXlrcXV4c2ZreGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDIwNjksImV4cCI6MjA2NjE3ODA2OX0.8dUZxENn7x3VDGQ6g6u3gdOjaZ5M6kjRBtlc3U-nxSg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      referral_users: {
        Row: {
          uid: string
          email: string
          display_name: string
          joined_at: string
          tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
          total_referrals: number
          total_earnings: number
          referral_code: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          uid: string
          email: string
          display_name: string
          joined_at: string
          tier?: "bronze" | "silver" | "gold" | "platinum" | "diamond"
          total_referrals?: number
          total_earnings?: number
          referral_code: string
        }
        Update: {
          uid?: string
          email?: string
          display_name?: string
          joined_at?: string
          tier?: "bronze" | "silver" | "gold" | "platinum" | "diamond"
          total_referrals?: number
          total_earnings?: number
          referral_code?: string
        }
      }
      referral_activities: {
        Row: {
          id: string
          referrer_id: string
          referee_email: string
          joined_at: string
          status: "pending" | "completed"
          reward_earned: number
          created_at?: string
        }
        Insert: {
          referrer_id: string
          referee_email: string
          joined_at: string
          status?: "pending" | "completed"
          reward_earned?: number
        }
        Update: {
          referrer_id?: string
          referee_email?: string
          joined_at?: string
          status?: "pending" | "completed"
          reward_earned?: number
        }
      }
      referral_discounts: {
        Row: {
          id: string
          user_id: string
          discount_percentage: number
          is_active: boolean
          expires_at: string
          applied_at?: string
          referred_by: string
          created_at?: string
        }
        Insert: {
          user_id: string
          discount_percentage: number
          is_active?: boolean
          expires_at: string
          referred_by: string
        }
        Update: {
          user_id?: string
          discount_percentage?: number
          is_active?: boolean
          expires_at?: string
          applied_at?: string
          referred_by?: string
        }
      }
    }
  }
}
