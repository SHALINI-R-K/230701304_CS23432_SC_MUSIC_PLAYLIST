import React from 'react';
import { PlayCircle, PauseCircle, Lock, ShoppingCart } from 'lucide-react';
import { Song } from '../../types';
import { formatTime } from '../../lib/utils';
import { usePlayerStore } from '../../store/playerStore';
import { useAuthStore } from '../../store/authStore';

interface SongCardProps {
  song: Song;
  isPurchased?: boolean;
  showPlayButton?: boolean;
  onPurchase?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  isPurchased = false, 
  showPlayButton = true,
  onPurchase
}) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const { user } = useAuthStore();
  
  const isCurrentSong = currentSong?.id === song.id;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <div className="music-card group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={song.image_url} 
          alt={song.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {song.is_premium && !isPurchased && user ? (
            <button
              onClick={onPurchase}
              className="bg-white/90 p-2 rounded-full transform hover:scale-110 transition-transform"
            >
              <ShoppingCart size={32} className="text-primary-600" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="bg-white/90 p-2 rounded-full transform hover:scale-110 transition-transform"
            >
              {isCurrentSong && isPlaying ? (
                <PauseCircle size={32} className="text-primary-600" />
              ) : (
                <PlayCircle size={32} className="text-primary-600" />
              )}
            </button>
          )}
        </div>
        
        {/* Premium Badge */}
        {song.is_premium && (
          <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
            Premium
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold truncate">{song.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
          {song.artist?.name || 'Unknown Artist'}
        </p>
        <div className="flex justify-between items-center mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{formatTime(song.duration)}</span>
          {song.is_premium && !isPurchased && (
            <span className="font-semibold text-secondary-500">${song.price?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;