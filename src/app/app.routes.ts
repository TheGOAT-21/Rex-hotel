// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
//import { adminGuard } from './core/guards/admin.guard';
//import { superAdminGuard } from './core/guards/super-admin.guard';

export const routes: Routes = [
  // Routes publiques avec le MainLayout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home-page/home-page.component').then(m => m.HomePageComponent),
        title: 'REX HOTEL - Élégance & Confort | Yamoussoukro'
      },
      {
        path: 'catalog',
        loadChildren: () => import('./routes/catalog.routes').then(m => m.CATALOG_ROUTES)
      },
      {
        path: 'spaces',
        loadChildren: () => import('./routes/spaces.routes').then(m => m.SPACES_ROUTES)
      },
      {
        path: 'reservation',
        loadChildren: () => import('./routes/reservation.routes').then(m => m.RESERVATION_ROUTES)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./routes/profile.routes').then(m => m.PROFILE_ROUTES)
      },
      {
        path: 'payment',
        canActivate: [authGuard],
        loadChildren: () => import('./routes/payment.routes').then(m => m.PAYMENT_ROUTES)
      },
      {
        path: 'invoice',
        canActivate: [authGuard],
        loadChildren: () => import('./routes/invoice.routes').then(m => m.INVOICE_ROUTES)
      },
      // Pages statiques
      {
        path: 'about',
        loadComponent: () => import('./features/static/about-page/about-page.component').then(m => m.AboutPageComponent),
        title: 'À propos | REX HOTEL'
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/static/contact-page/contact-page.component').then(m => m.ContactPageComponent),
        title: 'Contact | REX HOTEL'
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/static/faq-page/faq-page.component').then(m => m.FaqPageComponent),
        title: 'FAQ | REX HOTEL'
      },
      {
        path: 'services',
        loadComponent: () => import('./features/static/services-page/services-page.component').then(m => m.ServicesPageComponent),
        title: 'Services | REX HOTEL'
      },
      // Pages légales
      {
        path: 'legal',
        loadChildren: () => import('./routes/legal.routes').then(m => m.LEGAL_ROUTES)
      },
      // Notifications
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadChildren: () => import('./routes/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES)
      }
    ]
  },

  // Routes Admin - Lazy Loading
  {
    path: 'admin',
    component: AdminLayoutComponent,
    //canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./routes/admin.routes').then(m => m.ADMIN_ROUTES),
    title: 'Administration | REX HOTEL'
  },

  // Route d'authentification
  {
    path: 'auth',
    loadChildren: () => import('./routes/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Pages d'erreur
  {
    path: 'error',
    loadChildren: () => import('./routes/errors.routes').then(m => m.ERRORS_ROUTES)
  },
  // Redirection vers 404
  {
    path: '**',
    redirectTo: 'error/404'
  }
];