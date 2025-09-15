import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from './PetCard.jsx';
import Modal from './Modal.jsx';

const API_BASE_URL = "http://localhost:8000";

const PersonalityGame = ({ pets, setGameMode }) => {
  const [selectedPets, setSelectedPets] = useState([]);
  const [personalityResult, setPersonalityResult] = useState('');
  const [isResultModalOpen, setResultModalOpen] = useState(false);

  const handleSelectPet = (pet) => {
    if (selectedPets.length < 3) {
      setSelectedPets(prev => {
        const isAlreadySelected = prev.some(p => p.name === pet.name);
        if (isAlreadySelected) {
          return prev.filter(p => p.name !== pet.name);
        }
        return [...prev, pet];
      });
    } else {
      // If 3 are already selected, clicking another one deselects it
      setSelectedPets(prev => prev.filter(p => p.name !== pet.name));
    }
  };

  useEffect(() => {
    const fetchPersonality = async () => {
      if (selectedPets.length === 3) {
        const petTypes = selectedPets.map(p => p.type.toLowerCase());
        try {
          const response = await axios.post(`${API_BASE_URL}/pets/game`, petTypes);
          setPersonalityResult(response.data.personality);
          setResultModalOpen(true);
        } catch (error) {
          console.error("Failed to fetch personality:", error);
          setPersonalityResult("Could not determine your personality. Please try again!");
          setResultModalOpen(true);
        }
      }
    };
    fetchPersonality();
  }, [selectedPets]);

  const handleCloseModal = () => {
    setResultModalOpen(false);
    setSelectedPets([]);
    setGameMode(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Personality Game</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Choose 3 pets to reveal your personality! ({selectedPets.length} / 3 selected)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets.map((pet, index) => (
          <PetCard
            key={index}
            pet={pet}
            onSelect={() => handleSelectPet(pet)}
            isSelected={selectedPets.some(p => p.name === pet.name)}
            isGameMode={true}
          />
        ))}
      </div>
      <Modal isOpen={isResultModalOpen} onClose={handleCloseModal}>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Pet Personality Is...</h3>
        <p className="text-xl text-indigo-600">{personalityResult}</p>
      </Modal>
    </div>
  );
};

export default PersonalityGame;