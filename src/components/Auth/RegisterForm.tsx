import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password, fullName);
      
      // Check if there was an error
      if (!useAuthStore.getState().error) {
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Sign up to start using Melodify</p>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6">
          {error}
          <button 
            className="ml-2 text-red-500 dark:text-red-400 text-sm underline" 
            onClick={clearError}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-zinc-500" />
            </div>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-zinc-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-zinc-500" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input pl-10 w-full"
            />
          </div>
          <p className="text-xs text-zinc-500">
            Password must be at least 6 characters long.
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-zinc-500" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Already have an account? </span>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;