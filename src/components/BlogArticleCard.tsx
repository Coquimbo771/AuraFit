import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import type { BlogArticle } from '../types';

interface BlogArticleCardProps {
  article: BlogArticle;
  onClick?: () => void;
}

export const BlogArticleCard: React.FC<BlogArticleCardProps> = ({ article, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const readingTime = Math.ceil(article.content.split(/\s+/).length / 200);

  const categoryLabels: Record<string, string> = {
    'color-theory': 'Color Theory',
    'body-types': 'Body Types',
    'sustainability': 'Sustainability',
    'science': 'Science',
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback image for blog articles
  const getFallbackImage = () => {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&q=80';
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <Card variant="solid" hover={false} className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-sun/30 to-ember/10 h-48">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-sand/30 animate-pulse">
              <div className="w-10 h-10 border-4 border-ember/30 border-t-ember rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageError ? getFallbackImage() : (article.featured_image_url || getFallbackImage())}
            alt={article.title}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge label={categoryLabels[article.category] || article.category} variant="info" />
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-ink mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-sm text-ink/70 mb-4 line-clamp-3">{article.excerpt || article.content.substring(0, 100)}...</p>
          </div>

          <div className="border-t border-ink/10 pt-4 flex items-center justify-between">
            <div className="text-xs text-ink/50">
              <p className="font-medium text-ink mb-1">{article.author}</p>
              <p>{readingTime} min read</p>
            </div>
            <motion.div whileHover={{ x: 4 }} className="text-ink">
              <ArrowRight size={20} />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};