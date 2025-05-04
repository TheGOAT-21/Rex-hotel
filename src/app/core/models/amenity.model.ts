export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'general' | 'room' | 'bathroom' | 'kitchen' | 'entertainment' | 'accessibility';
} 