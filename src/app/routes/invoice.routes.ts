// src/app/routes/invoice.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const INVOICE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/invoice/invoice-page/invoice-page.component').then(m => m.InvoicePageComponent),
    title: 'Factures | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('../features/invoice/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent),
    title: 'Détail de la facture | REX HOTEL',
    canActivate: [authGuard]
  },
  {
    path: ':id/download',
    loadComponent: () => import('../features/invoice/invoice-download/invoice-download.component').then(m => m.InvoiceDownloadComponent),
    title: 'Téléchargement de la facture | REX HOTEL',
    canActivate: [authGuard]
  }
];
