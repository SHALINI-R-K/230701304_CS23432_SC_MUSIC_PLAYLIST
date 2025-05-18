import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Clock, MoreHorizontal, Music, Edit, Trash2, Share2 } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { formatTime, formatDate, SAMPLE_PLAYLISTS, SAMPLE_SONGS, TAMIL_ARTISTS } from '../lib/utils';
import { Playlist, Song, PlaylistSong } from '../types';
import toast from 'react-hot-toast';

const PlaylistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<(Song & { position: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuthStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay, setQueue } = usePlayerStore();

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // For now, use sample data
    const foundPlaylist = SAMPLE_PLAYLISTS.find(p => p.id === id);
    
    if (foundPlaylist) {
      setPlaylist({
        ...foundPlaylist,
        created_at: new Date().toISOString()
      });
      
      // Check if user is the owner
      setIsOwner(user?.id === foundPlaylist.user_id);
      
      // Get songs for this playlist (mock data)
      const songs = SAMPLE_SONGS.slice(0, 5).map((song, index) => ({
        ...song,
        created_at: new Date().toISOString(),
        artist: TAMIL_ARTISTS.find(artist => artist.id === song.artist_id),
        position: index
      }));
      
      setPlaylistSongs(songs);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id, user]);

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      setQueue(playlistSongs);
      toast.success('Playing entire playlist');
    }
  };

  const handlePlaySong = (song: Song, index: number) => {
    setCurrentSong(song);
    // Also set the queue to this playlist starting from this song
    setQueue(playlistSongs, index);
  };

  const handleDeletePlaylist = () => {
    // In a real app, we would call Supabase to delete
    toast.success('Playlist deleted successfully');
    // Redirect would happen here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading playlist...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Music size={64} className="mx-auto mb-4 text-zinc-400" />
        <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          The playlist you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/playlists"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          View All Playlists
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64 lg:w-80">
          <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
            {playlist.image_url ? (
              <img 
                src={playlist.image_url} 
                alt={playlist.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Music size={64} className="text-white/80" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{playlist.name}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {playlist.description || 'No description'}
            </p>
            
            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-6 space-x-3">
              <span>{playlistSongs.length} songs</span>
              <span>•</span>
              <span>Created {formatDate(playlist.created_at)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePlayAll}
              disabled={playlistSongs.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              <span>Play All</span>
            </button>
            
            {isOwner && (
              <>
                <Link
                  to={`/playlists/${playlist.id}/edit`}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Edit size={20} />
                  <span>Edit</span>
                </Link>
                
                <button
                  onClick={handleDeletePlaylist}
                  className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={20} />
                  <span>Delete</span>
                </button>
              </>
            )}
            
            <button
              className="flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Songs List */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow">
        <table className="w-full text-left">
          <thead className="bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4 hidden md:table-cell">Artist</th>
              <th className="py-3 px-4 hidden lg:table-cell">Album</th>
              <th className="py-3 px-4 text-right">
                <Clock size={16} />
              </th>
              <th className="py-3 px-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {playlistSongs.length > 0 ? (
              playlistSongs.map((song, index) => {
                const isCurrentPlaying = currentSong?.id === song.id && isPlaying;
                
                return (
                  <tr 
                    key={`${song.id}-${index}`}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 w-12">
                      <div className="flex items-center justify-center w-6 h-6">
                        <button
                          onClick={() => handlePlaySong(song, index)}
                          className="text-zinc-500 group-hover:text-primary-600 transition-colors"
                        >
                          {isCurrentPlaying ? (
                            <Pause size={18} />
                          ) : (
                            <Play size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={song.image_url}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className={`font-medium ${
                            isCurrentPlaying ? 'text-primary-600' : ''
                          }`}>
                            {song.title}
                          </p>
                          {song.is_premium && (
                            <span className="text-xs text-secondary-600 font-medium">Premium</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {song.artist?.name || 'Unknown Artist'}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {song.album || 'Single'}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-zinc-500">
                      {formatTime(song.duration)}
                    </td>
                    <td className="py-3 px-4 w-12">
                      <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  <p>This playlist is empty.</p>
                  {isOwner && (
                    <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                      Add songs
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistDetailsPage;