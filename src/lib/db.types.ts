// Auto-generated types matching the AgentsNerator Supabase schema.
// Update if columns change.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          neutrons_balance: number | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          subdomain: string | null;
          description: string | null;
          status: "active" | "paused" | "building" | null;
          tags: string[] | null;
          tasks_completed: number | null;
          neutron_earned: number | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      agents: {
        Row: {
          id: string;
          project_id: string | null;
          agent_name: string;
          role: string | null;
          barcode: string | null;
          score: number | null;
          status: "active" | "idle" | "training" | null;
          is_ceo: boolean | null;
          avatar_icon: string | null;
          tasks_completed: number | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["agents"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["agents"]["Insert"]>;
      };
      agent_performance: {
        Row: {
          id: string;
          agent_id: string | null;
          accuracy: number | null;
          latency: number | null;
          reliability: number | null;
          cost_efficiency: number | null;
          safety: number | null;
          user_rating: number | null;
          score: number | null;
          calculated_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_performance"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["agent_performance"]["Insert"]>;
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string | null;
          type: string | null;
          neutrons: number | null;
          usdt: number | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["wallet_transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["wallet_transactions"]["Insert"]>;
      };
    };
  };
}

// ─── Convenience row types ─────────────────────────────────────────────────────
export type DbProject = Database["public"]["Tables"]["projects"]["Row"];
export type DbAgent   = Database["public"]["Tables"]["agents"]["Row"];
