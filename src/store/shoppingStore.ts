import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { ShoppingState, ProductCategory } from '../types';

interface ShoppingStore extends ShoppingState {
  setOccasionFilter: (occasions: ProductCategory[]) => void;
  setSustainabilityFilter: (min: number) => void;
  setPriceRange: (min: number, max: number) => void;
  addToWardrobe: (userId: string, productId: string) => Promise<void>;
  removeFromWardrobe: (userId: string, productId: string) => Promise<void>;
  fetchSavedItems: (userId: string) => Promise<void>;
  resetFilters: () => void;
}

export const useShoppingStore = create<ShoppingStore>((set) => ({
  filters: {
    occasion: [],
    sustainabilityMin: 1,
    priceRange: [0, 1000],
  },
  savedItems: [],
  cart: [],

  setOccasionFilter: (occasions: ProductCategory[]) => {
    set((state) => ({
      filters: {
        ...state.filters,
        occasion: occasions,
      },
    }));
  },

  setSustainabilityFilter: (min: number) => {
    set((state) => ({
      filters: {
        ...state.filters,
        sustainabilityMin: min,
      },
    }));
  },

  setPriceRange: (min: number, max: number) => {
    set((state) => ({
      filters: {
        ...state.filters,
        priceRange: [min, max],
      },
    }));
  },

  addToWardrobe: async (userId: string, productId: string) => {
    try {
      const { error } = await supabase.from('user_wardrobe').insert([
        {
          user_id: userId,
          product_id: productId,
        },
      ]);

      if (error) throw error;

      set((state) => ({
        savedItems: [...new Set([...state.savedItems, productId])],
      }));
    } catch (error) {
      console.error('Error adding to wardrobe:', error);
      throw error;
    }
  },

  removeFromWardrobe: async (userId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('user_wardrobe')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;

      set((state) => ({
        savedItems: state.savedItems.filter((id) => id !== productId),
      }));
    } catch (error) {
      console.error('Error removing from wardrobe:', error);
      throw error;
    }
  },

  fetchSavedItems: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_wardrobe')
        .select('product_id')
        .eq('user_id', userId);

      if (error) throw error;

      set({
        savedItems: data?.map((item) => item.product_id) || [],
      });
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  },

  resetFilters: () => {
    set({
      filters: {
        occasion: [],
        sustainabilityMin: 1,
        priceRange: [0, 1000],
      },
    });
  },
}));