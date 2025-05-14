// src/app/routes/catalog.routes.ts

import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/rooms-list/rooms-list.component').then(m => m.RoomsListComponent),
    title: 'Catalogue des espaces | REX HOTEL'
  },
  {
    path: 'rooms',
    loadComponent: () => import('../features/rooms-list/rooms-list.component').then(m => m.RoomsListComponent),
    title: 'Chambres & Suites | REX HOTEL',
    data: { filter: { types: ['chambre_executive_twin', 'chambre_king_standard', 'chambre_king_superieure', 'chambre_king_executive', 'suite_luxe', 'suite_presidentielle', 'pentahouse'] } }
  },
  {
    path: 'events',
    loadComponent: () => import('../features/rooms-list/rooms-list.component').then(m => m.RoomsListComponent),
    title: 'Espaces événementiels | REX HOTEL',
    data: { filter: { types: ['salle_conference', 'salle_reunion', 'restaurant', 'lounge'] } }
  }
];