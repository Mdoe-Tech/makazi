import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { biometricService } from '../api/biometric/service';
import type { BiometricData, BiometricFilters } from '../api/biometric/types';
import { PaginationParams } from '../api/types';

interface BiometricState {
  biometricData: BiometricData[];
  selectedBiometric: BiometricData | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: BiometricFilters;
  pagination: PaginationParams;
  // Actions
  setFilters: (filters: BiometricFilters) => void;
  setPagination: (pagination: PaginationParams) => void;
  setSelectedBiometric: (biometric: BiometricData | null) => void;
  fetchBiometricData: () => Promise<void>;
  fetchBiometricById: (id: string) => Promise<void>;
  uploadBiometric: (data: FormData) => Promise<void>;
  deleteBiometric: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  biometricData: [],
  selectedBiometric: null,
  total: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

export const useBiometricStore = create<BiometricState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => set({ filters }),
        setPagination: (pagination) => set({ pagination }),
        setSelectedBiometric: (biometric) => set({ selectedBiometric: biometric }),

        fetchBiometricData: async () => {
          try {
            set({ loading: true, error: null });
            const { filters, pagination } = get();
            const response = await biometricService.getBiometricData({ ...filters, ...pagination });
            set({ 
              biometricData: response.data,
              total: response.total,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch biometric data',
              loading: false 
            });
          }
        },

        fetchBiometricById: async (id) => {
          try {
            set({ loading: true, error: null });
            const response = await biometricService.getBiometricById(id);
            set({ 
              selectedBiometric: response.data,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch biometric data',
              loading: false 
            });
          }
        },

        uploadBiometric: async (data) => {
          try {
            set({ loading: true, error: null });
            await biometricService.uploadBiometric(data);
            await get().fetchBiometricData();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to upload biometric data',
              loading: false 
            });
          }
        },

        deleteBiometric: async (id) => {
          try {
            set({ loading: true, error: null });
            await biometricService.deleteBiometric(id);
            await get().fetchBiometricData();
            if (get().selectedBiometric?.id === id) {
              set({ selectedBiometric: null });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete biometric data',
              loading: false 
            });
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: 'biometric-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  )
); 