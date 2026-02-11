import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, Download, Save } from 'lucide-react';
import Webcam from 'react-webcam';
import { Button, PageTransition, LoadingSpinner, Card } from '../components';
import { useBiometricStore } from '../store/biometricStore';
import { useAuthStore } from '../store/authStore';

type ScanPhase = 'idle' | 'camera' | 'processing' | 'results';

export const ScanStudio: React.FC = () => {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const { generateRandomScan, saveBiometric, loading: biometricLoading } = useBiometricStore();
  const { user } = useAuthStore();
  const [currentScan, setCurrentScan] = useState<any>(null);

  const handleCameraRequest = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as any });
      setCameraPermission(permission.state === 'granted');
      if (permission.state === 'granted') {
        setPhase('camera');
      }
    } catch {
      setCameraPermission(true);
      setPhase('camera');
    }
  };

  const handleCapture = async () => {
    setPhase('processing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    clearInterval(interval);
    setProgress(100);

    const scan = generateRandomScan();
    setCurrentScan(scan);
    setPhase('results');
  };

  const handleSaveResults = async () => {
    if (!user || !currentScan) return;

    try {
      await saveBiometric(user.id, {
        body_shape: currentScan.bodyShape,
        skin_tone: currentScan.skinTone,
        color_palette: currentScan.colorPalette.map((c: any) => c.hex),
        measurements: {
          shoulder: 40 + Math.random() * 10,
          waist: 28 + Math.random() * 12,
          hip: 36 + Math.random() * 12,
        },
      } as any);
      alert('Results saved to your profile!');
      setPhase('idle');
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const handleNewScan = () => {
    setPhase('idle');
    setCurrentScan(null);
    setProgress(0);
  };

  const bodyShapeLabels: Record<string, string> = {
    hourglass: 'Hourglass',
    rectangle: 'Rectangle',
    pear: 'Pear',
    triangle: 'Triangle',
    inverted_triangle: 'Inverted Triangle',
    athletic: 'Athletic',
  };

  const skinToneLabels: Record<string, string> = {
    cool: 'Cool Undertone',
    warm: 'Warm Undertone',
    neutral: 'Neutral Undertone',
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sand py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-sage mb-4">Scan Studio</h1>
            <p className="text-gray-600 text-lg">
              Let our AI analyze your body shape and skin tone to create your perfect style profile
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <Card variant="glass" className="p-12 text-center space-y-6">
                  <motion.div
                    className="inline-block p-8 bg-sage/10 rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Camera className="text-sage" size={48} />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-sage mb-2">Ready to scan?</h2>
                    <p className="text-gray-600">
                      We'll use your device's camera to analyze your measurements and coloring
                    </p>
                  </div>

                  <Button variant="neon" size="lg" onClick={handleCameraRequest}>
                    <Camera size={20} />
                    Activate Camera
                  </Button>

                  <p className="text-sm text-gray-500 border-t border-sage/10 pt-6">
                    Your privacy is protected. Images are processed locally and never stored.
                  </p>
                </Card>
              </motion.div>
            )}

            {phase === 'camera' && (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Card variant="solid" className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <Webcam
                      ref={webcamRef}
                      className="w-full h-full"
                      mirrored
                      screenshotFormat="image/jpeg"
                    />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 480">
                      <g className="opacity-50 stroke-neon-blue stroke-2 fill-none">
                        <circle cx="320" cy="240" r="120" />
                        <line x1="200" y1="240" x2="100" y2="240" />
                        <line x1="440" y1="240" x2="540" y2="240" />
                        <line x1="320" y1="120" x2="320" y2="20" />
                        <line x1="320" y1="360" x2="320" y2="460" />

                        <circle cx="280" cy="200" r="8" fill="currentColor" />
                        <circle cx="360" cy="200" r="8" fill="currentColor" />
                        <circle cx="320" cy="280" r="8" fill="currentColor" />
                      </g>
                    </svg>

                    <motion.div
                      className="absolute inset-0 border-2 border-neon-blue rounded-3xl"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </Card>

                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" onClick={handleNewScan}>
                    Cancel
                  </Button>
                  <Button variant="neon" onClick={handleCapture}>
                    Capturar y Analizar
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <Card variant="glass" className="p-12 text-center space-y-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="flex justify-center"
                  >
                    <LoadingSpinner size="lg" variant="neon" />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-sage mb-2">Procesando Biometría...</h2>
                    <p className="text-gray-600 mb-4">Analizando tu cuerpo y tono de piel</p>

                    <div className="w-full bg-sage/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-sage to-neon-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {phase === 'results' && currentScan && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card variant="solid" className="p-8 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-2xl font-bold text-sage mb-6">Tu Perfil de Estilo</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-sage/5 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Tipo de Cuerpo</p>
                        <p className="text-2xl font-bold text-sage">{bodyShapeLabels[currentScan.bodyShape]}</p>
                      </div>
                      <div className="p-4 bg-sage/5 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Tono de Piel</p>
                        <p className="text-2xl font-bold text-sage">{skinToneLabels[currentScan.skinTone]}</p>
                      </div>
                      <div className="p-4 bg-sage/5 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Talla Sugerida</p>
                        <p className="text-2xl font-bold text-sage">{currentScan.suggestedSize}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-sage mb-4">Tu Paleta de Colores Ideal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {currentScan.colorPalette.map((color: any, i: number) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="text-center"
                        >
                          <div
                            className="w-full aspect-square rounded-xl shadow-lg mb-2 border-2 border-sage/10 cursor-pointer hover:border-sage transition-colors"
                            style={{ backgroundColor: color.hex }}
                          />
                          <p className="text-xs font-medium text-gray-700">{color.name}</p>
                          <p className="text-xs text-gray-500">{color.hex}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-sage mb-3">Recomendaciones de Estilo</h3>
                    <ul className="space-y-2">
                      {currentScan.styleRecommendations.map((rec: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <div className="w-2 h-2 rounded-full bg-sage mt-2 flex-shrink-0" />
                          {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" onClick={handleNewScan}>
                    Nuevo Escaneo
                  </Button>
                  <Button
                    variant="neon"
                    onClick={handleSaveResults}
                    isLoading={biometricLoading}
                  >
                    <Save size={20} />
                    Guardar a Perfil
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};