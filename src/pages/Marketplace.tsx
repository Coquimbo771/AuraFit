import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Search, ArrowUpDown } from 'lucide-react';
import { ProductCard, PageTransition, Skeleton, Button, Badge, PredictiveInput, PersonalizedRecommendations } from '../components';
import { useShoppingStore } from '../store/shoppingStore';
import { useAuthStore } from '../store/authStore';
import { useBehaviorStore } from '../store/behaviorStore';
import { supabase } from '../lib/supabase';
import { semanticSearch } from '../lib/recommendations';
import type { Product, ProductCategory } from '../types';

export const Marketplace: React.FC = () => {
  const { user } = useAuthStore();
  const { trackSearch } = useBehaviorStore();
  const {
    filters,
    savedItems,
    setOccasionFilter,
    setSustainabilityFilter,
    setPriceRange,
    addToWardrobe,
    removeFromWardrobe,
    fetchSavedItems,
    addToCart,
  } = useShoppingStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'sustainable'>('match');

  const occasions: ProductCategory[] = ['office', 'gym', 'party', 'casual'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedItems(user.id);
    }
  }, [user, fetchSavedItems]);

  useEffect(() => {
    let filtered = [...products];

    // Smart semantic search (if query present)
    if (query.trim()) {
      filtered = semanticSearch(query, products);
      trackSearch(query); // Track search for ML
    } else {
      // Regular filters
      if (filters.occasion.length > 0) {
        filtered = filtered.filter((p) => filters.occasion.includes(p.category as ProductCategory));
      }
    }

    // Apply sustainability and price filters
    filtered = filtered.filter((p) => p.sustainable_rating >= filters.sustainabilityMin);
    filtered = filtered.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sustainable') return b.sustainable_rating - a.sustainable_rating;
      return b.sustainable_rating - a.sustainable_rating;
    });

    setFilteredProducts(sorted);
  }, [products, filters, query, sortBy, trackSearch]);

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (filters.occasion.length > 0) labels.push(`Ocasiones: ${filters.occasion.join(', ')}`);
    if (filters.sustainabilityMin > 1) labels.push(`Sostenibilidad ${filters.sustainabilityMin}★+`);
    if (filters.priceRange[1] < 1000) labels.push(`Hasta $${filters.priceRange[1]}`);
    if (query.trim()) labels.push(`Busqueda: ${query.trim()}`);
    return labels;
  }, [filters, query]);

  const predictiveSuggestions = useMemo(() => {
    const keywordPool = new Set<string>([
      'oficina elegante',
      'gym outfit',
      'party look',
      'casual minimal',
      'sostenible',
      'tallas inclusivas',
      'colores calidos',
      'colores frios',
    ]);

    products.forEach((product) => {
      keywordPool.add(product.name);
      if (product.category) keywordPool.add(product.category);
      if (product.occasion) keywordPool.add(product.occasion);
      if (product.description) {
        product.description
          .split(/\s+/)
          .filter((word) => word.length > 4)
          .slice(0, 4)
          .forEach((word) => keywordPool.add(word.toLowerCase()));
      }
    });

    return Array.from(keywordPool).map((item, index) => ({
      id: `${index}-${item}`,
      label: item,
      hint: 'Sugerencia inteligente',
    }));
  }, [products]);

  const handleOccasionChange = (occasion: ProductCategory) => {
    const newOccasions = filters.occasion.includes(occasion)
      ? filters.occasion.filter((o) => o !== occasion)
      : [...filters.occasion, occasion];
    setOccasionFilter(newOccasions);
  };

  const handleAddToWardrobe = async (productId: string) => {
    if (!user) return;
    try {
      await addToWardrobe(user.id, productId);
    } catch (error) {
      console.error('Error adding to wardrobe:', error);
    }
  };

  const handleRemoveFromWardrobe = async (productId: string) => {
    if (!user) return;
    try {
      await removeFromWardrobe(user.id, productId);
    } catch (error) {
      console.error('Error removing from wardrobe:', error);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white dark:from-dark-950 dark:via-dark-900 dark:to-dark-850 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-ink/50 dark:text-sand-50/50">Marketplace</p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink dark:text-sand-50 mb-2 sm:mb-3">Encuentra tu match perfecto</h1>
                <p className="text-ink/70 dark:text-sand-50/70 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Piezas curadas por fit, colorimetria y sostenibilidad. Compra con menos devoluciones.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-sand-50/40" size={16} />
                  <PredictiveInput
                    value={query}
                    onChange={setQuery}
                    onSubmit={() => undefined}
                    suggestions={predictiveSuggestions}
                    placeholder="Buscar por nombre, color o ocasion"
                    className="w-full sm:w-64 lg:w-72"
                    inputClassName="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-ink/10 dark:border-neon-blue/20 bg-white/80 dark:bg-dark-700/80 text-sm sm:text-base text-ink dark:text-sand-50 focus:outline-none focus:border-ember dark:focus:border-neon-blue"
                  />
                </div>
                <div className="flex items-center gap-2 border border-ink/10 dark:border-neon-blue/20 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 bg-white/80 dark:bg-dark-700/80">
                  <ArrowUpDown size={14} className="text-ink/50 dark:text-sand-50/50 sm:w-4 sm:h-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-ink/70 dark:text-sand-50/70 focus:outline-none"
                  >
                    <option value="match">Mejor match</option>
                    <option value="price-asc">Precio menor</option>
                    <option value="price-desc">Precio mayor</option>
                    <option value="sustainable">Mas sostenible</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-20 h-fit`}
            >
              <div className="bg-white dark:bg-dark-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_24px_60px_-40px_rgba(31,26,23,0.5)] dark:shadow-[0_24px_60px_-20px_rgba(0,240,255,0.2)] border border-ink/5 dark:border-neon-blue/20 backdrop-blur-xl">
                <h3 className="text-base sm:text-lg font-bold text-ink dark:text-sand-50 mb-4 sm:mb-6 flex items-center gap-2">
                  <Sliders size={18} className="sm:w-[20px] sm:h-[20px]" />
                  Filtros
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-semibold text-ink dark:text-sand-50 mb-2 sm:mb-3 text-sm sm:text-base">Ocasion</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {occasions.map((occasion) => (
                        <label key={occasion} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.occasion.includes(occasion)}
                            onChange={() => handleOccasionChange(occasion)}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-ember dark:accent-neon-blue rounded"
                          />
                          <span className="text-ink/70 dark:text-sand-50/70 capitalize text-xs sm:text-sm group-hover:text-ink dark:group-hover:text-sand-50 transition-colors">{occasion}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink/10 dark:border-sand-50/10 pt-3 sm:pt-4">
                    <h4 className="font-semibold text-ink dark:text-sand-50 mb-2 sm:mb-3 text-sm sm:text-base">Sostenibilidad</h4>
                    <div className="flex gap-1 sm:gap-1.5">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSustainabilityFilter(rating)}
                          className={
                            filters.sustainabilityMin === rating
                              ? 'flex-1 py-1.5 sm:py-2 rounded text-sm sm:text-base transition-colors bg-ember dark:bg-neon-blue text-ink dark:text-dark-950'
                              : 'flex-1 py-1.5 sm:py-2 rounded text-sm sm:text-base transition-colors bg-ink/5 dark:bg-dark-700 text-ink/70 dark:text-sand-50/70 hover:bg-ink/10 dark:hover:bg-dark-600'
                          }
                        >
                          ★
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink/10 dark:border-sand-50/10 pt-3 sm:pt-4">
                    <h4 className="font-semibold text-ink dark:text-sand-50 mb-2 sm:mb-3 text-sm sm:text-base">Rango de precio</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => setPriceRange(0, parseInt(e.target.value))}
                        className="w-full accent-ember dark:accent-neon-blue"
                      />
                      <p className="text-xs sm:text-sm text-ink/60 dark:text-sand-50/60">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {['oficina elegante', 'party look', 'sostenible', 'tallas inclusivas'].map((smartTag) => (
                  <button
                    key={smartTag}
                    onClick={() => setQuery(smartTag)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full border border-ink/15 dark:border-neon-blue/20 bg-white/70 dark:bg-dark-700/70 text-ink/70 dark:text-sand-50/70 hover:text-ink dark:hover:text-sand-50 hover:bg-white dark:hover:bg-dark-700 transition-colors"
                  >
                    {smartTag}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-4 sm:mb-6 flex items-center gap-2 px-4 py-2.5 bg-ember dark:bg-neon-blue text-ink dark:text-dark-950 rounded-full font-semibold text-sm shadow-lg transition-all"
              >
                <Sliders size={16} />
                Filtros
              </motion.button>

              {activeFilterLabels.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {activeFilterLabels.map((label) => (
                    <Badge key={label} label={label} variant="primary" />
                  ))}
                  <button
                    onClick={() => {
                      setOccasionFilter([]);
                      setSustainabilityFilter(1);
                      setPriceRange(0, 1000);
                      setQuery('');
                    }}
                    className="text-xs sm:text-sm font-semibold text-ink/60 dark:text-sand-50/60 hover:text-ink dark:hover:text-sand-50 transition-colors"
                  >
                    Limpiar todo
                  </button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} type="card" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-ink/70 dark:text-sand-50/70 text-base sm:text-lg mb-3 sm:mb-4">No hay productos con esos filtros</p>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setOccasionFilter([]);
                      setSustainabilityFilter(1);
                      setPriceRange(0, 1000);
                      setQuery('');
                    }}
                  >
                    Reiniciar filtros
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                >
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="flex flex-col h-full"
                    >
                      <ProductCard
                        product={product}
                        matchScore={60 + Math.floor(Math.random() * 40)}
                        isSaved={savedItems.includes(product.id)}
                        onAddToWardrobe={() => handleAddToWardrobe(product.id)}
                        onRemoveFromWardrobe={() => handleRemoveFromWardrobe(product.id)}
                        onQuickView={() => {
                          alert(`${product.name}\n\n${product.description}\n\nPrice: $${product.price}`);
                        }}
                      />
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full mt-3"
                        onClick={() => addToCart(product.id, 1)}
                      >
                        Agregar al carrito
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-ink/60 mt-12"
              >
                Mostrando {filteredProducts.length} de {products.length} productos
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};