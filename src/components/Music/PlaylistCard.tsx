import React from 'react';
import { PlayCircle, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Playlist } from '../../types';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Link to={`/playlists/${playlist.id}`} className="music-card block group">
      <div className="relative aspect-square overflow-hidden">
        {playlist.image_url ? (
          <img 
            src={playlist.image_url} 
            alt={playlist.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Music size={64} className="text-white/80" />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 p-2 rounded-full transform hover:scale-110 transition-transform">
            <PlayCircle size={32} className="text-primary-600" />
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold truncate">{playlist.name}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
          {playlist.description || `${playlist.songs?.length || 0} songs`}
        </p>
      </div>
    </Link>
  );
};

export default PlaylistCard;