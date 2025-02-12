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
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: number
          points_required: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: number
          points_required: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: number
          points_required?: number
          title?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          id: number
          image_type: Database["public"]["Enums"]["image_type"] | null
          image_url: string | null
          order_number: number
          section_id: number | null
          subcategory: string | null
          title: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: number
          image_type?: Database["public"]["Enums"]["image_type"] | null
          image_url?: string | null
          order_number: number
          section_id?: number | null
          subcategory?: string | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: number
          image_type?: Database["public"]["Enums"]["image_type"] | null
          image_url?: string | null
          order_number?: number
          section_id?: number | null
          subcategory?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          license_type: string | null
          location: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          license_type?: string | null
          location?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_type?: string | null
          location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_progress: {
        Row: {
          completed_questions: number[] | null
          created_at: string | null
          id: number
          last_question_index: number | null
          section_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_questions?: number[] | null
          created_at?: string | null
          id?: number
          last_question_index?: number | null
          section_id?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_questions?: number[] | null
          created_at?: string | null
          id?: number
          last_question_index?: number | null
          section_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          category: string | null
          correct_answer: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          explanation: string | null
          id: number
          image_url: string | null
          lesson_id: number | null
          options: string[]
          question: string
          question_type: Database["public"]["Enums"]["question_type"] | null
          related_lesson_ids: number[] | null
        }
        Insert: {
          category?: string | null
          correct_answer: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: number
          image_url?: string | null
          lesson_id?: number | null
          options: string[]
          question: string
          question_type?: Database["public"]["Enums"]["question_type"] | null
          related_lesson_ids?: number[] | null
        }
        Update: {
          category?: string | null
          correct_answer?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: number
          image_url?: string | null
          lesson_id?: number | null
          options?: string[]
          question?: string
          question_type?: Database["public"]["Enums"]["question_type"] | null
          related_lesson_ids?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          content_type: string | null
          created_at: string | null
          description: string | null
          id: number
          license_type: string | null
          order_number: number
          subject: string | null
          title: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          license_type?: string | null
          order_number: number
          subject?: string | null
          title: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          license_type?: string | null
          order_number?: number
          subject?: string | null
          title?: string
        }
        Relationships: []
      }
      spaced_repetition: {
        Row: {
          correct_streak: number | null
          created_at: string | null
          id: string
          interval_days: number | null
          lesson_id: number | null
          next_review: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          correct_streak?: number | null
          created_at?: string | null
          id?: string
          interval_days?: number | null
          lesson_id?: number | null
          next_review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          correct_streak?: number | null
          created_at?: string | null
          id?: string
          interval_days?: number | null
          lesson_id?: number | null
          next_review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spaced_repetition_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: number | null
          earned_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          achievement_id?: number | null
          earned_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          achievement_id?: number | null
          earned_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: number
          last_position: number | null
          lesson_id: number | null
          lives: number | null
          points: number | null
          section_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: number
          last_position?: number | null
          lesson_id?: number | null
          lives?: number | null
          points?: number | null
          section_id?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: number
          last_position?: number | null
          lesson_id?: number | null
          lives?: number | null
          points?: number | null
          section_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
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
      difficulty_level: "basic" | "intermediate" | "advanced"
      image_type: "sign" | "control" | "diagram" | "illustration"
      question_type:
        | "multipleChoice"
        | "trueFalse"
        | "imageIdentification"
        | "scenarioBased"
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
