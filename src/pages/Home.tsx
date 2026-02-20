import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, ShoppingBag, TrendingUp, Zap } from 'lucide-react';
import { Button, Card, PageTransition, Badge } from '../components';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-sand-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-sun/40 to-ember/20 blur-3xl opacity-70" />
          <div className="absolute bottom-0 -left-24 w-[32rem] h-[32rem] bg-gradient-to-tr from-sage/40 to-sand/30 blur-3xl opacity-70" />
          <div className="absolute inset-0 grain opacity-30" />
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 pt-24 pb-24"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-ink/10 rounded-full">
                <Sparkles className="text-ember" size={16} />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">Nuevo estudio AuraFit</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-ink leading-tight">
                Tu cuerpo, tu estilo
                <span className="block text-ember">sin ensayo y error.</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-ink/70 max-w-xl">
                Escanea, entiende y compra con confianza. AuraFit AI transforma tu forma y colorimetria en recomendaciones claras, con tallas precisas y marcas que si te quedan.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/scan')} className="group">
                  Iniciar escaneo 3D
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/marketplace')}>
                  Explorar marketplace
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 max-w-lg">
                {[
                  { label: 'Precision', value: '98%' },
                  { label: 'Matches', value: '120k+' },
                  { label: 'Marcas', value: '80+' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/70 border border-ink/10 rounded-2xl p-4">
                    <p className="text-2xl font-bold text-ink">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
              <Card variant="glass" className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Vista previa</p>
                    <h3 className="text-2xl font-bold text-ink">Perfil generado</h3>
                  </div>
                  <Badge label="Live" variant="info" />
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Tipo de cuerpo', value: 'Athletic', icon: Target },
                    { title: 'Colorimetria', value: 'Warm Neutral', icon: Sparkles },
                    { title: 'Match Score', value: '94%', icon: TrendingUp },
                  ].map((item, index) => (
                    <div key={item.title} className="flex items-center justify-between bg-white/70 border border-ink/10 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-ink/5 flex items-center justify-center text-ink">
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-ink/40">{item.title}</p>
                          <p className="font-semibold text-ink">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-xs text-ink/40">0{index + 1}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="solid" className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Modo rapido</p>
                  <p className="text-lg font-semibold text-ink">Escanea en 45 segundos</p>
                </div>
                <Zap className="text-ember" size={24} />
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="py-20 px-4 max-w-6xl mx-auto"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-ink text-center mb-16">
            Como funciona
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Escanea en casa',
                description: 'Activa la camara, sigue la guia y deja que la IA capture tus medidas clave.',
                step: '01',
              },
              {
                icon: Sparkles,
                title: 'Perfil instantaneo',
                description: 'Detectamos tu silueta, tono y proporciones para una guia precisa.',
                step: '02',
              },
              {
                icon: ShoppingBag,
                title: 'Compra sin dudas',
                description: 'Recomendaciones con ajuste real, colores que funcionan y tallas claras.',
                step: '03',
              },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                {i < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-ember"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <ArrowRight size={32} />
                  </motion.div>
                )}

                <Card variant="glass" className="p-8 text-center h-full">
                  <motion.div className="inline-block p-4 bg-ink/5 rounded-2xl mb-4" whileHover={{ scale: 1.1, rotate: 3 }}>
                    <item.icon className="text-ink" size={32} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-ink mb-3">{item.title}</h3>
                  <p className="text-ink/70 mb-4">{item.description}</p>

                  <div className="text-6xl font-bold text-ember/20">{item.step}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="py-20 px-4 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Ventajas clave</p>
              <h2 className="text-4xl font-bold text-ink">Por que AuraFit es diferente</h2>
            </div>
            <Button variant="secondary" onClick={() => navigate('/style-guide')}>
              Ver guias de estilo
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Precision real',
                description: 'Algoritmos entrenados con miles de cuerpos reales y tallaje de marca.',
              },
              {
                icon: Sparkles,
                title: 'Colorimetria inteligente',
                description: 'Te dice que tonos elevan tu piel y cuales evitar sin adivinar.',
              },
              {
                icon: ShoppingBag,
                title: 'Coleccion curada',
                description: 'Solo piezas con tallas consistentes y materiales que duran.',
              },
              {
                icon: Target,
                title: 'Inclusivo por diseño',
                description: 'Recomendaciones para todos los cuerpos con datos y no con estereotipos.',
              },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card variant="solid" className="p-8 flex gap-6">
                  <motion.div className="flex-shrink-0 p-4 bg-ink/5 rounded-2xl h-fit" whileHover={{ scale: 1.1 }}>
                    <item.icon className="text-ink" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-ink mb-2">{item.title}</h3>
                    <p className="text-ink/70">{item.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="py-20 px-4 max-w-6xl mx-auto"
        >
          <Card variant="glass" className="p-12 text-center space-y-8">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-ink">
              Listo para un estilo sin dudas?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-ink/70 max-w-2xl mx-auto">
              Crea tu perfil en minutos y recibe recomendaciones reales, pensadas para tu cuerpo y tu ritmo.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button variant="primary" size="lg" onClick={() => navigate('/register')} className="group">
                Crear mi perfil
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </motion.div>
          </Card>
        </motion.section>
      </div>
    </PageTransition>
  );
};