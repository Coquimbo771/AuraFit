/**
 * Image Analysis Library - Intelligent Body & Skin Analysis
 * Analyzes captured images to extract biometric and color information
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

interface AnalysisResult {
  bodyShape: 'hourglass' | 'rectangle' | 'pear' | 'triangle' | 'inverted_triangle' | 'athletic';
  skinTone: 'cool' | 'warm' | 'neutral';
  suggestedSize: string;
  colorPalette: ColorInfo[];
  styleRecommendations: string[];
  dominantColors: ColorInfo[];
  skinToneRGB: RGBColor;
  confidence: number;
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert RGB to HSL for color analysis
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Analyze skin tone from center region of image (face area)
 */
function analyzeSkinTone(imageData: ImageData): { skinTone: 'cool' | 'warm' | 'neutral'; rgb: RGBColor } {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Sample center region (face area - 30% width, 20-50% height)
  const centerX = width / 2;
  const centerY = height / 2;
  const sampleWidth = width * 0.3;
  const sampleHeight = height * 0.3;
  
  let totalR = 0, totalG = 0, totalB = 0;
  let sampleCount = 0;
  
  for (let y = Math.floor(centerY - sampleHeight / 2); y < centerY + sampleHeight / 2; y += 4) {
    for (let x = Math.floor(centerX - sampleWidth / 2); x < centerX + sampleWidth / 2; x += 4) {
      if (y >= 0 && y < height && x >= 0 && x < width) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        
        // Filter out extreme values (likely background or clothing)
        const brightness = (r + g + b) / 3;
        if (brightness > 60 && brightness < 230) {
          totalR += r;
          totalG += g;
          totalB += b;
          sampleCount++;
        }
      }
    }
  }
  
  const avgR = totalR / sampleCount;
  const avgG = totalG / sampleCount;
  const avgB = totalB / sampleCount;
  
  // Determine undertone using RGB ratios
  // Cool: more blue, Warm: more yellow/red, Neutral: balanced
  const yellowness = (avgR + avgG) / 2 - avgB;
  const redness = avgR - (avgG + avgB) / 2;
  
  let skinTone: 'cool' | 'warm' | 'neutral';
  
  if (yellowness > 15 || redness > 20) {
    skinTone = 'warm';
  } else if (avgB > (avgR + avgG) / 2 + 10) {
    skinTone = 'cool';
  } else {
    skinTone = 'neutral';
  }
  
  return {
    skinTone,
    rgb: { r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) }
  };
}

/**
 * Extract dominant colors from image using color quantization
 */
function extractDominantColors(imageData: ImageData, count: number = 8): ColorInfo[] {
  const data = imageData.data;
  const pixelCount = data.length / 4;
  
  // Sample every 16th pixel for performance
  const colorMap = new Map<string, number>();
  
  for (let i = 0; i < data.length; i += 64) { // Sample rate: every 16 pixels
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Quantize to reduce color space (round to nearest 16)
    const qR = Math.round(r / 16) * 16;
    const qG = Math.round(g / 16) * 16;
    const qB = Math.round(b / 16) * 16;
    
    const key = `${qR},${qG},${qB}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  // Sort by frequency and take top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count * 2) // Get more than needed for filtering
    .map(([rgb]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return { r, g, b };
    });
  
  // Filter out very dark, very bright, and gray colors
  const filteredColors = sortedColors.filter(color => {
    const brightness = (color.r + color.g + color.b) / 3;
    const saturation = Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b);
    return brightness > 40 && brightness < 220 && saturation > 20;
  });
  
  // Take final set
  const finalColors = filteredColors.slice(0, count);
  
  return finalColors.map((color, index) => ({
    name: getColorName(color),
    hex: rgbToHex(color.r, color.g, color.b),
    rgb: color
  }));
}

/**
 * Generate personalized color palette based on skin tone
 */
function generatePersonalizedPalette(skinTone: 'cool' | 'warm' | 'neutral', skinRGB: RGBColor): ColorInfo[] {
  const palettes = {
    cool: [
      { name: 'Icy Blue', r: 176, g: 224, b: 230 },
      { name: 'Lavender', r: 181, g: 126, b: 220 },
      { name: 'Deep Teal', r: 0, g: 139, b: 139 },
      { name: 'Silver Gray', r: 192, g: 192, b: 192 },
      { name: 'Royal Purple', r: 120, g: 81, b: 169 },
    ],
    warm: [
      { name: 'Warm Gold', r: 212, g: 165, b: 116 },
      { name: 'Coral', r: 255, g: 127, b: 80 },
      { name: 'Olive Green', r: 128, g: 128, b: 0 },
      { name: 'Terracotta', r: 204, g: 78, b: 92 },
      { name: 'Mustard', r: 255, g: 219, b: 88 },
    ],
    neutral: [
      { name: 'Charcoal', r: 54, g: 69, b: 79 },
      { name: 'Cream', r: 245, g: 245, b: 220 },
      { name: 'Sage Green', r: 159, g: 183, b: 137 },
      { name: 'Dusty Rose', r: 201, g: 160, b: 160 },
      { name: 'Slate Blue', r: 106, g: 90, b: 205 },
    ],
  };
  
  return palettes[skinTone].map(color => ({
    name: color.name,
    hex: rgbToHex(color.r, color.g, color.b),
    rgb: { r: color.r, g: color.g, b: color.b }
  }));
}

/**
 * Get color name from RGB values
 */
function getColorName(rgb: RGBColor): string {
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Low saturation = grayscale
  if (s < 15) {
    if (l < 20) return 'Black';
    if (l < 40) return 'Charcoal';
    if (l < 60) return 'Gray';
    if (l < 80) return 'Silver';
    return 'White';
  }
  
  // Determine hue name
  if (h < 15 || h >= 345) return l > 50 ? 'Pink' : 'Red';
  if (h < 45) return l > 60 ? 'Peach' : 'Orange';
  if (h < 70) return l > 60 ? 'Cream' : 'Brown';
  if (h < 150) return l > 60 ? 'Lime' : 'Green';
  if (h < 200) return l > 60 ? 'Cyan' : 'Teal';
  if (h < 260) return l > 60 ? 'Sky Blue' : 'Blue';
  if (h < 290) return l > 60 ? 'Lavender' : 'Purple';
  return l > 60 ? 'Pink' : 'Magenta';
}

/**
 * Analyze body proportions from image silhouette
 */
function analyzeBodyShape(imageData: ImageData): 'hourglass' | 'rectangle' | 'pear' | 'triangle' | 'inverted_triangle' | 'athletic' {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Sample three horizontal slices: shoulders, waist, hips
  const shoulderY = Math.floor(height * 0.25);
  const waistY = Math.floor(height * 0.50);
  const hipY = Math.floor(height * 0.70);
  
  const measureWidth = (y: number): number => {
    let leftEdge = width / 2;
    let rightEdge = width / 2;
    
    // Find left edge
    for (let x = Math.floor(width / 2); x > 0; x -= 2) {
      const index = (y * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      if (brightness < 100) {
        leftEdge = x;
        break;
      }
    }
    
    // Find right edge
    for (let x = Math.floor(width / 2); x < width; x += 2) {
      const index = (y * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      if (brightness < 100) {
        rightEdge = x;
        break;
      }
    }
    
    return rightEdge - leftEdge;
  };
  
  const shoulderWidth = measureWidth(shoulderY);
  const waistWidth = measureWidth(waistY);
  const hipWidth = measureWidth(hipY);
  
  // Normalize measurements
  const maxWidth = Math.max(shoulderWidth, waistWidth, hipWidth);
  const shoulder = shoulderWidth / maxWidth;
  const waist = waistWidth / maxWidth;
  const hip = hipWidth / maxWidth;
  
  // Classification logic
  if (waist < 0.75 && shoulder > 0.85 && hip > 0.85) {
    return 'hourglass';
  } else if (shoulder > hip * 1.1) {
    return 'inverted_triangle';
  } else if (hip > shoulder * 1.1) {
    return 'pear';
  } else if (waist > 0.85) {
    return 'rectangle';
  } else if (shoulder > 0.9 && hip > 0.9) {
    return 'athletic';
  }
  
  return 'rectangle'; // Default
}

/**
 * Generate style recommendations based on body shape and skin tone
 */
function generateRecommendations(bodyShape: string, skinTone: string): string[] {
  const recommendations: Record<string, string[]> = {
    hourglass: [
      'Fitted silhouettes that accentuate your curves',
      'Wrap dresses and belted styles to define waist',
      'High-waisted bottoms with tucked-in tops',
      'V-neck and scoop necklines to elongate torso',
    ],
    inverted_triangle: [
      'A-line skirts and wide-leg pants to balance shoulders',
      'Darker colors on top, brighter colors on bottom',
      'Detailed or patterned bottoms to add volume',
      'V-neck tops to soften shoulder line',
    ],
    pear: [
      'Statement tops and structured blazers',
      'A-line and fit-and-flare dresses',
      'Darker bottoms with colorful or detailed tops',
      'Boat neck and off-shoulder styles to widen shoulders',
    ],
    rectangle: [
      'Layering and belts to create definition',
      'Peplum tops and ruffled details for curves',
      'Color blocking to create visual interest',
      'Textured fabrics and patterns for dimension',
    ],
    athletic: [
      'Soft, flowing fabrics to add softness',
      'Details at bust and hip to create curves',
      'Scoop and sweetheart necklines',
      'Asymmetrical cuts and draping for femininity',
    ],
  };
  
  const toneRecs: Record<string, string> = {
    cool: 'Cool jewel tones and metallics suit you best (blues, purples, silvers)',
    warm: 'Warm earth tones enhance your natural glow (golds, corals, olives)',
    neutral: 'You can wear both warm and cool colors - experiment freely!',
  };
  
  const baseRecs = recommendations[bodyShape] || recommendations['rectangle'];
  return [...baseRecs, toneRecs[skinTone]];
}

/**
 * Suggest clothing size based on body proportions
 */
function suggestSize(bodyShape: string): string {
  // This is simplified - real implementation would need actual measurements
  const sizeMap: Record<string, string> = {
    hourglass: 'M',
    inverted_triangle: 'S-M',
    pear: 'M-L',
    rectangle: 'S',
    athletic: 'M',
  };
  
  return sizeMap[bodyShape] || 'M';
}

/**
 * Main analysis function - analyzes captured image
 */
export async function analyzeImage(imageDataUrl: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas to extract image data
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Perform analysis
        const { skinTone, rgb: skinToneRGB } = analyzeSkinTone(imageData);
        const bodyShape = analyzeBodyShape(imageData);
        const dominantColors = extractDominantColors(imageData, 8);
        const colorPalette = generatePersonalizedPalette(skinTone, skinToneRGB);
        const styleRecommendations = generateRecommendations(bodyShape, skinTone);
        const suggestedSize = suggestSize(bodyShape);
        
        // Calculate confidence based on image quality
        const avgBrightness = Array.from(imageData.data)
          .filter((_, i) => i % 4 !== 3) // Skip alpha channel
          .reduce((sum, val) => sum + val, 0) / (imageData.data.length * 0.75);
        
        const confidence = Math.min(95, Math.max(70, avgBrightness > 50 && avgBrightness < 200 ? 90 : 75));
        
        resolve({
          bodyShape,
          skinTone,
          suggestedSize,
          colorPalette,
          styleRecommendations,
          dominantColors,
          skinToneRGB,
          confidence,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
}

/**
 * Quick validation - check if image has sufficient quality
 */
export function validateImageQuality(imageDataUrl: string): Promise<{ valid: boolean; reason?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      if (img.width < 200 || img.height < 200) {
        resolve({ valid: false, reason: 'Image resolution too low' });
        return;
      }
      
      resolve({ valid: true });
    };
    
    img.onerror = () => {
      resolve({ valid: false, reason: 'Invalid image format' });
    };
    
    img.src = imageDataUrl;
  });
}
