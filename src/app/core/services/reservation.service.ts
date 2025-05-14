// src/app/core/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { 
  Reservation, 
  ReservationRequest, 
  ReservationStatus,
  Payment 
} from '../models';
import { RESERVATIONS, ROOMS } from '../mocks/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservations: Reservation[] = [...RESERVATIONS];
  private rooms = ROOMS;

  constructor() { }

  /**
   * Récupère toutes les réservations avec filtrage (pour l'admin)
   */
  getAllReservations(filter?: {
    status?: ReservationStatus,
    startDate?: Date,
    endDate?: Date,
    search?: string,
    page?: number,
    limit?: number
  }): Observable<{items: Reservation[], total: number}> {
    let filteredReservations = [...this.reservations];
    
    if (filter) {
      // Filtrer par statut
      if (filter.status) {
        filteredReservations = filteredReservations.filter(res => res.status === filter.status);
      }
      
      // Filtrer par date de début
      if (filter.startDate) {
        filteredReservations = filteredReservations.filter(res => 
          new Date(res.startDate) >= new Date(filter.startDate!)
        );
      }
      
      // Filtrer par date de fin
      if (filter.endDate) {
        filteredReservations = filteredReservations.filter(res => 
          new Date(res.endDate) <= new Date(filter.endDate!)
        );
      }
      
      // Filtrer par recherche (nom, email, etc.)
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredReservations = filteredReservations.filter(res => 
          res.guestInfo.firstName.toLowerCase().includes(searchTerm) ||
          res.guestInfo.lastName.toLowerCase().includes(searchTerm) ||
          res.guestInfo.email.toLowerCase().includes(searchTerm) ||
          res.id?.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    // Enrichir les réservations avec les infos de chambre
    const enrichedReservations = filteredReservations.map(reservation => {
      const room = this.rooms.find(r => r.id === reservation.roomId);
      return {
        ...reservation,
        room
      };
    });
    
    // Tri par date (plus récente d'abord)
    enrichedReservations.sort((a, b) => 
      new Date(b.createdAt || new Date()).getTime() - 
      new Date(a.createdAt || new Date()).getTime()
    );
    
    // Calculer le nombre total pour la pagination
    const total = enrichedReservations.length;
    
    // Appliquer la pagination
    let paginatedReservations = enrichedReservations;
    if (filter?.page && filter?.limit) {
      const startIndex = (filter.page - 1) * filter.limit;
      paginatedReservations = enrichedReservations.slice(startIndex, startIndex + filter.limit);
    }
    
    return of({
      items: paginatedReservations,
      total
    }).pipe(delay(500));
  }

  /**
   * Récupère une réservation par ID
   */
  getReservationById(id: string): Observable<Reservation> {
    const reservation = this.reservations.find(r => r.id === id);
    
    if (!reservation) {
      return throwError(() => new Error(`Reservation with id ${id} not found`));
    }
    
    // Ajouter les infos de la chambre
    const room = this.rooms.find(r => r.id === reservation.roomId);
    const enrichedReservation = {
      ...reservation,
      room
    };
    
    return of(enrichedReservation).pipe(delay(300));
  }

  /**
   * Récupère les réservations d'un client par email
   */
  getReservationsByEmail(email: string): Observable<Reservation[]> {
    const clientReservations = this.reservations
      .filter(res => res.guestInfo.email.toLowerCase() === email.toLowerCase())
      .map(reservation => {
        const room = this.rooms.find(r => r.id === reservation.roomId);
        return {
          ...reservation,
          room
        };
      });
    
    return of(clientReservations).pipe(delay(300));
  }

  /**
   * Crée une nouvelle réservation
   */
  createReservation(request: ReservationRequest): Observable<Reservation> {
    // Vérifier que la chambre existe
    const room = this.rooms.find(r => r.id === request.roomId);
    if (!room) {
      return throwError(() => new Error(`Room with id ${request.roomId} not found`));
    }
    
    // Vérifier que la chambre est disponible pour les dates
    const isAvailable = this.isRoomAvailable(request.roomId, request.startDate, request.endDate);
    if (!isAvailable) {
      return throwError(() => new Error('Room is not available for the selected dates'));
    }
    
    // Calculer le prix total
    const nights = this.calculateNights(request.startDate, request.endDate);
    const totalPrice = (room.discountedPrice || room.price) * nights;
    
    // Créer la nouvelle réservation
    const newReservation: Reservation = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      roomId: request.roomId,
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      numberOfGuests: request.numberOfGuests,
      guestInfo: request.guestInfo,
      specialRequests: request.specialRequests,
      status: 'pending',
      totalPrice,
      payment: request.payment,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ajouter au tableau des réservations
    this.reservations.push(newReservation);
    
    // Ajouter les infos de la chambre dans la réponse
    const responseReservation = {
      ...newReservation,
      room
    };
    
    return of(responseReservation).pipe(delay(500));
  }

  /**
   * Met à jour une réservation existante
   */
  updateReservation(id: string, updates: Partial<Reservation>): Observable<Reservation> {
    const index = this.reservations.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Reservation with id ${id} not found`));
    }
    
    // Vérifier la disponibilité si les dates changent
    if (updates.startDate && updates.endDate) {
      const currentReservation = this.reservations[index];
      
      // Ne pas vérifier si c'est la même réservation
      const otherReservations = this.reservations.filter(r => r.id !== id && r.roomId === currentReservation.roomId);
      
      const isOverlapping = otherReservations.some(reservation => {
        if (reservation.status === 'cancelled') return false;
        
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);
        const newStart = new Date(updates.startDate!);
        const newEnd = new Date(updates.endDate!);
        
        return (
          (newStart >= reservationStart && newStart < reservationEnd) ||
          (newEnd > reservationStart && newEnd <= reservationEnd) ||
          (newStart <= reservationStart && newEnd >= reservationEnd)
        );
      });
      
      if (isOverlapping) {
        return throwError(() => new Error('Room is not available for the updated dates'));
      }
    }
    
    // Mettre à jour la réservation
    const updatedReservation: Reservation = {
      ...this.reservations[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.reservations[index] = updatedReservation;
    
    // Ajouter les infos de la chambre dans la réponse
    const room = this.rooms.find(r => r.id === updatedReservation.roomId);
    const responseReservation = {
      ...updatedReservation,
      room
    };
    
    return of(responseReservation).pipe(delay(300));
  }

  /**
   * Annule une réservation
   */
  cancelReservation(id: string, reason?: string): Observable<Reservation> {
    return this.updateReservation(id, {
      status: 'cancelled',
      updatedAt: new Date()
    });
  }

  /**
   * Confirme une réservation (admin)
   */
  confirmReservation(id: string): Observable<Reservation> {
    return this.updateReservation(id, {
      status: 'confirmed',
      updatedAt: new Date()
    });
  }

  /**
   * Marque une réservation comme check-in effectué
   */
  checkIn(id: string): Observable<Reservation> {
    return this.updateReservation(id, {
      checkedIn: true,
      updatedAt: new Date()
    });
  }

  /**
   * Marque une réservation comme check-out effectué
   */
  checkOut(id: string): Observable<Reservation> {
    return this.updateReservation(id, {
      checkedOut: true,
      status: 'completed',
      updatedAt: new Date()
    });
  }

  /**
   * Ajoute un paiement à une réservation
   */
  addPayment(reservationId: string, payment: Payment): Observable<Reservation> {
    return this.updateReservation(reservationId, {
      payment: {
        ...payment,
        paidAt: new Date()
      },
      updatedAt: new Date()
    });
  }

  /**
   * Récupère des statistiques sur les réservations (pour le dashboard admin)
   */
  getReservationStats(): Observable<{
    totalReservations: number;
    confirmedReservations: number;
    pendingReservations: number;
    cancelledReservations: number;
    completedReservations: number;
    checkInsToday: number;
    checkOutsToday: number;
    occupancyRate: number;
    revenueTotal: number;
    revenuePending: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Calculer les statistiques
    const totalReservations = this.reservations.length;
    const confirmedReservations = this.reservations.filter(r => r.status === 'confirmed').length;
    const pendingReservations = this.reservations.filter(r => r.status === 'pending').length;
    const cancelledReservations = this.reservations.filter(r => r.status === 'cancelled').length;
    const completedReservations = this.reservations.filter(r => r.status === 'completed').length;
    
    // Arrivées et départs du jour
    const checkInsToday = this.reservations.filter(r => 
      r.status === 'confirmed' && 
      new Date(r.startDate).toDateString() === today.toDateString()
    ).length;
    
    const checkOutsToday = this.reservations.filter(r => 
      (r.status === 'confirmed' || r.status === 'completed') && 
      new Date(r.endDate).toDateString() === today.toDateString()
    ).length;
    
    // Taux d'occupation (chambres occupées aujourd'hui / total des chambres)
    const occupiedRooms = this.reservations.filter(r => 
      (r.status === 'confirmed' || r.status === 'completed') &&
      new Date(r.startDate) <= today &&
      new Date(r.endDate) > today
    );
    
    const occupancyRate = (occupiedRooms.length / this.rooms.length) * 100;
    
    // Revenus
    const revenueTotal = this.reservations
      .filter(r => r.status === 'confirmed' || r.status === 'completed')
      .reduce((sum, res) => sum + (res.totalPrice || 0), 0);
    
    const revenuePending = this.reservations
      .filter(r => r.status === 'pending')
      .reduce((sum, res) => sum + (res.totalPrice || 0), 0);
    
    return of({
      totalReservations,
      confirmedReservations,
      pendingReservations,
      cancelledReservations,
      completedReservations,
      checkInsToday,
      checkOutsToday,
      occupancyRate,
      revenueTotal,
      revenuePending
    }).pipe(delay(500));
  }

  /**
   * Récupère les réservations actives pour une date donnée
   */
  getActiveReservationsForDate(date: Date): Observable<Reservation[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const activeReservations = this.reservations
      .filter(r => 
        (r.status === 'confirmed' || r.status === 'completed') &&
        new Date(r.startDate) <= targetDate &&
        new Date(r.endDate) > targetDate
      )
      .map(reservation => {
        const room = this.rooms.find(r => r.id === reservation.roomId);
        return {
          ...reservation,
          room
        };
      });
    
    return of(activeReservations).pipe(delay(300));
  }

  /**
   * Vérifie la disponibilité d'une chambre pour des dates spécifiques
   */
  private isRoomAvailable(roomId: string, startDate: Date, endDate: Date): boolean {
    const overlappingReservations = this.reservations.filter(reservation => {
      if (reservation.roomId !== roomId) return false;
      if (reservation.status === 'cancelled') return false;
      
      const reservationStart = new Date(reservation.startDate);
      const reservationEnd = new Date(reservation.endDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      
      return (
        (newStart >= reservationStart && newStart < reservationEnd) ||
        (newEnd > reservationStart && newEnd <= reservationEnd) ||
        (newStart <= reservationStart && newEnd >= reservationEnd)
      );
    });
    
    return overlappingReservations.length === 0;
  }

  /**
   * Calcule le nombre de nuits entre deux dates
   */
  private calculateNights(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Différence en millisecondes
    const diffTime = end.getTime() - start.getTime();
    
    // Convertir en jours
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Génère un numéro de confirmation pour une réservation
   */
  private generateConfirmationNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'REX-';
    
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}