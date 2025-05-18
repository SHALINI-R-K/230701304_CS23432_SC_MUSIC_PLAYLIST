import { createClient } from '@supabase/supabase-js';
import { Song, Artist, Playlist, PlaylistSong, Purchase } from '../types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, full_name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data: data?.user, error };
};

// Song functions
export const getSongs = async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('*, artist:artists(*)');
  return { data: data as (Song & { artist: Artist })[] | null, error };
};

export const getSongById = async (id: string) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*, artist:artists(*)')
    .eq('id', id)
    .single();
  return { data: data as (Song & { artist: Artist }) | null, error };
};

export const getSongsByArtist = async (artistId: string) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*, artist:artists(*)')
    .eq('artist_id', artistId);
  return { data: data as (Song & { artist: Artist })[] | null, error };
};

export const getSongsByGenre = async (genre: string) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*, artist:artists(*)')
    .eq('genre', genre);
  return { data: data as (Song & { artist: Artist })[] | null, error };
};

// Artist functions
export const getArtists = async () => {
  const { data, error } = await supabase
    .from('artists')
    .select('*');
  return { data: data as Artist[] | null, error };
};

export const getArtistById = async (id: string) => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Artist | null, error };
};

// Playlist functions
export const getPlaylists = async (userId: string) => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId);
  return { data: data as Playlist[] | null, error };
};

export const getPlaylistById = async (id: string) => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Playlist | null, error };
};

export const createPlaylist = async (playlist: Omit<Playlist, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('playlists')
    .insert(playlist)
    .select()
    .single();
  return { data: data as Playlist | null, error };
};

export const updatePlaylist = async (id: string, playlist: Partial<Playlist>) => {
  const { data, error } = await supabase
    .from('playlists')
    .update(playlist)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Playlist | null, error };
};

export const deletePlaylist = async (id: string) => {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', id);
  return { error };
};

// Playlist songs functions
export const getPlaylistSongs = async (playlistId: string) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('*, song:songs(*, artist:artists(*))')
    .eq('playlist_id', playlistId)
    .order('position');
  return { data: data as (PlaylistSong & { song: Song & { artist: Artist } })[] | null, error };
};

export const addSongToPlaylist = async (playlistId: string, songId: string, position: number) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .insert({
      playlist_id: playlistId,
      song_id: songId,
      position,
    })
    .select()
    .single();
  return { data: data as PlaylistSong | null, error };
};

export const removeSongFromPlaylist = async (id: string) => {
  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('id', id);
  return { error };
};

// Purchase functions
export const getPurchases = async (userId: string) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*, song:songs(*)')
    .eq('user_id', userId);
  return { data: data as (Purchase & { song: Song })[] | null, error };
};

export const createPurchase = async (purchase: Omit<Purchase, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('purchases')
    .insert(purchase)
    .select()
    .single();
  return { data: data as Purchase | null, error };
};

export const checkPurchase = async (userId: string, songId: string) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('song_id', songId)
    .eq('status', 'completed')
    .single();
  return { data: data as Purchase | null, error };
};