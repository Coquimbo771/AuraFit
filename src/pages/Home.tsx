import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button, Card, PageTransition } from '../components';

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
      <div className="min-h-screen bg-gradient-to-b from-sage-50 via-sand to-white">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
        >
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-neon-blue rounded-full mix-blend-multiply filter blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-96 h-96 bg-sage rounded-full mix-blend-multiply filter blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full border border-sage/20"
            >
              <Sparkles className="text-neon-blue" size={16} />
              <span className="text-sm font-medium text-sage">Welcome to the future of fashion</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-6xl md:text-7xl font-bold text-sage"
            >
              Tu cuerpo, Tu estilo,
              <br />
              <span className="bg-gradient-to-r from-sage via-neon-blue to-sage bg-clip-text text-transparent">
                Sin errores
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              AuraFit AI uses advanced computer vision to analyze your body shape, skin tone, and personal style, delivering personalized fashion recommendations with 98% accuracy.
            </motion.p>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="neon"
                size="lg"
                onClick={() => navigate('/scan')}
                className="group"
              >
                Iniciar Escaneo 3D
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/marketplace')}
              >
                Ver Catálogo
              </Button>
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
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-sage text-center mb-16"
          >
            Cómo funciona
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Escanea',
                description: 'Accede a tu cámara y posiciónate para que nuestro AI analice tu cuerpo en 3D',
                step: '01',
              },
              {
                icon: Sparkles,
                title: 'Analiza',
                description: 'IA detecta tu tipo de cuerpo, tono de piel e ideal color palette en segundos',
                step: '02',
              },
              {
                icon: ShoppingBag,
                title: 'Compra con confianza',
                description: 'Recibe recomendaciones personalizadas con 98% de coincidencia en talla y estilo',
                step: '03',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative"
              >
                {i < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-neon-blue"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <ArrowRight size={32} />
                  </motion.div>
                )}

                <Card variant="glass" className="p-8 text-center h-full">
                  <motion.div
                    className="inline-block p-4 bg-sage/10 rounded-full mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="text-sage" size={32} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-sage mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>

                  <div className="text-6xl font-bold text-neon-blue/20">{item.step}</div>
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
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-sage text-center mb-16"
          >
            Por qué elegir AuraFit AI
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: TrendingUp,
                title: '98% Precision',
                description: 'Advanced AI algorithms for perfect size recommendations',
              },
              {
                icon: Sparkles,
                title: 'Personalized Palettes',
                description: 'Discover colors that enhance your natural beauty',
              },
              {
                icon: ShoppingBag,
                title: 'Curated Collection',
                description: 'Handpicked sustainable and luxury fashion brands',
              },
              {
                icon: Target,
                title: 'Body Inclusive',
                description: 'Celebrates all body types with science-backed styling',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
              >
                <Card variant="solid" className="p-8 flex gap-6">
                  <motion.div
                    className="flex-shrink-0 p-4 bg-sage/10 rounded-full h-fit"
                    whileHover={{ scale: 1.1 }}
                  >
                    <item.icon className="text-sage" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-sage mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
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
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-sage">
              Ready to transform your style?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts who've found their perfect fit with AuraFit AI
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                variant="neon"
                size="lg"
                onClick={() => navigate('/register')}
                className="group"
              >
                Get Started Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </motion.div>
          </Card>
        </motion.section>
      </div>
    </PageTransition>
  );
};