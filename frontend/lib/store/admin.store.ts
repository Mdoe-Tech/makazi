import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { adminService } from '../api/admin/service';
import { PaginationParams } from '../api/types';
import { User } from '../api/auth/types';
import { UserFilters, CreateUserDto, UpdateUserDto } from '../api/admin/types';

interface AdminState {
  users: User[];
  selectedUser: User | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  pagination: PaginationParams;
  // Actions
  setFilters: (filters: UserFilters) => void;
  setPagination: (pagination: PaginationParams) => void;
  setSelectedUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (data: CreateUserDto) => Promise<void>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  users: [],
  selectedUser: null,
  total: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => set({ filters }),
        setPagination: (pagination) => set({ pagination }),
        setSelectedUser: (user) => set({ selectedUser: user }),

        fetchUsers: async () => {
          try {
            set({ loading: true, error: null });
            const { filters, pagination } = get();
            const response = await adminService.getUsers({ ...filters, ...pagination });
            set({ 
              users: response.data,
              total: response.total,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch users',
              loading: false 
            });
          }
        },

        fetchUserById: async (id) => {
          try {
            set({ loading: true, error: null });
            const response = await adminService.getUserById(id);
            set({ 
              selectedUser: response.data,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch user',
              loading: false 
            });
          }
        },

        createUser: async (data) => {
          try {
            set({ loading: true, error: null });
            await adminService.createUser(data);
            await get().fetchUsers();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to create user',
              loading: false 
            });
          }
        },

        updateUser: async (id, data) => {
          try {
            set({ loading: true, error: null });
            await adminService.updateUser(id, data);
            await get().fetchUsers();
            if (get().selectedUser?.id === id) {
              await get().fetchUserById(id);
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update user',
              loading: false 
            });
          }
        },

        deleteUser: async (id) => {
          try {
            set({ loading: true, error: null });
            await adminService.deleteUser(id);
            await get().fetchUsers();
            if (get().selectedUser?.id === id) {
              set({ selectedUser: null });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete user',
              loading: false 
            });
          }
        },

        activateUser: async (id) => {
          try {
            set({ loading: true, error: null });
            await adminService.activateUser(id);
            await get().fetchUsers();
            if (get().selectedUser?.id === id) {
              await get().fetchUserById(id);
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to activate user',
              loading: false 
            });
          }
        },

        deactivateUser: async (id) => {
          try {
            set({ loading: true, error: null });
            await adminService.deactivateUser(id);
            await get().fetchUsers();
            if (get().selectedUser?.id === id) {
              await get().fetchUserById(id);
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to deactivate user',
              loading: false 
            });
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: 'admin-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  )
); 