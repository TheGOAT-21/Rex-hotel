// src/app/core/models/room-filter.model.ts
import { RoomType } from './room.model';

export interface RoomFilter {
  search?: string;
  priceMin?: number;
  priceMax?: number;
  capacityMin?: number;
  types?: RoomType[];
  amenities?: string[];
  views?: string[];
  bedTypes?: string[];
  hasBalcony?: boolean;
  floor?: number;
  page?: number;
  limit?: number;
}