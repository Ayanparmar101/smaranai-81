
import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Generating your lesson...", 
  size = 'md',
  color = 'border-kid-green'
}) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  return (
    <div className="text-center py-12">
      <div className={`inline-block animate-spin rounded-full ${sizeMap[size]} border-4 ${color} border-t-transparent`}></div>
      <p className="mt-4 text-lg">{message}</p>
    </div>
  );
};

export default LoadingState;
