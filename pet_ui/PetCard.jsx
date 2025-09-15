import React from 'react';

const PetCard = ({ pet, onAdoptClick, onFavoriteClick, onImageClick, className }) => {
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg group ${className}`}>
      <img 
        src={pet.image_url} 
        alt={pet.animal_type} 
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onImageClick && onImageClick(pet)}
      />
      {/* Favorite Button */}
      {onFavoriteClick && (
        <button onClick={() => onFavoriteClick(pet)} title="Add to favorites" className="absolute top-2 right-2 bg-black/30 p-2 rounded-full text-white hover:text-apc-red hover:bg-white/50 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
        </button>
      )}
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end">
        <p className="text-white font-bold text-lg capitalize">{pet.animal_type}</p>
        <button onClick={onAdoptClick} className="bg-apc-red text-white px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Adopt Me
        </button>
      </div>
    </div>
  );
};

export default PetCard;