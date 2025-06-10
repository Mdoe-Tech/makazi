import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../api/auth/service';
import type { User, LoginDto, RegisterDto, AuthResponse } from '../api/auth/types';
import { UserRole } from '../api/auth/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  // Actions
  login: (credentials: { username: string; password: string } | { nida_number: string; password: string }, role?: string) => Promise<any>;
  register: (data: RegisterDto) => Promise<AuthResponse>;
  logout: () => void;
  reset: () => void;
  initialize: () => void;
}

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        initialize: () => {
          const token = localStorage.getItem('token');
          if (token) {
            // Decode token to get user info
            try {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              set({
                token,
                initialized: true,
                user: {
                  id: tokenPayload.sub,
                  username: tokenPayload.username,
                  email: tokenPayload.email || '',
                  first_name: tokenPayload.first_name || '',
                  last_name: tokenPayload.last_name || '',
                  role: tokenPayload.role || UserRole.ADMIN,
                  roles: tokenPayload.roles || [tokenPayload.role || UserRole.ADMIN],
                  functional_roles: tokenPayload.functional_roles || [],
                  is_active: true,
                  permissions: tokenPayload.permissions || [],
                  created_at: tokenPayload.created_at || new Date().toISOString(),
                  updated_at: tokenPayload.updated_at || new Date().toISOString(),
                  citizen_id: tokenPayload.citizen_id || null
                }
              });
            } catch (error) {
              console.error('Error initializing auth state:', error);
              localStorage.removeItem('token');
              set({ ...initialState, initialized: true });
            }
          } else {
            set({ ...initialState, initialized: true });
          }
        },

        login: async (credentials, role) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.login(credentials);
            console.log('Login response:', response);
            
            if (response.data.data.access_token) {
              const token = response.data.data.access_token;
              localStorage.setItem('token', token);

              // Decode JWT token to get role
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              console.log('Token payload:', tokenPayload);

              // Handle citizen login
              if (tokenPayload.role === 'CITIZEN') {
                const citizen = response.data.data.citizen;
                if (!citizen) {
                  throw new Error('Citizen data not found in response');
                }
                const userData = {
                  id: citizen.id,
                  username: citizen.nida_number || citizen.id,
                  email: citizen.email || '',
                  first_name: citizen.first_name,
                  last_name: citizen.last_name,
                  role: UserRole.CITIZEN,
                  roles: [UserRole.CITIZEN],
                  functional_roles: [],
                  is_active: citizen.is_active,
                  permissions: [],
                  created_at: citizen.created_at,
                  updated_at: citizen.updated_at,
                  phone_number: citizen.phone_number,
                  employment_status: citizen.employment_status,
                  employer_name: citizen.employer_name,
                  occupation: citizen.occupation,
                  registration_status: citizen.registration_status,
                  citizen_id: citizen.id,
                  nida_number: citizen.nida_number
                };
                console.log('Setting citizen data:', userData);
                set({ 
                  user: userData,
                  token,
                  loading: false,
                  initialized: true
                });
                // Redirect to citizen dashboard
                if (typeof window !== 'undefined') {
                  window.location.href = '/citizen/dashboard';
                }
              } 
              // Handle admin login (any role that's not CITIZEN)
              else {
                const adminUser = response.data.data.user;
                if (!adminUser) {
                  throw new Error('Admin user data not found in response');
                }
                const adminData: User = {
                  id: adminUser.id,
                  username: adminUser.username || tokenPayload.username || 'admin',
                  email: adminUser.email || '',
                  first_name: adminUser.first_name || '',
                  last_name: adminUser.last_name || '',
                  role: tokenPayload.role || UserRole.ADMIN,
                  roles: tokenPayload.roles || [tokenPayload.role || UserRole.ADMIN],
                  functional_roles: tokenPayload.functional_roles || [],
                  is_active: adminUser.is_active || true,
                  permissions: adminUser.permissions || tokenPayload.permissions || [],
                  created_at: adminUser.created_at || new Date().toISOString(),
                  updated_at: adminUser.updated_at || new Date().toISOString(),
                  citizen_id: tokenPayload.citizen_id || null
                };
                console.log('Setting admin data:', adminData);
                set({
                  user: adminData,
                  token,
                  loading: false,
                  initialized: true
                });
                // Redirect to admin dashboard
                if (typeof window !== 'undefined') {
                  window.location.href = '/admin';
                }
              }
            }
            
            return response;
          } catch (error) {
            console.error('Login error:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to login',
              loading: false,
              initialized: true
            });
            throw error;
          }
        },

        register: async (data) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.register(data);
            set({ loading: false });
            return response;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to register',
              loading: false,
              initialized: true
            });
            throw error;
          }
        },

        logout: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          set({ ...initialState, initialized: true });
        },

        reset: () => set({ ...initialState, initialized: true }),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          initialized: state.initialized
        }),
      }
    )
  )
); 