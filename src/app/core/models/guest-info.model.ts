// src/app/core/models/guest-info.model.ts
export interface GuestInfo {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: {
      street?: string;
      city?: string;
      zipCode?: string;
      country?: string;
    };
  }