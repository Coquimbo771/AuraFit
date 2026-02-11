import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Edit, Camera, Heart, TrendingUp, Leaf } from 'lucide-react';
import { Button, Card, PageTransition, Skeleton } from '../components';
import { useAuthStore } from '../store/authStore';
import { useBiometricStore } from '../store/biometricStore';
import { useShoppingStore } from '../store/shoppingStore';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

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
    transition: { duration: 0.3 },
  },
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuthStore();
  const { currentScan, scanHistory, fetchScanHistory, loading: biometricLoading } = useBiometricStore();
  const { savedItems } = useShoppingStore();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchScanHistory(user.id);
  }, [user, fetchScanHistory, navigate]);

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        if (savedItems.length === 0) {
          setSavedProducts([]);
          setProductsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', savedItems.slice(0, 4));

        if (error) throw error;
        setSavedProducts(data || []);
      } catch (error) {
        console.error('Error fetching saved products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchSavedProducts();
  }, [savedItems]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const skinToneLabels: Record<string, string> = {
    cool: 'Cool Undertone',
    warm: 'Warm Undertone',
    neutral: 'Neutral Undertone',
  };

  const bodyShapeLabels: Record<string, string> = {
    hourglass: 'Hourglass',
    rectangle: 'Rectangle',
    pear: 'Pear',
    triangle: 'Triangle',
    inverted_triangle: 'Inverted Triangle',
    athletic: 'Athletic',
  };

  const avgRating = savedProducts.length > 0
    ? (savedProducts.reduce((sum, p) => sum + p.sustainable_rating, 0) / savedProducts.length).toFixed(1)
    : '0';

  const loading = authLoading || biometricLoading || productsLoading;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sand py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-4xl font-bold text-sage">Smart Wardrobe</h1>
              <p className="text-gray-600">Welcome, {user?.full_name || 'User'}</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              isLoading={authLoading}
              className="flex items-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min"
          >
            {/* Profile Card - 2x1 */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              {loading ? (
                <Skeleton type="card" className="h-48" />
              ) : (
                <Card variant="solid" className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-sage mb-2">Your Profile</h2>
                    <p className="text-gray-600 mb-6">{user?.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Member since {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                      Edit
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Latest Scan - 2x1 */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              {loading ? (
                <Skeleton type="card" className="h-48" />
              ) : currentScan ? (
                <Card variant="solid" className="p-8 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-sage">Latest Scan</h2>
                    <Camera className="text-neon-blue" size={20} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">Body Shape</p>
                      <p className="font-semibold text-sage">{bodyShapeLabels[currentScan.body_shape] || currentScan.body_shape}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Skin Tone</p>
                      <p className="font-semibold text-sage">{skinToneLabels[currentScan.skin_tone] || currentScan.skin_tone}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => navigate('/scan')}
                    >
                      New Scan
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card variant="glass" className="p-8 h-full flex flex-col justify-center items-center text-center">
                  <Camera className="text-sage/40 mb-4" size={32} />
                  <p className="text-gray-600 mb-4">No scans yet</p>
                  <Button
                    variant="neon"
                    size="sm"
                    onClick={() => navigate('/scan')}
                  >
                    Start Scanning
                  </Button>
                </Card>
              )}
            </motion.div>

            {/* Color Palette - 1x1 */}
            <motion.div variants={itemVariants}>
              {loading ? (
                <Skeleton type="card" className="h-48" />
              ) : currentScan?.color_palette ? (
                <Card variant="solid" className="p-6 h-full">
                  <h3 className="font-bold text-sage mb-4">Color Palette</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentScan.color_palette.slice(0, 4).map((color, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-lg border-2 border-sage/10 cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card variant="minimal" className="p-6 h-full flex items-center justify-center">
                  <p className="text-sm text-gray-500 text-center">No color data</p>
                </Card>
              )}
            </motion.div>

            {/* Scan History - 2x2 */}
            <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
              {loading ? (
                <Skeleton type="card" className="h-96" />
              ) : (
                <Card variant="solid" className="p-8 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-sage mb-6">Scan History</h3>
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {scanHistory.slice(0, 5).map((scan, i) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-3 bg-sage/5 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-sage capitalize">
                            {bodyShapeLabels[scan.body_shape] || scan.body_shape}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(scan.scan_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Camera size={16} className="text-gray-400" />
                      </motion.div>
                    ))}
                    {scanHistory.length === 0 && (
                      <p className="text-center text-gray-600 text-sm">No scan history yet</p>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Saved Items - 2x1 */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              {loading ? (
                <Skeleton type="card" className="h-48" />
              ) : (
                <Card variant="solid" className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sage">Saved Items</h3>
                    <Heart className="text-red-500" size={20} fill="currentColor" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {savedProducts.slice(0, 4).map((product, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-lg bg-sage/10 flex items-center justify-center text-center p-2 cursor-pointer"
                      >
                        <p className="text-xs font-medium text-sage line-clamp-2">{product.name}</p>
                      </motion.div>
                    ))}
                  </div>
                  {savedItems.length > 4 && (
                    <p className="text-xs text-gray-600 mt-3">+{savedItems.length - 4} more items</p>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => navigate('/marketplace')}
                  >
                    View All
                  </Button>
                </Card>
              )}
            </motion.div>

            {/* Match Statistics - 1x1 */}
            <motion.div variants={itemVariants}>
              {loading ? (
                <Skeleton type="card" className="h-48" />
              ) : (
                <Card variant="solid" className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <TrendingUp className="text-neon-blue mb-2" size={28} />
                  <p className="text-sm text-gray-600 mb-1">Match Avg</p>
                  <p className="text-3xl font-bold text-sage">{savedItems.length > 0 ? '87%' : '—'}</p>
                </Card>
              )}
            </motion.div>

            {/* Sustainability Impact - 1x1 */}
            <motion.div variants={itemVariants}>
              {loading ? (
                <Skeleton type="card" className="h-48" />
              ) : (
                <Card variant="solid" className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <Leaf className="text-sage mb-2" size={28} />
                  <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                  <p className="text-3xl font-bold text-sage">{avgRating}★</p>
                </Card>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};