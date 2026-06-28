export type SongStatus = "pending" | "analyzing" | "ready" | "failed";

export type Instrument =
  | "acoustic_guitar"
  | "electric_guitar"
  | "bass"
  | "piano"
  | "vocals"
  | "drums";

export type GuitarStyle = "rhythm" | "fingerstyle" | "arpeggiated" | "lead";

export type Feel =
  | "rock"
  | "pop"
  | "folk"
  | "blues"
  | "funk"
  | "country"
  | "ballad"
  | "reggae"
  | "latin";

export interface BeatInfo {
  time: number;
  position: number;
}

export interface ChordHit {
  time: number;
  duration: number;
  chord: string;
  verified?: boolean;
}

export interface AnalysisJson {
  beats: BeatInfo[];
  chords: ChordHit[];
  key?: string;
  bpm?: number;
  feel?: Feel;
  version: number;
}

export interface PlaybackState {
  playing: boolean;
  position_ms: number;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          audio_storage_path: string | null;
          key: string | null;
          bpm: number | null;
          feel: Feel | null;
          analysis_json: AnalysisJson | null;
          lyrics_lrc: string | null;
          uploaded_by: string | null;
          status: SongStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist: string;
          audio_storage_path?: string | null;
          key?: string | null;
          bpm?: number | null;
          feel?: Feel | null;
          analysis_json?: AnalysisJson | null;
          lyrics_lrc?: string | null;
          uploaded_by?: string | null;
          status?: SongStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["songs"]["Insert"]>;
        Relationships: [];
      };
      favorites: {
        Row: {
          user_id: string;
          song_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          song_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
        Relationships: [];
      };
      rooms: {
        Row: {
          id: string;
          code: string;
          host_id: string;
          current_song_id: string | null;
          playback_state: PlaybackState;
          created_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          host_id: string;
          current_song_id?: string | null;
          playback_state?: PlaybackState;
          created_at?: string;
          closed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
        Relationships: [];
      };
      room_participants: {
        Row: {
          room_id: string;
          participant_id: string;
          display_name: string;
          instrument: Instrument | null;
          style: string | null;
          joined_at: string;
        };
        Insert: {
          room_id: string;
          participant_id: string;
          display_name: string;
          instrument?: Instrument | null;
          style?: string | null;
          joined_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["room_participants"]["Insert"]
        >;
        Relationships: [];
      };
    };
    // The Supabase typed client requires these keys to recognise the schema;
    // without them every query resolves to `never`.
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
