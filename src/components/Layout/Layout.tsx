import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MusicPlayer from '../Player/MusicPlayer';
import { usePlayerStore } from '../../store/playerStore';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${currentSong ? 'pb-24 md:pb-28' : ''}`}>
        <Outlet />
      </main>
      {currentSong && <MusicPlayer />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
};

export default Layout;