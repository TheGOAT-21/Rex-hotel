// src/app/core/models/amenity.model.ts
export interface Amenity {
    id: string;
    name: string;
    icon: string;
    description?: string;
    category?: string;
    isActive?: boolean;
  }