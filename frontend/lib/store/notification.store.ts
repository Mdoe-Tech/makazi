import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { notificationService } from '../api/notification/service';
import type { Notification, NotificationFilters } from '../api/notification/types';
import { PaginationParams } from '../api/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  pagination: PaginationParams;
  // Actions
  setFilters: (filters: NotificationFilters) => void;
  setPagination: (pagination: PaginationParams) => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => set({ filters }),
        setPagination: (pagination) => set({ pagination }),

        fetchNotifications: async () => {
          try {
            set({ loading: true, error: null });
            const { filters, pagination } = get();
            const response = await notificationService.getNotifications({ ...filters, ...pagination });
            set({ 
              notifications: response.data,
              total: response.total,
              unreadCount: response.data.filter(n => !n.read).length,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch notifications',
              loading: false 
            });
          }
        },

        markAsRead: async (id) => {
          try {
            set({ loading: true, error: null });
            await notificationService.markAsRead(id);
            await get().fetchNotifications();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to mark notification as read',
              loading: false 
            });
          }
        },

        markAllAsRead: async () => {
          try {
            set({ loading: true, error: null });
            await notificationService.markAllAsRead();
            await get().fetchNotifications();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to mark all notifications as read',
              loading: false 
            });
          }
        },

        deleteNotification: async (id) => {
          try {
            set({ loading: true, error: null });
            await notificationService.deleteNotification(id);
            await get().fetchNotifications();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete notification',
              loading: false 
            });
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: 'notification-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  )
); 