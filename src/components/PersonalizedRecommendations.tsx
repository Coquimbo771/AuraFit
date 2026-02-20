import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, Zap } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import { useBehaviorStore } from '../store/behaviorStore';
import { getPersonalizedRecommendations } from '../lib/recommendations';

interface PersonalizedRecommendationsProps {
  allProducts: Product[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  allProducts,
  title = 'Seleccionados para ti',
  subtitle,
  limit = 8,
}) => {
  const { viewedProducts, purchasedProducts, preferences } = useBehaviorStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    // Get viewed products as full Product objects
    const viewedProductObjects = viewedProducts.map((view) =>
      allProducts.find((p) => p.id === view.productId)
    ).filter((p): p is Product => p !== undefined);

    // Generate personalized recommendations
    const recommended = getPersonalizedRecommendations(
      allProducts,
      viewedProductObjects,
      purchasedProducts,
      preferences.favoriteCategories,
      preferences.favoriteOccasions,
      preferences.priceRange,
      limit
    );

    setRecommendations(recommended);

    // Generate reason text
    const topCategory = Object.entries(preferences.favoriteCategories)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    
    const topOccasion = Object.entries(preferences.favoriteOccasions)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (topCategory && topOccasion) {
      setReason(`Basado en tu interés en ${topCategory} para ${topOccasion}`);
    } else if (viewedProducts.length > 0) {
      setReason('Basado en lo que has visto recientemente');
    } else {
      setReason('Descubre nuestras mejores piezas');
    }
  }, [allProducts, viewedProducts, purchasedProducts, preferences, limit]);

  if (recommendations.length === 0) return null;

  const getRecommendationIcon = () => {
    if (preferences.totalVisits > 10) return <TrendingUp className="text-ember" size={24} />;
    if (purchasedProducts.length > 0) return <Heart className="text-rose-500" size={24} />;
    return <Sparkles className="text-sun" size={24} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {getRecommendationIcon()}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">{title}</h2>
            <p className="text-sm text-ink/60 flex items-center gap-2 mt-1">
              <Zap size={14} className="text-ember" />
              {subtitle || reason}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard
              product={product}
              matchScore={95 - index * 3} // Decrease match score slightly for each item
            />
          </motion.div>
        ))}
      </div>

      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center justify-center gap-2 text-xs text-ink/50"
      >
        <Sparkles size={12} />
        <span>Personalizado con Inteligencia Artificial</span>
      </motion.div>
    </motion.div>
  );
};
