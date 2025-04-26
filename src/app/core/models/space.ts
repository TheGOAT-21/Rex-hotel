// src/app/core/models/space.ts

export enum SpaceType {
    CHAMBRE_EXECUTIVE_TWIN = 'chambre_executive_twin',
    CHAMBRE_KING_STANDARD = 'chambre_king_standard',
    CHAMBRE_KING_SUPERIEURE = 'chambre_king_superieure',
    CHAMBRE_KING_EXECUTIVE = 'chambre_king_executive',
    SUITE_LUXE = 'suite_luxe',
    SUITE_PRESIDENTIELLE = 'suite_presidentielle',
    PENTAHOUSE = 'pentahouse',
    SALLE_CONFERENCE = 'salle_conference',
    SALLE_REUNION = 'salle_reunion',
    RESTAURANT = 'restaurant',
    LOUNGE = 'lounge'
  }
  
  export enum ViewType {
    VILLE = 'ville',
    LAC = 'lac',
    PISCINE = 'piscine',
    STADE = 'stade'
  }
  
  export interface Amenity {
    id: string;
    name: string;
    icon: string;
  }
  
  export interface Space {
    id?: string;
    name: string;
    type: SpaceType;
    description: string;
    shortDescription: string;
    price: number;
    capacity: number;
    surface: number;
    floor?: number;
    images: string[];
    mainImage: string;
    view?: ViewType[];
    amenities: Amenity[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface RoomSpace extends Space {
    bedType: string;
    bedCount: number;
    hasBalcony?: boolean;
    hasBathTub?: boolean;
  }
  
  export interface EventSpace extends Space {
    hasProjector?: boolean;
    hasAudioSystem?: boolean;
    hasStage?: boolean;
    layout?: string;
  }
  
  export interface SpaceAvailability {
    spaceId: string;
    startDate: Date;
    endDate: Date;
    isAvailable: boolean;
    blockedReason?: string;
  }
  
  export interface SpacePricing {
    spaceId: string;
    basePrice: number;
    seasonPrices: {
      startDate: Date;
      endDate: Date;
      price: number;
    }[];
  }