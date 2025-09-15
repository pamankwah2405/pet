import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-apc-warm-yellow"></div>
    </div>
  );
};

export default Spinner;
