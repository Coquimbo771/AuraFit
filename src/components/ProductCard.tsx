import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Card } from './Card';
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

export const ProductCard: React.FC<ProductCardProps> = ({
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

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showSaved) {
      onRemoveFromWardrobe?.();
      setShowSaved(false);
    } else {
      onAddToWardrobe?.();
      setShowSaved(true);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback image based on category
  const getFallbackImage = () => {
    const fallbacks: { [key: string]: string } = {
      office: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&q=80',
      gym: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=600&fit=crop&q=80',
      party: 'https://images.unsplash.com/photo-1595777457583-95e08da9b0d6?w=500&h=600&fit=crop&q=80',
      casual: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=500&h=600&fit=crop&q=80',
    };
    return fallbacks[product.category] || 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=500&h=600&fit=crop&q=80';
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onQuickView}
      className="cursor-pointer"
    >
      <Card variant="solid" hover={false} className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-sun/20 via-sand/20 to-ember/10 h-64">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-sand/30 animate-pulse">
              <div className="w-12 h-12 border-4 border-ember/30 border-t-ember rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageError ? getFallbackImage() : (product.image_url || getFallbackImage())}
            alt={product.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHeartClick}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
              showSaved ? 'bg-rose-500 text-white' : 'bg-white/90 text-ink hover:bg-white'
            }`}
          >
            <Heart size={20} fill={showSaved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-ink text-lg line-clamp-2">{product.name}</h3>
            </div>
            <p className="text-sm text-ink/70 mb-4 line-clamp-2">{product.description}</p>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge label={`${matchScore}% Match`} variant={getMatchColor(matchScore)} />
              {product.occasion && (
                <Badge label={product.occasion} variant="info" />
              )}
            </div>
          </div>

          <div className="border-t border-ink/10 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-ink">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  {'★'.repeat(Math.floor(product.sustainable_rating))}
                  <span className="text-ink/50">Sostenibilidad</span>
                </div>
              </div>
              <div className="text-right text-xs text-ink/50">
                {product.sizes_available?.length} sizes
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};