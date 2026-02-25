/**
 * Image Analysis Library – Groq Vision AI
 * Sends the captured image to Groq Vision and parses the structured response.
 * The AnalysisResult interface is identical to before so ScanStudio.tsx and
 * biometricStore.ts require zero changes.
 */

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface ColorInfo {
  name: string;
  hex: string;
  rgb: RGBColor;
}

export interface AnalysisResult {
  bodyShape: 'hourglass' | 'rectangle' | 'pear' | 'triangle' | 'inverted_triangle' | 'athletic';
  skinTone: 'cool' | 'warm' | 'neutral';
  suggestedSize: string;
  colorPalette: ColorInfo[];
  styleRecommendations: string[];
  dominantColors: ColorInfo[];
  skinToneRGB: RGBColor;
  confidence: number;
}

// ─── Valores por defecto si Groq falla ───────────────────────────────────────
const FALLBACK_RESULT: AnalysisResult = {
  bodyShape: 'rectangle',
  skinTone: 'neutral',
  suggestedSize: 'M',
  colorPalette: [
    { name: 'Crema', hex: '#F5F5DC', rgb: { r: 245, g: 245, b: 220 } },
    { name: 'Carbón', hex: '#36454F', rgb: { r: 54, g: 69, b: 79 } },
    { name: 'Verde salvia', hex: '#9FB89F', rgb: { r: 159, g: 183, b: 137 } },
    { name: 'Rosa palo', hex: '#C9A0A0', rgb: { r: 201, g: 160, b: 160 } },
    { name: 'Azul pizarra', hex: '#6A5ACD', rgb: { r: 106, g: 90, b: 205 } },
  ],
  styleRecommendations: [
    'Usa cinturones para crear definición en la cintura.',
    'Los colores tierra y neutros complementan tu perfil neutral.',
    'Experimenta con texturas para añadir vida a tus outfits.',
    'Capas y prendas superpuestas te quedan muy bien.',
  ],
  dominantColors: [
    { name: 'Neutro', hex: '#888888', rgb: { r: 136, g: 136, b: 136 } },
  ],
  skinToneRGB: { r: 180, g: 150, b: 130 },
  confidence: 60,
};

// ─── Convierte hex string a RGB ───────────────────────────────────────────────
function hexToRgb(hex: string): RGBColor {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// ─── Parsea el JSON que devuelve Groq Vision ──────────────────────────────────
function parseGroqResponse(raw: string): AnalysisResult {
  // Groq a veces envuelve el JSON en bloques de código markdown
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : raw;
  const parsed = JSON.parse(jsonStr.trim());

  // Normalizar colorPalette: asegurar que cada elemento tenga rgb
  const normalizePalette = (arr: any[]): ColorInfo[] =>
    (arr ?? []).slice(0, 5).map((c: any) => ({
      name: c.name ?? 'Color',
      hex: c.hex ?? '#888888',
      rgb: c.rgb ?? hexToRgb(c.hex ?? '#888888'),
    }));

  return {
    bodyShape: parsed.bodyShape ?? 'rectangle',
    skinTone: parsed.skinTone ?? 'neutral',
    suggestedSize: parsed.suggestedSize ?? 'M',
    colorPalette: normalizePalette(parsed.colorPalette ?? []),
    styleRecommendations: (parsed.styleRecommendations ?? []).slice(0, 4),
    dominantColors: normalizePalette(parsed.dominantColors ?? []),
    skinToneRGB: parsed.skinToneRGB ?? hexToRgb('#B49680'),
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 80,
  };
}

// ─── Llamada a Groq Vision ────────────────────────────────────────────────────
async function callGroqVision(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY no configurada.');

  const prompt = `Eres un experto en moda y colorimetría. Analiza la imagen de esta persona y devuelve SOLO un objeto JSON válido (sin texto adicional, sin bloques markdown) con la siguiente estructura exacta:

{
  "bodyShape": "hourglass" | "rectangle" | "pear" | "triangle" | "inverted_triangle" | "athletic",
  "skinTone": "cool" | "warm" | "neutral",
  "suggestedSize": "XS" | "S" | "M" | "L" | "XL",
  "colorPalette": [
    { "name": "Nombre del color en español", "hex": "#RRGGBB" }
  ],
  "styleRecommendations": [
    "Consejo de estilo personalizado en español"
  ],
  "dominantColors": [
    { "name": "Nombre del color predominante en la foto", "hex": "#RRGGBB" }
  ],
  "skinToneRGB": { "r": 0, "g": 0, "b": 0 },
  "confidence": 85
}

Reglas:
- colorPalette: exactamente 5 colores que le favorecen según su tono de piel y figura
- styleRecommendations: exactamente 4 consejos prácticos en español
- dominantColors: hasta 5 colores predominantes detectados en la foto
- skinToneRGB: valores RGB promedio de la piel detectada
- confidence: porcentaje de confianza del análisis (70-95)
- Todos los nombres de colores deben estar en español`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // baja temperatura para respuestas más consistentes
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq Vision error [${response.status}]: ${err}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content ?? '';
  return parseGroqResponse(rawText);
}

// ─── Convierte data URL a base64 puro + mimeType ──────────────────────────────
function dataUrlToBase64(dataUrl: string): { base64: string; mimeType: string } {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
  return { base64, mimeType };
}

// ─── Función principal exportada (misma firma que antes) ──────────────────────
export async function analyzeImage(imageDataUrl: string): Promise<AnalysisResult> {
  try {
    const { base64, mimeType } = dataUrlToBase64(imageDataUrl);
    const result = await callGroqVision(base64, mimeType);
    return result;
  } catch (error) {
    console.error('[AuraFit Scan] Error en análisis con IA, usando fallback:', error);
    return FALLBACK_RESULT;
  }
}

// ─── Validación de calidad (sin cambios) ─────────────────────────────────────
export function validateImageQuality(imageDataUrl: string): Promise<{ valid: boolean; reason?: string }> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      if (img.width < 200 || img.height < 200) {
        resolve({ valid: false, reason: 'Resolución muy baja. Usa una imagen más grande.' });
        return;
      }
      resolve({ valid: true });
    };

    img.onerror = () => {
      resolve({ valid: false, reason: 'Formato de imagen no válido.' });
    };

    img.src = imageDataUrl;
  });
}
