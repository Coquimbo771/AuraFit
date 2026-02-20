import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
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
      whileHover={{ 
        y: -12,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
      }}
      onClick={onQuickView}
      className="cursor-pointer group h-full"
    >
      <Card 
        variant="solid" 
        hover={false} 
        className="overflow-hidden h-full flex flex-col border border-sage/5 bg-white shadow-sm transition-shadow duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(124,154,146,0.25)]"
      >
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
          <img
            src={`${product.image_url}&auto=format&fit=crop&w=600&q=80` || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Match Badge - Premium Style */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg
                ${matchScore >= 95 ? 'bg-neon-blue/80 text-white' : 'bg-white/80 text-sage'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${matchScore >= 95 ? 'bg-white' : 'bg-neon-blue'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{matchScore}% MATCH</span>
            </motion.div>
            
            {product.sustainable_rating >= 4 && (
              <div className="px-3 py-1.5 rounded-full bg-sage/90 backdrop-blur-md border border-white/20 text-white flex items-center gap-1 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Eco Friendly</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHeartClick}
            className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-xl
              ${showSaved ? 'bg-red-500 text-white' : 'bg-white/40 text-white hover:bg-white hover:text-sage border border-white/20'}`}
          >
            <Heart size={18} fill={showSaved ? 'currentColor' : 'none'} strokeWidth={2.5} />
          </motion.button>

          <div className="absolute bottom-4 left-4 right-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
             <Button variant="neon" size="sm" className="w-full text-[10px] font-black tracking-[0.2em] uppercase italic bg-white text-sage border-none hover:bg-neon-blue hover:text-white">
                Quick Look
             </Button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic tracking-tighter">
              {product.category || 'Casual'} — Premium Collection
            </p>
            <h3 className="font-black text-sage text-xl leading-tight mb-2 uppercase italic tracking-tighter truncate group-hover:text-neon-blue transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-4 mb-4">
               <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${i < product.sustainable_rating ? 'bg-sage' : 'bg-gray-200'}`} 
                    />
                  ))}
               </div>
               <span className="text-[9px] font-bold text-sage/40 uppercase tracking-widest">Sustainability</span>
            </div>
          </div>

          <div className="pt-4 border-t border-sage/5 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Price</span>
              <p className="text-2xl font-black text-sage italic tracking-tighter leading-none">
                ${product.price.toFixed(0)}
                <span className="text-sm font-bold text-sage/40 ml-1 italic tracking-tighter">.99</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
              <div className="flex gap-1 justify-end">
                {['S', 'M', 'L'].map(s => (
                  <span key={s} className="text-[10px] font-black text-sage border border-sage/10 px-1.5 rounded bg-sage/5">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};