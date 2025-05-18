import React from 'react';
import { Navigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuthStore } from '../store/authStore';

const RegisterPage: React.FC = () => {
  const { user } = useAuthStore();
  
  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-secondary-500 to-primary-600 p-12">
        <div className="h-full flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">Join Our Tamil Music Community</h2>
          <p className="text-lg text-center mb-8 text-white/90">
            Create an account to unlock premium features, save your favorite songs, and create custom playlists.
          </p>
          <img 
            src="https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Tamil Music" 
            className="w-3/4 rounded-xl shadow-lg"
          />
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center">
              <Music size={40} className="text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold mt-2">Melodify</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Tamil Music Experience</p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;