import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    empresa: [
      { label: 'Sobre nosotros', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carreras', href: '/careers' },
      { label: 'Prensa', href: '/press' },
    ],
    servicios: [
      { label: 'Escaneo Inteligente', href: '/scan' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Guía de estilo', href: '/style-guide' },
      { label: 'Asistente virtual', href: '/assistant' },
    ],
    soporte: [
      { label: 'Centro de ayuda', href: '/help' },
      { label: 'Contacto', href: '/contact' },
      { label: 'Envíos y devoluciones', href: '/shipping' },
      { label: 'Guía de tallas', href: '/size-guide' },
    ],
    legal: [
      { label: 'Política de privacidad', href: '/privacy' },
      { label: 'Términos y condiciones', href: '/terms' },
      { label: 'Política de cookies', href: '/cookies' },
      { label: 'Accesibilidad', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { icon: <Instagram size={20} />, href: 'https://instagram.com/aurafit', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: <Facebook size={20} />, href: 'https://facebook.com/aurafit', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com/aurafit', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com/company/aurafit', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  return (
    <footer className="bg-ink dark:bg-dark-900 text-sand-50 border-t border-ink/10 dark:border-neon-blue/20">
      {/* Newsletter & CTA Section */}
      <div className="bg-gradient-to-r from-ember/10 to-amber-500/10 dark:from-neon-blue/10 dark:to-purple-500/10 border-b border-ink/5 dark:border-neon-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-ink dark:text-sand-50 mb-2 flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="text-ember dark:text-neon-blue" size={28} />
                Descubre tu estilo perfecto
              </h3>
              <p className="text-ink/70 dark:text-sand-50/70 text-sm sm:text-base">
                Recibe recomendaciones personalizadas, ofertas exclusivas y tips de moda sostenible
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-dark-800 text-ink dark:text-sand-50 border border-ink/10 dark:border-neon-blue/20 focus:outline-none focus:border-ember dark:focus:border-neon-blue transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-ember dark:bg-neon-blue text-ink dark:text-dark-950 rounded-xl font-semibold whitespace-nowrap hover:shadow-lg transition-shadow"
                >
                  Suscribirme
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand & Contact Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-ember to-amber-500 dark:from-neon-blue dark:to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="text-white dark:text-dark-950" size={24} />
              </div>
              <span className="text-2xl font-bold text-sand-50">AuraFit</span>
            </Link>

            <p className="text-sand-50/70 text-sm mb-6 leading-relaxed">
              Moda inteligente y sostenible. Encuentra piezas que se ajusten perfectamente a tu estilo, cuerpo y valores.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <a
                href="mailto:contacto@aurafit.com"
                className="flex items-center gap-3 text-sand-50/70 hover:text-ember dark:hover:text-neon-blue transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-ink/50 dark:bg-dark-800 flex items-center justify-center group-hover:bg-ember/20 dark:group-hover:bg-neon-blue/20 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-sm">contacto@aurafit.com</span>
              </a>

              <a
                href="tel:+34900123456"
                className="flex items-center gap-3 text-sand-50/70 hover:text-ember dark:hover:text-neon-blue transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-ink/50 dark:bg-dark-800 flex items-center justify-center group-hover:bg-ember/20 dark:group-hover:bg-neon-blue/20 transition-colors">
                  <Phone size={16} />
                </div>
                <span className="text-sm">+34 900 123 456</span>
              </a>

              <div className="flex items-start gap-3 text-sand-50/70">
                <div className="w-8 h-8 rounded-lg bg-ink/50 dark:bg-dark-800 flex items-center justify-center mt-0.5">
                  <MapPin size={16} />
                </div>
                <span className="text-sm">
                  Calle de la Moda, 123<br />
                  28001 Madrid, España
                </span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-sand-50 font-bold text-sm uppercase tracking-wider mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sand-50/70 hover:text-ember dark:hover:text-neon-blue text-sm transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sand-50 font-bold text-sm uppercase tracking-wider mb-4">Servicios</h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sand-50/70 hover:text-ember dark:hover:text-neon-blue text-sm transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sand-50 font-bold text-sm uppercase tracking-wider mb-4">Soporte</h4>
            <ul className="space-y-2.5">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sand-50/70 hover:text-ember dark:hover:text-neon-blue text-sm transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sand-50 font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sand-50/70 hover:text-ember dark:hover:text-neon-blue text-sm transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="mt-12 pt-8 border-t border-sand-50/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sand-50/70 text-sm font-semibold mr-2">Síguenos:</span>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl bg-ink/50 dark:bg-dark-800 flex items-center justify-center text-sand-50/70 ${social.color} transition-all hover:shadow-lg`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-sand-50/70 text-sm">Métodos de pago:</span>
              <div className="flex items-center gap-2">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-white dark:bg-dark-800 rounded text-xs font-semibold text-ink dark:text-sand-50"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sand-50/10 bg-ink/50 dark:bg-dark-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sand-50/60 text-sm">
              © {currentYear} AuraFit. Todos los derechos reservados.
            </p>
            <p className="text-sand-50/60 text-sm flex items-center gap-1.5">
              Hecho con <Heart size={14} className="text-ember dark:text-neon-blue fill-current" /> en España
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
