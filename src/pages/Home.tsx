import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, ShoppingBag, TrendingUp, Zap } from 'lucide-react';
import { Button, Card, PageTransition, Badge, Footer } from '../components';

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
      <div className="min-h-screen bg-sand-50 dark:bg-gradient-to-br dark:from-dark-950 dark:via-dark-900 dark:to-dark-850 relative overflow-hidden transition-colors duration-500">
        {/* Fondo con efectos */}
        <div className="absolute inset-0">
          {/* Gradientes modo claro */}
          <div className="absolute -top-32 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-sun/40 to-ember/20 blur-3xl opacity-70 dark:opacity-0 transition-opacity duration-500" />
          <div className="absolute bottom-0 -left-24 w-[32rem] h-[32rem] bg-gradient-to-tr from-sage/40 to-sand/30 blur-3xl opacity-70 dark:opacity-0 transition-opacity duration-500" />
          
          {/* Gradientes modo oscuro - efecto neon */}
          <div className="opacity-0 dark:opacity-100 transition-opacity duration-500">
            <div className="absolute -top-40 right-0 w-[50rem] h-[50rem] bg-gradient-to-br from-neon-blue/20 via-neon-purple/10 to-transparent blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -left-32 w-[40rem] h-[40rem] bg-gradient-to-tr from-ember/20 via-neon-pink/10 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-tl from-neon-purple/15 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="absolute inset-0 grain opacity-30 dark:opacity-20" />
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8">
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/70 dark:bg-dark-800/60 border border-ink/10 dark:border-neon-blue/30 rounded-full backdrop-blur-xl dark:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300"
              >
                <Sparkles className="text-ember dark:text-neon-blue" size={14} />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-ink/60 dark:text-sand-50/70">Nuevo estudio AuraFit</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants} 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-ink dark:text-sand-50 leading-tight transition-colors"
              >
                Tu cuerpo, tu estilo
                <span className="block text-ember dark:text-transparent dark:bg-gradient-to-r dark:from-ember dark:via-neon-blue dark:to-neon-purple dark:bg-clip-text mt-1 sm:mt-2">sin ensayo y error.</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants} 
                className="text-base sm:text-lg text-ink/70 dark:text-sand-50/70 max-w-xl transition-colors leading-relaxed"
              >
                Escanea, entiende y compra con confianza. AuraFit AI transforma tu forma y colorimetria en recomendaciones claras, con tallas precisas y marcas que si te quedan.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/scan')} className="group w-full sm:w-auto justify-center">
                  <span className="text-sm sm:text-base">Iniciar escaneo 3D</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/marketplace')} className="w-full sm:w-auto justify-center">
                  <span className="text-sm sm:text-base">Explorar marketplace</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                {[
                  { label: 'Precision', value: '98%' },
                  { label: 'Matches', value: '120k+' },
                  { label: 'Marcas', value: '80+' },
                ].map((stat) => (
                  <div 
                    key={stat.label} 
                    className="bg-white/70 dark:bg-dark-800/50 border border-ink/10 dark:border-neon-blue/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-xl dark:shadow-[0_4px_16px_rgba(0,240,255,0.1)] transition-all duration-300 hover:scale-105"
                  >
                    <p className="text-xl sm:text-2xl font-bold text-ink dark:text-neon-blue">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-ink/50 dark:text-sand-50/50">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 sm:space-y-6 mt-8 lg:mt-0">
              <Card variant="glass" className="p-6 sm:p-8 dark:bg-dark-800/40 dark:border-neon-blue/20 dark:shadow-[0_8px_32px_rgba(0,240,255,0.15)]">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-sand-50/50">Vista previa</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-ink dark:text-sand-50">Perfil generado</h3>
                  </div>
                  <Badge label="Live" variant="info" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    { title: 'Tipo de cuerpo', value: 'Athletic', icon: Target },
                    { title: 'Colorimetria', value: 'Warm Neutral', icon: Sparkles },
                    { title: 'Match Score', value: '94%', icon: TrendingUp },
                  ].map((item, index) => (
                    <div 
                      key={item.title} 
                      className="flex items-center justify-between bg-white/70 dark:bg-dark-700/40 border border-ink/10 dark:border-neon-blue/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm transition-all hover:scale-[1.02] dark:hover:border-neon-blue/30"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-ink/5 dark:bg-neon-blue/10 flex items-center justify-center text-ink dark:text-neon-blue transition-colors">
                          <item.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-ink/40 dark:text-sand-50/40">{item.title}</p>
                          <p className="text-sm sm:text-base font-semibold text-ink dark:text-sand-50">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-xs text-ink/40 dark:text-sand-50/30">0{index + 1}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="solid" className="p-4 sm:p-6 flex items-center justify-between dark:bg-gradient-to-r dark:from-ember/20 dark:to-neon-purple/20 dark:border-neon-blue/30 dark:shadow-[0_4px_16px_rgba(255,107,53,0.2)]">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-sand-50/70">Modo rapido</p>
                  <p className="text-base sm:text-lg font-semibold text-ink dark:text-sand-50">Escanea en 45 segundos</p>
                </div>
                <Zap className="text-ember dark:text-neon-blue" size={20} />
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative"
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink dark:text-sand-50 text-center mb-10 sm:mb-12 md:mb-16 dark:text-transparent dark:bg-gradient-to-r dark:from-sand-50 dark:via-neon-blue dark:to-sand-50 dark:bg-clip-text"
          >
            Como funciona
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
              <motion.div key={i} variants={itemVariants} className="relative group">
                {i < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-ember dark:text-neon-blue"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <ArrowRight size={32} />
                  </motion.div>
                )}

                <Card 
                  variant="glass" 
                  className="p-6 sm:p-8 text-center h-full dark:bg-dark-800/40 dark:border-neon-blue/20 dark:shadow-[0_8px_32px_rgba(0,240,255,0.1)] hover:dark:shadow-[0_12px_40px_rgba(0,240,255,0.2)] transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <motion.div 
                    className="inline-block p-3 sm:p-4 bg-ink/5 dark:bg-neon-blue/10 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 dark:shadow-[0_0_20px_rgba(0,240,255,0.3)]" 
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    <item.icon className="text-ink dark:text-neon-blue" size={28} />
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-bold text-ink dark:text-sand-50 mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-ink/70 dark:text-sand-50/70 mb-3 sm:mb-4 leading-relaxed">{item.description}</p>

                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-ember/20 dark:text-neon-blue/20">{item.step}</div>
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
              <motion.div key={i} variants={itemVariants} className="group">
                <Card 
                  variant="solid" 
                  className="p-8 flex gap-6 dark:bg-dark-800/40 dark:border-neon-purple/20 dark:shadow-[0_8px_32px_rgba(168,85,247,0.1)] hover:dark:shadow-[0_12px_40px_rgba(168,85,247,0.2)] transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <motion.div 
                    className="flex-shrink-0 p-4 bg-ink/5 dark:bg-gradient-to-br dark:from-neon-purple/20 dark:to-neon-blue/20 rounded-2xl h-fit dark:shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                    whileHover={{ scale: 1.1 }}
                  >
                    <item.icon className="text-ink dark:text-neon-purple" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-ink dark:text-sand-50 mb-2">{item.title}</h3>
                    <p className="text-ink/70 dark:text-sand-50/70">{item.description}</p>
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
          className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative"
        >
          <Card 
            variant="glass" 
            className="p-8 sm:p-10 md:p-12 lg:p-16 text-center relative overflow-hidden dark:bg-gradient-to-br dark:from-dark-800/60 dark:via-dark-800/40 dark:to-dark-900/60 dark:border-neon-blue/30 dark:shadow-[0_20px_60px_rgba(0,240,255,0.2)]"
          >
            {/* Efectos de fondo para dark mode */}
            <div className="absolute inset-0 opacity-0 dark:opacity-100">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl" />
            </div>
            
            <motion.h2 
              variants={itemVariants} 
              className="text-4xl font-bold text-ink dark:text-sand-50 relative z-10"
            >
              Listo para un estilo sin dudas?
            </motion.h2>
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-ink/70 dark:text-sand-50/70 max-w-2xl mx-auto relative z-10"
            >
              Crea tu perfil en minutos y recibe recomendaciones reales, pensadas para tu cuerpo y tu ritmo.
            </motion.p>
            <motion.div variants={itemVariants} className="relative z-10">
              <Button variant="primary" size="lg" onClick={() => navigate('/register')} className="group">
                Crear mi perfil
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </motion.div>
          </Card>
        </motion.section>
      </div>
      <Footer />
    </PageTransition>
  );
};