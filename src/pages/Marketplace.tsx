import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { ProductCard, PageTransition, Skeleton, Button } from '../components';
import { useShoppingStore } from '../store/shoppingStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Product, ProductCategory } from '../types';

export const Marketplace: React.FC = () => {
  const { user } = useAuthStore();
  const { filters, savedItems, setOccasionFilter, setSustainabilityFilter, setPriceRange, addToWardrobe, removeFromWardrobe, fetchSavedItems } = useShoppingStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

    if (filters.occasion.length > 0) {
      filtered = filtered.filter((p) => filters.occasion.includes(p.category as ProductCategory));
    }

    filtered = filtered.filter((p) => p.sustainable_rating >= filters.sustainabilityMin);
    filtered = filtered.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    setFilteredProducts(filtered);
  }, [products, filters]);

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
      <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sand py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-sage mb-4">Marketplace</h1>
            <p className="text-gray-600 text-lg">
              Discover curated fashion pieces matched to your perfect style
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-4 h-fit`}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-sage mb-6 flex items-center gap-2">
                  <Sliders size={20} />
                  Filters
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sage mb-3">Occasion</h4>
                    <div className="space-y-2">
                      {occasions.map((occasion) => (
                        <label key={occasion} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.occasion.includes(occasion)}
                            onChange={() => handleOccasionChange(occasion)}
                            className="w-4 h-4 accent-sage rounded"
                          />
                          <span className="text-gray-700 capitalize">{occasion}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-sage/10 pt-4">
                    <h4 className="font-semibold text-sage mb-3">Sustainability</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSustainabilityFilter(rating)}
                          className={`flex-1 py-2 rounded transition-colors ${
                            filters.sustainabilityMin === rating
                              ? 'bg-sage text-white'
                              : 'bg-sage/10 text-sage hover:bg-sage/20'
                          }`}
                        >
                          ★
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-sage/10 pt-4">
                    <h4 className="font-semibold text-sage mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => setPriceRange(0, parseInt(e.target.value))}
                        className="w-full accent-sage"
                      />
                      <p className="text-sm text-gray-600">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-full font-semibold"
              >
                <Sliders size={16} />
                Filters
              </motion.button>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} type="card" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No products match your filters</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOccasionFilter([]);
                      setSustainabilityFilter(1);
                      setPriceRange(0, 1000);
                    }}
                  >
                    Reset Filters
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
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-600 mt-12"
              >
                Showing {filteredProducts.length} of {products.length} products
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};