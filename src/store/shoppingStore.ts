import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { ShoppingState, ProductCategory, ShippingAddress, Order } from '../types';

interface ShoppingStore extends ShoppingState {
  setOccasionFilter: (occasions: ProductCategory[]) => void;
  setSustainabilityFilter: (min: number) => void;
  setPriceRange: (min: number, max: number) => void;
  addToWardrobe: (userId: string, productId: string) => Promise<void>;
  removeFromWardrobe: (userId: string, productId: string) => Promise<void>;
  fetchSavedItems: (userId: string) => Promise<void>;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCouponCode: (couponCode: string) => void;
  setOrderNotes: (notes: string) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  createOrder: (userId: string) => Promise<string | null>;
  fetchOrders: (userId: string) => Promise<void>;
  resetFilters: () => void;
}

export const useShoppingStore = create<ShoppingStore>()(persist((set, get) => ({
  filters: {
    occasion: [],
    sustainabilityMin: 1,
    priceRange: [0, 1000],
  },
  savedItems: [],
  cart: [],
  checkout: {
    couponCode: '',
    notes: '',
    shippingAddress: null,
  },
  orders: [],

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

  addToCart: (productId: string, quantity = 1) => {
    if (quantity <= 0) return;

    set((state) => {
      const existingItem = state.cart.find((item) => item.productId === productId);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        cart: [...state.cart, { productId, quantity }],
      };
    });
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    }));
  },

  updateCartItemQty: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  setCouponCode: (couponCode: string) => {
    set((state) => ({
      checkout: {
        ...state.checkout,
        couponCode,
      },
    }));
  },

  setOrderNotes: (notes: string) => {
    set((state) => ({
      checkout: {
        ...state.checkout,
        notes,
      },
    }));
  },

  setShippingAddress: (address: ShippingAddress) => {
    set((state) => ({
      checkout: {
        ...state.checkout,
        shippingAddress: address,
      },
    }));
  },

  createOrder: async (userId: string) => {
    try {
      const state = get();
      if (state.cart.length === 0) return null;

      const productIds = state.cart.map((item) => item.productId);
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

      if (productError) throw productError;

      const priceMap = new Map((products || []).map((product) => [product.id, Number(product.price)]));
      const orderItems = state.cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: priceMap.get(item.productId) || 0,
      }));

      const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total_amount: totalAmount,
            currency: 'USD',
            status: 'pending',
            payment_provider: null,
            shipping_address: state.checkout.shippingAddress,
            notes: state.checkout.notes || null,
          },
        ])
        .select('*')
        .single();

      if (orderError) throw orderError;

      const orderId = createdOrder.id;
      const { error: orderItemsError } = await supabase.from('order_items').insert(
        orderItems.map((item) => ({
          order_id: orderId,
          ...item,
        }))
      );

      if (orderItemsError) throw orderItemsError;

      set((currentState) => ({
        cart: [],
        orders: [createdOrder as Order, ...currentState.orders],
      }));

      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  fetchOrders: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ orders: data || [] });
    } catch (error) {
      console.error('Error fetching orders:', error);
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
}), {
  name: 'aurafit-shopping',
  partialize: (state) => ({
    cart: state.cart,
    checkout: state.checkout,
  }),
}));