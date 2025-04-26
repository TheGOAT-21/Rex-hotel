// src/app/routes/auth.routes.ts

import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/auth/auth-page/auth-page.component').then(m => m.AuthPageComponent),
    title: 'Authentification | REX HOTEL',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('../features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Connexion | REX HOTEL'
      },
      {
        path: 'register',
        loadComponent: () => import('../features/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Inscription | REX HOTEL'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('../features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'Mot de passe oublié | REX HOTEL'
      },
      {
        path: 'reset-password',
        loadComponent: () => import('../features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        title: 'Réinitialisation du mot de passe | REX HOTEL'
      }
    ]
  }
];