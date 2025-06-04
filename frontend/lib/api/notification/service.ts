import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import {
  Notification,
  CreateNotificationDto,
  NotificationFilters,
  NotificationPreferences
} from './types';

export class NotificationService {
  private static instance: NotificationService;
  private readonly baseUrl = '/notifications';

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(params: PaginationParams & NotificationFilters): Promise<PaginatedResponse<Notification>> {
    return apiClient.get<PaginatedResponse<Notification>>(this.baseUrl, { params });
  }

  async getNotificationById(id: string): Promise<ApiResponse<Notification>> {
    return apiClient.get<ApiResponse<Notification>>(`${this.baseUrl}/${id}`);
  }

  async createNotification(data: CreateNotificationDto): Promise<ApiResponse<Notification>> {
    return apiClient.post<ApiResponse<Notification>>(this.baseUrl, data);
  }

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return apiClient.patch<ApiResponse<Notification>>(`${this.baseUrl}/${id}/read`);
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiClient.patch<ApiResponse<void>>(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async getUnreadCount(): Promise<ApiResponse<number>> {
    return apiClient.get<ApiResponse<number>>(`${this.baseUrl}/unread-count`);
  }

  async getNotificationPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.get<ApiResponse<NotificationPreferences>>(`${this.baseUrl}/preferences`);
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.patch<ApiResponse<NotificationPreferences>>(`${this.baseUrl}/preferences`, preferences);
  }

  async subscribeToNotifications(): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/subscribe`);
  }

  async unsubscribeFromNotifications(): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/unsubscribe`);
  }
}

export const notificationService = NotificationService.getInstance(); 