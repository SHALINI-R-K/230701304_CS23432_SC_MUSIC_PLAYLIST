import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Upload, X, Save, PlayCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { SAMPLE_SONGS, TAMIL_ARTISTS } from '../lib/utils';
import { Song } from '../types';

const CreatePlaylistPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, we would fetch from Supabase
  // For now, use sample data
  const availableSongs = SAMPLE_SONGS.map(song => ({
    ...song,
    created_at: new Date().toISOString(),
    artist: TAMIL_ARTISTS.find(artist => artist.id === song.artist_id)
  }));
  
  const filteredSongs = availableSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setCoverImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  });
  
  const handleToggleSong = (song: Song) => {
    if (selectedSongs.some(s => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };
  
  const handleCreatePlaylist = () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your playlist');
      return;
    }
    
    if (selectedSongs.length === 0) {
      toast.error('Please add at least one song to your playlist');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate creating playlist in Supabase
    setTimeout(() => {
      toast.success('Playlist created successfully!');
      setIsSubmitting(false);
      navigate('/playlists');
    }, 1500);
  };
  
  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Playlist</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Organize your favorite Tamil songs into a custom playlist
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Playlist Details */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Playlist Details</h2>
            
            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Cover Image
              </label>
              
              {coverPreview ? (
                <div className="relative rounded-lg overflow-hidden aspect-square">
                  <img 
                    src={coverPreview} 
                    alt="Playlist cover" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors"
                >
                  <input {...getInputProps()} ref={fileInputRef} />
                  <Upload size={36} className="text-zinc-400 mb-2" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                    Click or drag image to upload cover
                  </p>
                </div>
              )}
            </div>
            
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Playlist Name*
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="input w-full"
                required
              />
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your playlist..."
                rows={3}
                className="input w-full"
              />
            </div>
            
            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Visibility
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="w-4 h-4 accent-primary-600 mr-2"
                  />
                  <span>Public</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="w-4 h-4 accent-primary-600 mr-2"
                  />
                  <span>Private</span>
                </label>
              </div>
            </div>
            
            {/* Create Button */}
            <button
              onClick={handleCreatePlaylist}
              disabled={isSubmitting || !name.trim() || selectedSongs.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Creating...' : 'Create Playlist'}</span>
            </button>
          </div>
        </div>
        
        {/* Song Selection */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Add Songs <span className="text-sm font-normal text-zinc-500">({selectedSongs.length} selected)</span>
            </h2>
            
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs or artists..."
                className="input w-full"
              />
            </div>
            
            {/* Selected Songs List */}
            {selectedSongs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Selected Songs</h3>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {selectedSongs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between rounded-lg p-2 bg-white dark:bg-zinc-800 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={song.image_url} 
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{song.title}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {song.artist?.name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleSong(song)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Available Songs */}
            <div>
              <h3 className="text-lg font-medium mb-3">Available Songs</h3>
              
              {filteredSongs.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {filteredSongs.map((song) => {
                    const isSelected = selectedSongs.some(s => s.id === song.id);
                    
                    return (
                      <div
                        key={song.id}
                        onClick={() => handleToggleSong(song)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800' 
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                        }`}
                      >
                        <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={song.image_url} 
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <PlayCircle size={24} className="text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{song.title}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                            {song.artist?.name} • {song.album || 'Single'}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className={`w-6 h-6 rounded-full ${
                            isSelected 
                              ? 'bg-primary-600 text-white flex items-center justify-center' 
                              : 'border-2 border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {isSelected && <Check size={16} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg">
                  <Music size={40} className="mx-auto text-zinc-400 mb-2" />
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No songs found matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Check component is missing, add it
const Check = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default CreatePlaylistPage;