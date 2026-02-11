import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogArticleCard, PageTransition, Skeleton, Modal } from '../components';
import { supabase } from '../lib/supabase';
import type { BlogArticle } from '../types';

export const StyleGuide: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase.from('blog_articles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sand py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-sage mb-4">Style Guide</h1>
            <p className="text-xl text-gray-600">
              Expert advice on fashion, body types, color theory, and sustainable style
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} type="card" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  onClick={() => setSelectedArticle(article)}
                >
                  <BlogArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} title={selectedArticle?.title}>
          {selectedArticle && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedArticle.featured_image_url && (
                <img
                  src={selectedArticle.featured_image_url}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}
              <p className="text-gray-700 whitespace-pre-line">{selectedArticle.content}</p>
              <div className="pt-4 border-t border-sage/10 text-sm text-gray-600">
                <p className="font-medium text-sage mb-1">By {selectedArticle.author}</p>
                <p>{new Date(selectedArticle.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  );
};