import React, { useState } from 'react';

const Navbar = ({ onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', view: 'home' },
    { name: 'Favourites', view: 'favorites' },
    { name: 'Contact Us', view: 'contact' }, // Assuming a future contact page
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-apc-black cursor-pointer" onClick={() => onNavClick('home')}>Pet Match</div>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <button key={link.name} onClick={() => onNavClick(link.view)} className="text-apc-dark-grey hover:text-apc-red transition-colors">
                {link.name}
              </button>
            ))}
            <a href="#" className="bg-apc-red text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
              Login / Signup
            </a>
          </div>
          {/* Mobile menu button can be added here if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;