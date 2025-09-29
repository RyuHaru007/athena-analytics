import React from 'react';
import { Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className={`${sizeClasses[size]} text-blue-500 animate-pulse`} />
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;