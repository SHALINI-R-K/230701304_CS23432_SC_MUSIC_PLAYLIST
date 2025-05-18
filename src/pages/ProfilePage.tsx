import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Camera, Mail, Save, User } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAvatarFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  });
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate saving to Supabase
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setIsSaving(false);
    }, 1500);
  };

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header/Banner */}
          <div className="h-40 bg-gradient-to-r from-primary-600 to-secondary-600 relative"></div>
          
          {/* Avatar */}
          <div className="px-6 sm:px-8">
            <div className="relative -mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt={user.full_name || user.email} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                    <User size={64} />
                  </div>
                )}
              </div>
              
              <div 
                {...getRootProps()} 
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-secondary-600 text-white flex items-center justify-center cursor-pointer hover:bg-secondary-700 transition-colors"
              >
                <input {...getInputProps()} />
                <Camera size={18} />
              </div>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="p-6 sm:p-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">
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
                    placeholder="Your full name"
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
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
                    placeholder="your.email@example.com"
                    className="input pl-10 w-full"
                    disabled
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Email address cannot be changed
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <button className="text-primary-600 hover:text-primary-700">
                  Update your password
                </button>
              </div>
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                <button className="text-red-600 hover:text-red-700">
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;