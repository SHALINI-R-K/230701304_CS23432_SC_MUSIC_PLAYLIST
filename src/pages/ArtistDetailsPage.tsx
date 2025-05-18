import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, PlayCircle, Share2, ExternalLink } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { formatTime, TAMIL_ARTISTS, SAMPLE_SONGS } from '../lib/utils';
import { Artist, Song } from '../types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ArtistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue } = usePlayerStore();

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // For now, use sample data
    const foundArtist = TAMIL_ARTISTS.find(a => a.id === id);
    
    if (foundArtist) {
      setArtist({
        ...foundArtist,
        created_at: new Date().toISOString()
      });
      
      // Get songs for this artist
      const artistSongs = SAMPLE_SONGS.filter(song => song.artist_id === id).map(song => ({
        ...song,
        created_at: new Date().toISOString(),
        artist: foundArtist
      }));
      
      setSongs(artistSongs);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setQueue(songs);
      toast.success(`Playing all songs by ${artist?.name}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading artist details...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Artist Not Found</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          The artist you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/explore"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Explore Artists
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Artist Banner */}
      <div className="h-80 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover" 
          style={{ backgroundImage: `url(${artist.image_url})` }}
        ></div>
        
        <div className="absolute inset-x-0 bottom-0 container mx-auto px-4 py-8 flex items-end">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{artist.name}</h1>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handlePlayAll}
                disabled={songs.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={20} />
                <span>Play All</span>
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            {/* About the Artist */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {artist.bio || `${artist.name} is a renowned Tamil music artist known for their exceptional talent and contribution to the Tamil music industry.`}
              </p>
            </section>
            
            {/* Songs */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Songs by {artist.name}</h2>
              
              {songs.length > 0 ? (
                <div className="space-y-4">
                  {songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 group transition-colors"
                    >
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <img 
                          src={song.image_url} 
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle size={24} className="text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{song.title}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {song.album || 'Single'}
                        </p>
                      </div>
                      
                      {song.is_premium && (
                        <span className="text-xs bg-secondary-500 text-white px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                      
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatTime(song.duration)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No songs available for this artist yet.
                  </p>
                </div>
              )}
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden mb-6">
                <img 
                  src={artist.image_url} 
                  alt={artist.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Artist Info</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Songs</p>
                    <p className="font-medium">{songs.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Genre</p>
                    <p className="font-medium">Tamil Music</p>
                  </div>
                  
                  <div className="pt-4">
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink size={16} />
                      <span>Visit Official Website</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailsPage;