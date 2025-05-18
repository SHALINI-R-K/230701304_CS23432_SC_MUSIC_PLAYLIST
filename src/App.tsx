import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import ArtistDetailsPage from './pages/ArtistDetailsPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import PurchasesPage from './pages/PurchasesPage';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { refreshUser } = useAuthStore();
  
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="playlists" element={<PlaylistsPage />} />
          <Route path="playlists/:id" element={<PlaylistDetailsPage />} />
          <Route path="artists/:id" element={<ArtistDetailsPage />} />
          <Route 
            path="upload" 
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="create-playlist" 
            element={
              <ProtectedRoute>
                <CreatePlaylistPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="purchases" 
            element={
              <ProtectedRoute>
                <PurchasesPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
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
    </Router>
  );
}

export default App;