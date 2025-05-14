// src/app/core/services/room.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  Room, 
  RoomType, 
  RoomFilter, 
  RoomAvailability,
  Amenity
} from '../models';
import { 
  ROOMS, 
  ROOM_TYPES, 
  AMENITIES, 
  VIEW_OPTIONS, 
  BED_TYPES,
  RESERVATIONS,
  HOTEL_SERVICES,
  COMMON_AREAS
} from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private rooms: Room[] = ROOMS;
  private reservations = RESERVATIONS;
  private hotelServices = HOTEL_SERVICES;
  private commonAreas = COMMON_AREAS;

  constructor() { }

  /**
   * Récupère toutes les chambres avec filtrage et pagination
   */
  getAllRooms(filter?: RoomFilter): Observable<{items: Room[], total: number}> {
    // Simuler un délai réseau
    return of(this.filterRooms(filter))
      .pipe(delay(500));
  }

  /**
   * Récupère les chambres en vedette (featured)
   */
  getFeaturedRooms(): Observable<Room[]> {
    const featuredRooms = this.rooms.filter(room => room.isFeatured);
    return of(featuredRooms).pipe(delay(300));
  }

  /**
   * Récupère les détails d'une chambre par son ID
   */
  getRoomById(id: string): Observable<Room> {
    const room = this.rooms.find(r => r.id === id);
    
    if (!room) {
      return throwError(() => new Error(`Room with id ${id} not found`));
    }
    
    return of(room).pipe(delay(300));
  }

  /**
   * Récupère une chambre similaire à la chambre donnée
   */
  getSimilarRooms(roomId: string, limit: number = 3): Observable<Room[]> {
    const room = this.rooms.find(r => r.id === roomId);
    
    if (!room) {
      return of([]);
    }
    
    // Trouver des chambres similaires (même type ou prix similaire)
    const similarRooms = this.rooms
      .filter(r => r.id !== roomId && 
               (r.type === room.type || 
                Math.abs((r.discountedPrice || r.price) - (room.discountedPrice || room.price)) < 50))
      .slice(0, limit);
    
    return of(similarRooms).pipe(delay(300));
  }

  /**
   * Vérifie la disponibilité d'une chambre pour les dates spécifiées
   */
  checkAvailability(roomId: string, startDate: Date, endDate: Date): Observable<RoomAvailability> {
    const room = this.rooms.find(r => r.id === roomId);
    
    if (!room) {
      return of({ 
        isAvailable: false, 
        reason: 'Chambre introuvable.' 
      }).pipe(delay(300));
    }
    
    // Vérifier si la chambre est disponible pour les dates données
    const isAvailable = this.isRoomAvailable(roomId, startDate, endDate);
    
    return of({
      isAvailable,
      reason: isAvailable ? undefined : 'La chambre est déjà réservée pour ces dates.'
    }).pipe(delay(500));
  }

  /**
   * Récupère les dates indisponibles pour une chambre
   */
  getUnavailableDates(roomId: string): Observable<{dates: Date[], ranges: {start: Date, end: Date}[]}> {
    const room = this.rooms.find(r => r.id === roomId);
    
    if (!room) {
      return of({ dates: [], ranges: [] }).pipe(delay(300));
    }
    
    // Simuler des dates individuelles indisponibles (maintenance, etc.)
    const unavailableDates: Date[] = [];
    
    // Ajouter quelques dates aléatoires de maintenance dans le mois courant
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 3; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      unavailableDates.push(new Date(currentYear, currentMonth, day));
    }
    
    // Extraire les plages de dates réservées
    const unavailableRanges: {start: Date, end: Date}[] = this.reservations
      .filter(reservation => reservation.roomId === roomId && 
             (reservation.status === 'confirmed' || reservation.status === 'pending'))
      .map(reservation => ({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      }));
    
    return of({
      dates: unavailableDates,
      ranges: unavailableRanges
    }).pipe(delay(500));
  }

  /**
   * Récupère les types de chambres disponibles
   */
  getRoomTypes(): Observable<{id: string, name: string}[]> {
    return of(ROOM_TYPES).pipe(delay(300));
  }

  /**
   * Récupère les équipements disponibles
   */
  getAmenities(): Observable<Amenity[]> {
    return of(AMENITIES).pipe(delay(300));
  }
  
  /**
   * Récupère les options de vue disponibles
   */
  getViewOptions(): Observable<{id: string, name: string}[]> {
    return of(VIEW_OPTIONS).pipe(delay(300));
  }
  
  /**
   * Récupère les types de lit disponibles
   */
  getBedTypes(): Observable<{id: string, name: string}[]> {
    return of(BED_TYPES).pipe(delay(300));
  }
  
  /**
   * Récupère tous les services de l'hôtel
   */
  getAllHotelServices(): Observable<any[]> {
    return of(HOTEL_SERVICES).pipe(delay(300));
  }
  
  /**
   * Récupère les services de l'hôtel par type
   */
  getHotelServicesByType(type: string): Observable<any[]> {
    const services = HOTEL_SERVICES.filter(service => service.type === type);
    return of(services).pipe(delay(300));
  }
  
  /**
   * Récupère un service de l'hôtel par ID
   */
  getHotelServiceById(id: string): Observable<any> {
    const service = HOTEL_SERVICES.find(s => s.id === id);
    
    if (!service) {
      return throwError(() => new Error(`Service with id ${id} not found`));
    }
    
    return of(service).pipe(delay(300));
  }
  
  /**
   * Récupère les espaces communs de l'hôtel
   */
  getCommonAreas(): Observable<any[]> {
    return of(COMMON_AREAS).pipe(delay(300));
  }
  
  /**
   * Crée une nouvelle chambre (pour l'administration)
   */
  createRoom(room: Room): Observable<Room> {
    const newRoom: Room = {
      ...room,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.rooms.push(newRoom);
    
    return of(newRoom).pipe(delay(500));
  }
  
  /**
   * Met à jour une chambre existante (pour l'administration)
   */
  updateRoom(id: string, room: Room): Observable<Room> {
    const index = this.rooms.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Room with id ${id} not found`));
    }
    
    const updatedRoom: Room = {
      ...room,
      id,
      updatedAt: new Date()
    };
    
    this.rooms[index] = updatedRoom;
    
    return of(updatedRoom).pipe(delay(500));
  }
  
  /**
   * Supprime une chambre (pour l'administration)
   */
  deleteRoom(id: string): Observable<void> {
    const index = this.rooms.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Room with id ${id} not found`));
    }
    
    this.rooms.splice(index, 1);
    
    return of(void 0).pipe(delay(500));
  }
  
  /**
   * Cherche parmi les chambres et services (recherche générale)
   */
  search(query: string): Observable<{rooms: Room[], services: any[]}> {
    if (!query || query.trim() === '') {
      return of({rooms: [], services: []});
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Rechercher dans les chambres
    const matchingRooms = this.rooms.filter(room => 
      room.name.toLowerCase().includes(normalizedQuery) ||
      room.description.toLowerCase().includes(normalizedQuery) ||
      room.shortDescription.toLowerCase().includes(normalizedQuery) ||
      room.type.toLowerCase().includes(normalizedQuery)
    );
    
    // Rechercher dans les services
    const matchingServices = HOTEL_SERVICES.filter(service => 
      service.name.toLowerCase().includes(normalizedQuery) ||
      service.description.toLowerCase().includes(normalizedQuery) ||
      service.type.toLowerCase().includes(normalizedQuery) ||
      (service.features && service.features.some(f => f.toLowerCase().includes(normalizedQuery)))
    );
    
    return of({
      rooms: matchingRooms,
      services: matchingServices
    }).pipe(delay(500));
  }
  
  // Méthodes privées pour la gestion des données
  
  /**
   * Filtre les chambres selon les critères de filtre fournis
   */
  private filterRooms(filter?: RoomFilter): {items: Room[], total: number} {
    if (!filter) {
      return { items: [...this.rooms], total: this.rooms.length };
    }
    
    let filteredRooms = [...this.rooms];
    
    // Filtrer par recherche
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredRooms = filteredRooms.filter(room => 
        room.name.toLowerCase().includes(searchTerm) || 
        room.description.toLowerCase().includes(searchTerm) ||
        room.shortDescription.toLowerCase().includes(searchTerm) ||
        room.type.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrer par prix
    if (filter.priceMin) {
      filteredRooms = filteredRooms.filter(room => 
        (room.discountedPrice || room.price) >= filter.priceMin!
      );
    }
    
    if (filter.priceMax) {
      filteredRooms = filteredRooms.filter(room => 
        (room.discountedPrice || room.price) <= filter.priceMax!
      );
    }
    
    // Filtrer par capacité
    if (filter.capacityMin) {
      filteredRooms = filteredRooms.filter(room => 
        room.capacity >= filter.capacityMin!
      );
    }
    
    // Filtrer par type de chambre
    if (filter.types && filter.types.length > 0) {
      filteredRooms = filteredRooms.filter(room => 
        filter.types!.includes(room.type as RoomType)
      );
    }
    
    // Filtrer par équipements
    if (filter.amenities && filter.amenities.length > 0) {
      filteredRooms = filteredRooms.filter(room => 
        filter.amenities!.every(amenityId => 
          room.amenities?.some(amenity => amenity.id === amenityId)
        )
      );
    }
    
    // Filtrer par vue
    if (filter.views && filter.views.length > 0) {
      filteredRooms = filteredRooms.filter(room => 
        filter.views!.some(view => room.view?.includes(view))
      );
    }
    
    // Filtrer par balcon
    if (filter.hasBalcony !== undefined) {
      filteredRooms = filteredRooms.filter(room => 
        room.hasBalcony === filter.hasBalcony
      );
    }
    
    // Filtrer par étage
    if (filter.floor !== undefined) {
      filteredRooms = filteredRooms.filter(room => 
        room.floor === filter.floor
      );
    }
    
    // Calculer le nombre total d'éléments correspondant aux filtres
    const total = filteredRooms.length;
    
    // Appliquer la pagination
    if (filter.page && filter.limit) {
      const startIndex = (filter.page - 1) * filter.limit;
      filteredRooms = filteredRooms.slice(startIndex, startIndex + filter.limit);
    }
    
    return { items: filteredRooms, total };
  }
  
  /**
   * Vérifie si une chambre est disponible pour les dates spécifiées
   */
  private isRoomAvailable(roomId: string, startDate: Date, endDate: Date): boolean {
    const overlappingReservations = this.reservations.filter(reservation => {
      if (reservation.roomId !== roomId) return false;
      if (reservation.status === 'cancelled') return false;
      
      const reservationStart = new Date(reservation.startDate);
      const reservationEnd = new Date(reservation.endDate);
      
      // Vérifier s'il y a chevauchement de dates
      return (
        (startDate >= reservationStart && startDate < reservationEnd) ||
        (endDate > reservationStart && endDate <= reservationEnd) ||
        (startDate <= reservationStart && endDate >= reservationEnd)
      );
    });
    
    return overlappingReservations.length === 0;
  }
  
  /**
   * Génère un ID unique pour une nouvelle chambre
   */
  private generateId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}