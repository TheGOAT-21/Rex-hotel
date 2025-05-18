// src/app/core/mocks/mock-data.ts
import { Room, RoomType, Amenity, Reservation, Testimonial } from '../models';

// Types de chambre
export const ROOM_TYPES: { id: RoomType; name: string }[] = [
  { id: 'standard', name: 'Chambre Standard' },
  { id: 'deluxe', name: 'Chambre Deluxe' },
  { id: 'suite', name: 'Suite' },
  { id: 'presidential', name: 'Suite Présidentielle' }
];

// Équipements
export const AMENITIES: Amenity[] = [
  { id: 'wifi', name: 'WiFi gratuit', icon: 'wifi', description: 'WiFi haut débit gratuit', category: 'connectivity' },
  { id: 'breakfast', name: 'Petit-déjeuner', icon: 'breakfast', description: 'Petit-déjeuner buffet inclus', category: 'food' },
  { id: 'parking', name: 'Parking', icon: 'parking', description: 'Parking sous-terrain sécurisé', category: 'services' },
  { id: 'pool', name: 'Piscine', icon: 'pool', description: 'Accès à la piscine', category: 'leisure' },
  { id: 'restaurant', name: 'Restaurant', icon: 'restaurant', description: 'Restaurant gastronomique', category: 'food' },
  { id: 'tv', name: 'TV Écran plat', icon: 'tv', description: 'Télévision écran plat', category: 'entertainment' },
  { id: 'ac', name: 'Climatisation', icon: 'ac', description: 'Climatisation individuelle', category: 'comfort' },
  { id: 'balcony', name: 'Balcon privé', icon: 'balcony', description: 'Balcon ou terrasse privée', category: 'outdoor' },
  { id: 'conference', name: 'Salle de conférence', icon: 'conference', description: 'Accès aux salles de conférence', category: 'business' },
  { id: 'meeting', name: 'Salle de réunion', icon: 'meeting', description: 'Salles de réunion équipées', category: 'business' },
  { id: 'childcare', name: 'Espace enfant', icon: 'child', description: 'Espace de jeux pour enfants', category: 'family' },
  { id: 'terrace', name: 'Terrasse', icon: 'terrace', description: 'Accès aux terrasses communes', category: 'outdoor' },
  { id: 'minibar', name: 'Minibar', icon: 'minibar', description: 'Minibar inclus', category: 'food' },
  { id: 'safe', name: 'Coffre-fort', icon: 'safe', description: 'Coffre-fort individuel', category: 'security' },
  { id: 'bathtub', name: 'Baignoire', icon: 'bathtub', description: 'Salle de bain avec baignoire', category: 'bathroom' }
];

// Chambres
export const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Chambre Standard',
    type: 'standard',
    price: 120,
    capacity: 2,
    surface: 25,
    floor: 1,
    mainImage: 'assets/images/ChambretypeA/classic-room (1).png',
    images: [
      'assets/images/ChambretypeA/classic-room (2).png',
      'assets/images/ChambretypeA/classic-room (3).png',
      'assets/images/ChambretypeA/classic-room (4).png'
    ],
    hasBalcony: false,
    view: ['garden'],
    amenities: [
      AMENITIES[0], // WiFi
      AMENITIES[5], // TV
      AMENITIES[6], // AC
    ],
    shortDescription: 'Chambre confortable au design contemporain.',
    description: `Notre chambre Type A offre un confort optimal avec son lit double, sa salle de bain privative et son espace de travail fonctionnel. Idéale pour les voyageurs d'affaires ou les couples recherchant un séjour agréable à Yamoussoukro.`,
    isAvailable: true,
    isActive: true,
    isFeatured: false
  },
  {
    id: '2',
    name: 'Chambre Deluxe',
    type: 'deluxe',
    price: 150,
    capacity: 2,
    surface: 30,
    floor: 1,
    mainImage: 'assets/images/ChambretypeB/chamb1.png',
    images: [
      'assets/images/ChambretypeB/chamb5.png',
      'assets/images/ChambretypeB/chamb6.png',
      'assets/images/ChambretypeB/chamb7.png'
    ],
    hasBalcony: true,
    view: ['garden'],
    amenities: [
      AMENITIES[0], // WiFi
      AMENITIES[1], // Breakfast
      AMENITIES[5], // TV
      AMENITIES[6], // AC
      AMENITIES[7], // Balcony
    ],
    shortDescription: 'Chambre supérieure avec balcon privé et vue jardin.',
    description: `La chambre Type B vous offre un espace élégant et lumineux avec un confortable lit queen-size et un balcon privé donnant sur le jardin. Profitez du petit-déjeuner inclus et de tous les équipements modernes pour un séjour parfait.`,
    isAvailable: true,
    isActive: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Suite',
    type: 'suite',
    price: 180,
    capacity: 3,
    surface: 35,
    floor: 2,
    mainImage: 'assets/images/ChambretypeC/deluxe1.png',
    images: [
      'assets/images/ChambretypeC/deluxe2.png',
      'assets/images/ChambretypeC/deluxe3.png',
      'assets/images/ChambretypeC/deluxe1.png'
    ],
    hasBalcony: true,
    view: ['pool'],
    amenities: [
      AMENITIES[0], // WiFi
      AMENITIES[1], // Breakfast
      AMENITIES[3], // Pool
      AMENITIES[5], // TV
      AMENITIES[6], // AC
      AMENITIES[7], // Balcony
      AMENITIES[12], // Minibar
    ],
    shortDescription: 'Chambre spacieuse avec vue piscine et coin salon.',
    description: `Profitez d'un séjour luxueux dans notre chambre Type C, qui offre une vue imprenable sur la piscine depuis son balcon privé. Cette chambre spacieuse dispose d'un coin salon confortable et peut accueillir jusqu'à 3 personnes. Le petit-déjeuner et l'accès à la piscine sont inclus.`,
    isAvailable: true,
    isActive: true,
    isFeatured: true
  },
  {
    id: '4',
    name: 'Suite Deluxe',
    type: 'suite',
    price: 200,
    capacity: 2,
    surface: 40,
    floor: 2,
    mainImage: 'assets/images/chambretypeD/Familiale.png',
    images: [
      'assets/images/chambretypeD/Familiale.png',
      'assets/images/chambretypeD/Familiale2.png',
      'assets/images/ChambretypeP/prnthouse4.png'
    ],
    hasBalcony: true,
    view: ['city'],
    amenities: [
      AMENITIES[0], // WiFi
      AMENITIES[1], // Breakfast
      AMENITIES[3], // Pool
      AMENITIES[4], // Restaurant
      AMENITIES[5], // TV
      AMENITIES[6], // AC
      AMENITIES[7], // Balcony
      AMENITIES[12], // Minibar
      AMENITIES[13], // Safe
      AMENITIES[14], // Bathtub
    ],
    shortDescription: 'Chambre deluxe avec baignoire et vue panoramique sur la ville.',
    description: `Notre chambre Type D vous offre une expérience de luxe avec son lit king-size, sa salle de bain en marbre équipée d'une baignoire, et sa vue panoramique sur la ville depuis son balcon privé. Profitez du petit-déjeuner au restaurant et d'un accès privilégié à toutes nos installations.`,
    isAvailable: true,
    isActive: true,
    isFeatured: true
  },
  {
    id: '5',
    name: 'Suite Présidentielle',
    type: 'presidential',
    price: 350,
    capacity: 4,
    surface: 65,
    floor: 3,
    mainImage: 'assets/images/ChambretypeP/penthouse1.png',
    images: [
      'assets/images/ChambretypeP/penthouse2.png',
      'assets/images/ChambretypeP/penthouse3.png',
      'assets/images/ChambretypeP/penthouse4.png'
    ],
    hasBalcony: true,
    view: ['city', 'pool'],
    amenities: AMENITIES.slice(0, 10), // Tous les équipements principaux
    shortDescription: 'Suite de luxe avec espace salon séparé et terrasse privée.',
    description: `La chambre Type P est notre suite de luxe, offrant une chambre principale avec lit king-size, un salon séparé, et une grande terrasse privée avec vue sur la ville et la piscine. Cette suite spacieuse de 65m² peut accueillir confortablement jusqu'à 4 personnes, ce qui en fait un choix idéal pour les familles ou les séjours prolongés.`,
    isAvailable: true,
    isActive: true,
    isFeatured: false
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Jean Roland',
    rating: 4.8,
    comment: 'Un séjour inoubliable avec un service exceptionnel. La vue sur le lac depuis notre chambre était magnifique.',
    date: new Date('2025-03-15'),
    roomType: 'suite'
  },
  {
    id: '2',
    name: 'Chris Touré',
    rating: 5,
    comment: 'Espace incroyable, personnel attentif et cuisine délicieuse. Parfait pour notre événement d\'entreprise.',
    date: new Date('2025-03-02'),
    location: 'Abidjan',
    roomType: 'presidential'
  },
  {
    id: '3',
    name: 'Gisele Konan',
    rating: 4.7,
    comment: 'Le Rex Hotel a dépassé nos attentes. Les espaces sont élégants et le confort est au rendez-vous.',
    date: new Date('2025-02-18'),
    location: 'Yamoussoukro',
    roomType: 'deluxe'
  },
  {
    id: '4',
    name: 'Marc Dubois',
    rating: 4.5,
    comment: 'Personnel très professionnel et attentionné. Nous avons particulièrement apprécié le restaurant.',
    date: new Date('2025-01-25'),
    location: 'Paris',
    roomType: 'standard'
  },
  {
    id: '5',
    name: 'Aminata Diallo',
    rating: 4.9,
    comment: 'La qualité du service est vraiment exceptionnelle. Les chambres sont spacieuses et très bien aménagées.',
    date: new Date('2025-02-10'),
    location: 'Dakar',
    roomType: 'suite'
  },
  {
    id: '6',
    name: 'Thomas Kouamé',
    rating: 4.6,
    comment: 'J\'ai adoré la piscine et les espaces de détente. Un vrai havre de paix au cœur de la ville.',
    date: new Date('2025-03-05'),
    location: 'San Pedro',
    roomType: 'deluxe'
  }
];

// Options de vue
export const VIEW_OPTIONS: { id: string; name: string }[] = [
  { id: 'city', name: 'Vue ville' },
  { id: 'garden', name: 'Vue jardin' },
  { id: 'pool', name: 'Vue piscine' },
  { id: 'terrace', name: 'Vue terrasse' }
];

// Types de lit
export const BED_TYPES: { id: string; name: string }[] = [
  { id: 'king', name: 'Lit King Size' },
  { id: 'queen', name: 'Lit Queen Size' },
  { id: 'double', name: 'Lit Double' },
  { id: 'twin', name: 'Lits Jumeaux' },
  { id: 'single', name: 'Lit Simple' }
];

// Réservations fictives pour tester la disponibilité
export const RESERVATIONS: Reservation[] = [
  {
    id: '1',
    roomId: '1',
    startDate: new Date(2025, 5, 15), // 15 juin 2025
    endDate: new Date(2025, 5, 20),   // 20 juin 2025
    numberOfGuests: 2,
    status: 'confirmed',
    guestInfo: {
      title: 'mr',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+225 0123456789'
    }
  },
  {
    id: '2',
    roomId: '3',
    startDate: new Date(2025, 5, 10), // 10 juin 2025
    endDate: new Date(2025, 5, 15),   // 15 juin 2025
    numberOfGuests: 2,
    status: 'confirmed',
    guestInfo: {
      title: 'mrs',
      firstName: 'Marie',
      lastName: 'Laurent',
      email: 'marie.laurent@example.com',
      phone: '+225 9876543210'
    }
  }
];

// Services de l'hôtel
export const HOTEL_SERVICES = [
  {
    id: '1',
    name: 'Restaurant',
    type: 'restaurant',
    description: 'Notre restaurant gastronomique propose une cuisine raffinée inspirée des saveurs locales et internationales.',
    openingHours: '07:00 - 22:30',
    images: [
      'assets/images/Restaurant/restaurant.png',
      'assets/images/Restaurant/restaurant1.png',
      'assets/images/Restaurant/restaurant2.png',
      'assets/images/Restaurant/restaurant3.png'
    ],
    features: [
      'Cuisine locale et internationale',
      'Chef renommé',
      'Cave à vins',
      'Terrasse extérieure'
    ]
  },
  {
    id: '2',
    name: 'Piscine',
    type: 'pool',
    description: 'Détendez-vous au bord de notre magnifique piscine extérieure entourée de transats et de palmiers.',
    openingHours: '08:00 - 20:00',
    images: [
      'assets/images/Piscine/piscine-1.png',
      'assets/images/Piscine/piscine-2.png',
      'assets/images/Piscine/piscine-3.png'
    ],
    features: [
      'Piscine extérieure',
      'Transats et parasols',
      'Bar à cocktails',
      'Service de serviettes'
    ]
  },
  {
    id: '3',
    name: 'Salle de Conférence',
    type: 'conference',
    description: 'Espace modulable pour vos réunions professionnelles et événements, équipé des dernières technologies.',
    capacity: 150,
    images: [
      'assets/images/ConferenceRoom/conference.png',
      'assets/images/ConferenceRoom/conference1.png',
      'assets/images/ConferenceRoom/conference2.png',
      'assets/images/ConferenceRoom/conference3.png'
    ],
    features: [
      'Équipement audiovisuel',
      'WiFi haut débit',
      'Service de restauration',
      'Assistance technique'
    ]
  },
  {
    id: '4',
    name: 'Salle de Réunion 1',
    type: 'meeting',
    description: 'Salle de réunion intime et fonctionnelle, idéale pour les petits groupes et les entretiens.',
    capacity: 20,
    images: [
      'assets/images/MeetingRoom/meeting1.png',
      'assets/images/MeetingRoom/meeting2.png',
      'assets/images/MeetingRoom/meeting3.png',
      'assets/images/MeetingRoom/meeting4.png'
    ],
    features: [
      'Table de conférence',
      'Écran de projection',
      'WiFi haut débit',
      'Pause-café disponible'
    ]
  },
  {
    id: '5',
    name: 'Salle de Réunion 2',
    type: 'meeting',
    description: 'Salle de réunion spacieuse avec configuration flexible, parfaite pour les ateliers et séminaires.',
    capacity: 40,
    images: [
      'assets/images/MeetingRoom2/meeting1.png',
      'assets/images/MeetingRoom2/meeting2.png',
      'assets/images/MeetingRoom2/meeting3.png',
      'assets/images/MeetingRoom2/meeting4.png'
    ],
    features: [
      'Configuration flexible',
      'Équipement audiovisuel',
      'Lumière naturelle',
      'Service de restauration disponible'
    ]
  },
  {
    id: '6',
    name: 'Salle de Mariage',
    type: 'event',
    description: 'Magnifique salle de réception pour célébrer votre mariage dans un cadre élégant et raffiné.',
    capacity: 200,
    images: [
      'assets/images/WeddingRoom/wedroom0.png',
      'assets/images/WeddingRoom/wedroom1.png',
      'assets/images/WeddingRoom/wedroom2.png',
      'assets/images/WeddingRoom/wedroom3.png',
      'assets/images/WeddingRoom/wedroom4.png',
      'assets/images/WeddingRoom/wedroom5.png',
      'assets/images/WeddingRoom/wedroom6.png',
    ],
    features: [
      'Espace de réception élégant',
      'Piste de danse',
      'Service de traiteur personnalisé',
      'Coordination d\'événements disponible'
    ]
  },
  {
    id: '7',
    name: 'Parking Souterrain',
    type: 'parking',
    description: 'Parking sécurisé en sous-sol avec accès direct à l\'hôtel.',
    images: [
      'assets/images/ParkingRDC/parking.png',
      'assets/images/ParkingRDC/parking1.png',
      'assets/images/ParkingRDC/parking2.png',
      'assets/images/ParkingRDC/parking3.png',
    ],
    features: [
      'Sécurité 24/7',
      'Accès direct à l\'hôtel',
      'Places réservées pour PMR',
      'Service voiturier disponible'
    ]
  },
  {
    id: '8',
    name: 'Espace Enfant',
    type: 'childcare',
    description: 'Aire de jeux surveillée pour le divertissement de vos enfants pendant votre séjour.',
    openingHours: '10:00 - 18:00',
    images: [
      'assets/images/KidsSpaces/kids-play (1).png',
      'assets/images/KidsSpaces/kids-play (2).png',
    ],
    features: [
      'Activités ludiques et éducatives',
      'Personnel qualifié',
      'Espace sécurisé',
      'Adapté pour différentes tranches d\'âge'
    ]
  },
  {
    id: '9',
    name: 'Terrasse RDC',
    type: 'terrace',
    description: 'Élégante terrasse au rez-de-chaussée, idéale pour se détendre ou prendre un verre en fin de journée.',
    openingHours: '09:00 - 23:00',
    images: [
      'assets/images/Terrasse RDC/terrasse1.png',
      'assets/images/Terrasse RDC/terrasse2.png',
      'assets/images/Terrasse RDC/terrasse3.png',
      'assets/images/Terrasse RDC/terrasse4.png',
      'assets/images/Terrasse RDC/terrasse5.png'
    ],
    features: [
      'Service de boissons et snacks',
      'Espaces ombragés',
      'Mobilier confortable',
      'Ambiance paisible'
    ]
  },
  {
    id: '10',
    name: 'Terrasse 1er Étage',
    type: 'terrace',
    description: 'Terrasse panoramique au premier étage offrant une vue imprenable sur les environs.',
    openingHours: '09:00 - 22:00',
    images: [
      'assets/images/Terrasse1eretage/terrasse1.png',
      'assets/images/Terrasse1eretage/terrasse2.png',
      'assets/images/Terrasse1eretage/terrasse3.png',
      'assets/images/Terrasse1eretage/terrasse4.png',      
    ],
    features: [
      'Vue panoramique',
      'Mobilier lounge',
      'Service de bar',
      'Idéal pour les cocktails et réceptions'
    ]
  }
];

// Informations sur les espaces communs
export const COMMON_AREAS = [
  {
    id: '1',
    name: 'Hall d\'entrée',
    description: 'Hall d\'accueil spacieux et élégant avec réception ouverte 24h/24.',
    images: [
      'assets/images/Exterieur/exterieur-1.png',
      'assets/images/Exterieur/exterieur-2.png'
    ],
  },
  {
    id: '2',
    name: 'Hall 1er Étage',
    description: 'Espace de détente et d\'attente au 1er étage, avec accès aux salles de réunion.',
    images: [
      'assets/images/Hall 1er Etage/hall-1er-1.png',
      'assets/images/Hall 1er Etage/hall-1er-2.png'
    ],
  }
];