import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, Download, Save } from 'lucide-react';
import Webcam from 'react-webcam';
import { Button, PageTransition, LoadingSpinner, Card } from '../components';
import { useBiometricStore } from '../store/biometricStore';
import { useAuthStore } from '../store/authStore';

type ScanPhase = 'idle' | 'camera' | 'processing' | 'results';

const ScanningOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal Scanning Line */}
      <motion.div
        className="absolute w-full h-1 bg-neon-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.8)] z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Grid Mesh Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Target Corners */}
      <div className="absolute inset-10 border-2 border-neon-blue/20 rounded-3xl">
        {[0, 90, 180, 270].map((rotation) => (
          <div
            key={rotation}
            className="absolute w-8 h-8 border-t-4 border-l-4 border-neon-blue"
            style={{
              transform: `rotate(${rotation}deg)`,
              top: rotation === 0 || rotation === 270 ? -2 : 'auto',
              bottom: rotation === 90 || rotation === 180 ? -2 : 'auto',
              left: rotation === 0 || rotation === 90 ? -2 : 'auto',
              right: rotation === 180 || rotation === 270 ? -2 : 'auto',
            }}
          />
        ))}
      </div>

      {/* Measurement Points (Simulated Detection) */}
      {[
        { top: '25%', left: '50%', label: 'CHEST' },
        { top: '45%', left: '50%', label: 'WAIST' },
        { top: '65%', left: '50%', label: 'HIPS' },
        { top: '15%', left: '35%', label: 'L-SHOULDER' },
        { top: '15%', left: '65%', label: 'R-SHOULDER' },
      ].map((point, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: point.top, left: point.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5] }}
          transition={{ delay: i * 0.5, duration: 2, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-neon-blue rounded-full shadow-[0_0_10px_#00F0FF] -translate-x-1/2 -translate-y-1/2" />
          <motion.div 
            className="absolute top-4 left-4 whitespace-nowrap text-[10px] font-mono text-neon-blue font-bold tracking-widest bg-black/40 px-1 rounded"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {point.label} :: DETECTED
          </motion.div>
        </motion.div>
      ))}

      {/* Digital Telemetry (Corners) */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-neon-blue/60 leading-tight">
        SCAN_MODE: BIOMETRIC_3D<br />
        SYNC: ACTIVE<br />
        RES: 8K_DYNAMIC
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-neon-blue/60 text-right">
        LAT: 12.456<br />
        LNG: 89.123<br />
        FRAME: {Math.floor(Math.random() * 1000)}
      </div>
    </div>
  );
};

const ANALYSIS_STEPS = [
  "Iniciando escaneo biométrico...",
  "Mapeando estructura corporal...",
  "Analizando subtonos de piel...",
  "Detectando puntos de articulación...",
  "Calculando proporciones ideales...",
  "Consultando motor de estilo IA...",
  "Finalizando perfil de usuario..."
];

export const ScanStudio: React.FC = () => {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const { generateRandomScan, saveBiometric, loading: biometricLoading } = useBiometricStore();
  const { user } = useAuthStore();
  const [currentScan, setCurrentScan] = useState<any>(null);

  useEffect(() => {
    if (phase === 'processing') {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 500);
      return () => clearInterval(stepInterval);
    }
  }, [phase]);

  const handleCameraRequest = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as any });
      setCameraPermission(permission.state === 'granted');
      if (permission.state === 'granted') {
        setPhase('camera');
      } else {
        // Just trigger the browser dialog
        setPhase('camera');
      }
    } catch {
      setPhase('camera');
    }
  };

  const handleCapture = async () => {
    setPhase('processing');
    setProgress(0);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    await new Promise((resolve) => setTimeout(resolve, 4000));
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <Card variant="solid" className="overflow-hidden border-2 border-neon-blue/30 shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-black">
                  <div className="relative aspect-video">
                    <Webcam
                      ref={webcamRef}
                      className="w-full h-full object-cover"
                      mirrored
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: 'user' }}
                    />

                    {/* NEW PREMIUM OVERLAY */}
                    <ScanningOverlay />

                    <motion.div
                      className="absolute inset-0 border-2 border-neon-blue rounded-3xl pointer-events-none"
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </Card>

                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="secondary" 
                    onClick={handleNewScan}
                    className="backdrop-blur-md bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="neon" 
                    onClick={handleCapture}
                    className="shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] animate-pulse"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Capturar y Analizar
                    </motion.span>
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <Card variant="glass" className="p-12 text-center space-y-8 border-neon-blue/20 bg-black/40 backdrop-blur-2xl">
                  <div className="relative flex justify-center py-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute"
                    >
                      <LoadingSpinner size="lg" variant="neon" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 bg-neon-blue rounded-full blur-3xl"
                    />
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.h2 
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-2xl font-bold text-neon-blue font-mono tracking-tighter"
                      >
                        {ANALYSIS_STEPS[currentStep]}
                      </motion.h2>
                    </AnimatePresence>
                    
                    <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Procesando Biometría 3D</p>

                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden border border-white/10 mt-6">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-blue to-purple-500 shadow-[0_0_10px_#00F0FF]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-neon-blue/60 font-mono mt-2">{Math.round(progress)}% COMPLETE</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {phase === 'results' && currentScan && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* MAIN BIO CARD */}
                  <Card variant="solid" className="lg:col-span-2 p-8 space-y-8 bg-white shadow-2xl border-t-4 border-neon-blue">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black text-sage tracking-tight mb-2 uppercase italic">Profile Analysis</h2>
                        <p className="text-gray-500 font-medium">Escaneo completado exitosamente</p>
                      </div>
                      <div className="px-3 py-1 bg-neon-blue/10 rounded-full border border-neon-blue/30">
                        <span className="text-xs font-bold text-neon-blue tracking-widest uppercase">AI Verified</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 bg-sage/5 rounded-2xl border border-sage/10 group hover:bg-sage/10 transition-colors">
                        <p className="text-[10px] font-bold text-sage/60 uppercase tracking-widest mb-3">Body Shape</p>
                        <p className="text-xl font-black text-sage group-hover:scale-105 transition-transform origin-left">{bodyShapeLabels[currentScan.bodyShape]}</p>
                      </div>
                      <div className="p-6 bg-sage/5 rounded-2xl border border-sage/10 group hover:bg-sage/10 transition-colors">
                        <p className="text-[10px] font-bold text-sage/60 uppercase tracking-widest mb-3">Skin Tone</p>
                        <p className="text-xl font-black text-sage group-hover:scale-105 transition-transform origin-left">{skinToneLabels[currentScan.skinTone]}</p>
                      </div>
                      <div className="p-6 bg-sage/5 rounded-2xl border border-sage/10 group hover:bg-sage/10 transition-colors">
                        <p className="text-[10px] font-bold text-sage/60 uppercase tracking-widest mb-3">Suggested Size</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-neon-blue">{currentScan.suggestedSize}</span>
                          <span className="text-[10px] text-gray-400 font-mono">ADULT_STD</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-sm font-black text-sage uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-4 h-[2px] bg-neon-blue" />
                        Ideal Color Palette
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {currentScan.colorPalette.map((color: any, i: number) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="group"
                          >
                            <div
                              className="w-full aspect-square rounded-2xl shadow-xl mb-3 border-4 border-white transition-all group-hover:shadow-neon-blue/20"
                              style={{ backgroundColor: color.hex }}
                            />
                            <p className="text-[10px] font-black text-sage uppercase tracking-tighter truncate">{color.name}</p>
                            <p className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">{color.hex}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* SIDEBAR RECS */}
                  <div className="space-y-6">
                    <Card variant="glass" className="p-8 border-sage/20 bg-sage text-white h-full">
                      <h3 className="text-xl font-black mb-6 italic uppercase tracking-tighter">Style AI Insights</h3>
                      <ul className="space-y-6">
                        {currentScan.styleRecommendations.map((rec: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-start gap-4"
                          >
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-black">
                              {i + 1}
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-sand/90 italic tracking-tight">
                              {rec}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                      
                      <div className="mt-12 p-4 bg-white/10 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">Confidence Score</p>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black">98</span>
                          <span className="text-xl font-bold opacity-60 mb-1">%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button variant="secondary" onClick={handleNewScan} className="px-8">
                    Nuevo Escaneo
                  </Button>
                  <Button
                    variant="neon"
                    onClick={handleSaveResults}
                    isLoading={biometricLoading}
                    className="px-12 shadow-[0_20px_40px_rgba(0,240,255,0.3)]"
                  >
                    <Save size={20} className="mr-2" />
                    Guardar Perfil de Estilo
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