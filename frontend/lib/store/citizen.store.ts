import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Citizen, CitizenFilters, CreateCitizenDto, UpdateCitizenDto } from '../api/citizen/types';
import { citizenService } from '../api/citizen/service';
import { PaginationParams } from '../api/types';

interface CitizenState {
  citizens: Citizen[];
  selectedCitizen: Citizen | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: CitizenFilters;
  pagination: PaginationParams;
  // Actions
  setFilters: (filters: CitizenFilters) => void;
  setPagination: (pagination: PaginationParams) => void;
  setSelectedCitizen: (citizen: Citizen | null) => void;
  fetchCitizens: () => Promise<void>;
  fetchCitizenById: (id: string) => Promise<void>;
  createCitizen: (data: CreateCitizenDto) => Promise<void>;
  updateCitizen: (id: string, data: UpdateCitizenDto) => Promise<void>;
  deleteCitizen: (id: string) => Promise<void>;
  verifyCitizen: (id: string) => Promise<void>;
  rejectCitizen: (id: string, reason: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  citizens: [],
  selectedCitizen: null,
  total: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

export const useCitizenStore = create<CitizenState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => set({ filters }),
        setPagination: (pagination) => set({ pagination }),
        setSelectedCitizen: (citizen) => set({ selectedCitizen: citizen }),

        fetchCitizens: async () => {
          try {
            set({ loading: true, error: null });
            const { filters, pagination } = get();
            const response = await citizenService.getCitizens({ ...filters, ...pagination });
            set({ 
              citizens: response.data,
              total: response.total,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch citizens',
              loading: false 
            });
          }
        },

        fetchCitizenById: async (id) => {
          try {
            set({ loading: true, error: null });
            const response = await citizenService.getCitizenById(id);
            set({ 
              selectedCitizen: response.data,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch citizen',
              loading: false 
            });
          }
        },

        createCitizen: async (data) => {
          try {
            set({ loading: true, error: null });
            await citizenService.createCitizen(data);
            await get().fetchCitizens();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to create citizen',
              loading: false 
            });
          }
        },

        updateCitizen: async (id, data) => {
          try {
            set({ loading: true, error: null });
            await citizenService.updateCitizen(id, data);
            await get().fetchCitizens();
            if (get().selectedCitizen?.id === id) {
              await get().fetchCitizenById(id);
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update citizen',
              loading: false 
            });
          }
        },

        deleteCitizen: async (id) => {
          try {
            set({ loading: true, error: null });
            await citizenService.deleteCitizen(id);
            await get().fetchCitizens();
            if (get().selectedCitizen?.id === id) {
              set({ selectedCitizen: null });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete citizen',
              loading: false 
            });
          }
        },

        verifyCitizen: async (id) => {
          try {
            set({ loading: true, error: null });
            await citizenService.verifyCitizen(id);
            await get().fetchCitizens();
            if (get().selectedCitizen?.id === id) {
              await get().fetchCitizenById(id);
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to verify citizen',
              loading: false 
            });
          }
        },

        rejectCitizen: async (id, reason) => {
          try {
            set({ loading: true, error: null });
            await citizenService.rejectCitizen(id, reason);
            await get().fetchCitizens();
            if (get().selectedCitizen?.id === id) {
              await get().fetchCitizenById(id);
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to reject citizen',
              loading: false 
            });
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: 'citizen-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  )
); 