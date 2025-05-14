// src/app/routes/rooms.routes.ts

import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // 1. Accueil (/)
      {
        path: '',
        loadComponent: () => import('../features/home/home-page/home-page.component')
          .then(m => m.HomePageComponent),
        title: 'Accueil | REX HOTEL'
      },

      // 2. Catalogue des chambres (/catalog)
      {
        path: 'catalog',
        children: [
          {
            path: '',
            loadComponent: () => import('../features/rooms/rooms-list/rooms-list.component')
              .then(m => m.RoomsListComponent),
            title: 'Nos Chambres | REX HOTEL'
          },
          {
            path: ':id',
            loadComponent: () => import('../features/rooms/room-detail/room-detail.component')
              .then(m => m.RoomDetailComponent),
            title: 'Détail de la chambre | REX HOTEL'
          }
        ]
      },

      // 3. Services (/services)
      {
        path: 'services',
        loadComponent: () => import('../features/services/services-page/services-page.component')
          .then(m => m.ServicesPageComponent),
        title: 'Nos Services | REX HOTEL'
      },

      // 4. Contact (/contact)
      {
        path: 'contact',
        loadComponent: () => import('../features/static/contact-page/contact-page.component')
          .then(m => m.ContactPageComponent),
        title: 'Contact | REX HOTEL'
      },

      // 5. Réservation (/reservation)
      {
        path: 'reservation',
        children: [
          {
            path: '',
            loadComponent: () => import('../features/reservation/reservation-search/reservation-search.component')
              .then(m => m.ReservationSearchComponent),
            title: 'Réservation | REX HOTEL'
          },
          {
            path: 'form',
            loadComponent: () => import('../features/reservation/reservation-form/reservation-form.component')
              .then(m => m.ReservationFormComponent),
            title: 'Formulaire de Réservation | REX HOTEL'
          },
          {
            path: 'confirmation',
            loadComponent: () => import('../features/reservation/reservation-confirmation/reservation-confirmation.component')
              .then(m => m.ReservationConfirmationComponent),
            title: 'Confirmation de Réservation | REX HOTEL'
          }
        ]
      },

    ]
  },

  // Route pour les erreurs
  {
    path: '**',
    redirectTo: ''
  }
];