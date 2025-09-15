import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import PetCard from './PetCard.jsx';
import Modal from './Modal.jsx';
import Spinner from './Spinner.jsx'; // Assuming Spinner.jsx exists

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdoptModalOpen, setAdoptModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'favorites'
  const [viewedPet, setViewedPet] = useState(null); // For viewing a single pet image

  useEffect(() => {
    const fetchInitialPets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/pets/random`);
        setPets(response.data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setError("Could not load pet data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialPets();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/pets/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setError("Could not load your favorite pets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdoptClick = () => {
    setAdoptModalOpen(true);
  };

  const handleFavoriteClick = async (petToFavorite) => {
    try {
      const payload = {
        image_url: petToFavorite.image_url,
        animal_type: petToFavorite.animal_type,
      };
      await axios.post(`${API_BASE_URL}/pets/favorites`, payload);
      alert(`${petToFavorite.animal_type} added to your favorites!`);
      // Optimistically add to favorites list if on that view
      if (currentView === 'favorites') {
        // The backend returns the created pet, but for simplicity we'll just refetch
        fetchFavorites();
      }
    } catch (error) {
      console.error("Failed to favorite pet:", error);
      if (error.response && error.response.status === 409) {
        alert('You have already favorited this pet!');
      } else {
        alert('Failed to add pet to favorites. Please try again.');
      }
    }
  };

  const handleNavClick = (view) => {
    setCurrentView(view);
    if (view === 'favorites') {
      fetchFavorites();
    }
  };

  const handleImageClick = (pet) => {
    setViewedPet(pet);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar onNavClick={handleNavClick} />
      
      <main className="container mx-auto px-4 py-8">
        {isLoading ? <Spinner /> : error ? (
          <p className="text-center text-apc-red">{error}</p>
        ) : currentView === 'home' ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-apc-black mb-8 text-center">Find Your New Best Friend</h1>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {pets.map(pet => (
                <PetCard 
                  className="break-inside-avoid"
                  key={pet.image_url}
                  pet={pet} 
                  onAdoptClick={handleAdoptClick} 
                  onFavoriteClick={handleFavoriteClick}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          </>
        ) : ( // 'favorites' view
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-apc-black mb-8 text-center">Your Favorite Pets</h1>
            {favorites.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {favorites.map(pet => (
                  <PetCard 
                    className="break-inside-avoid" 
                    key={pet.id} 
                    pet={pet} 
                    onAdoptClick={handleAdoptClick} 
                    onImageClick={handleImageClick}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-apc-dark-grey text-lg">You haven't saved any favorites yet!</p>
            )}
          </>
        )}
      </main>

      <Modal isOpen={isAdoptModalOpen} onClose={() => setAdoptModalOpen(false)}>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-apc-black">Adoption Hotline</h3>
          <p className="text-apc-dark-grey mb-2">Ready to adopt? Give us a call!</p>
          <p className="text-2xl font-mono font-bold text-apc-red tracking-wider">
            +233-55-123-4567
          </p>
        </div>
      </Modal>

      <Modal isOpen={!!viewedPet} onClose={() => setViewedPet(null)}>
        {viewedPet && (
          <div className="text-center">
            <img src={viewedPet.image_url} alt={viewedPet.animal_type} className="w-full h-auto rounded-lg mb-4 max-h-[80vh]" />
            <p className="text-xl font-bold capitalize text-apc-black">{viewedPet.animal_type}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;