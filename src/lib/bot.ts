import type { Biometric } from '../types';

export interface BotMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Traducciones legibles para el prompt ─────────────────────────────────────
const BODY_SHAPE_LABELS: Record<string, string> = {
  hourglass: 'reloj de arena (caderas y hombros equilibrados, cintura definida)',
  rectangle: 'rectangular (hombros, cintura y caderas similares)',
  pear: 'pera (caderas más anchas que los hombros)',
  triangle: 'triángulo (caderas más anchas que hombros)',
  inverted_triangle: 'triángulo invertido (hombros más anchos que caderas)',
  athletic: 'atlético (musculoso, cintura poco marcada)',
};

const SKIN_TONE_LABELS: Record<string, string> = {
  cool: 'fría (rosada, azulada o beige rosada; le quedan los colores joya, azules, morados y blancos puros)',
  warm: 'cálida (amarilla, dorada o bronceada; le quedan los tierras, naranjas, verdes olivo y mostaza)',
  neutral: 'neutral (combina bien tanto con colores cálidos como fríos)',
};

// Mapa de hex → nombre legible (cubre todas las paletas de los presets de escaneo)
const HEX_TO_NAME: Record<string, string> = {
  '#D4A574': 'dorado cálido',
  '#D97634': 'terracota',
  '#8B3A62': 'borgoña',
  '#C85A17': 'naranja intenso',
  '#A89E8F': 'taupe cálido',
  '#B0E0E6': 'azul hielo',
  '#C0C0C0': 'plateado',
  '#9B59B6': 'morado joya',
  '#008B8B': 'verde azulado profundo',
  '#778899': 'gris pizarra',
  '#36454F': 'carbón oscuro',
  '#F5F5DC': 'crema',
  '#808000': 'verde olivo',
  '#C19A6B': 'camello',
  '#000000': 'negro',
};

/** Convierte un array de hex codes a nombres legibles */
const translatePalette = (palette: string[]): string =>
  palette
    .map((hex) => HEX_TO_NAME[hex.toUpperCase()] ?? HEX_TO_NAME[hex] ?? hex)
    .join(', ');

// ─── Construye el contexto del sistema con los datos del escaneo del usuario ──
const buildSystemContext = (scan: Biometric | null): string => {
  const base = `Eres "AuraFit Style Assistant", un asesor personal de moda y estilo.
Tu misión es dar consejos prácticos y personalizados sobre outfits, colores, siluetas y combinaciones.
Responde siempre en español, de forma concisa, amigable y directa. No listes más de 4 puntos a la vez.
IMPORTANTE: Nunca menciones códigos hexadecimales (como #D4A574). Usa siempre el nombre del color en español.`;

  if (!scan) {
    return `${base}
    
El usuario aún no tiene un escaneo biométrico registrado. Puedes darle consejos generales de moda.`;
  }

  const bodyLabel = scan.body_shape ? BODY_SHAPE_LABELS[scan.body_shape] ?? scan.body_shape : 'no especificada';
  const skinLabel = scan.skin_tone ? SKIN_TONE_LABELS[scan.skin_tone] ?? scan.skin_tone : 'no especificada';

  const measurementsText = scan.measurements
    ? [
      scan.measurements.shoulder ? `• Hombros: ${scan.measurements.shoulder} cm` : null,
      scan.measurements.waist ? `• Cintura: ${scan.measurements.waist} cm` : null,
      scan.measurements.hip ? `• Caderas: ${scan.measurements.hip} cm` : null,
    ]
      .filter(Boolean)
      .join('\n')
    : 'No registradas';

  const colorsText = scan.color_palette?.length
    ? translatePalette(scan.color_palette)
    : 'No registrada';

  return `${base}

PERFIL BIOMÉTRICO DEL USUARIO:
- Figura: ${bodyLabel}
- Tono de piel: ${skinLabel}
- Estatura: ${scan.height ? `${scan.height} cm` : 'No registrada'}
- Medidas:
${measurementsText}
- Paleta de colores recomendada: ${colorsText}

Usa este perfil para personalizar CADA respuesta con consejos específicos para esta figura y tono de piel.`;
};

// ─── Fallback cuando la API no está disponible ────────────────────────────────
const getLocalFallback = (): string =>
  'Estoy con alta demanda ahora mismo 🌟 Por favor, intenta de nuevo en unos segundos.';

// ─── Llamada a Groq API ───────────────────────────────────────────────────────
const callGroq = async (
  systemContext: string,
  userMessage: string,
  apiKey: string
): Promise<string> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 450,
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`[${response.status}] ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
};

// ─── Función principal exportada ──────────────────────────────────────────────
export const askStoreAssistant = async (
  messages: BotMessage[],
  scan: Biometric | null = null
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  if (!apiKey) return 'Error: GROQ API Key no configurada.';

  const latestUserMessage = messages[messages.length - 1].content;

  try {
    const systemContext = buildSystemContext(scan); // síncrono, sin query a Supabase
    const reply = await callGroq(systemContext, latestUserMessage, apiKey);
    return reply || getLocalFallback();
  } catch (error: any) {
    console.error('[AuraFit Bot] Error:', error?.message ?? error);
    return getLocalFallback();
  }
};
