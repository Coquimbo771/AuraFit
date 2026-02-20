import React from 'react';
import { ShieldCheck, Package, Users, Bot } from 'lucide-react';
import { Card, PageTransition, Button } from '../components';
import { useAuthStore } from '../store/authStore';
import { Navigate, useNavigate } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Administracion</p>
            <h1 className="text-4xl font-bold text-ink">Panel de tienda</h1>
            <p className="text-ink/70 mt-2">Centro de control para operaciones, clientes y catalogo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="solid" className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-ink">Gestion de catalogo</h3>
                <Package className="text-ember" />
              </div>
              <p className="text-ink/70 mb-4">Administra inventario, precios y colecciones destacadas.</p>
              <Button variant="secondary" onClick={() => navigate('/marketplace')}>Ver marketplace</Button>
            </Card>

            <Card variant="solid" className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-ink">Clientes y roles</h3>
                <Users className="text-ember" />
              </div>
              <p className="text-ink/70 mb-4">Segmenta por tipo de usuario y crea campañas personalizadas.</p>
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>Ver dashboard</Button>
            </Card>

            <Card variant="glass" className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-ink">Centro IA</h3>
                <Bot className="text-ember" />
              </div>
              <p className="text-ink/70 mb-4">Usa el bot de negocio para pricing, promociones y conversion.</p>
              <Button variant="primary" onClick={() => navigate('/assistant')}>Abrir bot comercial</Button>
            </Card>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white/80 p-5 text-sm text-ink/70 flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-600 mt-0.5" />
            Recomendacion: protege este panel con RLS + verificacion de rol en backend (Edge Function/API), no solo en frontend.
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
