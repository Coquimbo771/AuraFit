import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, SendHorizonal, Sparkles, Shirt } from 'lucide-react';
import { Button, Card, PageTransition, PredictiveInput, Footer } from '../components';
import { askStoreAssistant, type BotMessage } from '../lib/bot';
import { useBiometricStore } from '../store/biometricStore';

const starterPrompts = [
  '¿Qué colores me quedan mejor?',
  'Recomiéndame algo para la oficina',
  'Busco outfit para el gym',
  '¿Cómo resaltar mi figura?',
];

export const StoreAssistant: React.FC = () => {
  const { currentScan } = useBiometricStore();
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu asesor de estilo personal de AuraFit. ¿Buscas algo específico o quieres consejos según tu perfil de escaneo?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const predictivePrompts = [
    ...starterPrompts,
    'Outfit para una fiesta de noche',
    'Colores para piel cálida',
    'Prendas para cuerpo reloj de arena',
    'Ropa sostenible recomendada',
    '¿Qué talle soy en marcas de deporte?',
  ].map((prompt, index) => ({
    id: `bot-prompt-${index}`,
    label: prompt,
    hint: 'Asistente de estilo',
  }));

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const nextMessages: BotMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await askStoreAssistant(nextMessages, currentScan);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Hubo un problema al conectar con el asistente. Intenta de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-sand-50 via-sand to-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <Card variant="solid" className="p-7 space-y-6 h-fit">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50 flex items-center gap-2">
                <Sparkles size={14} className="text-ember" />
                AuraFit AI
              </p>
              <h1 className="text-4xl font-bold text-ink">Asistente de Estilo</h1>
              <p className="text-ink/70 mt-2">
                Tu experto personal en moda, colorimetría y ajuste. Pregúntame lo que sea sobre tu próximo outfit.
              </p>
            </div>

            <div className="space-y-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-ink/5 hover:bg-ink/10 text-ink/80 font-medium flex items-center justify-between group transition-colors"
                >
                  {prompt}
                  <Shirt size={16} className="text-ink/30 group-hover:text-ember transition-colors" />
                </button>
              ))}
            </div>

            {currentScan ? (
              <div className="rounded-2xl border border-ember/20 bg-ember/5 p-4 text-sm text-ink/70 flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-ember shadow-sm">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="font-bold text-ink mb-1">Perfil activo detectado</p>
                  <p>Tengo tus datos de cuerpo **{currentScan.body_shape}** y tono **{currentScan.skin_tone}**. Mis consejos serán personalizados.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-white/80 p-4 text-sm text-ink/70">
                Tip: Haz un escaneo en el **Scan Studio** para que pueda darte recomendaciones precisas para tu figura.
              </div>
            )}
          </Card>

          <Card variant="glass" className="p-6 flex flex-col h-[72vh] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-ink/10 pb-4 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-ink text-sand-50 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-semibold text-ink">Style Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-ink/50">En línea y listo para asesorarte</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-auto bg-ink text-sand-50 shadow-lg'
                      : 'bg-white border border-ink/10 text-ink/80 shadow-sm'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 text-xs text-ink/40 mb-1 font-bold">
                      AURAFIT AI
                    </div>
                  )}
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
                      {line}
                    </p>
                  ))}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 p-4"
                >
                  <div className="w-2 h-2 rounded-full bg-ink/20 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-ink/20 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-ink/20 animate-bounce [animation-delay:0.4s]" />
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <PredictiveInput
                value={input}
                onChange={setInput}
                onSubmit={() => handleSend()}
                onPickSuggestion={(suggestion) => setInput(suggestion.label)}
                suggestions={predictivePrompts}
                placeholder="Pregúntame sobre outfits o colores..."
                className="flex-1"
                inputClassName="w-full px-4 py-3 rounded-2xl border border-ink/15 bg-white focus:outline-none focus:border-ember shadow-inner"
              />
              <Button variant="primary" onClick={() => handleSend()} isLoading={loading} className="rounded-2xl shadow-lg">
                <SendHorizonal size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};
