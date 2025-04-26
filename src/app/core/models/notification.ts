// src/app/core/models/notification.ts

export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
  }
  
  export enum NotificationCategory {
    RESERVATION = 'reservation',
    USER = 'user',
    PAYMENT = 'payment',
    SYSTEM = 'system'
  }
  
  export interface Notification {
    id?: string;
    userId?: string;
    title: string;
    message: string;
    type: NotificationType;
    category: NotificationCategory;
    isRead: boolean;
    createdAt: Date;
    expiresAt?: Date;
    link?: string;
    data?: any;
  }
  
  export interface NotificationSettings {
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    emailNotificationTypes: NotificationCategory[];
    pushNotificationTypes: NotificationCategory[];
    emailFrequency: 'instant' | 'daily' | 'weekly';
  }
  
  export interface EmailNotification {
    to: string;
    subject: string;
    body: string;
    html?: string;
    from?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: {
      filename: string;
      content: string;
      contentType?: string;
    }[];
  }
  
  export interface PushNotification {
    userId: string;
    title: string;
    body: string;
    icon?: string;
    image?: string;
    data?: any;
    clickAction?: string;
  }
  
  export interface AdminNotification extends Notification {
    isGlobal: boolean;
    priority: 'low' | 'medium' | 'high';
    targetUserRoles?: string[];
    acknowledgedBy?: string[];
  }