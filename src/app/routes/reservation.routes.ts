// src/app/routes/reservation.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const RESERVATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/reservation/reservation-page/reservation-page.component').then(m => m.ReservationPageComponent),
    title: 'Réservations | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: 'create/:spaceId',
    loadComponent: () => import('../features/reservation/reservation-form/reservation-form.component').then(m => m.ReservationFormComponent),
    title: 'Nouvelle réservation | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: 'list',
    loadComponent: () => import('../features/reservation/reservation-list/reservation-list.component').then(m => m.ReservationListComponent),
    title: 'Mes réservations | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('../features/reservation/reservation-detail/reservation-detail.component').then(m => m.ReservationDetailComponent),
    title: 'Détail de la réservation | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('../features/reservation/reservation-form/reservation-form.component').then(m => m.ReservationFormComponent),
    title: 'Modifier la réservation | REX HOTEL',
    canActivate: [authGuard],
    data: { isEdit: true }
  },
  {
    path: ':id/cancel',
    loadComponent: () => import('../features/reservation/reservation-cancel/reservation-cancel.component').then(m => m.ReservationCancelComponent),
    title: 'Annuler la réservation | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: ':id/confirm',
    loadComponent: () => import('../features/reservation/reservation-confirmation/reservation-confirmation.component').then(m => m.ReservationConfirmationComponent),
    title: 'Confirmation de réservation | REX HOTEL',
    canActivate: [authGuard]
  }
];