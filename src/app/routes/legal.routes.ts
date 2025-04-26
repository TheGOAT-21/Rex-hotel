// src/app/routes/legal.routes.ts
import { Routes } from '@angular/router';

export const LEGAL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'terms',
    pathMatch: 'full'
  },
  {
    path: 'terms',
    loadComponent: () => import('../features/legal/terms-page/terms-page.component').then(m => m.TermsPageComponent),
    title: 'Conditions Générales | REX HOTEL'
  },
  {
    path: 'privacy',
    loadComponent: () => import('../features/legal/privacy-page/privacy-page.component').then(m => m.PrivacyPageComponent),
    title: 'Politique de Confidentialité | REX HOTEL'
  },
  {
    path: 'cookies',
    loadComponent: () => import('../features/legal/cookies-page/cookies-page.component').then(m => m.CookiesPageComponent),
    title: 'Politique de Cookies | REX HOTEL'
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('../features/legal/legal-notice-page/legal-notice-page.component').then(m => m.LegalNoticePageComponent),
    title: 'Mentions Légales | REX HOTEL'
  }
];