// src/app/routes/admin.routes.ts

import { Routes } from '@angular/router';
import { superAdminGuard } from '../core/guards/super-admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/admin/admin-page/admin-page.component').then(m => m.AdminPageComponent),
    title: 'Tableau de bord | Administration REX HOTEL',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Tableau de bord | Administration REX HOTEL'
      },
      {
        path: 'spaces',
        loadComponent: () => import('../features/admin/spaces/space-manager/space-manager.component').then(m => m.SpaceManagerComponent),
        title: 'Gestion des espaces | Administration REX HOTEL'
      },
      {
        path: 'espace-management',
        loadComponent: () => import('../features/admin/espace-management/espace-management.component').then(m => m.EspaceManagementComponent),
        title: 'Gestion des espaces détaillée | Administration REX HOTEL'
      },
      {
        path: 'reservations',
        loadComponent: () => import('../features/admin/reservations/reservations.component').then(m => m.ReservationsComponent),
        title: 'Réservations | Administration REX HOTEL'
      },
      {
        path: 'reservation-management',
        loadComponent: () => import('../features/admin/reservation-management/reservation-management.component').then(m => m.ReservationManagementComponent),
        title: 'Gestion des réservations | Administration REX HOTEL'
      },
      {
        path: 'clients',
        loadComponent: () => import('../features/admin/clients/clients.component').then(m => m.ClientsComponent),
        title: 'Clients | Administration REX HOTEL'
      },
      {
        path: 'user-management',
        canActivate: [SuperAdminGuard],
        loadComponent: () => import('../features/admin/user-management/user-management.component').then(m => m.UserManagementComponent),
        title: 'Gestion des utilisateurs | Administration REX HOTEL'
      },
      {
        path: 'statistics',
        loadComponent: () => import('../features/admin/statistics/statistics.component').then(m => m.StatisticsComponent),
        title: 'Statistiques | Administration REX HOTEL'
      },
      {
        path: 'settings',
        canActivate: [SuperAdminGuard],
        loadComponent: () => import('../features/admin/settings/settings-manager/settings-manager.component').then(m => m.SettingsManagerComponent),
        title: 'Paramètres | Administration REX HOTEL'
      },
      {
        path: 'invoices',
        loadComponent: () => import('../features/admin/invoices/invoice-management/invoice-management.component').then(m => m.InvoiceManagementComponent),
        title: 'Factures | Administration REX HOTEL'
      }
    ]
  }
];