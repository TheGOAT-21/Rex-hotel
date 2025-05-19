import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home-page/home-page.component').then(c => c.HomePageComponent),
        title: 'Accueil | REX HOTEL'
      },
      {
        path: 'rooms',
        loadChildren: () => import('./routes/rooms.routes').then(routes => routes.ROOMS_ROUTES),
      },
      {
        path: 'services',
        loadComponent: () => import('./features/services/services-page/services-page.component').then(c => c.ServicesPageComponent),
        title: 'Nos Services | REX HOTEL'
      },
      {
        path: 'services/:id',
        loadComponent: () => import('./features/services/service-detail/service-detail.component').then(c => c.ServiceDetailComponent),
        title: 'Service | REX HOTEL'
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact-page/contact-page.component').then(c => c.ContactPageComponent),
        title: 'Contact | REX HOTEL'
      },
      {
        path: 'reservation',
        loadChildren: () => import('./routes/reservation.routes').then(m => m.RESERVATION_ROUTES),
      },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    loadChildren: () => import('./routes/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'error',
    loadChildren: () => import('./routes/errors.routes').then(m => m.ERRORS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];