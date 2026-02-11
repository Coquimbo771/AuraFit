import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Biometric, BiometricState, ScanPreset, BodyShape, SkinTone } from '../types';

interface BiometricStore extends BiometricState {
  fetchScanHistory: (userId: string) => Promise<void>;
  saveBiometric: (userId: string, biometric: Partial<Biometric>) => Promise<void>;
  generateRandomScan: () => ScanPreset;
  clearError: () => void;
}

const SCAN_PRESETS: Record<string, ScanPreset> = {
  'preset-a': {
    id: 'preset-a',
    bodyShape: 'hourglass',
    skinTone: 'warm',
    suggestedSize: 'M',
    colorPalette: [
      { name: 'Warm Gold', hex: '#D4A574' },
      { name: 'Terracotta', hex: '#D97634' },
      { name: 'Burgundy', hex: '#8B3A62' },
      { name: 'Deep Orange', hex: '#C85A17' },
      { name: 'Warm Taupe', hex: '#A89E8F' },
    ],
    styleRecommendations: [
      'Fitted silhouettes that accentuate curves',
      'Wrap dresses and belted styles',
      'Rich, warm color tones',
      'Layering pieces to define waist',
    ],
  },
  'preset-b': {
    id: 'preset-b',
    bodyShape: 'inverted_triangle',
    skinTone: 'cool',
    suggestedSize: 'S',
    colorPalette: [
      { name: 'Icy Blue', hex: '#B0E0E6' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Jewel Purple', hex: '#9B59B6' },
      { name: 'Deep Teal', hex: '#008B8B' },
      { name: 'Cool Gray', hex: '#778899' },
    ],
    styleRecommendations: [
      'A-line skirts to balance shoulders',
      'Cool jewel tones and metallics',
      'Horizontal stripes on lower body',
      'Statement necklaces to highlight collarbone',
    ],
  },
  'preset-c': {
    id: 'preset-c',
    bodyShape: 'athletic',
    skinTone: 'neutral',
    suggestedSize: 'L',
    colorPalette: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Cream', hex: '#F5F5DC' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#000000' },
    ],
    styleRecommendations: [
      'Straight-cut silhouettes',
      'Earth tones and neutrals',
      'Textured fabrics for dimension',
      'Oversized cuts for comfort',
    ],
  },
};

export const useBiometricStore = create<BiometricStore>((set) => ({
  currentScan: null,
  scanHistory: [],
  loading: false,
  error: null,

  fetchScanHistory: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('biometrics')
        .select('*')
        .eq('user_id', userId)
        .order('scan_date', { ascending: false });

      if (error) throw error;

      set({
        scanHistory: data || [],
        currentScan: data && data.length > 0 ? data[0] : null,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch scan history',
        loading: false,
      });
    }
  },

  saveBiometric: async (userId: string, biometric: Partial<Biometric>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('biometrics')
        .insert([
          {
            user_id: userId,
            body_shape: biometric.body_shape,
            skin_tone: biometric.skin_tone,
            color_palette: biometric.color_palette,
            measurements: biometric.measurements,
            height: biometric.height,
            scan_date: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        set((state) => ({
          currentScan: data,
          scanHistory: [data, ...state.scanHistory],
          loading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save biometric',
        loading: false,
      });
      throw error;
    }
  },

  generateRandomScan: () => {
    const presets = Object.values(SCAN_PRESETS);
    return presets[Math.floor(Math.random() * presets.length)];
  },

  clearError: () => set({ error: null }),
}));