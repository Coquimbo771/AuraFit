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
      if (state.cart.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Verificar que el usuario esté autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Debes iniciar sesión para crear un pedido');
      }

      // Obtener los productos del carrito
      const productIds = state.cart.map((item) => item.productId);
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

      if (productError) {
        console.error('Error fetching products:', productError);
        throw new Error(`Error al obtener productos: ${productError.message}`);
      }

      if (!products || products.length === 0) {
        throw new Error('No se encontraron los productos del carrito');
      }

      // Crear mapa de precios
      const priceMap = new Map((products || []).map((product) => [product.id, Number(product.price)]));
      const orderItems = state.cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: priceMap.get(item.productId) || 0,
      }));

      // Calcular total
      const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

      // Crear la orden
      const orderData = {
        user_id: userId,
        total_amount: totalAmount,
        currency: 'USD',
        status: 'pending' as const,
        payment_provider: null,
        shipping_address: state.checkout.shippingAddress || null,
        notes: state.checkout.notes || null,
      };

      console.log('Creating order with data:', orderData);

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select('*')
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error(`Error al crear orden: ${orderError.message}`);
      }

      if (!createdOrder) {
        throw new Error('No se pudo crear la orden');
      }

      const orderId = createdOrder.id;
      console.log('Order created with ID:', orderId);

      // Insertar los items de la orden
      const itemsToInsert = orderItems.map((item) => ({
        order_id: orderId,
        ...item,
      }));

      console.log('Inserting order items:', itemsToInsert);

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (orderItemsError) {
        console.error('Error creating order items:', orderItemsError);
        // Intentar eliminar la orden si falla la inserción de items
        await supabase.from('orders').delete().eq('id', orderId);
        throw new Error(`Error al crear items del pedido: ${orderItemsError.message}`);
      }

      console.log('Order items created successfully');

      // Actualizar el estado
      set((currentState) => ({
        cart: [],
        checkout: {
          couponCode: '',
          notes: '',
          shippingAddress: null,
        },
        orders: [createdOrder as Order, ...currentState.orders],
      }));

      return orderId;
    } catch (error: any) {
      console.error('Error in createOrder:', error);
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