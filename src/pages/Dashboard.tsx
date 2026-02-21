import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Edit, Camera, Heart, TrendingUp, Leaf } from 'lucide-react';
import { Button, Card, PageTransition, Skeleton, Footer } from '../components';
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
  const { savedItems, orders, fetchOrders } = useShoppingStore();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchScanHistory(user.id);
    fetchOrders(user.id);
  }, [user, fetchScanHistory, fetchOrders, navigate]);

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
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Dashboard</p>
              <h1 className="text-4xl font-bold text-ink">Tu guardarropa inteligente</h1>
              <p className="text-ink/70">Hola, {user?.full_name || 'User'}</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              isLoading={authLoading}
              className="flex items-center gap-2"
            >
              <LogOut size={20} />
              Cerrar sesion
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
                    <h2 className="text-2xl font-bold text-ink mb-2">Tu perfil</h2>
                    <p className="text-ink/60 mb-6">{user?.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink/60">
                      Miembro desde {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                      Editar
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
                    <h2 className="text-lg font-bold text-ink">Ultimo escaneo</h2>
                    <Camera className="text-ember" size={20} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-ink/50">Tipo de cuerpo</p>
                      <p className="font-semibold text-ink">{bodyShapeLabels[currentScan.body_shape] || currentScan.body_shape}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/50">Tono de piel</p>
                      <p className="font-semibold text-ink">{skinToneLabels[currentScan.skin_tone] || currentScan.skin_tone}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => navigate('/scan')}
                    >
                      Nuevo escaneo
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card variant="glass" className="p-8 h-full flex flex-col justify-center items-center text-center">
                  <Camera className="text-ink/40 mb-4" size={32} />
                  <p className="text-ink/60 mb-4">Aun no tienes escaneos</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/scan')}
                  >
                    Iniciar escaneo
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
                  <h3 className="font-bold text-ink mb-4">Paleta de color</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentScan.color_palette.slice(0, 4).map((color, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-lg border-2 border-ink/10 cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card variant="minimal" className="p-6 h-full flex items-center justify-center">
                  <p className="text-sm text-ink/50 text-center">Sin datos de color</p>
                </Card>
              )}
            </motion.div>

            {/* Scan History - 2x2 */}
            <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
              {loading ? (
                <Skeleton type="card" className="h-96" />
              ) : (
                <Card variant="solid" className="p-8 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-ink mb-6">Historial de escaneos</h3>
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {scanHistory.slice(0, 5).map((scan, i) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-3 bg-ink/5 rounded-2xl flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink capitalize">
                            {bodyShapeLabels[scan.body_shape] || scan.body_shape}
                          </p>
                          <p className="text-xs text-ink/60">
                            {new Date(scan.scan_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Camera size={16} className="text-ink/40" />
                      </motion.div>
                    ))}
                    {scanHistory.length === 0 && (
                      <p className="text-center text-ink/60 text-sm">Sin historial de escaneos</p>
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
                    <h3 className="font-bold text-ink">Guardados</h3>
                    <Heart className="text-rose-500" size={20} fill="currentColor" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {savedProducts.slice(0, 4).map((product, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-2xl bg-ink/5 flex items-center justify-center text-center p-2 cursor-pointer"
                      >
                        <p className="text-xs font-medium text-ink line-clamp-2">{product.name}</p>
                      </motion.div>
                    ))}
                  </div>
                  {savedItems.length > 4 && (
                    <p className="text-xs text-ink/60 mt-3">+{savedItems.length - 4} items mas</p>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => navigate('/marketplace')}
                  >
                    Ver todos
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
                  <TrendingUp className="text-ember mb-2" size={28} />
                  <p className="text-sm text-ink/60 mb-1">Pedidos</p>
                  <p className="text-3xl font-bold text-ink">{orders.length}</p>
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
                  <p className="text-sm text-ink/60 mb-1">Impacto verde</p>
                  <p className="text-3xl font-bold text-ink">{avgRating}★</p>
                </Card>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};