import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import PetCard from './PetCard.jsx';
import Modal from './Modal.jsx';
import PersonalityGame from './PersonalityGame.jsx';

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [pets, setPets] = useState([]);
  const [isAdoptModalOpen, setAdoptModalOpen] = useState(false);
  const [isGameMode, setGameMode] = useState(false);

  // Fetch pets from your FastAPI backend
  useEffect(() => {
    // Using the seeding script data, but you can change to /pets/favorites
    // when you have favorite pets saved.
    const fetchPets = async () => {
      try {
        // This endpoint doesn't exist yet, so I'm creating a dummy one.
        // Let's assume you create a GET /pets endpoint that returns the seeded data.
        // For now, I'll use a placeholder.
        // const response = await axios.get(`${API_BASE_URL}/pets`);
        // setPets(response.data);
        
        // Using shell.py data as a stand-in until the endpoint is ready
        const mockPets = [
            {"name": "Buddy", "type": "Dog", "age": 3, "description": "Playful Golden Retriever", "image_url": "https://images.dog.ceo/breeds/retriever-golden/n02099601_3334.jpg"},
            {"name": "Milo", "type": "Cat", "age": 2, "description": "Lazy but cuddly tabby", "image_url": "https://cdn2.thecatapi.com/images/3up.jpg"},
            {"name": "Luna", "type": "Dog", "age": 1, "description": "Energetic Husky puppy", "image_url": "https://images.dog.ceo/breeds/husky/n02110185_13110.jpg"},
            {"name": "Coco", "type": "Parrot", "age": 4, "description": "Talkative African Grey", "image_url": "https://images.unsplash.com/photo-1544923408-75c5cef46de6?w=400"},
            {"name": "Daisy", "type": "Rabbit", "age": 2, "description": "White rabbit with floppy ears", "image_url": "https://images.unsplash.com/photo-1590349492048-906523953715?w=400"},
            {"name": "Rocky", "type": "Dog", "age": 5, "description": "Protective German Shepherd", "image_url": "https://images.dog.ceo/breeds/germanshepherd/n02106662_14337.jpg"},
        ];
        setPets(mockPets);

      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };
    fetchPets();
  }, []);

  const handleAdoptClick = () => {
    setAdoptModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar onGameClick={() => setGameMode(prev => !prev)} isGameMode={isGameMode} />
      
      <main className="container mx-auto px-4 py-8">
        {isGameMode ? (
          <PersonalityGame pets={pets} setGameMode={setGameMode} />
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Find Your New Best Friend
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet, index) => (
                <PetCard 
                  key={index} 
                  pet={pet} 
                  onAdoptClick={handleAdoptClick} 
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Modal isOpen={isAdoptModalOpen} onClose={() => setAdoptModalOpen(false)}>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Adoption Hotline</h3>
          <p className="text-gray-600 mb-2">Ready to adopt? Give us a call!</p>
          <p className="text-2xl font-mono font-bold text-indigo-600 tracking-wider">
            +233-55-123-4567
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default App;