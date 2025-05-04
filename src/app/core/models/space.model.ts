export interface Space {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  price: number;
  currency: string;
  amenities: string[];
  images: string[];
  location: {
    floor: number;
    building: string;
  };
  status: 'available' | 'reserved' | 'maintenance';
} 