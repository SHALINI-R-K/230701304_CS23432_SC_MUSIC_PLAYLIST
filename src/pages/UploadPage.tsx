import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, X, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GENRES } from '../lib/utils';

interface UploadFile {
  file: File;
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  isPremium: boolean;
  price?: number;
  progress: number;
  status: 'waiting' | 'uploading' | 'success' | 'error';
  error?: string;
}

const UploadPage: React.FC = () => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      // Extract title from filename by removing extension
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      return {
        file,
        id: Math.random().toString(36).substring(2, 9),
        title: fileName,
        artist: '', // Will be filled by user
        isPremium: false,
        progress: 0,
        status: 'waiting' as const
      };
    });
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg'],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB
  });
  
  const handleFileChange = (id: string, field: keyof UploadFile, value: any) => {
    setUploadFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === id ? { ...file, [field]: value } : file
      )
    );
  };
  
  const handleRemoveFile = (id: string) => {
    setUploadFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };
  
  const validateFiles = () => {
    let valid = true;
    
    const updatedFiles = uploadFiles.map(file => {
      if (!file.title.trim()) {
        return { ...file, status: 'error' as const, error: 'Title is required' };
      }
      
      if (!file.artist.trim()) {
        return { ...file, status: 'error' as const, error: 'Artist is required' };
      }
      
      if (file.isPremium && (!file.price || file.price <= 0)) {
        return { ...file, status: 'error' as const, error: 'Premium songs must have a price' };
      }
      
      return file;
    });
    
    setUploadFiles(updatedFiles);
    
    return !updatedFiles.some(file => file.status === 'error');
  };
  
  const simulateUpload = (file: UploadFile) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        
        if (progress >= 100) {
          clearInterval(interval);
          handleFileChange(file.id, 'progress', 100);
          handleFileChange(file.id, 'status', 'success');
          resolve();
        } else {
          handleFileChange(file.id, 'progress', progress);
        }
      }, 500);
    });
  };
  
  const handleUpload = async () => {
    if (!validateFiles()) {
      toast.error('Please fix all errors before uploading');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Set all files to uploading state
      setUploadFiles(prevFiles => 
        prevFiles.map(file => ({ ...file, status: 'uploading', progress: 0 }))
      );
      
      // Simulate uploading each file
      for (const file of uploadFiles) {
        await simulateUpload(file);
      }
      
      toast.success('All files uploaded successfully!');
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Music</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Share your Tamil music with the community
        </p>
      </div>
      
      {/* Dropzone */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-zinc-300 dark:border-zinc-700 hover:border-primary-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center">
            <Upload size={48} className={`mb-4 ${isDragActive ? 'text-primary-500' : 'text-zinc-400'}`} />
            
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop your audio files here' : 'Drag and drop audio files here'}
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              or click to browse from your computer
            </p>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Supports MP3, WAV, OGG (max 20MB)
            </p>
          </div>
        </div>
      </div>
      
      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Files to Upload</h2>
          
          <div className="space-y-4">
            {uploadFiles.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm ${
                  uploadFile.status === 'error' ? 'border border-red-300 dark:border-red-700' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                    <Music size={24} className="text-primary-600" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Title and Artist */}
                    <div className="space-y-2">
                      <div>
                        <label htmlFor={`title-${uploadFile.id}`} className="text-sm font-medium">
                          Title*
                        </label>
                        <input
                          id={`title-${uploadFile.id}`}
                          type="text"
                          value={uploadFile.title}
                          onChange={(e) => handleFileChange(uploadFile.id, 'title', e.target.value)}
                          placeholder="Song title"
                          className="input w-full mt-1"
                          disabled={uploadFile.status === 'uploading' || uploadFile.status === 'success'}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`artist-${uploadFile.id}`} className="text-sm font-medium">
                          Artist*
                        </label>
                        <input
                          id={`artist-${uploadFile.id}`}
                          type="text"
                          value={uploadFile.artist}
                          onChange={(e) => handleFileChange(uploadFile.id, 'artist', e.target.value)}
                          placeholder="Artist name"
                          className="input w-full mt-1"
                          disabled={uploadFile.status === 'uploading' || uploadFile.status === 'success'}
                        />
                      </div>
                    </div>
                    
                    {/* Album and Genre */}
                    <div className="space-y-2">
                      <div>
                        <label htmlFor={`album-${uploadFile.id}`} className="text-sm font-medium">
                          Album
                        </label>
                        <input
                          id={`album-${uploadFile.id}`}
                          type="text"
                          value={uploadFile.album || ''}
                          onChange={(e) => handleFileChange(uploadFile.id, 'album', e.target.value)}
                          placeholder="Album name (optional)"
                          className="input w-full mt-1"
                          disabled={uploadFile.status === 'uploading' || uploadFile.status === 'success'}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`genre-${uploadFile.id}`} className="text-sm font-medium">
                          Genre
                        </label>
                        <select
                          id={`genre-${uploadFile.id}`}
                          value={uploadFile.genre || ''}
                          onChange={(e) => handleFileChange(uploadFile.id, 'genre', e.target.value)}
                          className="input w-full mt-1"
                          disabled={uploadFile.status === 'uploading' || uploadFile.status === 'success'}
                        >
                          <option value="">Select a genre</option>
                          {GENRES.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Premium and Price */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          id={`premium-${uploadFile.id}`}
                          type="checkbox"
                          checked={uploadFile.isPremium}
                          onChange={(e) => handleFileChange(uploadFile.id, 'isPremium', e.target.checked)}
                          className="w-4 h-4 accent-primary-600"
                          disabled={uploadFile.status === 'uploading' || uploadFile.status === 'success'}
                        />
                        <label htmlFor={`premium-${uploadFile.id}`} className="text-sm font-medium">
                          Premium Song
                        </label>
                      </div>
                      
                      {uploadFile.isPremium && (
                        <div>
                          <label htmlFor={`price-${uploadFile.id}`} className="text-sm font-medium">
                            Price ($)
                          </label>
                          <input
                            id={`price-${uploadFile.id}`}
                            type="number"
                            min="0.49"
                            step="0.50"
                            value={uploadFile.price || ''}
                            onChange={(e) => handleFileChange(uploadFile.id, 'price', parseFloat(e.target.value))}
                            placeholder="e.g. 1.99"
                            className="input w-full mt-1"
                            disabled={uploadFile.status === 'uploading' || uploadFile.status === 'success'}
                          />
                        </div>
                      )}
                      
                      <p className="text-xs text-zinc-500">
                        {uploadFile.file.name} ({(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    </div>
                  </div>
                  
                  {/* Status and Remove Button */}
                  <div className="shrink-0">
                    {uploadFile.status === 'waiting' && (
                      <button
                        onClick={() => handleRemoveFile(uploadFile.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                    
                    {uploadFile.status === 'uploading' && (
                      <div className="w-6 h-6 border-2 border-primary-600 border-r-transparent rounded-full animate-spin"></div>
                    )}
                    
                    {uploadFile.status === 'success' && (
                      <div className="text-green-500">
                        <Check size={20} />
                      </div>
                    )}
                    
                    {uploadFile.status === 'error' && (
                      <div className="text-red-500">
                        <AlertCircle size={20} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Error Message */}
                {uploadFile.error && (
                  <div className="mt-2 text-sm text-red-600">
                    {uploadFile.error}
                  </div>
                )}
                
                {/* Progress Bar */}
                {uploadFile.status === 'uploading' && (
                  <div className="mt-3">
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadFile.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-zinc-500">
                      {uploadFile.progress}%
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Button */}
      {uploadFiles.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading || uploadFiles.every(file => file.status === 'success')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading 
              ? 'Uploading...' 
              : uploadFiles.every(file => file.status === 'success')
                ? 'Upload Complete'
                : `Upload ${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}`
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;