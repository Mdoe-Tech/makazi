import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from '../api/nida/types';
import { nidaService } from '../api/nida/service';
import { PaginationParams } from '../api/types';

interface NidaState {
  nidaData: NidaData[];
  selectedNida: NidaData | null;
  verificationHistory: NidaVerificationResult[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: NidaFilters;
  pagination: PaginationParams;
  // Actions
  setFilters: (filters: NidaFilters) => void;
  setPagination: (pagination: PaginationParams) => void;
  setSelectedNida: (nida: NidaData | null) => void;
  fetchNidaData: () => Promise<void>;
  fetchNidaById: (id: string) => Promise<void>;
  registerNida: (data: Omit<NidaData, 'nida_number'>) => Promise<void>;
  verifyNida: (data: { nida_number: string; first_name: string; last_name: string; date_of_birth: string }) => Promise<{ data: NidaVerificationResult }>;
  fetchVerificationHistory: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  nidaData: [],
  selectedNida: null,
  verificationHistory: [],
  total: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

export const useNidaStore = create<NidaState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => set({ filters }),
        setPagination: (pagination) => set({ pagination }),
        setSelectedNida: (nida) => set({ selectedNida: nida }),

        fetchNidaData: async () => {
          try {
            set({ loading: true, error: null });
            const { filters, pagination } = get();
            const response = await nidaService.getNidaData({ ...filters, ...pagination });
            set({ 
              nidaData: response.data,
              total: response.total,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch NIDA data',
              loading: false 
            });
          }
        },

        fetchNidaById: async (id) => {
          try {
            set({ loading: true, error: null });
            const response = await nidaService.getNidaDataById(id);
            set({ 
              selectedNida: response.data,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch NIDA data',
              loading: false 
            });
          }
        },

        registerNida: async (data) => {
          try {
            set({ loading: true, error: null });
            await nidaService.registerNida(data);
            await get().fetchNidaData();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to register NIDA',
              loading: false 
            });
          }
        },

        verifyNida: async (data) => {
          try {
            return await nidaService.verifyNida(data);
          } catch (error) {
            return {
              data: {
                is_valid: false,
                match_score: 0,
                verification_date: new Date().toISOString(),
                details: {
                  verified_fields: [],
                  mismatches: [],
                  reason: error instanceof Error ? error.message : 'Failed to verify NIDA'
                }
              }
            };
          }
        },

        fetchVerificationHistory: async (id) => {
          try {
            set({ loading: true, error: null });
            const response = await nidaService.getNidaVerificationHistory(id);
            set({ 
              verificationHistory: response.data,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch verification history',
              loading: false 
            });
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: 'nida-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  )
); 