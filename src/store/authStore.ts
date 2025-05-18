import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase, signIn, signUp, signOut } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await signIn(email, password);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          
          if (data?.user) {
            set({ 
              user: {
                id: data.user.id,
                email: data.user.email || '',
                full_name: data.user.user_metadata?.full_name,
                avatar_url: data.user.user_metadata?.avatar_url,
                created_at: data.user.created_at,
              }, 
              isLoading: false 
            });
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await signUp(email, password, fullName);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          
          if (data?.user) {
            set({ 
              user: {
                id: data.user.id,
                email: data.user.email || '',
                full_name: data.user.user_metadata?.full_name,
                avatar_url: data.user.user_metadata?.avatar_url,
                created_at: data.user.created_at,
              }, 
              isLoading: false 
            });
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await signOut();
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      refreshUser: async () => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            set({ user: null, isLoading: false });
            return;
          }
          
          if (data?.user) {
            set({ 
              user: {
                id: data.user.id,
                email: data.user.email || '',
                full_name: data.user.user_metadata?.full_name,
                avatar_url: data.user.user_metadata?.avatar_url,
                created_at: data.user.created_at,
              }, 
              isLoading: false 
            });
          } else {
            set({ user: null, isLoading: false });
          }
        } catch (error) {
          set({ user: null, isLoading: false });
        }
      },

      setUser: (user) => {
        set({ user, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'melodify-auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const user: User = {
      id: session.user.id,
      email: session.user.email || '',
      full_name: session.user.user_metadata?.full_name,
      avatar_url: session.user.user_metadata?.avatar_url,
      created_at: session.user.created_at,
    };
    useAuthStore.getState().setUser(user);
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.getState().setUser(null);
  }
});

// Initialize the auth state
useAuthStore.getState().refreshUser();