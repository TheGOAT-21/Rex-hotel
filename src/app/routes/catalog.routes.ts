// src/app/routes/catalog.routes.ts

import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/catalog/catalog-page/catalog-page.component').then(m => m.CatalogPageComponent),
    title: 'Catalogue des espaces | REX HOTEL'
  },
  {
    path: 'rooms',
    loadComponent: () => import('../features/catalog/catalog-page/catalog-page.component').then(m => m.CatalogPageComponent),
    title: 'Chambres & Suites | REX HOTEL',
    data: { filter: { types: ['chambre_executive_twin', 'chambre_king_standard', 'chambre_king_superieure', 'chambre_king_executive', 'suite_luxe', 'suite_presidentielle', 'pentahouse'] } }
  },
  {
    path: 'events',
    loadComponent: () => import('../features/catalog/catalog-page/catalog-page.component').then(m => m.CatalogPageComponent),
    title: 'Espaces événementiels | REX HOTEL',
    data: { filter: { types: ['salle_conference', 'salle_reunion', 'restaurant', 'lounge'] } }
  },
  {
    path: 'amenities',
    loadComponent: () => import('../features/catalog/amenities-page/amenities-page.component').then(m => m.AmenitiesPageComponent),
    title: 'Équipements & Services | REX HOTEL'
  }
];