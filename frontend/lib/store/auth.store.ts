import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../api/auth/service';
import type { User, LoginDto, RegisterDto } from '../api/auth/types';
import { UserRole } from '../api/auth/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  // Actions
  login: (nidaNumber: string, password: string, role: string) => Promise<any>;
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

        login: async (nidaNumber: string, password: string, role: string) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.login({ nida_number: nidaNumber, password });
            console.log('Login response:', response);
            
            // Only set user and token if login was successful and no password setup is needed
            if (!response.data.data.needsPasswordSetup) {
              if (typeof window !== 'undefined' && response.data.data.access_token) {
                localStorage.setItem('token', response.data.data.access_token);
              }

              // Handle citizen login
              if (response.data.data.citizen) {
                const userData = {
                  id: response.data.data.citizen.id,
                  username: response.data.data.citizen.nida_number,
                  email: response.data.data.citizen.email || '',
                  first_name: response.data.data.citizen.first_name,
                  last_name: response.data.data.citizen.last_name,
                  role: UserRole.USER,
                  is_active: response.data.data.citizen.is_active,
                  permissions: [],
                  created_at: response.data.data.citizen.created_at,
                  updated_at: response.data.data.citizen.updated_at,
                  phone_number: response.data.data.citizen.phone_number,
                  employment_status: response.data.data.citizen.employment_status,
                  employer_name: response.data.data.citizen.employer_name,
                  occupation: response.data.data.citizen.occupation,
                  registration_status: response.data.data.citizen.registration_status
                };
                console.log('Setting user data:', userData);
                set({ 
                  user: userData,
                  token: response.data.data.access_token,
                  loading: false 
                });
              } 
              // Handle non-citizen login (admin, super_admin, etc)
              else if (response.data.data.user) {
                set({
                  user: response.data.data.user,
                  token: response.data.data.access_token,
                  loading: false
                });
              }
            }
            
            return response;
          } catch (error) {
            console.error('Login error:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to login',
              loading: false 
            });
            throw error;
          }
        },

        register: async (data) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.register(data);
            set({ 
              user: response.data.data.user,
              token: response.data.data.access_token,
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
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          set(initialState);
        },

        reset: () => set(initialState),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
); 