// src/app/core/services/mock/mock-space.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Space, 
  SpaceType, 
  ViewType, 
  SpaceFilter, 
  SpaceAvailability,
  PaginatedResult
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class MockSpaceService {
  private mockSpaces: Space[] = [];
  
  constructor() {
    this.initMockData();
  }
  
  getAllSpaces(filter?: SpaceFilter): Observable<PaginatedResult<Space>> {
    let filteredSpaces = [...this.mockSpaces];
    
    // Appliquer les filtres
    if (filter) {
      if (filter.types && filter.types.length > 0) {
        filteredSpaces = filteredSpaces.filter(space => 
          filter.types?.some(type => space.type === type)
        );
      }
      
      if (filter.priceMin !== undefined) {
        filteredSpaces = filteredSpaces.filter(space => space.price >= filter.priceMin!);
      }
      
      if (filter.priceMax !== undefined) {
        filteredSpaces = filteredSpaces.filter(space => space.price <= filter.priceMax!);
      }
      
      if (filter.capacityMin !== undefined) {
        filteredSpaces = filteredSpaces.filter(space => space.capacity >= filter.capacityMin!);
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredSpaces = filteredSpaces.filter(space => 
          space.name.toLowerCase().includes(searchLower) || 
          space.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Pagination
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSpaces = filteredSpaces.slice(startIndex, endIndex);
    
    // Résultat paginé
    const result: PaginatedResult<Space> = {
      items: paginatedSpaces,
      total: filteredSpaces.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredSpaces.length / limit)
    };
    
    return of(result);
  }
  
  getSpaceById(id: string): Observable<Space> {
    const space = this.mockSpaces.find(s => s.id === id);
    if (space) {
      return of(space);
    }
    return new Observable(observer => {
      observer.error(new Error('Espace non trouvé'));
    });
  }
  
  getFeaturedSpaces(): Observable<Space[]> {
    return of(this.mockSpaces.slice(0, 4));
  }
  
  getSpacesByType(type: SpaceType): Observable<Space[]> {
    return of(this.mockSpaces.filter(s => s.type === type));
  }
  
  checkAvailability(spaceId: string, startDate: Date, endDate: Date): Observable<SpaceAvailability> {
    // Simuler une vérification de disponibilité
    const isAvailable = Math.random() > 0.2; // 80% de chance d'être disponible
    
    return of({
      spaceId,
      startDate,
      endDate,
      isAvailable,
      blockedReason: isAvailable ? undefined : 'Espace déjà réservé pour ces dates'
    });
  }
  
  getSpaceTypes(): Observable<{ id: string; name: string; }[]> {
    return of([
      { id: SpaceType.CHAMBRE_EXECUTIVE_TWIN, name: 'Chambre Executive Twin' },
      { id: SpaceType.CHAMBRE_KING_STANDARD, name: 'Chambre King Standard' },
      { id: SpaceType.CHAMBRE_KING_SUPERIEURE, name: 'Chambre King Supérieure' },
      { id: SpaceType.CHAMBRE_KING_EXECUTIVE, name: 'Chambre King Executive' },
      { id: SpaceType.SUITE_LUXE, name: 'Suite de Luxe' },
      { id: SpaceType.SUITE_PRESIDENTIELLE, name: 'Suite Présidentielle' },
      { id: SpaceType.PENTAHOUSE, name: 'Pentahouse' },
      { id: SpaceType.SALLE_CONFERENCE, name: 'Salle de Conférence' },
      { id: SpaceType.SALLE_REUNION, name: 'Salle de Réunion' },
      { id: SpaceType.RESTAURANT, name: 'Restaurant' },
      { id: SpaceType.LOUNGE, name: 'Lounge' }
    ]);
  }
  
  getAmenities(): Observable<{ id: string; name: string; icon: string; }[]> {
    return of([
      { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
      { id: 'parking', name: 'Parking', icon: 'parking' },
      { id: 'breakfast', name: 'Petit-déjeuner', icon: 'breakfast' },
      { id: 'pool', name: 'Piscine', icon: 'pool' },
      { id: 'spa', name: 'Spa', icon: 'spa' },
      { id: 'restaurant', name: 'Restaurant', icon: 'restaurant' },
      { id: 'tv', name: 'TV LCD', icon: 'tv' },
      { id: 'ac', name: 'Climatisation', icon: 'ac' },
      { id: 'gym', name: 'Salle de sport', icon: 'gym' },
      { id: 'view', name: 'Vue panoramique', icon: 'view' }
    ]);
  }
  
  private initMockData(): void {
    this.mockSpaces = [
      {
        id: 'room-1',
        name: 'Suite Présidentielle',
        type: SpaceType.SUITE_PRESIDENTIELLE,
        description: 'Une suite luxueuse avec vue panoramique sur la ville et le lac. Parfaite pour les séjours d\'exception et les clients exigeants. Profitez d\'une terrasse privée et d\'un salon séparé.',
        shortDescription: 'Suite luxueuse avec vue panoramique',
        price: 250000,
        capacity: 4,
        surface: 76,
        floor: 10,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'tv', name: 'TV LCD', icon: 'tv' },
          { id: 'minibar', name: 'Minibar', icon: 'wine' },
          { id: 'safe', name: 'Coffre-fort', icon: 'lock' },
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [ViewType.LAC],
        isActive: true
      },
      {
        id: 'room-2',
        name: 'Suite Executive',
        type: SpaceType.CHAMBRE_KING_EXECUTIVE,
        description: 'Une suite spacieuse avec salon séparé et bureau. Idéale pour les voyages d\'affaires et les longs séjours. Bénéficiez d\'une vue magnifique sur la ville.',
        shortDescription: 'Suite spacieuse pour voyages d\'affaires',
        price: 180000,
        capacity: 2,
        surface: 39,
        floor: 8,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'tv', name: 'TV LCD', icon: 'tv' },
          { id: 'minibar', name: 'Minibar', icon: 'wine' },
          { id: 'safe', name: 'Coffre-fort', icon: 'lock' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [ViewType.VILLE],
        isActive: true
      },
      {
        id: 'room-3',
        name: 'Chambre King Supérieure',
        type: SpaceType.CHAMBRE_KING_SUPERIEURE,
        description: 'Chambre élégante avec lit king-size et vue sur la piscine. Parfaite pour un séjour confortable et relaxant. Décoration moderne avec des touches locales.',
        shortDescription: 'Chambre élégante avec vue sur la piscine',
        price: 120000,
        capacity: 2,
        surface: 31,
        floor: 5,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'tv', name: 'TV LCD', icon: 'tv' },
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [ViewType.PISCINE],
        isActive: true
      },
      {
        id: 'room-4',
        name: 'Chambre King Standard',
        type: SpaceType.CHAMBRE_KING_STANDARD,
        description: 'Chambre confortable avec toutes les commodités essentielles. Idéale pour les courts séjours et les voyageurs soucieux de leur budget.',
        shortDescription: 'Chambre confortable et économique',
        price: 80000,
        capacity: 2,
        surface: 26,
        floor: 3,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'tv', name: 'TV LCD', icon: 'tv' },
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [ViewType.VILLE],
        isActive: true
      },
      {
        id: 'room-5',
        name: 'Chambre Executive Twin',
        type: SpaceType.CHAMBRE_EXECUTIVE_TWIN,
        description: 'Chambre spacieuse avec deux lits jumeaux, parfaite pour les voyageurs partageant une chambre. Confort et intimité garantis.',
        shortDescription: 'Chambre spacieuse avec lits jumeaux',
        price: 100000,
        capacity: 2,
        surface: 38,
        floor: 6,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'tv', name: 'TV LCD', icon: 'tv' },
          { id: 'minibar', name: 'Minibar', icon: 'wine' },
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [ViewType.STADE],
        isActive: true
      },
      {
        id: 'conf-1',
        name: 'Grande Salle de Conférence',
        type: SpaceType.SALLE_CONFERENCE,
        description: 'Salle de conférence spacieuse pouvant accueillir jusqu\'à 200 personnes. Équipée des dernières technologies audiovisuelles pour des présentations impeccables.',
        shortDescription: 'Grande salle de conférence moderne',
        price: 500000,
        capacity: 200,
        surface: 300,
        floor: 1,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'projector', name: 'Projecteur', icon: 'projector' },
          { id: 'microphone', name: 'Microphones', icon: 'microphone' },
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [],
        isActive: true
      },
      {
        id: 'conf-2',
        name: 'Salle de Réunion Exécutive',
        type: SpaceType.SALLE_REUNION,
        description: 'Salle de réunion élégante pour les rencontres professionnelles jusqu\'à 20 personnes. Environnement calme et propice à la concentration.',
        shortDescription: 'Salle de réunion élégante',
        price: 150000,
        capacity: 20,
        surface: 60,
        floor: 2,
        amenities: [
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'projector', name: 'Projecteur', icon: 'projector' },
          { id: 'coffee', name: 'Service café', icon: 'coffee' },
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [],
        isActive: true
      },
      {
        id: 'rest-1',
        name: 'Restaurant Principal',
        type: SpaceType.RESTAURANT,
        description: 'Restaurant élégant offrant une cuisine internationale et des spécialités ivoiriennes. Cadre raffiné avec vue sur le lac.',
        shortDescription: 'Restaurant élégant avec vue',
        price: 0,
        capacity: 300,
        surface: 500,
        floor: 0,
        amenities: [
          { id: 'ac', name: 'Climatisation', icon: 'thermometer' },
          { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
          { id: 'bar', name: 'Bar intégré', icon: 'wine' }
        ],
        images: [
          '/assets/images/rooms/chambre.jpeg',
          '/assets/images/rooms/chambre.jpeg'
        ],
        mainImage: '/assets/images/rooms/chambre.jpeg',
        view: [ViewType.LAC],
        isActive: true
      }
    ];
  }
}