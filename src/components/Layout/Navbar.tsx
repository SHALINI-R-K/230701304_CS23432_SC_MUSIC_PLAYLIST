import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, User, Search, Menu, X, LogOut, PlayCircle, Home, Library, Upload, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        active
          ? 'bg-primary-100/10 text-primary-500'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/10 hover:text-primary-500'
      )}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/explore', icon: <Search size={20} />, label: 'Explore' },
    { to: '/playlists', icon: <Library size={20} />, label: 'Playlists' },
    { to: '/upload', icon: <Upload size={20} />, label: 'Upload' },
  ];

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Music size={28} className="text-primary-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Melodify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/create-playlist"
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                <Plus size={16} />
                <span>New Playlist</span>
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 py-2 px-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.full_name || user.email} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                  <span className="text-sm font-medium">{user.full_name || user.email.split('@')[0]}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    Profile
                  </Link>
                  <Link to="/purchases" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    My Purchases
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="py-2 px-4 text-sm font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="py-2 px-4 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMenu}
      />
      
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-zinc-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Music size={24} className="text-primary-600" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Melodify
            </span>
          </Link>
          <button
            onClick={closeMenu}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
              onClick={closeMenu}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name || user.email} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
                <div>
                  <p className="font-medium">{user.full_name || user.email.split('@')[0]}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                </div>
              </div>
              
              <Link
                to="/create-playlist"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                onClick={closeMenu}
              >
                <Plus size={18} />
                <span>Create New Playlist</span>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/10 hover:text-primary-500"
                onClick={closeMenu}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
              
              <Link
                to="/purchases"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/10 hover:text-primary-500"
                onClick={closeMenu}
              >
                <PlayCircle size={20} />
                <span>My Purchases</span>
              </Link>
              
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-zinc-100/10"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full text-center py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-2 px-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;