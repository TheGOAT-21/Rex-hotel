// src/app/core/services/statistics.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  OccupancyData,
  RevenueData,
  PopularityData,
  OriginData,
  DashboardStats,
  StatisticsFilter,
  SpaceTypeStatistics,
  MonthlyStatistics,
  PeriodComparison,
  ApiResponse
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) { }

  // Récupérer les statistiques du tableau de bord
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard`)
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des statistiques du tableau de bord');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des statistiques du tableau de bord'));
        })
      );
  }

  // Récupérer les statistiques d'occupation
  getOccupancyRate(filter: StatisticsFilter): Observable<OccupancyData> {
    const params = this.buildFilterParams(filter);
    
    return this.http.get<ApiResponse<OccupancyData>>(`${this.apiUrl}/occupancy`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des taux d\'occupation');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des taux d\'occupation'));
        })
      );
  }

  // Récupérer les statistiques de revenus
  getRevenue(filter: StatisticsFilter): Observable<RevenueData> {
    const params = this.buildFilterParams(filter);
    
    return this.http.get<ApiResponse<RevenueData>>(`${this.apiUrl}/revenue`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des revenus');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des revenus'));
        })
      );
  }

  // Récupérer les statistiques de popularité des espaces
  getPopularityStats(filter: StatisticsFilter): Observable<PopularityData> {
    const params = this.buildFilterParams(filter);
    
    return this.http.get<ApiResponse<PopularityData>>(`${this.apiUrl}/popularity`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des statistiques de popularité');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des statistiques de popularité'));
        })
      );
  }

  // Récupérer les statistiques sur l'origine des clients
  getClientOrigins(filter: StatisticsFilter): Observable<OriginData> {
    const params = this.buildFilterParams(filter);
    
    return this.http.get<ApiResponse<OriginData>>(`${this.apiUrl}/origins`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des origines des clients');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des origines des clients'));
        })
      );
  }

  // Récupérer les statistiques par type d'espace
  getSpaceTypeStats(filter: StatisticsFilter): Observable<SpaceTypeStatistics[]> {
    const params = this.buildFilterParams(filter);
    
    return this.http.get<ApiResponse<SpaceTypeStatistics[]>>(`${this.apiUrl}/space-types`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des statistiques par type d\'espace');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des statistiques par type d\'espace'));
        })
      );
  }

  // Récupérer les statistiques mensuelles
  getMonthlyStats(year: number): Observable<MonthlyStatistics[]> {
    const params = new HttpParams().set('year', year.toString());
    
    return this.http.get<ApiResponse<MonthlyStatistics[]>>(`${this.apiUrl}/monthly`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des statistiques mensuelles');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des statistiques mensuelles'));
        })
      );
  }

  // Comparer deux périodes
  comparePeriods(currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date): Observable<PeriodComparison> {
    const params = new HttpParams()
      .set('currentStart', currentStart.toISOString())
      .set('currentEnd', currentEnd.toISOString())
      .set('previousStart', previousStart.toISOString())
      .set('previousEnd', previousEnd.toISOString());
    
    return this.http.get<ApiResponse<PeriodComparison>>(`${this.apiUrl}/compare`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de comparaison des périodes');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la comparaison des périodes'));
        })
      );
  }

  // Obtenir des prévisions pour les prochains mois
  getForecast(months: number): Observable<MonthlyStatistics[]> {
    const params = new HttpParams().set('months', months.toString());
    
    return this.http.get<ApiResponse<MonthlyStatistics[]>>(`${this.apiUrl}/forecast`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Échec de récupération des prévisions');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erreur lors de la récupération des prévisions'));
        })
      );
  }

  // Exporter les statistiques en CSV ou Excel
  exportStatistics(filter: StatisticsFilter, format: 'csv' | 'excel'): Observable<Blob> {
    let params = this.buildFilterParams(filter).set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Erreur lors de l\'exportation des statistiques'));
      })
    );
  }

  // Méthode privée pour construire les paramètres de filtre
  private buildFilterParams(filter: StatisticsFilter): HttpParams {
    let params = new HttpParams()
      .set('startDate', filter.startDate.toISOString())
      .set('endDate', filter.endDate.toISOString());
    
    if (filter.spaceTypes && filter.spaceTypes.length > 0) {
      filter.spaceTypes.forEach(type => {
        params = params.append('spaceTypes', type);
      });
    }
    
    if (filter.compareWithPrevious !== undefined) {
      params = params.set('compareWithPrevious', filter.compareWithPrevious.toString());
    }
    
    if (filter.groupBy) {
      params = params.set('groupBy', filter.groupBy);
    }
    
    return params;
  }
}