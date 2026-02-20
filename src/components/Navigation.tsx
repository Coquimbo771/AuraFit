import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wand2, ShoppingBag, BookOpen, Menu, X, UserCircle, Bot, CreditCard, Shield, LogOut, LogIn, UserPlus, ChevronDown } from 'lucide-react';
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
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const cartCount = useShoppingStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

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
            {user ? (
              // Usuario logueado
              <>
                <Link to="/scan" className="btn-primary">
                  Iniciar escaneo
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-full border border-ink/20 text-ink/80 hover:text-ink hover:border-ink transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
                
                {/* Menú desplegable del usuario */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="relative px-4 py-2 rounded-full border border-ink/20 text-ink/80 hover:text-ink hover:border-ink transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    <UserCircle size={18} />
                    {user.full_name || 'Mi cuenta'}
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-ember text-ink text-[10px] font-bold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                    <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-ink/10 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          <Link
                            to="/checkout"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink/80 hover:text-ink hover:bg-ink/5 transition-colors"
                          >
                            <CreditCard size={18} />
                            <span>Carrito</span>
                            {cartCount > 0 && (
                              <span className="ml-auto min-w-5 h-5 px-1 rounded-full bg-ember text-ink text-[10px] font-bold flex items-center justify-center">
                                {cartCount}
                              </span>
                            )}
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink/80 hover:text-ink hover:bg-ink/5 transition-colors"
                          >
                            <UserCircle size={18} />
                            <span>{user.full_name || 'Mi cuenta'}</span>
                          </Link>
                          <div className="h-px bg-ink/10 my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink/80 hover:text-ember hover:bg-ember/5 transition-colors"
                          >
                            <LogOut size={18} />
                            <span>Salir</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Usuario NO logueado
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full border border-ink/20 text-ink/80 hover:text-ink hover:border-ink transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Registrarse
                </Link>
              </>
            )}
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
                
                {user ? (
                  // Usuario logueado - Menú móvil
                  <>
                    <Link
                      to="/scan"
                      className="btn-primary w-full text-center flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Wand2 size={18} />
                      Iniciar escaneo
                    </Link>
                    <Link
                      to="/checkout"
                      className="w-full text-center px-4 py-3 rounded-2xl border border-ink/20 text-ink/80 font-semibold flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <CreditCard size={18} />
                      Carrito {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="w-full text-center px-4 py-3 rounded-2xl border border-ink/20 text-ink/80 font-semibold flex items-center justify-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield size={18} />
                        Panel admin
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="w-full text-center px-4 py-3 rounded-2xl border border-ink/20 text-ink/80 font-semibold flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle size={18} />
                      {user.full_name || 'Mi cuenta'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center px-4 py-3 rounded-2xl bg-ink/5 text-ink/80 font-semibold flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  // Usuario NO logueado - Menú móvil
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center px-4 py-3 rounded-2xl border border-ink/20 text-ink/80 font-semibold flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn size={18} />
                      Ingresar
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary w-full text-center flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus size={18} />
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};