import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SongCard from '../components/Music/SongCard';
import ArtistCard from '../components/Music/ArtistCard';
import { TAMIL_ARTISTS, SAMPLE_SONGS, GENRES } from '../lib/utils';
import { Search, X } from 'lucide-react';
import { Artist, Song } from '../types';
import { usePlayerStore } from '../store/playerStore';
import toast from 'react-hot-toast';

const ExplorePage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const { setQueue } = usePlayerStore();

  useEffect(() => {
    // Load songs with artist information
    const loadedSongs = SAMPLE_SONGS.map(song => ({
      ...song,
      created_at: new Date().toISOString(),
      artist: TAMIL_ARTISTS.find(artist => artist.id === song.artist_id)
    }));
    
    setSongs(loadedSongs);
    setFilteredSongs(loadedSongs);
    setArtists(TAMIL_ARTISTS.map(artist => ({
      ...artist,
      created_at: new Date().toISOString()
    })));
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter songs based on search query and genre
  useEffect(() => {
    let filtered = songs;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist?.name.toLowerCase().includes(query) ||
        (song.album && song.album.toLowerCase().includes(query))
      );
    }
    
    if (selectedGenre) {
      filtered = filtered.filter(song => song.genre === selectedGenre);
    }
    
    setFilteredSongs(filtered);
  }, [searchQuery, selectedGenre, songs]);

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      setQueue(filteredSongs);
      toast.success('All songs added to queue!');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading music collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Tamil Music</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Discover new songs, artists, and genres from the Tamil music scene
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <X size={18} className="text-zinc-500 hover:text-zinc-700" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === genre
                  ? 'bg-primary-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {genre}
            </button>
          ))}
          
          {(searchQuery || selectedGenre) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Artist Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ArtistCard artist={artist} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Songs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedGenre ? `${selectedGenre} Songs` : 'All Songs'}
            {searchQuery && ` matching "${searchQuery}"`}
          </h2>
          
          {filteredSongs.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Play All
            </button>
          )}
        </div>
        
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SongCard song={song} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-500 dark:text-zinc-400">No songs found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ExplorePage;