// src/app/core/services/reservation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Reservation, 
  ReservationRequest, 
  ReservationStatus, 
  ReservationWithDetails,
  ReservationFilter,
  Invoice,
  PaymentStatus,
  ApiResponse,
  PaginatedResult
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) { }

  // Créer une nouvelle réservation
  createReservation(reservationRequest: ReservationRequest): Observable<Reservation> {
    return this.http.post<ApiResponse<Reservation>>(this.apiUrl, reservationRequest)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de la réservation');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la réservation'));
        })
      );
  }

  // Obtenir une réservation par ID
  getReservationById(id: string): Observable<ReservationWithDetails> {
    return this.http.get<ApiResponse<ReservationWithDetails>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Réservation non trouvée');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération de la réservation'));
        })
      );
  }

  // Obtenir les réservations de l'utilisateur courant
  getUserReservations(filter?: ReservationFilter): Observable<PaginatedResult<ReservationWithDetails>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.startDateFrom) params = params.set('startDateFrom', filter.startDateFrom.toISOString());
      if (filter.startDateTo) params = params.set('startDateTo', filter.startDateTo.toISOString());
      if (filter.endDateFrom) params = params.set('endDateFrom', filter.endDateFrom.toISOString());
      if (filter.endDateTo) params = params.set('endDateTo', filter.endDateTo.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    
    return this.http.get<ApiResponse<PaginatedResult<ReservationWithDetails>>>(`${this.apiUrl}/user`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des réservations');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des réservations'));
        })
      );
  }

  // Annuler une réservation
  cancelReservation(id: string, reason?: string): Observable<Reservation> {
    return this.http.put<ApiResponse<Reservation>>(`${this.apiUrl}/${id}/cancel`, { reason })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec d\'annulation de la réservation');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'annulation de la réservation'));
        })
      );
  }

  // Calculer le prix d'une réservation potentielle (avant création)
  calculatePrice(spaceId: string, startDate: Date, endDate: Date, numberOfGuests: number): Observable<number> {
    const params = new HttpParams()
      .set('spaceId', spaceId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString())
      .set('numberOfGuests', numberOfGuests.toString());
    
    return this.http.get<ApiResponse<{ totalPrice: number }>>(`${this.apiUrl}/calculate-price`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data.totalPrice;
          }
          throw new Error(response.message || 'Échec de calcul du prix');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du calcul du prix'));
        })
      );
  }

  // Obtenir la facture d'une réservation
  getReservationInvoice(reservationId: string): Observable<Invoice> {
    return this.http.get<ApiResponse<Invoice>>(`${this.apiUrl}/${reservationId}/invoice`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Facture non trouvée');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération de la facture'));
        })
      );
  }

  // Ajouter une demande spéciale à une réservation
  addSpecialRequest(reservationId: string, specialRequest: string): Observable<Reservation> {
    return this.http.put<ApiResponse<Reservation>>(`${this.apiUrl}/${reservationId}/special-request`, { specialRequest })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec d\'ajout de la demande spéciale');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'ajout de la demande spéciale'));
        })
      );
  }

  // [ADMIN] Obtenir toutes les réservations avec filtres
  getAllReservations(filter?: ReservationFilter): Observable<PaginatedResult<ReservationWithDetails>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.userId) params = params.set('userId', filter.userId);
      if (filter.spaceId) params = params.set('spaceId', filter.spaceId);
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.startDateFrom) params = params.set('startDateFrom', filter.startDateFrom.toISOString());
      if (filter.startDateTo) params = params.set('startDateTo', filter.startDateTo.toISOString());
      if (filter.endDateFrom) params = params.set('endDateFrom', filter.endDateFrom.toISOString());
      if (filter.endDateTo) params = params.set('endDateTo', filter.endDateTo.toISOString());
      if (filter.createdAtFrom) params = params.set('createdAtFrom', filter.createdAtFrom.toISOString());
      if (filter.createdAtTo) params = params.set('createdAtTo', filter.createdAtTo.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    
    return this.http.get<ApiResponse<PaginatedResult<ReservationWithDetails>>>(`${this.apiUrl}/admin`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des réservations');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des réservations'));
        })
      );
  }

  // [ADMIN] Mettre à jour le statut d'une réservation
  updateReservationStatus(reservationId: string, status: ReservationStatus): Observable<Reservation> {
    return this.http.put<ApiResponse<Reservation>>(`${this.apiUrl}/${reservationId}/status`, { status })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour du statut');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du statut'));
        })
      );
  }

  // [ADMIN] Mettre à jour le statut de paiement d'une réservation
  updatePaymentStatus(reservationId: string, paymentStatus: PaymentStatus, paidAmount?: number): Observable<Reservation> {
    return this.http.put<ApiResponse<Reservation>>(`${this.apiUrl}/${reservationId}/payment`, { 
      paymentStatus, 
      paidAmount 
    })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour du statut de paiement');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du statut de paiement'));
        })
      );
  }

  // [ADMIN] Marquer une réservation comme contactée par le commercial
  markAsContacted(reservationId: string): Observable<Reservation> {
    return this.http.put<ApiResponse<Reservation>>(`${this.apiUrl}/${reservationId}/contacted`, {})
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de marquage comme contacté');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du marquage comme contacté'));
        })
      );
  }

  // [ADMIN] Générer une facture pour une réservation
  generateInvoice(reservationId: string): Observable<Invoice> {
    return this.http.post<ApiResponse<Invoice>>(`${this.apiUrl}/${reservationId}/invoice`, {})
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de génération de la facture');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la génération de la facture'));
        })
      );
  }

  // [ADMIN] Obtenir les réservations par espace
  getReservationsBySpace(spaceId: string, filter?: ReservationFilter): Observable<PaginatedResult<ReservationWithDetails>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.startDateFrom) params = params.set('startDateFrom', filter.startDateFrom.toISOString());
      if (filter.startDateTo) params = params.set('startDateTo', filter.startDateTo.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    
    return this.http.get<ApiResponse<PaginatedResult<ReservationWithDetails>>>(`${this.apiUrl}/space/${spaceId}`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des réservations');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des réservations'));
        })
      );
  }

  // [ADMIN] Obtenir les réservations par client
  getReservationsByUser(userId: string, filter?: ReservationFilter): Observable<PaginatedResult<ReservationWithDetails>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.startDateFrom) params = params.set('startDateFrom', filter.startDateFrom.toISOString());
      if (filter.startDateTo) params = params.set('startDateTo', filter.startDateTo.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    
    return this.http.get<ApiResponse<PaginatedResult<ReservationWithDetails>>>(`${this.apiUrl}/user/${userId}/admin`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des réservations');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des réservations'));
        })
      );
  }

  // [ADMIN] Exporter les réservations en CSV ou Excel
  exportReservations(format: 'csv' | 'excel', filter?: ReservationFilter): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    
    if (filter) {
      if (filter.userId) params = params.set('userId', filter.userId);
      if (filter.spaceId) params = params.set('spaceId', filter.spaceId);
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach(status => {
          params = params.append('status', status);
        });
      }
      if (filter.startDateFrom) params = params.set('startDateFrom', filter.startDateFrom.toISOString());
      if (filter.startDateTo) params = params.set('startDateTo', filter.startDateTo.toISOString());
      if (filter.endDateFrom) params = params.set('endDateFrom', filter.endDateFrom.toISOString());
      if (filter.endDateTo) params = params.set('endDateTo', filter.endDateTo.toISOString());
    }
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Erreur lors de l\'exportation des réservations'));
      })
    );
  }
}