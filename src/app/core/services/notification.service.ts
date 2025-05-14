// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'reservation' | 'payment' | 'user' | 'system';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  readAt?: Date;
  link?: string;
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Notifications mockées
  private notifications: Notification[] = [
    {
      id: '1',
      title: 'Nouvelle réservation',
      message: 'Une nouvelle réservation a été effectuée pour la chambre Type C',
      category: 'reservation',
      isRead: false,
      priority: 'medium',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 30), // 30 minutes ago
      link: '/admin/reservations/12345',
      metadata: {
        reservationId: '12345',
        roomId: '3',
        guestName: 'Jean Dupont'
      }
    },
    {
      id: '2',
      title: 'Paiement reçu',
      message: 'Un paiement de 150 000 XOF a été reçu pour la réservation #12345',
      category: 'payment',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
      readAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 1), // 1 hour ago
      link: '/admin/payments/p-789',
      metadata: {
        paymentId: 'p-789',
        reservationId: '12345',
        amount: 150000
      }
    },
    {
      id: '3',
      title: 'Check-in aujourd\'hui',
      message: '5 arrivées prévues aujourd\'hui. Veuillez préparer les chambres.',
      category: 'system',
      isRead: false,
      priority: 'high',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 6), // 6 hours ago
      link: '/admin/dashboard'
    },
    {
      id: '4',
      title: 'Nouveau message',
      message: 'Un client a posé une question concernant les services de spa.',
      category: 'user',
      isRead: false,
      priority: 'low',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 12), // 12 hours ago
      link: '/admin/messages/m-456',
      metadata: {
        messageId: 'm-456',
        userEmail: 'client@example.com'
      }
    },
    {
      id: '5',
      title: 'Maintenance programmée',
      message: 'Une maintenance du système est prévue demain à 02:00. Le système sera indisponible pendant 30 minutes.',
      category: 'system',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 24 hours ago
      readAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 23), // 23 hours ago
    }
  ];

  // BehaviorSubjects pour les notifications
  private systemNotificationsSubject = new BehaviorSubject<Notification[]>(this.notifications);
  private unreadCountSubject = new BehaviorSubject<number>(this.notifications.filter(n => !n.isRead).length);
  
  // Observables publics
  public systemNotifications$ = this.systemNotificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    // Initialiser le compteur de notifications non lues au démarrage
    this.updateUnreadCount();
  }

  /**
   * Récupère toutes les notifications avec filtrage optionnel
   */
  getNotifications(filter?: {
    isRead?: boolean,
    category?: string,
    priority?: string,
    startDate?: Date,
    endDate?: Date,
    search?: string,
    page?: number,
    limit?: number
  }): Observable<{items: Notification[], total: number}> {
    let filteredNotifications = [...this.notifications];
    
    if (filter) {
      // Filtrer par statut de lecture
      if (filter.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.isRead === filter.isRead);
      }
      
      // Filtrer par catégorie
      if (filter.category) {
        filteredNotifications = filteredNotifications.filter(n => n.category === filter.category);
      }
      
      // Filtrer par priorité
      if (filter.priority) {
        filteredNotifications = filteredNotifications.filter(n => n.priority === filter.priority);
      }
      
      // Filtrer par date de début
      if (filter.startDate) {
        filteredNotifications = filteredNotifications.filter(n => 
          new Date(n.createdAt) >= new Date(filter.startDate!)
        );
      }
      
      // Filtrer par date de fin
      if (filter.endDate) {
        filteredNotifications = filteredNotifications.filter(n => 
          new Date(n.createdAt) <= new Date(filter.endDate!)
        );
      }
      
      // Filtrer par recherche
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredNotifications = filteredNotifications.filter(n => 
          n.title.toLowerCase().includes(searchTerm) ||
          n.message.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    // Trier par date (plus récente d'abord)
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Calculer le nombre total pour la pagination
    const total = filteredNotifications.length;
    
    // Appliquer la pagination
    let paginatedNotifications = filteredNotifications;
    if (filter?.page && filter?.limit) {
      const startIndex = (filter.page - 1) * filter.limit;
      paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + filter.limit);
    }
    
    return of({
      items: paginatedNotifications,
      total
    }).pipe(delay(500));
  }

  /**
   * Récupère une notification par ID
   */
  getNotificationById(id: string): Observable<Notification> {
    const notification = this.notifications.find(n => n.id === id);
    
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    
    return of(notification).pipe(delay(300));
  }

  /**
   * Crée une nouvelle notification
   */
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Observable<Notification> {
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      isRead: false,
      createdAt: new Date(),
      ...notification
    };
    
    this.notifications.unshift(newNotification);
    this.updateSystemNotifications();
    this.updateUnreadCount();
    
    return of(newNotification).pipe(delay(300));
  }

  /**
   * Marque une notification comme lue
   */
  markAsRead(id: string): Observable<Notification> {
    const notification = this.notifications.find(n => n.id === id);
    
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    
    notification.isRead = true;
    notification.readAt = new Date();
    
    this.updateSystemNotifications();
    this.updateUnreadCount();
    
    return of(notification).pipe(delay(300));
  }

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead(): Observable<{count: number}> {
    let count = 0;
    
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        count++;
      }
    });
    
    this.updateSystemNotifications();
    this.updateUnreadCount();
    
    return of({ count }).pipe(delay(500));
  }

  /**
   * Supprime une notification
   */
  deleteNotification(id: string): Observable<{success: boolean}> {
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index === -1) {
      throw new Error(`Notification with id ${id} not found`);
    }
    
    this.notifications.splice(index, 1);
    this.updateSystemNotifications();
    this.updateUnreadCount();
    
    return of({ success: true }).pipe(delay(300));
  }

  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadCount(): Observable<number> {
    const count = this.notifications.filter(n => !n.isRead).length;
    
    this.unreadCountSubject.next(count);
    
    return of(count).pipe(delay(300));
  }

  /**
   * Récupère les notifications par catégorie
   */
  getNotificationsByCategory(category: string): Observable<Notification[]> {
    const filteredNotifications = this.notifications
      .filter(n => n.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return of(filteredNotifications).pipe(delay(300));
  }

  /**
   * Crée une notification de réservation
   */
  createReservationNotification(
    title: string,
    message: string,
    reservationId: string,
    roomId: string,
    guestName: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Observable<Notification> {
    return this.createNotification({
      title,
      message,
      category: 'reservation',
      priority,
      link: `/admin/reservations/${reservationId}`,
      metadata: {
        reservationId,
        roomId,
        guestName
      }
    });
  }

  /**
   * Crée une notification de paiement
   */
  createPaymentNotification(
    title: string,
    message: string,
    paymentId: string,
    reservationId: string,
    amount: number,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Observable<Notification> {
    return this.createNotification({
      title,
      message,
      category: 'payment',
      priority,
      link: `/admin/payments/${paymentId}`,
      metadata: {
        paymentId,
        reservationId,
        amount
      }
    });
  }

  /**
   * Crée une notification système
   */
  createSystemNotification(
    title: string,
    message: string,
    link?: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Observable<Notification> {
    return this.createNotification({
      title,
      message,
      category: 'system',
      priority,
      link
    });
  }

  /**
   * Met à jour le sujet BehaviorSubject des notifications système
   */
  private updateSystemNotifications(): void {
    this.systemNotificationsSubject.next([...this.notifications]);
  }

  /**
   * Met à jour le compteur de notifications non lues
   */
  private updateUnreadCount(): void {
    const count = this.notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
  }

}