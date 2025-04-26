// src/app/routes/errors.routes.ts
import { Routes } from '@angular/router';

export const ERRORS_ROUTES: Routes = [
  {
    path: '404',
    loadComponent: () => import('../features/errors/error-404-page/error-404-page.component').then(m => m.Error404PageComponent),
    title: 'Page non trouvée | REX HOTEL'
  },
  {
    path: '500',
    loadComponent: () => import('../features/errors/error-500-page/error-500-page.component').then(m => m.Error500PageComponent),
    title: 'Erreur serveur | REX HOTEL'
  },
  {
    path: 'maintenance',
    loadComponent: () => import('../features/errors/error-maintenance-page/error-maintenance-page.component').then(m => m.ErrorMaintenancePageComponent),
    title: 'Site en maintenance | REX HOTEL'
  }
];