// src/app/routes/profile.routes.ts

import { Routes } from '@angular/router';
//import { authGuard } from '../core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/profile/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
    title: 'Mon profil | REX HOTEL',
//    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        loadComponent: () => import('../features/profile/profile-info/profile-info.component').then(m => m.ProfileInfoComponent),
        title: 'Mes informations personnelles | REX HOTEL'
      },
      {
        path: 'reservations',
        loadComponent: () => import('../features/profile/profile-reservations/profile-reservations.component').then(m => m.ProfileReservationsComponent),
        title: 'Mes réservations | REX HOTEL'
      },
      {
        path: 'invoices',
        loadComponent: () => import('../features/profile/profile-invoices/profile-invoices.component').then(m => m.ProfileInvoicesComponent),
        title: 'Mes factures | REX HOTEL'
      },
      {
        path: 'settings',
        loadComponent: () => import('../features/profile/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent),
        title: 'Paramètres du compte | REX HOTEL'
      },
      {
        path: 'security',
        loadComponent: () => import('../features/profile/profile-security/profile-security.component').then(m => m.ProfileSecurityComponent),
        title: 'Sécurité du compte | REX HOTEL'
      }
    ]
  },
  {
    path: 'edit',
    loadComponent: () => import('../features/profile/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
    title: 'Modifier mon profil | REX HOTEL',
//    canActivate: [authGuard]
  }
];