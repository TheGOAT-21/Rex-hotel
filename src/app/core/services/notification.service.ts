// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Notification, 
  NotificationType, 
  NotificationCategory, 
  NotificationSettings, 
  PaginatedResult,
  ApiResponse
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  
  // Pour les notifications UI (toast/alert)
  private notificationSubject = new Subject<{ type: NotificationType; message: string; title?: string }>();
  notification$ = this.notificationSubject.asObservable();
  
  // Pour les notifications système persistantes
  private systemNotificationsSubject = new BehaviorSubject<Notification[]>([]);
  systemNotifications$ = this.systemNotificationsSubject.asObservable();
  
  // Compteur de notifications non lues
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Charger les notifications au démarrage si l'utilisateur est connecté
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.loadSystemNotifications();
    }
  }
  
  // Notifications UI (toast/alert)
  showSuccess(message: string, title?: string): void {
    this.notificationSubject.next({ type: NotificationType.SUCCESS, message, title });
  }
  
  showError(message: string, title?: string): void {
    this.notificationSubject.next({ type: NotificationType.ERROR, message, title });
  }
  
  showWarning(message: string, title?: string): void {
    this.notificationSubject.next({ type: NotificationType.WARNING, message, title });
  }
  
  showInfo(message: string, title?: string): void {
    this.notificationSubject.next({ type: NotificationType.INFO, message, title });
  }
  
  // Notifications système persistantes
  getNotifications(page: number = 1, limit: number = 10): Observable<PaginatedResult<Notification>> {
    return this.http.get<ApiResponse<PaginatedResult<Notification>>>(`${this.apiUrl}?page=${page}&limit=${limit}`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des notifications');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des notifications'));
        })
      );
  }
  
  getUnreadCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/unread/count`)
      .pipe(
        map(response => {
          if (response && response.success && response.data !== undefined) {
            // Mettre à jour le compteur local
            this.unreadCountSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération du nombre de notifications non lues');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération du nombre de notifications non lues'));
        })
      );
  }
  
  markAsRead(notificationId: string): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${notificationId}/read`, {})
      .pipe(
        map(response => {
          if (response && response.success) {
            // Mettre à jour le compteur local
            const currentCount = this.unreadCountSubject.value;
            if (currentCount > 0) {
              this.unreadCountSubject.next(currentCount - 1);
            }
            
            // Mettre à jour les notifications locales
            this.updateNotificationReadStatus(notificationId, true);
            
            return true;
          }
          throw new Error(response.message || 'Échec de marquage de la notification comme lue');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du marquage de la notification comme lue'));
        })
      );
  }
  
  markAllAsRead(): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/read-all`, {})
      .pipe(
        map(response => {
          if (response && response.success) {
            // Mettre à jour le compteur local
            this.unreadCountSubject.next(0);
            
            // Mettre à jour les notifications locales
            const notifications = this.systemNotificationsSubject.value.map(n => ({
              ...n,
              isRead: true
            }));
            this.systemNotificationsSubject.next(notifications);
            
            return true;
          }
          throw new Error(response.message || 'Échec de marquage de toutes les notifications comme lues');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du marquage de toutes les notifications comme lues'));
        })
      );
  }
  
  deleteNotification(notificationId: string): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${notificationId}`)
      .pipe(
        map(response => {
          if (response && response.success) {
            // Mettre à jour les notifications locales
            this.removeNotificationFromList(notificationId);
            
            return true;
          }
          throw new Error(response.message || 'Échec de suppression de la notification');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de la notification'));
        })
      );
  }
  
  // Paramètres de notification
  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<ApiResponse<NotificationSettings>>(`${this.apiUrl}/settings`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des paramètres de notification');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des paramètres de notification'));
        })
      );
  }
  
  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.http.put<ApiResponse<NotificationSettings>>(`${this.apiUrl}/settings`, settings)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour des paramètres de notification');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des paramètres de notification'));
        })
      );
  }
  
  // Admin : Créer des notifications pour les utilisateurs
  createNotificationForUser(userId: string, notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<ApiResponse<Notification>>(`${this.apiUrl}/admin/user/${userId}`, notification)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de la notification');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la notification'));
        })
      );
  }
  
  // Admin : Créer une notification globale
  createGlobalNotification(notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<ApiResponse<Notification>>(`${this.apiUrl}/admin/global`, notification)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de la notification globale');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la notification globale'));
        })
      );
  }
  
  // Méthodes privées
  private loadSystemNotifications(): void {
    this.getNotifications(1, 20).subscribe({
      next: (result) => {
        this.systemNotificationsSubject.next(result.items);
        this.unreadCountSubject.next(result.items.filter(n => !n.isRead).length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications', error);
      }
    });
  }
  
  private updateNotificationReadStatus(notificationId: string, isRead: boolean): void {
    const notifications = this.systemNotificationsSubject.value.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, isRead };
      }
      return notification;
    });
    
    this.systemNotificationsSubject.next(notifications);
  }
  
  private removeNotificationFromList(notificationId: string): void {
    const notification = this.systemNotificationsSubject.value.find(n => n.id === notificationId);
    const notifications = this.systemNotificationsSubject.value.filter(n => n.id !== notificationId);
    
    this.systemNotificationsSubject.next(notifications);
    
    // Mettre à jour le compteur si la notification était non lue
    if (notification && !notification.isRead) {
      const currentCount = this.unreadCountSubject.value;
      if (currentCount > 0) {
        this.unreadCountSubject.next(currentCount - 1);
      }
    }
  }
}