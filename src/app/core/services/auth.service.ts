// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserLogin, UserRegistration, UserRole, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Tenter de restaurer la session au démarrage
    this.restoreUserSession();
  }

  login(credentials: UserLogin): Observable<User> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            this.setUserData(response.data.user, response.data.token);
            return response.data.user;
          }
          throw new Error(response.message || 'Échec de la connexion');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la connexion'));
        })
      );
  }

  register(userData: UserRegistration): Observable<User> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            this.setUserData(response.data.user, response.data.token);
            return response.data.user;
          }
          throw new Error(response.message || 'Échec de l\'inscription');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'inscription'));
        })
      );
  }

  logout(): void {
    // Supprimer le token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userData');
    
    // Réinitialiser l'utilisateur courant
    this.currentUserSubject.next(null);
    
    // Effacer le timer d'expiration
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    // Rediriger vers la page d'accueil
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN);
  }

  isSuperAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === UserRole.SUPER_ADMIN;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${environment.apiUrl}/users/profile`, userData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            // Mettre à jour les données utilisateur dans le localStorage
            const currentUser = this.getCurrentUser();
            if (currentUser) {
              const updatedUser = { ...currentUser, ...response.data };
              this.currentUserSubject.next(updatedUser);
              localStorage.setItem('userData', JSON.stringify(updatedUser));
            }
            return response.data;
          }
          throw new Error(response.message || 'Échec de la mise à jour du profil');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du profil'));
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/users/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      map(response => {
        if (response && response.success) {
          return true;
        }
        throw new Error(response.message || 'Échec du changement de mot de passe');
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erreur lors du changement de mot de passe'));
      })
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de l\'envoi du lien de réinitialisation');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'envoi du lien de réinitialisation'));
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      map(response => {
        if (response && response.success) {
          return true;
        }
        throw new Error(response.message || 'Échec de la réinitialisation du mot de passe');
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erreur lors de la réinitialisation du mot de passe'));
      })
    );
  }

  // Méthodes privées
  private setUserData(user: User, token: string): void {
    // Stocker les données dans localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));
    
    // Calculer et stocker l'expiration du token (par exemple, 24h)
    const expirationDate = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('tokenExpiration', expirationDate.toString());
    
    // Mettre à jour l'utilisateur courant
    this.currentUserSubject.next(user);
    
    // Configurer l'auto-déconnexion
    this.autoLogout(24 * 60 * 60 * 1000);
  }

  private restoreUserSession(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !userData || !tokenExpiration) {
      return;
    }
    
    const expirationDate = new Date(+tokenExpiration);
    const now = new Date();
    
    // Vérifier si le token n'est pas expiré
    if (expirationDate <= now) {
      this.logout();
      return;
    }
    
    // Restaurer la session
    const user: User = JSON.parse(userData);
    this.currentUserSubject.next(user);
    
    // Configurer l'auto-déconnexion pour le temps restant
    const expirationDuration = expirationDate.getTime() - now.getTime();
    this.autoLogout(expirationDuration);
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}