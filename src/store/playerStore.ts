import { create } from 'zustand';
import { Song } from '../types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  muted: boolean;
}

interface PlayerActions {
  setCurrentSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (progress: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  removeFromQueue: (index: number) => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  reset: () => void;
}

type PlayerStore = PlayerState & PlayerActions;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  muted: false,

  setCurrentSong: (song: Song) => {
    set({ currentSong: song, isPlaying: true });
  },

  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    set(state => ({ isPlaying: !state.isPlaying }));
  },

  setVolume: (volume: number) => {
    set({ volume, muted: volume === 0 });
  },

  toggleMute: () => {
    const { muted, volume } = get();
    set({ muted: !muted, volume: muted ? (volume > 0 ? volume : 0.5) : 0 });
  },

  seekTo: (progress: number) => {
    set({ progress });
  },

  nextSong: () => {
    const { queue, currentIndex } = get();
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextSong = queue[nextIndex];
      set({ currentIndex: nextIndex });
      get().setCurrentSong(nextSong);
    }
  },

  previousSong: () => {
    const { queue, currentIndex } = get();
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevSong = queue[prevIndex];
      set({ currentIndex: prevIndex });
      get().setCurrentSong(prevSong);
    }
  },

  addToQueue: (song: Song) => {
    set((state) => ({
      queue: [...state.queue, song],
    }));
  },

  clearQueue: () => {
    set({ queue: [], currentIndex: 0 });
  },

  removeFromQueue: (index: number) => {
    set((state) => {
      const newQueue = [...state.queue];
      newQueue.splice(index, 1);
      let newIndex = state.currentIndex;
      
      if (index < state.currentIndex) {
        newIndex = newIndex - 1;
      }
      
      return {
        queue: newQueue,
        currentIndex: newIndex >= 0 ? newIndex : 0,
      };
    });
  },

  setQueue: (songs: Song[], startIndex = 0) => {
    if (songs.length > 0) {
      set({
        queue: songs,
        currentIndex: startIndex,
      });
      get().setCurrentSong(songs[startIndex]);
    }
  },

  reset: () => {
    set({
      currentSong: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
    });
  },
}));