// src/app/core/services/espace.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Space, 
  RoomSpace, 
  EventSpace, 
  SpaceAvailability, 
  SpaceFilter, 
  SpaceType,
  ApiResponse,
  PaginatedResult
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspaceService {
  private apiUrl = `${environment.apiUrl}/spaces`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les espaces (avec pagination et filtres optionnels)
  getAllSpaces(filter?: SpaceFilter): Observable<PaginatedResult<Space>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.priceMin) params = params.set('priceMin', filter.priceMin.toString());
      if (filter.priceMax) params = params.set('priceMax', filter.priceMax.toString());
      if (filter.capacityMin) params = params.set('capacityMin', filter.capacityMin.toString());
      if (filter.types && filter.types.length > 0) {
        filter.types.forEach(type => {
          params = params.append('types', type);
        });
      }
      if (filter.views && filter.views.length > 0) {
        filter.views.forEach(view => {
          params = params.append('views', view);
        });
      }
      if (filter.amenities && filter.amenities.length > 0) {
        filter.amenities.forEach(amenity => {
          params = params.append('amenities', amenity);
        });
      }
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.limit) params = params.set('limit', filter.limit.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    
    return this.http.get<ApiResponse<PaginatedResult<Space>>>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des espaces');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des espaces'));
        })
      );
  }

  // Récupérer un espace par ID
  getSpaceById(id: string): Observable<Space> {
    return this.http.get<ApiResponse<Space>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Espace non trouvé');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération de l\'espace'));
        })
      );
  }

  // Récupérer les espaces en vedette
  getFeaturedSpaces(): Observable<Space[]> {
    return this.http.get<ApiResponse<Space[]>>(`${this.apiUrl}/featured`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des espaces en vedette');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des espaces en vedette'));
        })
      );
  }

  // Récupérer les espaces par type
  getSpacesByType(type: SpaceType): Observable<Space[]> {
    return this.http.get<ApiResponse<Space[]>>(`${this.apiUrl}/type/${type}`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des espaces par type');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des espaces par type'));
        })
      );
  }

  // Vérifier la disponibilité d'un espace
  checkAvailability(spaceId: string, startDate: Date, endDate: Date): Observable<SpaceAvailability> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<ApiResponse<SpaceAvailability>>(`${this.apiUrl}/${spaceId}/availability`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de vérification de disponibilité');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la vérification de disponibilité'));
        })
      );
  }

  // Créer un nouvel espace (Admin)
  createSpace(spaceData: Partial<Space>): Observable<Space> {
    return this.http.post<ApiResponse<Space>>(this.apiUrl, spaceData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de l\'espace');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de l\'espace'));
        })
      );
  }

  // Créer une chambre (Admin)
  createRoomSpace(roomData: Partial<RoomSpace>): Observable<RoomSpace> {
    return this.http.post<ApiResponse<RoomSpace>>(`${this.apiUrl}/room`, roomData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de la chambre');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la chambre'));
        })
      );
  }

  // Créer un espace événementiel (Admin)
  createEventSpace(eventData: Partial<EventSpace>): Observable<EventSpace> {
    return this.http.post<ApiResponse<EventSpace>>(`${this.apiUrl}/event`, eventData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de création de l\'espace événementiel');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de l\'espace événementiel'));
        })
      );
  }

  // Mettre à jour un espace (Admin)
  updateSpace(id: string, spaceData: Partial<Space>): Observable<Space> {
    return this.http.put<ApiResponse<Space>>(`${this.apiUrl}/${id}`, spaceData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de mise à jour de l\'espace');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour de l\'espace'));
        })
      );
  }

  // Supprimer un espace (Admin)
  deleteSpace(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de suppression de l\'espace');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de l\'espace'));
        })
      );
  }

  // Bloquer des dates pour un espace (Admin)
  blockDates(spaceId: string, startDate: Date, endDate: Date, reason?: string): Observable<boolean> {
    const blockData = {
      startDate,
      endDate,
      reason
    };
    
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/${spaceId}/block`, blockData)
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de blocage des dates');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du blocage des dates'));
        })
      );
  }

  // Débloquer des dates pour un espace (Admin)
  unblockDates(spaceId: string, startDate: Date, endDate: Date): Observable<boolean> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
      
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${spaceId}/block`, { params })
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de déblocage des dates');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors du déblocage des dates'));
        })
      );
  }

  // Mettre à jour les tarifs d'un espace (Admin)
  updatePricing(spaceId: string, basePrice: number, seasonPrices?: any[]): Observable<boolean> {
    const pricingData = {
      basePrice,
      seasonPrices
    };
    
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${spaceId}/pricing`, pricingData)
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de mise à jour des tarifs');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des tarifs'));
        })
      );
  }

  // Uploader des images pour un espace (Admin)
  uploadSpaceImages(spaceId: string, formData: FormData): Observable<string[]> {
    return this.http.post<ApiResponse<string[]>>(`${this.apiUrl}/${spaceId}/images`, formData)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec d\'upload des images');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'upload des images'));
        })
      );
  }

  // Supprimer une image d'un espace (Admin)
  deleteSpaceImage(spaceId: string, imageUrl: string): Observable<boolean> {
    const params = new HttpParams().set('imageUrl', imageUrl);
    
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${spaceId}/images`, { params })
      .pipe(
        map(response => {
          if (response && response.success) {
            return true;
          }
          throw new Error(response.message || 'Échec de suppression de l\'image');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de l\'image'));
        })
      );
  }
}