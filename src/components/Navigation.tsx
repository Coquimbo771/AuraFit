import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wand2, ShoppingBag, BookOpen, Menu, X, UserCircle, Bot, CreditCard, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useShoppingStore } from '../store/shoppingStore';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: <Home size={20} />, href: '/' },
  { label: 'Scan Studio', icon: <Wand2 size={20} />, href: '/scan', requiresAuth: true },
  { label: 'Marketplace', icon: <ShoppingBag size={20} />, href: '/marketplace' },
  { label: 'Guia de estilo', icon: <BookOpen size={20} />, href: '/style-guide' },
  { label: 'Asistente', icon: <Bot size={20} />, href: '/assistant' },
  { label: 'Checkout', icon: <CreditCard size={20} />, href: '/checkout', requiresAuth: true },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const cartCount = useShoppingStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  const visibleItems = navItems.filter((item) => !item.requiresAuth || user);

  return (
    <header className="sticky top-0 z-40">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-sand-50/80 backdrop-blur-xl border-b border-ink/10"
      >
        <div className="absolute inset-0 grain opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-ember text-ink flex items-center justify-center font-bold">
              AF
            </div>
            <div>
              <p className="text-lg font-bold text-ink leading-none">AuraFit</p>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">AI Studio</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive(item.href)
                    ? 'bg-ink text-sand-50'
                    : 'text-ink/70 hover:text-ink hover:bg-ink/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/scan" className="btn-primary">
              Iniciar escaneo
            </Link>
            <Link
              to="/checkout"
              className="relative px-4 py-2 rounded-full border border-ink/20 text-ink/80 hover:text-ink hover:border-ink transition-colors text-sm font-semibold"
            >
              Carrito
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-ember text-ink text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full border border-ink/20 text-ink/80 hover:text-ink hover:border-ink transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
            <Link
              to={user ? '/dashboard' : '/login'}
              className="px-4 py-2 rounded-full border border-ink/20 text-ink/80 hover:text-ink hover:border-ink transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <UserCircle size={18} />
              {user ? 'Mi cuenta' : 'Ingresar'}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-ink/10 hover:bg-ink/5 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} className="text-ink" /> : <Menu size={22} className="text-ink" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-4 pb-6"
            >
              <div className="grid gap-2 pt-4 border-t border-ink/10">
                {visibleItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold ${
                      isActive(item.href)
                        ? 'bg-ink text-sand-50'
                        : 'bg-white text-ink/80 border border-ink/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/scan"
                  className="btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar escaneo
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="w-full text-center px-4 py-3 rounded-2xl border border-ink/20 text-ink/80 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panel admin
                  </Link>
                )}
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="w-full text-center px-4 py-3 rounded-2xl border border-ink/20 text-ink/80 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user ? 'Mi cuenta' : 'Ingresar'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};