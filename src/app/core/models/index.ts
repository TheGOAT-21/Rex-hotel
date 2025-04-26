// src/app/core/models/index.ts

export * from './user';
export * from './space';
export * from './reservation';
export * from './filter';
export * from './statistics';
export * from './settings';
export * from './notification';

// Types additionnels

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { [key: string]: string };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FileUpload {
  id?: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  createdAt: Date;
  entityType?: string;
  entityId?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface Review {
  id?: string;
  userId: string;
  spaceId: string;
  reservationId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  isApproved: boolean;
  response?: {
    message: string;
    respondedBy: string;
    respondedAt: Date;
  };
}

export interface ActivityLog {
  id?: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  allergens?: string[];
  ingredients?: string[];
}

export interface EventPackage {
  id?: string;
  name: string;
  description: string;
  spaceTypes: string[];
  price: number;
  minGuests: number;
  maxGuests: number;
  duration: number;
  inclusions: string[];
  images: string[];
  isActive: boolean;
}