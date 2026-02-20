import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Check } from 'lucide-react';
import { Button, Input, PageTransition } from '../components';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

// Google icon SVG
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, loading, error } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [validationError, setValidationError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    try {
      await signUp(email, password, fullName, role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Sign up error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  };

  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-sand-50 via-sand to-white flex items-center justify-center pt-24 pb-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Registro</p>
              <h1 className="text-4xl md:text-5xl font-bold text-ink mb-2">Crea tu perfil AuraFit</h1>
              <p className="text-ink/70">Completa tus datos y desbloquea recomendaciones precisas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User size={20} />}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={20} />}
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-ink/60 mb-2">
                  Tipo de cuenta
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-ink/10 focus:border-ember focus:outline-none bg-white/80"
                >
                  <option value="client">Cliente</option>
                  <option value="stylist">Stylist</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <Input
                  label="Contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  icon={<Lock size={20} />}
                />
                {password && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-ink/10'}`} />
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Confirmar contrasena"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock size={20} />}
              />

              {(validationError || error) && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
                  {validationError || error}
                </div>
              )}

              <Button variant="primary" size="lg" type="submit" isLoading={loading} className="w-full">
                Crear cuenta
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-ink/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-ink/50">O continua con</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3"
                isLoading={loading}
              >
                <GoogleIcon />
                <span>Continuar con Google</span>
              </Button>
            </form>

            <p className="text-center text-ink/60 mt-6">
              Ya tienes cuenta?{' '}
              <Link to="/login" className="text-ink font-semibold hover:text-ember">
                Iniciar sesion
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="bg-white/80 border border-ink/10 rounded-3xl p-8 w-full">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50 mb-4">Incluye</p>
              <div className="space-y-4">
                {[
                  'Recomendaciones de talla con precision',
                  'Paleta de color personalizada',
                  'Historial de escaneos y comparativas',
                  'Marketplace con marcas verificadas',
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-ember/20 flex items-center justify-center text-ember">
                      <Check size={16} />
                    </div>
                    <span className="font-medium text-ink">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};