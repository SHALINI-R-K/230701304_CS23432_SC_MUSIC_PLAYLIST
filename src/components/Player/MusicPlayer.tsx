import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, X } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { formatTime } from '../../lib/utils';
import YouTube from 'react-youtube';

const MusicPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    previousSong, 
    volume, 
    setVolume, 
    progress,
    duration,
    seekTo,
    queue,
    currentIndex,
  } = usePlayerStore();

  const [showQueue, setShowQueue] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && player) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      player.seekTo(newTime);
      seekTo(newTime);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      nextSong();
    }
  };

  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
      player.setVolume(volume * 100);
    }
  }, [isPlaying, volume, player]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (player && isPlaying) {
      interval = setInterval(() => {
        const currentTime = player.getCurrentTime();
        const videoDuration = player.getDuration();
        seekTo(currentTime);
        usePlayerStore.setState({ duration: videoDuration });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const queueElement = document.getElementById('queue-panel');
      if (queueElement && !queueElement.contains(e.target as Node)) {
        setShowQueue(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentSong) return null;

  const videoId = getYouTubeId(currentSong.song_url);

  if (!videoId) {
    console.error('Invalid YouTube URL:', currentSong.song_url);
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-2 md:p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 w-full md:w-1/3">
          <img 
            src={currentSong.image_url} 
            alt={currentSong.title} 
            className="w-14 h-14 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate">{currentSong.title}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {currentSong.artist?.name || 'Unknown Artist'}
            </p>
          </div>
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col items-center w-full md:w-2/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={previousSong}
              className="p-1 text-zinc-700 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="p-1 text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
            >
              {isPlaying ? <PauseCircle size={40} /> : <PlayCircle size={40} />}
            </button>
            
            <button 
              onClick={nextSong}
              className="p-1 text-zinc-700 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <SkipForward size={24} />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-2 mt-1">
            <span className="text-xs">{formatTime(progress)}</span>
            <div 
              ref={progressBarRef}
              className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume & Queue */}
        <div className="hidden md:flex items-center justify-end gap-4 w-full md:w-1/4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
              className="text-zinc-700 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
            />
          </div>
          
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-full ${showQueue ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            <ListMusic size={20} />
          </button>
        </div>
      </div>

      {/* YouTube Player (hidden) */}
      <div className="hidden">
        <YouTube
          videoId={videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              rel: 0,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      
      {/* Queue Panel */}
      {showQueue && (
        <div 
          id="queue-panel"
          className="absolute bottom-full right-0 md:right-4 mb-2 w-full md:w-80 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 max-h-96 overflow-hidden flex flex-col"
        >
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold">Up Next</h3>
            <button onClick={() => setShowQueue(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {queue.length === 0 ? (
              <p className="text-center py-6 text-zinc-500 dark:text-zinc-400">Queue is empty</p>
            ) : (
              <ul>
                {queue.map((song, index) => (
                  <li 
                    key={`${song.id}-${index}`} 
                    className={`flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${currentIndex === index ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}
                  >
                    <img 
                      src={song.image_url} 
                      alt={song.title} 
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {currentIndex === index && (
                          <span className="inline-flex items-center mr-1">
                            <div className="music-wave">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </span>
                        )}
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {song.artist?.name || 'Unknown Artist'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;