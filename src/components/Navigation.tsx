import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wand2, ShoppingBag, BookOpen, Menu, X, UserCircle, Bot, CreditCard, Shield, LogOut, LogIn, UserPlus, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useShoppingStore } from '../store/shoppingStore';
import { useThemeStore } from '../store/themeStore';

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
  const { theme, toggleTheme } = useThemeStore();
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
        className="relative bg-sand-50/80 dark:bg-dark-900/90 backdrop-blur-2xl border-b border-ink/10 dark:border-neon-blue/20 transition-all duration-300 dark:shadow-[0_4px_24px_rgba(0,240,255,0.1)]"
      >
        <div className="absolute inset-0 grain opacity-40 dark:opacity-20 pointer-events-none" />
        
        {/* Glow effect para dark mode */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent blur-xl" />
          <div className="absolute top-0 right-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent blur-xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 relative z-10">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-ember text-ink dark:text-sand-50 flex items-center justify-center font-bold text-sm sm:text-base">
              AF
            </div>
            <div className="hidden sm:block">
              <p className="text-sm sm:text-base lg:text-lg font-bold text-ink dark:text-sand-50 leading-none transition-colors">AuraFit</p>
              <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-sand-50/50 transition-colors">AI Studio</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-2.5 xl:px-3.5 py-2 rounded-full text-xs xl:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-ink text-sand-50 dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple dark:text-dark-950 dark:shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105'
                    : 'text-ink/70 hover:text-ink hover:bg-ink/5 dark:text-sand-50/70 dark:hover:text-sand-50 dark:hover:bg-neon-blue/10 dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 xl:gap-3">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full border border-ink/20 dark:border-neon-blue/30 text-ink/80 dark:text-neon-blue hover:text-ink dark:hover:text-sand-50 hover:border-ink dark:hover:border-neon-blue transition-all dark:shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:dark:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-110"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? <Moon size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Sun size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" style={{ animationDuration: '20s' }} />}
            </button>

            {user ? (
              // Usuario logueado
              <>
                <Link to="/scan" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 xl:px-6 py-2 xl:py-3 whitespace-nowrap">
                  <span className="hidden sm:inline">Iniciar escaneo</span>
                  <span className="sm:hidden">Scan</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-2.5 sm:px-3 xl:px-4 py-2 rounded-full border border-ink/20 dark:border-sand-50/20 text-ink/80 dark:text-sand-50/80 hover:text-ink dark:hover:text-sand-50 hover:border-ink dark:hover:border-sand-50 transition-colors text-xs xl:text-sm font-semibold flex items-center gap-2"
                  >
                    <Shield size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
                
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="relative px-2.5 sm:px-3 xl:px-4 py-2 rounded-full border border-ink/20 dark:border-neon-blue/30 text-ink/80 dark:text-sand-50 hover:text-ink dark:hover:text-neon-blue hover:border-ink dark:hover:border-neon-blue transition-all text-xs xl:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 dark:shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:dark:shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                  >
                    <UserCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden xl:inline">{user.full_name || 'Mi cuenta'}</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full bg-ember text-ink dark:text-sand-50 text-[9px] sm:text-[10px] font-bold flex items-center justify-center dark:shadow-[0_0_10px_rgba(255,107,53,0.6)] animate-pulse">
                        {cartCount}
                      </span>
                    )}
                    <ChevronDown size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-dark-850/95 rounded-xl sm:rounded-2xl shadow-xl border border-ink/10 dark:border-neon-blue/20 overflow-hidden z-50 backdrop-blur-2xl dark:shadow-[0_8px_32px_rgba(0,240,255,0.2)]"
                      >
                        <div className="p-1.5 sm:p-2">
                          <Link
                            to="/checkout"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-ink/80 dark:text-sand-50/80 hover:text-ink dark:hover:text-sand-50 hover:bg-ink/5 dark:hover:bg-sand-50/5 transition-colors"
                          >
                            <CreditCard size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span>Carrito</span>
                            {cartCount > 0 && (
                              <span className="ml-auto min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full bg-ember text-ink dark:text-sand-50 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                                {cartCount}
                              </span>
                            )}
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-ink/80 dark:text-sand-50/80 hover:text-ink dark:hover:text-sand-50 hover:bg-ink/5 dark:hover:bg-sand-50/5 transition-colors"
                          >
                            <UserCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span>{user.full_name || 'Mi cuenta'}</span>
                          </Link>
                          <div className="h-px bg-ink/10 dark:bg-sand-50/10 my-1.5 sm:my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-ink/80 dark:text-sand-50/80 hover:text-ember dark:hover:text-ember hover:bg-ember/5 dark:hover:bg-ember/10 transition-colors"
                          >
                            <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
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
                  className="px-2.5 sm:px-3 xl:px-4 py-2 rounded-full border border-ink/20 dark:border-sand-50/20 text-ink/80 dark:text-sand-50/80 hover:text-ink dark:hover:text-sand-50 hover:border-ink dark:hover:border-sand-50 transition-colors text-xs xl:text-sm font-semibold flex items-center gap-1.5 sm:gap-2"
                >
                  <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xl:inline">Ingresar</span>
                </Link>
                <Link
                  to="/register"
                  className="btn-primary flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 xl:px-6 py-2 xl:py-3 whitespace-nowrap"
                >
                  <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Registrarse</span>
                  <span className="sm:hidden">Registro</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {/* Toggle tema móvil */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-ink/10 dark:border-neon-blue/30 text-ink dark:text-neon-blue hover:bg-ink/5 dark:hover:bg-neon-blue/10 transition-all dark:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? <Moon size={18} className="sm:w-[20px] sm:h-[20px]" /> : <Sun size={18} className="sm:w-[20px] sm:h-[20px]" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl border border-ink/10 dark:border-sand-50/10 text-ink dark:text-sand-50 hover:bg-ink/5 dark:hover:bg-sand-50/5 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-3 sm:px-4 pb-4 sm:pb-6 bg-sand-50/95 dark:bg-ink-900/95 backdrop-blur-xl"
            >
              <div className="grid gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-ink/10 dark:border-sand-50/10">
                {visibleItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-colors ${
                      isActive(item.href)
                        ? 'bg-ink text-sand-50 dark:bg-sand-50 dark:text-ink'
                        : 'bg-white dark:bg-ink-800 text-ink/80 dark:text-sand-50/80 border border-ink/10 dark:border-sand-50/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, { size: 18, className: 'sm:w-[20px] sm:h-[20px]' })}
                    {item.label}
                  </Link>
                ))}
                
                {user ? (
                  // Usuario logueado - Menú móvil
                  <>
                    <Link
                      to="/scan"
                      className="btn-primary w-full text-center flex items-center justify-center gap-2 text-sm sm:text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Wand2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Iniciar escaneo
                    </Link>
                    <Link
                      to="/checkout"
                      className="w-full text-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-ink/20 dark:border-sand-50/20 text-ink/80 dark:text-sand-50/80 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <CreditCard size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Carrito {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="w-full text-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-ink/20 dark:border-sand-50/20 text-ink/80 dark:text-sand-50/80 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Panel admin
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="w-full text-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-ink/20 dark:border-sand-50/20 text-ink/80 dark:text-sand-50/80 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                      {user.full_name || 'Mi cuenta'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-ink/5 dark:bg-sand-50/5 text-ink/80 dark:text-sand-50/80 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  // Usuario NO logueado - Menú móvil
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-ink/20 dark:border-sand-50/20 text-ink/80 dark:text-sand-50/80 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Ingresar
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary w-full text-center flex items-center justify-center gap-2 text-sm sm:text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
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