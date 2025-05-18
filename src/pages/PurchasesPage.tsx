import React, { useState, useEffect } from 'react';
import { ShoppingCart, PlayCircle, Download } from 'lucide-react';
import { SAMPLE_SONGS, TAMIL_ARTISTS, formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { Song, Purchase } from '../types';
import toast from 'react-hot-toast';

interface PurchaseWithSong extends Purchase {
  song: Song;
}

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseWithSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { setCurrentSong } = usePlayerStore();

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // For now, generate mock data
    if (user) {
      // Create mock purchases from premium songs
      const premiumSongs = SAMPLE_SONGS.filter(song => song.is_premium);
      const mockPurchases = premiumSongs.slice(0, 3).map((song, index) => ({
        id: `purchase-${index}`,
        user_id: user.id,
        song_id: song.id,
        amount: song.price || 0,
        status: 'completed' as const,
        created_at: new Date(Date.now() - index * 86400000).toISOString(), // Stagger dates
        song: {
          ...song,
          created_at: new Date().toISOString(),
          artist: TAMIL_ARTISTS.find(artist => artist.id === song.artist_id)
        }
      }));
      
      setPurchases(mockPurchases);
      
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [user]);

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    toast.success(`Playing "${song.title}"`);
  };

  const handleDownload = (song: Song) => {
    // In a real app, this would trigger a download
    toast.success(`Downloading "${song.title}"`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Purchases</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Access and manage your premium song purchases
        </p>
      </div>
      
      {purchases.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Purchase History</h2>
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={purchase.song.image_url} 
                      alt={purchase.song.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div>
                      <h3 className="font-semibold">{purchase.song.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {purchase.song.artist?.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Purchased on {formatDate(purchase.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-4">
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                      ${purchase.amount.toFixed(2)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlay(purchase.song)}
                        className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                        title="Play"
                      >
                        <PlayCircle size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleDownload(purchase.song)}
                        className="p-2 rounded-full bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-900/50 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-zinc-400" />
          <h2 className="text-xl font-semibold mb-2">No Purchases Yet</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            You haven't purchased any premium songs yet.
          </p>
          <a
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Browse Premium Songs</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default PurchasesPage;