import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '../api/auth/service';
import type { User, LoginDto, RegisterDto } from '../api/auth/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  // Actions
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        login: async (data) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.login(data);
            set({ 
              user: response.data.user,
              token: response.data.access_token,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to login',
              loading: false 
            });
          }
        },

        register: async (data) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.register(data);
            set({ 
              user: response.data.user,
              token: response.data.access_token,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to register',
              loading: false 
            });
          }
        },

        logout: () => {
          set(initialState);
        },

        reset: () => set(initialState),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
); 