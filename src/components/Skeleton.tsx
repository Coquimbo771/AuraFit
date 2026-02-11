import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'text' | 'image' | 'avatar';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type = 'text', className = '' }) => {
  const baseClass = 'bg-gradient-to-r from-sage/10 to-sage/20 animate-shimmer bg-[length:200%_100%]';

  const typeClasses = {
    card: `${baseClass} rounded-2xl h-64 w-full`,
    text: `${baseClass} rounded-lg h-4 w-full`,
    image: `${baseClass} rounded-xl h-48 w-full`,
    avatar: `${baseClass} rounded-full h-12 w-12`,
  };

  return <div className={`${typeClasses[type]} ${className}`} />;
};