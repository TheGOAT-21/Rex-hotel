// src/app/core/models/hotel-settings.model.ts
export interface ContactInfo {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  }
  
  export interface HotelSettings {
    id?: string;
    name: string;
    logo?: string;
    description?: string;
    checkInTime?: string;
    checkOutTime?: string;
    contact?: ContactInfo;
    currency?: string;
    taxRate?: number;
    termsAndConditions?: string;
    privacyPolicy?: string;
    isMaintenanceMode?: boolean;
    updatedAt?: Date;
  }