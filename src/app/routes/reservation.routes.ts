import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const RESERVATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/reservation/reservation-search/reservation-search.component').then(c => c.ReservationSearchComponent),
    title: 'Réservation | REX HOTEL'
  },
  {
    path: 'form',
    loadComponent: () => import('../features/reservation/reservation-form/reservation-form.component').then(c => c.ReservationFormComponent),
    title: 'Formulaire de Réservation | REX HOTEL'
  },
  {
    path: 'confirmation',
    loadComponent: () => import('../features/reservation/reservation-confirmation/reservation-confirmation.component').then(c => c.ReservationConfirmationComponent),
    title: 'Confirmation de Réservation | REX HOTEL'
  }
];