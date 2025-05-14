// src/app/core/models/room.model.ts
import { Amenity } from './amenity.model';

export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential';

export interface Room {
  id?: string;
  name: string;
  type: RoomType;
  price: number;
  discountedPrice?: number;
  capacity: number;
  surface: number;
  floor?: number;
  mainImage: string;
  images: string[];
  hasBalcony?: boolean;
  view?: string[];
  amenities?: Amenity[];
  shortDescription: string;
  description: string;
  isAvailable?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomAvailability {
  isAvailable: boolean;
  availableRooms?: Room[];
  reason?: string;
}