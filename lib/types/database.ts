export type UserRole = 'admin' | 'consultant' | 'team_lead'

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          whatsapp_credits: number
          subscription_status: 'trial' | 'active' | 'suspended'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          whatsapp_credits?: number
          subscription_status?: 'trial' | 'active' | 'suspended'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          whatsapp_credits?: number
          subscription_status?: 'trial' | 'active' | 'suspended'
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          agency_id: string
          email: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          email: string
          role: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          email?: string
          role?: UserRole
          created_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone?: string
          created_at?: string
        }
      }
    }
  }
}

export type Agency = Database['public']['Tables']['agencies']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Candidate = Database['public']['Tables']['candidates']['Row']

export type InsertAgency = Database['public']['Tables']['agencies']['Insert']
export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertCandidate = Database['public']['Tables']['candidates']['Insert']
