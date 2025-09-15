import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import PetCard from './PetCard.jsx';
import Modal from './Modal.jsx';
import Spinner from './Spinner.jsx'; // Assuming Spinner.jsx exists

const API_URL = "http://localhost:8000/pets/random";

function App() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isAdoptModalOpen, setAdoptModalOpen] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(API_URL);
        setPets(response.data);
        setFilteredPets(response.data);
        // Dynamically create categories from data
        const uniqueCategories = [...new Set(response.data.map(pet => pet.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setError("Could not load pet data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Filtering logic
  useEffect(() => {
    let result = pets;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(pet => 
        pet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(pet => pet.category === selectedCategory);
    }

    setFilteredPets(result);
  }, [searchTerm, selectedCategory, pets]);

  const handleAdoptClick = () => {
    setAdoptModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-apc-black mb-8 text-center">
          Find Your New Best Friend
        </h1>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-apc-light-grey rounded-md focus:ring-2 focus:ring-apc-warm-yellow focus:outline-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-apc-light-grey rounded-md focus:ring-2 focus:ring-apc-warm-yellow focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {isLoading ? <Spinner /> : error ? (
          <p className="text-center text-apc-red">{error}</p>
        ) : filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map(pet => (
                <PetCard 
                  key={pet._id} 
                  pet={pet} 
                  onAdoptClick={handleAdoptClick} 
                />
              ))}
            </div>
        ) : (
          <p className="text-center text-apc-dark-grey text-lg">No results found. Try adjusting your search.</p>
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
    </div>
  );
}

export default App;