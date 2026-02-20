import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

// User behavior tracking for intelligent recommendations
interface ProductView {
  productId: string;
  productName: string;
  category: string;
  occasion: string;
  price: number;
  timestamp: number;
  timeSpent: number; // seconds spent viewing
}

interface SearchQuery {
  query: string;
  timestamp: number;
  resultsClicked: string[]; // IDs of products clicked from this search
}

interface UserPreferences {
  favoriteCategories: Record<string, number>; // category -> score
  favoriteOccasions: Record<string, number>; // occasion -> score
  priceRange: { min: number; max: number };
  brandPreferences: Record<string, number>; // brand -> score
  colorPreferences: string[];
  lastVisit: number;
  totalVisits: number;
  averageSessionTime: number;
}

interface BehaviorState {
  viewedProducts: ProductView[];
  searchHistory: SearchQuery[];
  clickedProducts: string[];
  addedToCart: string[];
  purchasedProducts: string[];
  preferences: UserPreferences;
  currentSessionStart: number;
  
  // Actions
  trackProductView: (product: Product, timeSpent: number) => void;
  trackSearch: (query: string) => void;
  trackSearchClick: (query: string, productId: string) => void;
  trackAddToCart: (productId: string) => void;
  trackPurchase: (productIds: string[]) => void;
  updatePreferences: () => void;
  getRecommendations: (limit?: number) => string[];
  getSimilarUsers: () => string[];
  clearOldData: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: {},
  favoriteOccasions: {},
  priceRange: { min: 0, max: 1000 },
  brandPreferences: {},
  colorPreferences: [],
  lastVisit: Date.now(),
  totalVisits: 0,
  averageSessionTime: 0,
};

export const useBehaviorStore = create<BehaviorState>()(
  persist(
    (set, get) => ({
      viewedProducts: [],
      searchHistory: [],
      clickedProducts: [],
      addedToCart: [],
      purchasedProducts: [],
      preferences: DEFAULT_PREFERENCES,
      currentSessionStart: Date.now(),

      trackProductView: (product: Product, timeSpent: number) => {
        const view: ProductView = {
          productId: product.id,
          productName: product.name,
          category: product.category,
          occasion: product.occasion || 'general',
          price: product.price,
          timestamp: Date.now(),
          timeSpent,
        };

        set((state) => ({
          viewedProducts: [...state.viewedProducts, view].slice(-100), // Keep last 100
          clickedProducts: [...new Set([...state.clickedProducts, product.id])],
        }));

        // Update preferences after tracking
        setTimeout(() => get().updatePreferences(), 100);
      },

      trackSearch: (query: string) => {
        set((state) => ({
          searchHistory: [
            ...state.searchHistory,
            { query, timestamp: Date.now(), resultsClicked: [] },
          ].slice(-50), // Keep last 50 searches
        }));
      },

      trackSearchClick: (query: string, productId: string) => {
        set((state) => {
          const updatedHistory = state.searchHistory.map((search) =>
            search.query === query && Date.now() - search.timestamp < 300000 // 5 min window
              ? { ...search, resultsClicked: [...search.resultsClicked, productId] }
              : search
          );
          return { searchHistory: updatedHistory };
        });
      },

      trackAddToCart: (productId: string) => {
        set((state) => ({
          addedToCart: [...new Set([...state.addedToCart, productId])],
        }));
      },

      trackPurchase: (productIds: string[]) => {
        set((state) => ({
          purchasedProducts: [...new Set([...state.purchasedProducts, ...productIds])],
        }));
        get().updatePreferences();
      },

      updatePreferences: () => {
        const state = get();
        const { viewedProducts, purchasedProducts } = state;

        // Calculate favorite categories (weighted: viewed=1, purchased=5)
        const categoryScores: Record<string, number> = {};
        const occasionScores: Record<string, number> = {};
        const prices: number[] = [];

        viewedProducts.forEach((view) => {
          const weight = view.timeSpent > 30 ? 2 : 1; // More time = more interest
          categoryScores[view.category] = (categoryScores[view.category] || 0) + weight;
          occasionScores[view.occasion] = (occasionScores[view.occasion] || 0) + weight;
          prices.push(view.price);
        });

        // Boost purchased categories
        viewedProducts
          .filter((v) => purchasedProducts.includes(v.productId))
          .forEach((view) => {
            categoryScores[view.category] = (categoryScores[view.category] || 0) + 5;
            occasionScores[view.occasion] = (occasionScores[view.occasion] || 0) + 5;
          });

        // Calculate price range
        const sortedPrices = prices.sort((a, b) => a - b);
        const priceRange = {
          min: sortedPrices[Math.floor(sortedPrices.length * 0.1)] || 0,
          max: sortedPrices[Math.floor(sortedPrices.length * 0.9)] || 1000,
        };

        // Update session stats
        const sessionTime = (Date.now() - state.currentSessionStart) / 1000 / 60; // minutes
        const totalVisits = state.preferences.totalVisits + 1;
        const avgSessionTime =
          (state.preferences.averageSessionTime * state.preferences.totalVisits + sessionTime) /
          totalVisits;

        set((state) => ({
          preferences: {
            ...state.preferences,
            favoriteCategories: categoryScores,
            favoriteOccasions: occasionScores,
            priceRange,
            lastVisit: Date.now(),
            totalVisits,
            averageSessionTime: avgSessionTime,
          },
        }));
      },

      getRecommendations: (limit = 10) => {
        const { viewedProducts, clickedProducts, purchasedProducts, preferences } = get();

        // Exclude already purchased or currently being viewed
        const excludeIds = new Set([...purchasedProducts, ...clickedProducts.slice(-5)]);

        // Score based on preferences
        const categoryScores = preferences.favoriteCategories;
        const occasionScores = preferences.favoriteOccasions;

        // Get top categories and occasions
        const topCategories = Object.entries(categoryScores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([cat]) => cat);

        const topOccasions = Object.entries(occasionScores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([occ]) => occ);

        // Return IDs that match preferences (in real app, fetch from products)
        // This is a placeholder - in practice, you'd query products matching these criteria
        return Array.from(excludeIds).slice(0, limit);
      },

      getSimilarUsers: () => {
        // Placeholder for collaborative filtering
        // In real implementation, this would query backend for users with similar behavior
        return [];
      },

      clearOldData: () => {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        set((state) => ({
          viewedProducts: state.viewedProducts.filter((v) => v.timestamp > thirtyDaysAgo),
          searchHistory: state.searchHistory.filter((s) => s.timestamp > thirtyDaysAgo),
        }));
      },
    }),
    {
      name: 'aurafit-behavior',
      version: 1,
    }
  )
);
