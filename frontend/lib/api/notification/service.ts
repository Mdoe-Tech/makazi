import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Notification, NotificationFilters } from './types';

class NotificationService {
  private readonly baseUrl = '/notification';

  async getNotifications(params: PaginationParams & NotificationFilters): Promise<PaginatedResponse<Notification>> {
    return apiClientInstance.get<PaginatedResponse<Notification>>(this.baseUrl, { params });
  }

  async getNotificationById(id: string): Promise<{ data: Notification }> {
    return apiClientInstance.get<{ data: Notification }>(`${this.baseUrl}/${id}`);
  }

  async markAsRead(id: string): Promise<{ data: Notification }> {
    return apiClientInstance.post<{ data: Notification }>(`${this.baseUrl}/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    return apiClientInstance.post(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return apiClientInstance.get<{ count: number }>(`${this.baseUrl}/unread-count`);
  }

  async getNotificationStats(): Promise<{
    total_notifications: number;
    unread_count: number;
    notifications_by_type: Record<string, number>;
    notifications_by_priority: Record<string, number>;
  }> {
    return apiClientInstance.get<{
      total_notifications: number;
      unread_count: number;
      notifications_by_type: Record<string, number>;
      notifications_by_priority: Record<string, number>;
    }>(`${this.baseUrl}/stats`);
  }
}

export const notificationService = new NotificationService(); 