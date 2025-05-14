// src/app/routes/spaces.routes.ts

import { Routes } from '@angular/router';

export const SPACES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
  {
    path: ':id', 
    loadComponent: () => import('../features/rooms/room-detail/room-detail.component').then(m => m.DetailPageComponent),
    title: 'Détail de l\'espace | REX HOTEL'
  },
  {
    path: 'rooms',
    children: [
      {
        path: '',
        loadComponent: () => import('../features/espace/eroom-list/eroom-list.component').then(m => m.EspaceListComponent),
        title: 'Chambres & Suites | REX HOTEL',
        data: { filter: { types: ['chambre_executive_twin', 'chambre_king_standard', 'chambre_king_superieure', 'chambre_king_executive', 'suite_luxe', 'suite_presidentielle', 'pentahouse'] } }
      },
      {
        path: ':id',
        loadComponent: () => import('../features/espace/espace-detail/espace-detail.component').then(m => m.EspaceDetailComponent),
        title: 'Détail de la chambre | REX HOTEL'
      }
    ]
  },
  {
    path: 'conference',
    children: [
      {
        path: '',
        loadComponent: () => import('../features/espace/eroom-list/eroom-list.component').then(m => m.EspaceListComponent),
        title: 'Salles de conférence | REX HOTEL',
        data: { filter: { types: ['salle_conference'] } }
      },
      {
        path: ':id',
        loadComponent: () => import('../features/espace/espace-detail/espace-detail.component').then(m => m.EspaceDetailComponent),
        title: 'Détail de la salle de conférence | REX HOTEL'
      }
    ]
  },
  {
    path: 'restaurants',
    children: [
      {
        path: '',
        loadComponent: () => import('../features/espace/room-list/eroom-list.component').then(m => m.EspaceListComponent),
        title: 'Restaurants & Lounges | REX HOTEL',
        data: { filter: { types: ['restaurant', 'lounge'] } }
      },
      {
        path: ':id',
        loadComponent: () => import('../features/espace/espace-detail/espace-detail.component').then(m => m.EspaceDetailComponent),
        title: 'Détail du restaurant | REX HOTEL'
      }
    ]
  }
];