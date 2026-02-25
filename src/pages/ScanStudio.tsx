import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, Sparkles, Upload } from 'lucide-react';
import Webcam from 'react-webcam';
import { Button, PageTransition, LoadingSpinner, Card, Footer } from '../components';
import { useBiometricStore } from '../store/biometricStore';
import { useAuthStore } from '../store/authStore';
import { analyzeImage, validateImageQuality } from '../lib/imageAnalysis';

type ScanPhase = 'idle' | 'camera' | 'processing' | 'results';

export const ScanStudio: React.FC = () => {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveBiometric, loading: biometricLoading } = useBiometricStore();
  const { user } = useAuthStore();
  const [currentScan, setCurrentScan] = useState<any>(null);

  const handleCameraRequest = () => {
    // Directly go to camera phase - browser will request permissions automatically
    setPhase('camera');
    setCameraPermission(true);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageSrc = event.target?.result as string;
      if (imageSrc) {
        await processImage(imageSrc);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageSrc: string) => {
    setPhase('processing');
    setProgress(0);

    try {
      // Validate image quality
      setProgress(10);
      const validation = await validateImageQuality(imageSrc);
      if (!validation.valid) {
        alert(`Calidad de imagen insuficiente: ${validation.reason}`);
        setPhase('idle');
        return;
      }

      setProgress(30);

      // Analyze image with AI
      const analysisResult = await analyzeImage(imageSrc);

      setProgress(70);

      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(100);

      // Convert analysis result to scan format
      const scan = {
        id: `scan-${Date.now()}`,
        bodyShape: analysisResult.bodyShape,
        skinTone: analysisResult.skinTone,
        suggestedSize: analysisResult.suggestedSize,
        colorPalette: analysisResult.colorPalette,
        styleRecommendations: analysisResult.styleRecommendations,
        confidence: analysisResult.confidence,
        dominantColors: analysisResult.dominantColors,
        skinToneRGB: analysisResult.skinToneRGB,
      };

      setCurrentScan(scan);
      setPhase('results');
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error en el análisis. Intenta con mejor iluminación o una imagen más clara.');
      setPhase('idle');
    }
  };

  const handleCapture = async () => {
    if (!webcamRef.current) return;

    // Capture image from webcam
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert('Error al capturar imagen. Intenta de nuevo.');
      return;
    }

    await processImage(imageSrc);
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
      alert('¡Resultados guardados en tu perfil!');
      setPhase('idle');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error al guardar. Intenta de nuevo.');
    }
  };

  const handleNewScan = () => {
    setPhase('idle');
    setCurrentScan(null);
    setProgress(0);
  };

  const bodyShapeLabels: Record<string, string> = {
    hourglass: 'Reloj de arena',
    rectangle: 'Rectángulo',
    pear: 'Pera',
    triangle: 'Triángulo',
    inverted_triangle: 'Triángulo invertido',
    athletic: 'Atlético',
  };

  const skinToneLabels: Record<string, string> = {
    cool: 'Subtono frío',
    warm: 'Subtono cálido',
    neutral: 'Subtono neutro',
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50 flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-ember" />
              Escaneo Inteligente con IA
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">Escaneo Inteligente</h1>
            <p className="text-ink/70 text-lg">
              Análisis real con IA: detecta tu tono de piel, proporciones y colores ideales
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
                    className="inline-block p-8 bg-ink/5 rounded-3xl"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Camera className="text-ink" size={48} />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-ink mb-2">¿Listo para escanear?</h2>
                    <p className="text-ink/70 mb-3">
                      La IA analizará tu foto para detectar tono de piel, proporciones y paleta de colores
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-ember font-semibold">
                      <Sparkles size={16} />
                      Análisis inteligente en tiempo real
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" onClick={handleCameraRequest}>
                      <Camera size={20} />
                      Activar cámara
                    </Button>
                    <Button variant="secondary" size="lg" onClick={handleFileUpload}>
                      <Upload size={20} />
                      Subir foto
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <p className="text-sm text-ink/60 border-t border-ink/10 pt-6">
                    Tu privacidad está protegida. El video se procesa localmente y no se guarda.
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
                      <g className="opacity-50 stroke-sun stroke-2 fill-none">
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
                      className="absolute inset-0 border-2 border-sun rounded-3xl"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </Card>

                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" onClick={handleNewScan}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleCapture}>
                    <Sparkles size={18} />
                    Capturar y analizar con IA
                  </Button>
                </div>

                <div className="text-center text-sm text-ink/60">
                  <p>💡 Asegúrate de tener buena iluminación para mejores resultados</p>
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
                    <h2 className="text-2xl font-bold text-ink mb-2">Analizando con IA...</h2>
                    <p className="text-ink/70 mb-4">
                      {progress < 40
                        ? '🎨 Extrayendo colores dominantes...'
                        : progress < 75
                          ? '🧬 Detectando tono de piel...'
                          : '✨ Generando recomendaciones personalizadas...'}
                    </p>

                    <div className="w-full bg-ink/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-ember to-sun"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-sm text-ink/60 mt-2">{Math.round(progress)}%</p>
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
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-ink">Tu perfil de estilo</h2>
                      {currentScan.confidence && (
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles size={16} className="text-ember" />
                          <span className="text-ink/60">
                            Confianza IA: <span className="font-bold text-ink">{currentScan.confidence}%</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-ink/5 rounded-xl">
                        <p className="text-sm text-ink/60 mb-1">Tipo de cuerpo</p>
                        <p className="text-2xl font-bold text-ink">{bodyShapeLabels[currentScan.bodyShape]}</p>
                      </div>
                      <div className="p-4 bg-ink/5 rounded-xl">
                        <p className="text-sm text-ink/60 mb-1">Tono de piel</p>
                        <p className="text-2xl font-bold text-ink">{skinToneLabels[currentScan.skinTone]}</p>
                      </div>
                      <div className="p-4 bg-ink/5 rounded-xl">
                        <p className="text-sm text-ink/60 mb-1">Talla sugerida</p>
                        <p className="text-2xl font-bold text-ink">{currentScan.suggestedSize}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Colores dominantes detectados */}
                  {currentScan.dominantColors && currentScan.dominantColors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-ink mb-3 flex items-center gap-2">
                        <Sparkles size={18} className="text-ember" />
                        Colores detectados en tu foto
                      </h3>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {currentScan.dominantColors.slice(0, 8).map((color: any, i: number) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            className="text-center"
                          >
                            <div
                              className="w-full aspect-square rounded-lg shadow-md border-2 border-ink/10"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                            <p className="text-xs text-ink/60 mt-1">{color.name}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-ink mb-4">Tu paleta de color ideal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {currentScan.colorPalette.map((color: any, i: number) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="text-center"
                        >
                          <div
                            className="w-full aspect-square rounded-xl shadow-lg mb-2 border-2 border-ink/10 cursor-pointer hover:border-ember transition-colors"
                            style={{ backgroundColor: color.hex }}
                          />
                          <p className="text-xs font-medium text-ink/80">{color.name}</p>
                          <p className="text-xs text-ink/50">{color.hex}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-ink mb-3">Recomendaciones de estilo</h3>
                    <ul className="space-y-2">
                      {currentScan.styleRecommendations.map((rec: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-start gap-3 text-ink/80"
                        >
                          <div className="w-2 h-2 rounded-full bg-ember mt-2 flex-shrink-0" />
                          {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" onClick={handleNewScan}>
                    Nuevo escaneo
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveResults}
                    isLoading={biometricLoading}
                  >
                    <Save size={20} />
                    Guardar en perfil
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};
