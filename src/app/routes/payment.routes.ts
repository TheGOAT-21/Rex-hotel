
// src/app/routes/payment.routes.ts
import { Routes } from '@angular/router';
//import { authGuard } from '../core/guards/auth.guard';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'checkout',
    pathMatch: 'full'
  },
  {
    path: 'checkout/:reservationId',
    loadComponent: () => import('../features/payment/payment-page/payment-page.component').then(m => m.PaymentPageComponent),
    title: 'Paiement | REX HOTEL',
//    canActivate: [authGuard]
  },
  {
    path: 'confirmation/:reservationId',
    loadComponent: () => import('../features/payment/payment-confirmation/payment-confirmation.component').then(m => m.PaymentConfirmationComponent),
    title: 'Confirmation de paiement | REX HOTEL',
//    canActivate: [authGuard]
  },
  {
    path: 'cancel/:reservationId',
    loadComponent: () => import('../features/payment/payment-cancel/payment-cancel.component').then(m => m.PaymentCancelComponent),
    title: 'Annulation de paiement | REX HOTEL',
//    canActivate: [authGuard]
  }
];