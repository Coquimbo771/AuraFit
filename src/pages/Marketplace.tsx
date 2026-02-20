import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { ProductCard, PageTransition, Skeleton, Button, Card } from '../components';
import { useShoppingStore } from '../store/shoppingStore';
import { useAuthStore } from '../store/authStore';
import { useBiometricStore } from '../store/biometricStore';
import { supabase } from '../lib/supabase';
import type { Product, ProductCategory } from '../types';

export const Marketplace: React.FC = () => {
  const { user } = useAuthStore();
  const { filters, savedItems, setOccasionFilter, setSustainabilityFilter, setPriceRange, addToWardrobe, removeFromWardrobe, fetchSavedItems } = useShoppingStore();
  const { currentScan } = useBiometricStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const occasions: ProductCategory[] = ['office', 'gym', 'party', 'casual'];

  // Logic to calculate a "Real-ish" Match Score based on biometrics
  const calculateMatchScore = (product: Product, scan: any): number => {
    if (!scan) return 75 + Math.floor(Math.random() * 15); // Base score if no scan
    
    let baseScore = 85;
    
    // Match by occasion vs body shape (Simulated logic)
    if (scan.body_shape === 'hourglass' && product.category === 'party') baseScore += 12;
    if (scan.body_shape === 'athletic' && product.category === 'gym') baseScore += 10;
    if (scan.body_shape === 'inverted_triangle' && product.category === 'casual') baseScore += 8;
    
    // Sustainability bonus
    if (product.sustainable_rating >= 4) baseScore += 5;
    
    // Add some random variety so it's not static
    const variability = (product.id.charCodeAt(0) % 5);
    
    return Math.min(99, baseScore + variability);
  };

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
      <div className="min-h-screen bg-[#F9FAFB] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-[1px] bg-neon-blue" />
                 <span className="text-[10px] font-black text-neon-blue uppercase tracking-[0.3em]">Smart Catalog</span>
              </div>
              <h1 className="text-6xl font-black text-sage uppercase italic tracking-tighter mb-4 leading-none">
                Curated<br />Marketplace
              </h1>
              <p className="text-gray-500 font-medium max-w-lg italic">
                Our Style AI has curated these selections based on your <span className="text-sage font-bold underline decoration-neon-blue underline-offset-4">{currentScan?.body_shape || 'uniquely'}</span> profile.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items Found</p>
                  <p className="text-2xl font-black text-sage italic tracking-tighter">{filteredProducts.length}</p>
               </div>
               <div className="p-4 bg-sage border border-sage rounded-2xl shadow-sm text-center text-white">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Avg Fit</p>
                  <p className="text-2xl font-black italic tracking-tighter">94%</p>
               </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* FILTER SIDEBAR */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-3 ${showFilters ? 'block' : 'hidden'} lg:block sticky top-8 h-fit`}
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                <h3 className="text-xs font-black text-sage mb-8 uppercase tracking-[0.2em] flex items-center justify-between">
                  Filter Parameters
                  <Sliders size={14} className="text-neon-blue" />
                </h3>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 italic">By Occasion</h4>
                    <div className="space-y-3">
                      {occasions.map((occasion) => (
                        <label key={occasion} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={filters.occasion.includes(occasion)}
                              onChange={() => handleOccasionChange(occasion)}
                              className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-sage checked:border-sage transition-all"
                            />
                            <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white font-bold text-[10px]">✓</div>
                          </div>
                          <span className="text-sm font-bold text-sage/60 uppercase tracking-tight group-hover:text-sage transition-colors peer-checked:text-sage italic">
                            {occasion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 italic">Sustainability Level</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSustainabilityFilter(rating)}
                          className={`flex-1 aspect-square rounded-xl text-xs font-black transition-all ${
                            filters.sustainabilityMin === rating
                              ? 'bg-sage text-white shadow-lg shadow-sage/20 scale-110'
                              : 'bg-gray-50 text-sage/40 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 italic">Price Ceiling</h4>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.priceRange[1]}
                        onChange={(e) => setPriceRange(0, parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                      />
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Max Limit</span>
                        <span className="text-sm font-black text-sage italic">${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                   <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] font-black tracking-widest uppercase hover:bg-gray-50"
                    onClick={() => {
                      setOccasionFilter([]);
                      setSustainabilityFilter(1);
                      setPriceRange(0, 1000);
                    }}
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* PRODUCT GRID */}
            <div className="lg:col-span-9">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-8 w-full py-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm"
              >
                <Sliders size={16} />
                Filters & Parameters
              </motion.button>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} type="card" className="aspect-[3/5] rounded-3xl" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <Card variant="glass" className="py-24 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
                  <div className="max-w-xs mx-auto">
                    <Sliders className="mx-auto text-gray-300 mb-6" size={48} />
                    <h3 className="text-xl font-black text-sage uppercase italic tracking-tighter mb-4">No Matches Found</h3>
                    <p className="text-sm text-gray-500 mb-8 font-medium">Try adjusting your filters or expanding your price range.</p>
                    <Button
                      variant="neon"
                      onClick={() => {
                        setOccasionFilter([]);
                        setSustainabilityFilter(1);
                        setPriceRange(0, 1000);
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      matchScore={calculateMatchScore(product, currentScan)}
                      isSaved={savedItems.includes(product.id)}
                      onAddToWardrobe={() => handleAddToWardrobe(product.id)}
                      onRemoveFromWardrobe={() => handleRemoveFromWardrobe(product.id)}
                      onQuickView={() => {
                        // Modal logic could go here
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};