import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlaylistCard from '../components/Music/PlaylistCard';
import { SAMPLE_PLAYLISTS } from '../lib/utils';
import { Playlist } from '../types';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { Music, Plus } from 'lucide-react';

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // For now, use sample data
    setPlaylists(SAMPLE_PLAYLISTS.map(playlist => ({
      ...playlist,
      created_at: new Date().toISOString()
    })));
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading playlists...</p>
        </div>
      </div>
    );
  }

  // Filter public playlists and user's playlists
  const publicPlaylists = playlists.filter(playlist => playlist.is_public);
  const userPlaylists = user ? playlists.filter(playlist => playlist.user_id === user.id) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Playlists</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Discover curated collections of Tamil music or create your own
        </p>
      </div>
      
      {/* User's Playlists */}
      {user && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <Link
              to="/create-playlist"
              className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={18} />
              <span>Create Playlist</span>
            </Link>
          </div>
          
          {userPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userPlaylists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PlaylistCard playlist={playlist} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-8 text-center">
              <Music size={48} className="mx-auto mb-4 text-zinc-400" />
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Create your first playlist to organize your favorite Tamil songs.
              </p>
              <Link
                to="/create-playlist"
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={18} />
                <span>Create Playlist</span>
              </Link>
            </div>
          )}
        </section>
      )}
      
      {/* Featured Playlists */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publicPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <PlaylistCard playlist={playlist} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Create Account CTA */}
      {!user && (
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Create Your Own Playlists</h3>
              <p className="text-white/90">
                Sign up to create and manage your personal Tamil music playlists.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white text-primary-700 rounded-lg hover:bg-white/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;