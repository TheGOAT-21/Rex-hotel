// src/app/core/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  User, 
  UserRole, 
  UserProfile, 
  ClientFilter, 
  ApiResponse,
  PaginatedResult
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  // Récupérer le profil de l'utilisateur connecté
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération du profil utilisateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération du profil utilisateur'));
        })
      );
  }

  // Mettre à jour le profil utilisateur
  updateUserProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`, profileData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour du profil utilisateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du profil utilisateur'));
        })
      );
  }

  // Uploader la pièce d'identité
  uploadIdCard(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('idCard', file);
    
    return this.http.post<ApiResponse<{ idCardUrl: string }>>(`${this.apiUrl}/upload-id-card`, formData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data.idCardUrl;
          }
          throw new Error(response.message || 'Échec d\'upload de la pièce d\'identité');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'upload de la pièce d\'identité'));
        })
      );
  }

  // [ADMIN] Récupérer tous les utilisateurs avec filtres
  getAllUsers(filter?: ClientFilter): Observable<PaginatedResult<User>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.country) params = params.set('country', filter.country);
      if (filter.hasReservations !== undefined) params = params.set('hasReservations', filter.hasReservations.toString());
      if (filter.registeredFrom) params = params.set('registeredFrom', filter.registeredFrom.toISOString());
      if (filter.registeredTo) params = params.set('registeredTo', filter.registeredTo.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    
    return this.http.get<ApiResponse<PaginatedResult<User>>>(`${this.apiUrl}/admin`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des utilisateurs');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des utilisateurs'));
        })
      );
  }

  // [ADMIN] Récupérer un utilisateur par ID
  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Utilisateur non trouvé');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération de l\'utilisateur'));
        })
      );
  }

  // [ADMIN] Créer un nouvel utilisateur
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/admin`, userData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de l\'utilisateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de l\'utilisateur'));
        })
      );
  }

  // [ADMIN] Mettre à jour un utilisateur
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour de l\'utilisateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour de l\'utilisateur'));
        })
      );
  }

  // [ADMIN] Désactiver un utilisateur
  deactivateUser(id: string): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/deactivate`, {})
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de désactivation de l\'utilisateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la désactivation de l\'utilisateur'));
        })
      );
  }

  // [ADMIN] Activer un utilisateur
  activateUser(id: string): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/activate`, {})
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec d\'activation de l\'utilisateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'activation de l\'utilisateur'));
        })
      );
  }

  // [ADMIN] Changer le rôle d'un utilisateur
  changeUserRole(id: string, role: UserRole): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}/role`, { role })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de changement de rôle');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du changement de rôle'));
        })
      );
  }

  // [ADMIN] Réinitialiser le mot de passe d'un utilisateur
  resetUserPassword(id: string): Observable<{ temporaryPassword: string }> {
    return this.http.post<ApiResponse<{ temporaryPassword: string }>>(`${this.apiUrl}/${id}/reset-password`, {})
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de réinitialisation du mot de passe');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la réinitialisation du mot de passe'));
        })
      );
  }

  // [ADMIN] Exporter les données utilisateurs
  exportUsers(format: 'csv' | 'excel', filter?: ClientFilter): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    
    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.country) params = params.set('country', filter.country);
      if (filter.hasReservations !== undefined) params = params.set('hasReservations', filter.hasReservations.toString());
      if (filter.registeredFrom) params = params.set('registeredFrom', filter.registeredFrom.toISOString());
      if (filter.registeredTo) params = params.set('registeredTo', filter.registeredTo.toISOString());
    }
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Erreur lors de l\'exportation des utilisateurs'));
      })
    );
  }

  // [SUPER_ADMIN] Obtenir les administrateurs
  getAdmins(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/admins`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des administrateurs');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des administrateurs'));
        })
      );
  }

  // [SUPER_ADMIN] Créer un administrateur
  createAdmin(adminData: Partial<User>): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/admins`, adminData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de l\'administrateur');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de l\'administrateur'));
        })
      );
  }

  // Obtenir les pays des utilisateurs
  getUserCountries(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/countries`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des pays');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des pays'));
        })
      );
  }
}