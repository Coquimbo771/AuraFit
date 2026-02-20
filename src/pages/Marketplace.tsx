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
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Marketplace</p>
                <h1 className="text-4xl md:text-5xl font-bold text-ink mb-3">Encuentra tu match perfecto</h1>
                <p className="text-ink/70 text-lg">
                  Piezas curadas por fit, colorimetria y sostenibilidad. Compra con menos devoluciones.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                  <PredictiveInput
                    value={query}
                    onChange={setQuery}
                    onSubmit={() => undefined}
                    suggestions={predictiveSuggestions}
                    placeholder="Buscar por nombre, color o ocasion"
                    className="w-72 max-w-full"
                    inputClassName="w-full pl-11 pr-4 py-3 rounded-2xl border border-ink/10 bg-white/80 focus:outline-none focus:border-ember"
                  />
                </div>
                <div className="flex items-center gap-2 border border-ink/10 rounded-2xl px-3 py-2 bg-white/80">
                  <ArrowUpDown size={16} className="text-ink/50" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent text-sm font-semibold text-ink/70 focus:outline-none"
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-4 h-fit`}
            >
              <div className="bg-white rounded-3xl p-6 shadow-[0_24px_60px_-40px_rgba(31,26,23,0.5)] border border-ink/5">
                <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
                  <Sliders size={20} />
                  Filtros
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-ink mb-3">Ocasion</h4>
                    <div className="space-y-2">
                      {occasions.map((occasion) => (
                        <label key={occasion} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.occasion.includes(occasion)}
                            onChange={() => handleOccasionChange(occasion)}
                            className="w-4 h-4 accent-ember rounded"
                          />
                          <span className="text-ink/70 capitalize">{occasion}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink/10 pt-4">
                    <h4 className="font-semibold text-ink mb-3">Sostenibilidad</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSustainabilityFilter(rating)}
                          className={`flex-1 py-2 rounded transition-colors ${
                            filters.sustainabilityMin === rating
                              ? 'bg-ember text-ink'
                              : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
                          }`}
                        >
                          ★
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink/10 pt-4">
                    <h4 className="font-semibold text-ink mb-3">Rango de precio</h4>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => setPriceRange(0, parseInt(e.target.value))}
                        className="w-full accent-ember"
                      />
                      <p className="text-sm text-ink/60">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {['oficina elegante', 'party look', 'sostenible', 'tallas inclusivas'].map((smartTag) => (
                  <button
                    key={smartTag}
                    onClick={() => setQuery(smartTag)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-ink/15 bg-white/70 text-ink/70 hover:text-ink"
                  >
                    {smartTag}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-ember text-ink rounded-full font-semibold"
              >
                <Sliders size={16} />
                Filtros
              </motion.button>

              {activeFilterLabels.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
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
                    className="text-sm font-semibold text-ink/60 hover:text-ink"
                  >
                    Limpiar todo
                  </button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} type="card" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-ink/70 text-lg mb-4">No hay productos con esos filtros</p>
                  <Button
                    variant="secondary"
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
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