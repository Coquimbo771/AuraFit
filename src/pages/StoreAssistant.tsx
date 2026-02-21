import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, SendHorizonal, Sparkles } from 'lucide-react';
import { Button, Card, PageTransition, PredictiveInput, Footer } from '../components';
import { askStoreAssistant, type BotMessage } from '../lib/bot';

const starterPrompts = [
  '¿Cómo aumento conversion en mi tienda?',
  '¿Qué promociones me recomiendas esta semana?',
  '¿Cómo reducir devoluciones por talla?',
  'Dame ideas de bundles para vender más.',
];

export const StoreAssistant: React.FC = () => {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu bot comercial. Te ayudo a vender más, mejorar tallaje y optimizar tu tienda virtual.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const predictivePrompts = [
    ...starterPrompts,
    'Escribe copy para producto premium de gym',
    'Crea campaña para clientes nuevos',
    'Que KPIs debo revisar esta semana',
    'Como subo ticket promedio',
    'Dame idea de cross-sell para vestidos',
  ].map((prompt, index) => ({
    id: `bot-prompt-${index}`,
    label: prompt,
    hint: 'Prediccion de prompt',
  }));

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const nextMessages: BotMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await askStoreAssistant(nextMessages);
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
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Asistente IA</p>
              <h1 className="text-4xl font-bold text-ink">Bot para tu tienda</h1>
              <p className="text-ink/70 mt-2">
                Te ayuda con ventas, promociones, devoluciones, copy de producto y estrategia comercial.
              </p>
            </div>

            <div className="space-y-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-ink/5 hover:bg-ink/10 text-ink/80 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white/80 p-4 text-sm text-ink/70">
              Si defines VITE_CHATBOT_API_URL, el bot usara tu API real. Si no, funciona en modo inteligente local.
            </div>
          </Card>

          <Card variant="glass" className="p-6 flex flex-col h-[72vh]">
            <div className="flex items-center gap-3 border-b border-ink/10 pb-4 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-ember/20 text-ember flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-semibold text-ink">AuraFit Commerce Bot</p>
                <p className="text-xs text-ink/50">Asistente de negocio</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'ml-auto bg-ink text-sand-50'
                      : 'bg-white border border-ink/10 text-ink/80'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 text-xs text-ink/50 mb-1">
                      <Sparkles size={12} />
                      AuraBot
                    </div>
                  )}
                  {message.content}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <PredictiveInput
                value={input}
                onChange={setInput}
                onSubmit={() => handleSend()}
                onPickSuggestion={(suggestion) => setInput(suggestion.label)}
                suggestions={predictivePrompts}
                placeholder="Escribe tu pregunta de negocio..."
                className="flex-1"
                inputClassName="w-full px-4 py-3 rounded-2xl border border-ink/15 bg-white focus:outline-none focus:border-ember"
              />
              <Button variant="primary" onClick={() => handleSend()} isLoading={loading}>
                <SendHorizonal size={18} />
                Enviar
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};
