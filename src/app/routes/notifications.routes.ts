// src/app/routes/notifications.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/notifications/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
    title: 'Notifications | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('../features/notifications/notification-detail/notification-detail.component').then(m => m.NotificationDetailComponent),
    title: 'Détail de la notification | REX HOTEL',
    canActivate: [authGuard]
  }
];