export interface SpaceFilter {
  types?: string[];
  capacity?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  location?: {
    floor?: number;
    building?: string;
  };
  status?: 'available' | 'reserved' | 'maintenance';
} 