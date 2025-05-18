import React from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '../../types';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link to={`/artists/${artist.id}`} className="flex flex-col items-center group">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-3">
        <img 
          src={artist.image_url} 
          alt={artist.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h3 className="font-semibold text-center group-hover:text-primary-600 transition-colors">
        {artist.name}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">Artist</p>
    </Link>
  );
};

export default ArtistCard;