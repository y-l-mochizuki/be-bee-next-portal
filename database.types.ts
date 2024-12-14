export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feed_types: {
        Row: {
          created_at: string
          id: number
          type_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          type_name: string
        }
        Update: {
          created_at?: string
          id?: number
          type_name?: string
        }
        Relationships: []
      }
      feeds: {
        Row: {
          created_at: string
          feed_type_id: number | null
          feed_url: string
          group_id: number | null
          id: number
        }
        Insert: {
          created_at?: string
          feed_type_id?: number | null
          feed_url: string
          group_id?: number | null
          id?: number
        }
        Update: {
          created_at?: string
          feed_type_id?: number | null
          feed_url?: string
          group_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "feeds_feed_type_id_fkey"
            columns: ["feed_type_id"]
            isOneToOne: false
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeds_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: number
          is_archived: boolean
          name: string
          site_url: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_archived?: boolean
          name: string
          site_url: string
        }
        Update: {
          created_at?: string
          id?: number
          is_archived?: boolean
          name?: string
          site_url?: string
        }
        Relationships: []
      }
      official_sites: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean
          official_site_url: string
          rss_url: string
          site_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean
          official_site_url: string
          rss_url: string
          site_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean
          official_site_url?: string
          rss_url?: string
          site_name?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          created_at: string
          embed_string: string
          id: string
        }
        Insert: {
          created_at?: string
          embed_string: string
          id?: string
        }
        Update: {
          created_at?: string
          embed_string?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      feed_details: {
        Row: {
          feed_type_name: string | null
          feed_url: string | null
          group_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
