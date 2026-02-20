import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogArticleCard, PageTransition, Skeleton, Modal } from '../components';
import { supabase } from '../lib/supabase';
import type { BlogArticle } from '../types';

export const StyleGuide: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const categories = [
    { label: 'Todo', value: 'all' },
    { label: 'Colorimetria', value: 'color-theory' },
    { label: 'Tipos de cuerpo', value: 'body-types' },
    { label: 'Sostenibilidad', value: 'sustainability' },
    { label: 'Ciencia', value: 'science' },
  ];

  const visibleArticles = activeCategory === 'all'
    ? articles
    : articles.filter((article) => article.category === activeCategory);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Guia de estilo</p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">Inspiracion y ciencia aplicada</h1>
            <p className="text-xl text-ink/70">
              Recomendaciones claras sobre color, silueta y compras responsables.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === category.value
                    ? 'bg-ink text-sand-50'
                    : 'bg-white/70 border border-ink/10 text-ink/70 hover:text-ink'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} type="card" />
              ))}
            </div>
          ) : visibleArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink/70 text-lg mb-4">No hay articulos en esta categoria.</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-5 py-2 rounded-full border border-ink/20 text-ink/70 font-semibold"
              >
                Ver todo
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visibleArticles.map((article) => (
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
              <p className="text-ink/80 whitespace-pre-line">{selectedArticle.content}</p>
              <div className="pt-4 border-t border-ink/10 text-sm text-ink/60">
                <p className="font-medium text-ink mb-1">Por {selectedArticle.author}</p>
                <p>{new Date(selectedArticle.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  );
};