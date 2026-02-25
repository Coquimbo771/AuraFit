import React from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallbackSrc,
  threshold,
  rootMargin,
  className = '',
  ...props
}) => {
  const {
    imgRef,
    imageSrc,
    isLoading,
    hasError,
    handleLoad,
    handleError,
  } = useLazyImage(src, { threshold, rootMargin });

  const displaySrc = hasError && fallbackSrc ? fallbackSrc : imageSrc;

  return (
    <div ref={imgRef as React.RefObject<HTMLDivElement>} className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand/30 dark:bg-dark-800/30">
          <div className="w-8 h-8 border-3 border-ember/30 dark:border-neon-blue/30 border-t-ember dark:border-t-neon-blue rounded-full animate-spin" />
        </div>
      )}
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(LazyImage);
