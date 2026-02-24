import { supabase } from './supabase';

export interface BotMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Lógica de respaldo (Local) cuando la API de Google esté saturada
const getLocalFallback = async (query: string, userData?: any) => {
  const { data: products } = await supabase.from('products').select('name, price, category').limit(2);
  const body = userData?.body_shape || 'tu figura';
  
  return `¡Hola! Mi cerebro de IA está analizando miles de tendencias ahora mismo, pero para adelantarte algo: basándome en tu perfil de ${body}, te recomendaría echar un vistazo a ${products?.[0]?.name || 'nuestras nuevas llegadas'}. ¿Te gustaría que te cuente más sobre cómo combinarlo?`;
};

const getSystemContext = async (userData?: any) => {
  const { data: products } = await supabase
    .from('products')
    .select('name, price, category, description, sustainable_rating')
    .limit(10);

  const productsJson = JSON.stringify(products);
  const userJson = userData ? JSON.stringify(userData) : 'Sin datos biométricos.';

  return `Eres el "AuraFit Style Assistant". 
Catálogo: ${productsJson}
Usuario: ${userJson}
Instrucciones: Responde en español, recomienda 2 productos reales y sé breve.`;
};

export const askStoreAssistant = async (messages: BotMessage[], userData?: any): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  if (!apiKey) return "Error: API Key no configurada.";

  const latestUserMessage = messages[messages.length - 1].content;

  try {
    const systemContext = await getSystemContext(userData);

    const response = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemContext}\n\nPregunta: ${latestUserMessage}` }]
        }]
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        // SI GOOGLE ESTÁ OCUPADO, USAMOS LA LÓGICA LOCAL PARA QUE NO SE NOTE
        return await getLocalFallback(latestUserMessage, userData);
      }
      throw new Error('API Error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Qué buen gusto! AuraFit tiene opciones increíbles para eso.";
  } catch (error) {
    console.error('Fallback activo:', error);
    return await getLocalFallback(latestUserMessage, userData);
  }
};
