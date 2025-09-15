import React from 'react';
import { motion } from 'framer-motion';

const PetCard = ({ pet, onAdoptClick }) => {
  const placeholderImage = "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400";

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    hover: { scale: 1.03, y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", transition: { type: 'spring', stiffness: 300, damping: 15 } },
  };

  // A map to give different colors to different categories
  const categoryColors = {
    'Dog': 'bg-blue-100 text-blue-800',
    'Cat': 'bg-green-100 text-green-800',
    'Rabbit': 'bg-pink-100 text-pink-800',
    'Parrot': 'bg-yellow-100 text-yellow-800',
    'Bird': 'bg-sky-100 text-sky-800',
    'Fish': 'bg-indigo-100 text-indigo-800',
    'Hamster': 'bg-orange-100 text-orange-800',
    'Turtle': 'bg-teal-100 text-teal-800',
    'default': 'bg-gray-100 text-gray-800',
  };

  return (
    <motion.div
      variants={cardVariants}
      // The parent `motion.div` in App.jsx will orchestrate the `hidden` and `visible` states
      whileHover="hover"
      className="bg-white rounded-xl shadow-md overflow-hidden h-[450px] flex flex-col cursor-default"
    >
      <img 
        src={pet.image_url || placeholderImage} 
        alt={pet.title} 
        className="w-full h-56 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-apc-black">{pet.title}</h3>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[pet.category] || categoryColors.default}`}>
            {pet.category}
          </span>
        </div>
        <p className="text-apc-dark-grey text-base flex-grow">{pet.description}</p>
          <button 
            onClick={onAdoptClick}
            className="mt-4 w-full bg-apc-red text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Adopt Me ❤️
          </button>
      </div>
    </motion.div>
  );
};

export default PetCard;