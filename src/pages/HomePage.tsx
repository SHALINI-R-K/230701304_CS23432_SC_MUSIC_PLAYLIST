import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SongCard from '../components/Music/SongCard';
import ArtistCard from '../components/Music/ArtistCard';
import PlaylistCard from '../components/Music/PlaylistCard';
import { Link } from 'react-router-dom';
import { TAMIL_ARTISTS, SAMPLE_SONGS, SAMPLE_PLAYLISTS, GENRES } from '../lib/utils';
import { Artist, Song, Playlist } from '../types';
import { PlayCircle, Star, Music, Users, Headphones } from 'lucide-react';

const HomePage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [trending, setTrending] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch this data from Supabase
    // For now, use our sample data
    setArtists(TAMIL_ARTISTS);
    setFeaturedSongs(SAMPLE_SONGS.filter(song => song.is_premium).slice(0, 4));
    setPlaylists(SAMPLE_PLAYLISTS);
    setTrending(SAMPLE_SONGS.slice(0, 4));
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading amazing Tamil music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative mb-16 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/164879/pexels-photo-164879.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center"></div>
        
        <div className="relative z-20 py-16 px-6 md:py-24 md:px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Tamil Music
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Stream, create playlists, and enjoy the best Tamil songs. Experience the rich cultural heritage of Tamil music.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/explore" 
                className="bg-white text-primary-600 hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <PlayCircle size={20} />
                <span>Start Listening</span>
              </Link>
              <Link 
                to="/upload" 
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Music size={20} />
                <span>Upload Music</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { icon: <Music className="text-primary-500" size={28} />, label: 'Tamil Songs', value: '1000+' },
          { icon: <Users className="text-secondary-500" size={28} />, label: 'Artists', value: '100+' },
          { icon: <Headphones className="text-accent-500" size={28} />, label: 'Listeners', value: '50K+' },
          { icon: <Star className="text-yellow-500" size={28} />, label: 'Premium Songs', value: '250+' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center"
          >
            <div className="mb-2">{stat.icon}</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{stat.label}</p>
          </motion.div>
        ))}
      </section>
      
      {/* Featured Songs */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Songs</h2>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SongCard 
                song={{
                  ...song,
                  created_at: new Date().toISOString(),
                  artist: TAMIL_ARTISTS.find(artist => artist.id === song.artist_id)
                }} 
              />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Popular Artists */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Artists</h2>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ArtistCard 
                artist={{
                  ...artist,
                  created_at: new Date().toISOString()
                }} 
              />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Playlists Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Playlists</h2>
          <Link to="/playlists" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PlaylistCard playlist={{
                ...playlist,
                created_at: new Date().toISOString()
              }} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Genres Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map((genre, index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-xl aspect-video group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-secondary-600/80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl md:text-2xl font-bold text-white">{genre}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-secondary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Enjoy Premium Tamil Music?</h2>
            <p className="text-white/90 text-lg mb-4">
              Create an account to unlock all features and enjoy premium songs.
            </p>
          </div>
          <Link
            to="/register"
            className="bg-white text-primary-700 hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;