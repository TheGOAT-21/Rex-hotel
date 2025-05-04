// src/app/core/mocks/space.mock.ts

import { Space, SpaceType, ViewType, Amenity } from '../models';

export const MOCK_SPACES: Space[] = [
  {
    id: 'room-1',
    name: 'Suite Présidentielle',
    type: SpaceType.SUITE_PRESIDENTIELLE,
    description: 'Une suite luxueuse avec vue panoramique sur la ville. Parfaite pour les séjours d\'exception.',
    shortDescription: 'Suite luxueuse avec vue panoramique',
    price: 250000,
    capacity: 4,
    surface: 85,
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
    view: [ViewType.VILLE],
    isActive: true
  },
  {
    id: 'room-2',
    name: 'Suite Executive',
    type: SpaceType.CHAMBRE_KING_EXECUTIVE,
    description: 'Une suite spacieuse avec salon séparé et bureau. Idéale pour les voyages d\'affaires.',
    shortDescription: 'Suite spacieuse pour voyages d\'affaires',
    price: 180000,
    capacity: 2,
    surface: 65,
    amenities: [
      { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
      { id: 'tv', name: 'TV LCD', icon: 'tv' },
      { id: 'minibar', name: 'Minibar', icon: 'wine' },
      { id: 'safe', name: 'Coffre-fort', icon: 'lock' }
    ],
    images: [
      '/assets/images/rooms/chambre.jpeg',
      '/assets/images/rooms/conference.jpeg'
    ],
    mainImage: '/assets/images/rooms/chambre.jpeg',
    view: [ViewType.PISCINE],
    isActive: true
  }
];