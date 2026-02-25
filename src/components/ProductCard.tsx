import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  matchScore?: number;
  isSaved?: boolean;
  onAddToWardrobe?: () => void;
  onRemoveFromWardrobe?: () => void;
  onQuickView?: () => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  matchScore = 85,
  isSaved = false,
  onAddToWardrobe,
  onRemoveFromWardrobe,
  onQuickView,
}) => {
  const [showSaved, setShowSaved] = useState(isSaved);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getMatchColor = useCallback((score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  }, []);

  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (showSaved) {
      onRemoveFromWardrobe?.();
      setShowSaved(false);
    } else {
      onAddToWardrobe?.();
      setShowSaved(true);
    }
  }, [showSaved, onAddToWardrobe, onRemoveFromWardrobe]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Fallback image based on category - memoized
  const fallbackImage = useMemo(() => {
    const fallbacks: { [key: string]: string } = {
      office: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&q=80',
      gym: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=600&fit=crop&q=80',
      party: 'https://images.unsplash.com/photo-1595777457583-95e08da9b0d6?w=500&h=600&fit=crop&q=80',
      casual: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=500&h=600&fit=crop&q=80',
    };
    return fallbacks[product.category] || 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=500&h=600&fit=crop&q=80';
  }, [product.category]);

  const imageSrc = imageError ? fallbackImage : (product.image_url || fallbackImage);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onQuickView}
      className="cursor-pointer group h-full"
    >
      <Card variant="solid" hover={false} className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-sun/20 via-sand/20 to-ember/10 h-48 sm:h-56 md:h-64">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-sand/30">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-ember/30 border-t-ember rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageSrc}
            alt={product.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHeartClick}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full transition-colors duration-200 ${
              showSaved ? 'bg-rose-500 text-white' : 'bg-white/90 text-ink hover:bg-white'
            }`}
          >
            <Heart size={16} className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" fill={showSaved ? 'currentColor' : 'none'} />
          </motion.button>

          <div className="absolute bottom-4 left-4 right-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
             <Button variant="neon" size="sm" className="w-full text-[10px] font-black tracking-[0.2em] uppercase italic bg-white text-sage border-none hover:bg-neon-blue hover:text-white">
                Quick Look
             </Button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h3 className="font-semibold text-ink dark:text-sand-50 text-sm sm:text-base md:text-lg line-clamp-2">{product.name}</h3>
            </div>
            <p className="text-xs sm:text-sm text-ink/70 dark:text-sand-50/70 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

            <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
              <Badge label={`${matchScore}% Match`} variant={getMatchColor(matchScore)} />
              {product.occasion && (
                <Badge label={product.occasion} variant="info" />
              )}
            </div>
          </div>

          <div className="border-t border-ink/10 dark:border-sand-50/10 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-ink dark:text-sand-50">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-700 dark:text-amber-400">
                  {'★'.repeat(Math.floor(product.sustainable_rating))}
                  <span className="text-ink/50 dark:text-sand-50/50">Sostenibilidad</span>
                </div>
              </div>
              <div className="text-right text-[10px] sm:text-xs text-ink/50 dark:text-sand-50/50">
                {product.sizes_available?.length} sizes
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const ProductCard = React.memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.matchScore === nextProps.matchScore &&
    prevProps.isSaved === nextProps.isSaved
  );
});