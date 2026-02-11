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

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onQuickView}
      className="cursor-pointer"
    >
      <Card variant="solid" hover={false} className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-sage/10 to-sand/10 h-64">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x500?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHeartClick}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
              showSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-sage hover:bg-white'
            }`}
          >
            <Heart size={20} fill={showSaved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-sage text-lg line-clamp-2">{product.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge label={`${matchScore}% Match`} variant={getMatchColor(matchScore)} />
              {product.occasion && (
                <Badge label={product.occasion} variant="info" />
              )}
            </div>
          </div>

          <div className="border-t border-sage/10 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-sage">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  {'★'.repeat(Math.floor(product.sustainable_rating))}
                  <span className="text-gray-400">Sustainability</span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                {product.sizes_available?.length} sizes
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};