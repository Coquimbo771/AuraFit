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
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* 1. Profile Card - 12cols -> 4cols (1/3) */}
            <motion.div variants={itemVariants} className="md:col-span-4 h-full">
              {loading ? (
                <Skeleton type="card" className="h-64" />
              ) : (
                <Card variant="solid" className="p-8 h-full bg-gradient-to-br from-white to-sage/5 border-l-4 border-sage">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="w-16 h-16 bg-sage/10 rounded-2xl flex items-center justify-center mb-6 border border-sage/20">
                        <span className="text-2xl font-black text-sage tracking-tighter uppercase italic">
                          {user?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-sage tracking-tight uppercase italic mb-1">
                        {user?.full_name || 'User Profile'}
                      </h2>
                      <p className="text-gray-500 font-medium text-sm">{user?.email}</p>
                    </div>
                    <div className="pt-8 border-t border-sage/10 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        EST. {new Date(user?.created_at || '').getFullYear()}
                      </p>
                      <Button variant="ghost" size="sm" className="hover:bg-sage/5">
                        <Edit size={14} className="mr-2" />
                        Update Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* 2. Latest Scan - 12cols -> 5cols */}
            <motion.div variants={itemVariants} className="md:col-span-5 h-full">
              {loading ? (
                <Skeleton type="card" className="h-64" />
              ) : currentScan ? (
                <Card variant="solid" className="p-8 h-full bg-black text-white relative overflow-hidden group">
                  <motion.div 
                    className="absolute -right-20 -top-20 w-64 h-64 bg-neon-blue/20 rounded-full blur-[80px]"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <h2 className="text-lg font-black tracking-widest uppercase italic text-neon-blue">Latest Analysis</h2>
                      <Camera className="text-neon-blue/40" size={24} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Structure</p>
                        <p className="text-2xl font-black text-white italic truncate tracking-tighter">
                          {currentScan.body_shape ? bodyShapeLabels[currentScan.body_shape] : 'Analyzing...'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Skin Tone</p>
                        <p className="text-2xl font-black text-neon-blue italic tracking-tighter">
                          {currentScan.skin_tone ? skinToneLabels[currentScan.skin_tone] : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="neon"
                        size="sm"
                        className="w-full shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                        onClick={() => navigate('/scan')}
                      >
                        Launch Scan Studio
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card variant="glass" className="p-8 h-full flex flex-col justify-center items-center text-center border-dashed border-2 border-sage/20 bg-sage/5">
                  <Camera className="text-sage/40 mb-4" size={40} />
                  <p className="text-sage font-black uppercase italic tracking-tighter mb-4">No Biometric Data Found</p>
                  <Button variant="neon" size="lg" onClick={() => navigate('/scan')}>
                    Scan Now
                  </Button>
                </Card>
              )}
            </motion.div>

            {/* 3. Color Palette - 12cols -> 3cols */}
            <motion.div variants={itemVariants} className="md:col-span-3 h-full">
              {loading ? (
                <Skeleton type="card" className="h-64" />
              ) : (
                <Card variant="solid" className="p-6 h-full bg-white flex flex-col">
                  <h3 className="text-xs font-black text-sage uppercase tracking-widest mb-6">Preferred Palette</h3>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {(currentScan?.color_palette || ['#7C9A92', '#F5F5DC', '#00F0FF', '#36454F']).slice(0, 4).map((color, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -4, scale: 1.05 }}
                        className="rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="flex-1" style={{ backgroundColor: color }} />
                        <div className="bg-white p-1.5">
                          <p className="text-[9px] font-mono text-gray-400 text-center uppercase">{color}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>

            {/* 4. Scan History - 12cols -> 4cols / 2rows */}
            <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-2">
              {loading ? (
                <Skeleton type="card" className="h-[500px]" />
              ) : (
                <Card variant="solid" className="p-8 h-full bg-white flex flex-col">
                  <h3 className="text-lg font-black text-sage uppercase italic tracking-tighter mb-8 border-b border-sage/10 pb-4 flex items-center justify-between">
                    Scan Timeline
                    <span className="text-[10px] font-bold text-gray-400 italic">LOG_V2.0</span>
                  </h3>
                  <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {scanHistory.map((scan, i) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-6 border-l-2 border-sage/10 pb-6 last:pb-0 group"
                      >
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-sage/20 group-hover:bg-neon-blue transition-colors" />
                        <div className="flex flex-col">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {new Date(scan.scan_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm font-black text-sage uppercase italic tracking-tight">
                            {scan.body_shape ? bodyShapeLabels[scan.body_shape] : 'Unknown'}
                          </p>
                          <p className="text-[10px] text-sage/60 font-medium">Verified by StyleEngine™</p>
                        </div>
                      </motion.div>
                    ))}
                    {scanHistory.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <TrendingUp size={32} className="mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">No activity yet</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>

            {/* 5. Saved Items - 12cols -> 5cols */}
            <motion.div variants={itemVariants} className="md:col-span-5 h-full">
              {loading ? (
                <Skeleton type="card" className="h-60" />
              ) : (
                <Card variant="solid" className="p-8 h-full bg-sage text-white overflow-hidden relative group">
                   <Heart className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12" />
                   <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black uppercase italic tracking-tighter">Your Wardrobe</h3>
                      <div className="px-2 py-1 bg-white/10 rounded-full border border-white/20">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{savedItems.length} ITEMS</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 flex-1 mb-8">
                      {savedProducts.slice(0, 4).map((product, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          className="aspect-square rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-2 group-hover:border-white/40 transition-all overflow-hidden"
                        >
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <div className="w-full h-full bg-sand/20 rounded-lg animate-pulse" />
                          )}
                        </motion.div>
                      ))}
                      {savedProducts.length === 0 && [1,2,3,4].map(i => (
                         <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 border-dashed" />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => navigate('/marketplace')}
                    >
                      Enter Marketplace
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* 6. Match Stats - 12cols -> 3cols */}
            <motion.div variants={itemVariants} className="md:col-span-3 h-full">
              {loading ? (
                <Skeleton type="card" className="h-60" />
              ) : (
                <Card variant="solid" className="p-8 h-full bg-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="relative mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-sage/10"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * (savedItems.length > 0 ? 0.87 : 0)) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-sage tracking-tighter">
                        {savedItems.length > 0 ? '87%' : '--'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Fit Accuracy</p>
                </Card>
              )}
            </motion.div>

            {/* 7. Sustainability - 12cols -> 3cols */}
            <motion.div variants={itemVariants} className="md:col-span-3 h-full">
              {loading ? (
                <Skeleton type="card" className="h-56" />
              ) : (
                <Card variant="solid" className="p-8 h-full bg-sand/20 border border-sand flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                    <Leaf className="text-sage" size={24} />
                  </div>
                  <p className="text-3xl font-black text-sage tracking-tighter mb-1">{avgRating}★</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sustainability Rank</p>
                </Card>
              )}
            </motion.div>

            {/* 8. Next Steps - 12cols -> 5cols */}
            <motion.div variants={itemVariants} className="md:col-span-5 h-full">
              {loading ? (
                <Skeleton type="card" className="h-56" />
              ) : (
                <Card variant="solid" className="p-8 h-full bg-gradient-to-br from-sage to-black text-white relative group cursor-pointer overflow-hidden" onClick={() => navigate('/marketplace')}>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-neon-blue transition-colors">Style Recommendations</h3>
                      <p className="text-sm text-sand/60 leading-relaxed max-w-[80%]">
                        Based on your latest scan, we've found 12 new items that perfectly match your <span className="text-white italic font-bold">Inverted Triangle</span> shape.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue group-hover:translate-x-2 transition-transform">
                      <span className="text-[10px] font-black uppercase tracking-widest">Explore Curated Picks</span>
                      <TrendingUp size={14} />
                    </div>
                  </div>
                  <motion.div 
                    className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </Card>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};