export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  album?: string;
  genre?: string;
  duration: number;
  image_url: string;
  song_url: string;
  is_premium: boolean;
  price?: number;
  artist?: Artist;
  created_at: string;
}

export interface Artist {
  id: string;
  name: string;
  image_url: string;
  bio?: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  user_id: string;
  description?: string;
  image_url?: string;
  is_public: boolean;
  created_at: string;
  songs?: Song[];
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  created_at: string;
  song?: Song;
}

export interface Purchase {
  id: string;
  user_id: string;
  song_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  song?: Song;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
}