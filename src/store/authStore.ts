import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // We wait a brief moment for the database trigger to complete
        const { data: userData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        // If the profile isn't ready yet (race condition), we'll retry once after 1 second
        if (profileError) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: retryData, error: retryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (retryError) throw retryError;
          set({ user: retryData, session: authData.session, loading: false });
        } else {
          set({ user: userData, session: authData.session, loading: false });
        }
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign up failed',
        loading: false,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userError) throw userError;

        set({
          user: userData,
          session: data.session,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign in failed',
        loading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign out failed',
        loading: false,
      });
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (userError) throw userError;

        set({
          user: userData,
          session,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));