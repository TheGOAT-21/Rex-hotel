// src/app/core/models/settings.ts

export interface HotelSettings {
    name: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    contact: {
      phone: string;
      email: string;
      website: string;
    };
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
    legalInfo: {
      companyName: string;
      registrationNumber: string;
      vatNumber?: string;
      termsAndConditionsUrl?: string;
      privacyPolicyUrl?: string;
    };
    checkInTime: string;
    checkOutTime: string;
    logo: string;
    amenities: string[];
    featuredSpaceIds: string[];
  }
  
  export interface EmailSettings {
    fromEmail: string;
    fromName: string;
    templates: {
      registration: {
        subject: string;
        body: string;
      };
      reservationConfirmation: {
        subject: string;
        body: string;
      };
      reservationCancellation: {
        subject: string;
        body: string;
      };
      paymentConfirmation: {
        subject: string;
        body: string;
      };
      newsletter: {
        subject: string;
        body: string;
      };
    };
    smtpSettings: {
      host: string;
      port: number;
      secure: boolean;
      username: string;
      password: string;
    };
  }
  
  export interface PaymentSettings {
    currency: string;
    depositPercentage: number;
    taxRate: number;
    cancellationPolicies: {
      beforeDays: number; // nombre de jours avant l'arrivée
      refundPercentage: number; // pourcentage de remboursement
    }[];
    paymentMethods: string[];
    bankInfo: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      swiftCode?: string;
      iban?: string;
    };
  }
  
  export interface SystemSettings {
    maintenance: {
      isInMaintenance: boolean;
      maintenanceMessage: string;
      plannedEndTime?: Date;
    };
    languages: {
      available: string[];
      default: string;
    };
    reservationRules: {
      minStay: number; // en jours
      maxStay: number; // en jours
      maxGuestsPerRoom: number;
      advanceBookingLimit: number; // en jours
    };
    admin: {
      notificationEmails: string[];
      enableEmailNotifications: boolean;
      enableSmsNotifications: boolean;
    };
  }