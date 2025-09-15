import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-apc-black">Pet Match</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;