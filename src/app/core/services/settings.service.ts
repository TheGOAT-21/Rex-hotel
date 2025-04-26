// src/app/core/services/settings.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  HotelSettings, 
  EmailSettings, 
  PaymentSettings, 
  SystemSettings, 
  ApiResponse 
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;
  
  private hotelSettingsSubject = new BehaviorSubject<HotelSettings | null>(null);
  hotelSettings$ = this.hotelSettingsSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Charger les paramètres de l'hôtel au démarrage
    this.loadHotelSettings();
  }
  
  // Paramètres de l'hôtel
  getHotelSettings(): Observable<HotelSettings> {
    return this.http.get<ApiResponse<HotelSettings>>(`${this.apiUrl}/hotel`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            this.hotelSettingsSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des paramètres de l\'hôtel');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des paramètres de l\'hôtel'));
        })
      );
  }
  
  updateHotelSettings(settings: Partial<HotelSettings>): Observable<HotelSettings> {
    return this.http.put<ApiResponse<HotelSettings>>(`${this.apiUrl}/hotel`, settings)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            this.hotelSettingsSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour des paramètres de l\'hôtel');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des paramètres de l\'hôtel'));
        })
      );
  }
  
  // Paramètres d'email
  getEmailSettings(): Observable<EmailSettings> {
    return this.http.get<ApiResponse<EmailSettings>>(`${this.apiUrl}/email`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des paramètres d\'email');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des paramètres d\'email'));
        })
      );
  }
  
  updateEmailSettings(settings: Partial<EmailSettings>): Observable<EmailSettings> {
    return this.http.put<ApiResponse<EmailSettings>>(`${this.apiUrl}/email`, settings)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour des paramètres d\'email');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des paramètres d\'email'));
        })
      );
  }
  
  // Paramètres de paiement
  getPaymentSettings(): Observable<PaymentSettings> {
    return this.http.get<ApiResponse<PaymentSettings>>(`${this.apiUrl}/payment`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des paramètres de paiement');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des paramètres de paiement'));
        })
      );
  }
  
  updatePaymentSettings(settings: Partial<PaymentSettings>): Observable<PaymentSettings> {
    return this.http.put<ApiResponse<PaymentSettings>>(`${this.apiUrl}/payment`, settings)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour des paramètres de paiement');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des paramètres de paiement'));
        })
      );
  }
  
  // Paramètres système
  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<ApiResponse<SystemSettings>>(`${this.apiUrl}/system`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des paramètres système');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des paramètres système'));
        })
      );
  }
  
  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    return this.http.put<ApiResponse<SystemSettings>>(`${this.apiUrl}/system`, settings)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour des paramètres système');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des paramètres système'));
        })
      );
  }
  
  // Tester la connexion SMTP
  testSmtpConnection(smtpSettings: any): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/email/test-smtp`, smtpSettings)
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec du test SMTP');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du test SMTP'));
        })
      );
  }
  
  // Activer/désactiver le mode maintenance
  setMaintenanceMode(active: boolean, message?: string, plannedEndTime?: Date): Observable<SystemSettings> {
    const maintenanceData = {
      isInMaintenance: active,
      maintenanceMessage: message || 'Site en maintenance. Veuillez réessayer plus tard.',
      plannedEndTime: plannedEndTime
    };
    
    return this.http.put<ApiResponse<SystemSettings>>(`${this.apiUrl}/system/maintenance`, maintenanceData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour du mode maintenance');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du mode maintenance'));
        })
      );
  }
  
  // Méthodes pour récupérer les paramètres publics (accessibles sans authentification)
  getPublicSettings(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/public`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des paramètres publics');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des paramètres publics'));
        })
      );
  }
  
  // Uploader le logo de l'hôtel
  uploadLogo(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('logo', file);
    
    return this.http.post<ApiResponse<{ logoUrl: string }>>(`${this.apiUrl}/hotel/logo`, formData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            // Mettre à jour les paramètres locaux
            const currentSettings = this.hotelSettingsSubject.value;
            if (currentSettings) {
              const updatedSettings = { ...currentSettings, logo: response.data.logoUrl };
              this.hotelSettingsSubject.next(updatedSettings);
            }
            
            return response.data.logoUrl;
          }
          throw new Error(response.message || 'Échec d\'upload du logo');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'upload du logo'));
        })
      );
  }
  
  // Méthodes privées
  private loadHotelSettings(): void {
    this.getHotelSettings().subscribe({
      error: (error) => {
        console.error('Erreur lors du chargement des paramètres de l\'hôtel', error);
      }
    });
  }
}