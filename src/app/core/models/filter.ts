// src/app/core/models/filter.ts

import { SpaceType, ViewType } from './space';

export interface SpaceFilter {
  search?: string;
  types?: SpaceType[];
  priceMin?: number;
  priceMax?: number;
  capacityMin?: number;
  views?: ViewType[];
  amenities?: string[];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: SortOption;
}

export enum SortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  CAPACITY_ASC = 'capacity_asc',
  CAPACITY_DESC = 'capacity_desc',
  SURFACE_ASC = 'surface_asc',
  SURFACE_DESC = 'surface_desc'
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReservationFilter {
  userId?: string;
  spaceId?: string;
  status?: string[];
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: ReservationSortOption;
}

export enum ReservationSortOption {
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  CREATED_ASC = 'created_asc',
  CREATED_DESC = 'created_desc'
}

export interface ClientFilter {
  search?: string;
  country?: string;
  hasReservations?: boolean;
  registeredFrom?: Date;
  registeredTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: ClientSortOption;
}

export enum ClientSortOption {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  COUNTRY_ASC = 'country_asc',
  COUNTRY_DESC = 'country_desc',
  RESERVATIONS_ASC = 'reservations_asc',
  RESERVATIONS_DESC = 'reservations_desc',
  REGISTERED_ASC = 'registered_asc',
  REGISTERED_DESC = 'registered_desc'
}