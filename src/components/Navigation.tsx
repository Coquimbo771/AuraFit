import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wand2, ShoppingBag, BookOpen, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: <Home size={20} />, href: '/' },
  { label: 'Scan Studio', icon: <Wand2 size={20} />, href: '/scan', requiresAuth: true },
  { label: 'Marketplace', icon: <ShoppingBag size={20} />, href: '/marketplace' },
  { label: 'Style Guide', icon: <BookOpen size={20} />, href: '/style-guide' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  const visibleItems = navItems.filter((item) => !item.requiresAuth || user);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex fixed bottom-8 right-8 z-40"
      >
        <div className="glass p-2 flex gap-2 rounded-full">
          {visibleItems.map((item) => (
            <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={item.href}
                className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive(item.href)
                    ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/50'
                    : 'text-sage hover:bg-sage/10'
                }`}
                title={item.label}
              >
                {item.icon}
              </Link>
            </motion.div>
          ))}

          {user && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive('/dashboard')
                    ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/50'
                    : 'text-sage hover:bg-sage/10'
                }`}
                title="Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-sage/10 p-4 z-30">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-sage">
            AuraFit
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-sage/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} className="text-sage" /> : <Menu size={24} className="text-sage" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2 border-t border-sage/10 pt-4"
            >
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive(item.href) ? 'bg-sage text-white' : 'text-sage hover:bg-sage/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {user && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive('/dashboard') ? 'bg-sage text-white' : 'text-sage hover:bg-sage/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="w-3 h-3 rounded-full bg-neon-blue" />
                  Dashboard
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-20 top-[70px]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};