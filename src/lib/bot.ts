export interface BotMessage {
  role: 'user' | 'assistant';
  content: string;
}

const fallbackReply = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes('talla')) {
    return 'Para sugerirte talla exacta, dime tu altura, tipo de cuerpo y marca que quieres comprar. Si ya hiciste escaneo en AuraFit, prioriza productos con match mayor a 85%.';
  }

  if (normalized.includes('envio') || normalized.includes('delivery')) {
    return 'Los tiempos estimados de envio dependen del destino. Como base: nacional 2-5 dias habiles e internacional 7-12 dias habiles.';
  }

  if (normalized.includes('devol')) {
    return 'Puedes habilitar devoluciones de 30 dias en la configuracion de tienda. Recomendacion: devolucion gratis en primera compra para subir conversion.';
  }

  if (normalized.includes('promoc') || normalized.includes('cupon')) {
    return 'Te recomiendo un cupon de bienvenida del 10% y otro de carrito abandonado del 12% con expiracion de 24h para mejorar conversion.';
  }

  return 'Puedo ayudarte con tallas, recomendaciones de outfit, politicas de envio/devolucion y estrategias para vender mas en tu tienda. ¿Que quieres optimizar primero?';
};

export const askStoreAssistant = async (messages: BotMessage[]): Promise<string> => {
  const endpoint = import.meta.env.VITE_CHATBOT_API_URL;

  if (!endpoint) {
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    return fallbackReply(latestUserMessage?.content || '');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_CHATBOT_API_KEY
        ? { Authorization: `Bearer ${import.meta.env.VITE_CHATBOT_API_KEY}` }
        : {}),
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener respuesta del asistente.');
  }

  const data = await response.json();
  return data.reply || data.message || fallbackReply('');
};
