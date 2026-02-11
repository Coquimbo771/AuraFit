import React from 'react';
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
  const readingTime = Math.ceil(article.content.split(/\s+/).length / 200);

  const categoryLabels: Record<string, string> = {
    'color-theory': 'Color Theory',
    'body-types': 'Body Types',
    'sustainability': 'Sustainability',
    'science': 'Science',
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <Card variant="solid" hover={false} className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-sage/20 to-neon-blue/10 h-48">
          <img
            src={article.featured_image_url || 'https://via.placeholder.com/400x300?text=Blog'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge label={categoryLabels[article.category] || article.category} variant="info" />
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-sage mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt || article.content.substring(0, 100)}...</p>
          </div>

          <div className="border-t border-sage/10 pt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p className="font-medium text-sage mb-1">{article.author}</p>
              <p>{readingTime} min read</p>
            </div>
            <motion.div whileHover={{ x: 4 }} className="text-sage">
              <ArrowRight size={20} />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};