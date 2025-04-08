
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-kid-green border-t-transparent"></div>
      <p className="mt-4 text-lg">Generating your lesson...</p>
    </div>
  );
};

export default LoadingState;
