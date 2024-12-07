export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: 'head' | 'contributor'
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role: 'head' | 'contributor'
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: 'head' | 'contributor'
          created_at?: string
        }
      }
      cookbooks: {
        Row: {
          id: string
          family_id: string
          name: string
          subtitle: string
          theme: 'warm' | 'cool' | 'neutral'
          cover_image: string
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          subtitle?: string
          theme?: 'warm' | 'cool' | 'neutral'
          cover_image?: string
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          subtitle?: string
          theme?: 'warm' | 'cool' | 'neutral'
          cover_image?: string
          created_at?: string
        }
      }
      cookbook_access: {
        Row: {
          id: string
          cookbook_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          cookbook_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          cookbook_id?: string
          user_id?: string
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          cookbook_id: string
          title: string
          description: string
          backstory: string
          prep_time: number
          cook_time: number
          notes: string
          primary_image: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          cookbook_id: string
          title: string
          description: string
          backstory?: string
          prep_time: number
          cook_time: number
          notes?: string
          primary_image?: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          cookbook_id?: string
          title?: string
          description?: string
          backstory?: string
          prep_time?: number
          cook_time?: number
          notes?: string
          primary_image?: string
          created_at?: string
          created_by?: string
        }
      }
      recipe_images: {
        Row: {
          id: string
          recipe_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          image_url?: string
          created_at?: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          quantity: string
          unit: string
          item: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          quantity: string
          unit: string
          item: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          quantity?: string
          unit?: string
          item?: string
          created_at?: string
        }
      }
      recipe_steps: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          instruction: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          instruction: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          step_number?: number
          instruction?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}