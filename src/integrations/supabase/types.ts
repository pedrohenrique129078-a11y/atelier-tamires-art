export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          attendance_mode: Database["public"]["Enums"]["attendance_mode"] | null
          available: boolean
          created_at: string
          duration_minutes: number
          held_until: string | null
          id: string
          starts_at: string
          updated_at: string
        }
        Insert: {
          attendance_mode?:
            | Database["public"]["Enums"]["attendance_mode"]
            | null
          available?: boolean
          created_at?: string
          duration_minutes: number
          held_until?: string | null
          id?: string
          starts_at: string
          updated_at?: string
        }
        Update: {
          attendance_mode?:
            | Database["public"]["Enums"]["attendance_mode"]
            | null
          available?: boolean
          created_at?: string
          duration_minutes?: number
          held_until?: string | null
          id?: string
          starts_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          attendance_mode: Database["public"]["Enums"]["attendance_mode"]
          city: string | null
          client_email: string | null
          client_name: string
          client_phone: string
          complement: string | null
          course_id: string | null
          created_at: string
          id: string
          item_name: string
          kind: Database["public"]["Enums"]["booking_kind"]
          location_text: string
          neighborhood: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          postal_code: string | null
          price_cents: number | null
          service_id: string | null
          slot_id: string
          starts_at: string
          state: string | null
          status: Database["public"]["Enums"]["booking_status"]
          street: string | null
          street_number: string | null
          updated_at: string
        }
        Insert: {
          attendance_mode: Database["public"]["Enums"]["attendance_mode"]
          city?: string | null
          client_email?: string | null
          client_name: string
          client_phone: string
          complement?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          item_name: string
          kind: Database["public"]["Enums"]["booking_kind"]
          location_text: string
          neighborhood?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          postal_code?: string | null
          price_cents?: number | null
          service_id?: string | null
          slot_id: string
          starts_at: string
          state?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          street?: string | null
          street_number?: string | null
          updated_at?: string
        }
        Update: {
          attendance_mode?: Database["public"]["Enums"]["attendance_mode"]
          city?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string
          complement?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          item_name?: string
          kind?: Database["public"]["Enums"]["booking_kind"]
          location_text?: string
          neighborhood?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          postal_code?: string | null
          price_cents?: number | null
          service_id?: string | null
          slot_id?: string
          starts_at?: string
          state?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          street?: string | null
          street_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          name: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          active: boolean
          attendance_mode: string
          availability_notes: string | null
          created_at: string
          description: string
          duration_text: string | null
          id: string
          image_url: string | null
          name: string
          position: number
          price_cents: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          attendance_mode?: string
          availability_notes?: string | null
          created_at?: string
          description: string
          duration_text?: string | null
          id?: string
          image_url?: string | null
          name: string
          position?: number
          price_cents?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          attendance_mode?: string
          availability_notes?: string | null
          created_at?: string
          description?: string
          duration_text?: string | null
          id?: string
          image_url?: string | null
          name?: string
          position?: number
          price_cents?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          attendance_modes: Database["public"]["Enums"]["attendance_mode"][]
          availability_notes: string | null
          category_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          name: string
          position: number
          price_cents: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          attendance_modes?: Database["public"]["Enums"]["attendance_mode"][]
          availability_notes?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          name: string
          position?: number
          price_cents?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          attendance_modes?: Database["public"]["Enums"]["attendance_mode"][]
          availability_notes?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          name?: string
          position?: number
          price_cents?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_mode: "ESTABELECIMENTO" | "DOMICILIAR"
      booking_kind: "SERVICO" | "CURSO"
      booking_status:
        | "PENDENTE"
        | "AGUARDANDO_PAGAMENTO"
        | "COMPROVANTE_ENVIADO"
        | "CONFIRMADO"
        | "CANCELADO"
        | "CONCLUIDO"
      payment_status:
        | "AGUARDANDO_CONFIRMACAO"
        | "COMPROVANTE_ENVIADO"
        | "CONFIRMADO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_mode: ["ESTABELECIMENTO", "DOMICILIAR"],
      booking_kind: ["SERVICO", "CURSO"],
      booking_status: [
        "PENDENTE",
        "AGUARDANDO_PAGAMENTO",
        "COMPROVANTE_ENVIADO",
        "CONFIRMADO",
        "CANCELADO",
        "CONCLUIDO",
      ],
      payment_status: [
        "AGUARDANDO_CONFIRMACAO",
        "COMPROVANTE_ENVIADO",
        "CONFIRMADO",
      ],
    },
  },
} as const
