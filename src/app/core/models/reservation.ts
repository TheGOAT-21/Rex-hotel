// src/app/core/models/reservation.ts

export enum ReservationStatus {
    EN_ATTENTE = 'en_attente',
    CONFIRMEE = 'confirmee',
    EN_COURS = 'en_cours',
    TERMINEE = 'terminee',
    ANNULEE = 'annulee'
  }
  
  export interface Reservation {
    id?: string;
    userId: string;
    spaceId: string;
    startDate: Date;
    endDate: Date;
    numberOfGuests: number;
    totalPrice: number;
    status: ReservationStatus;
    createdAt?: Date;
    updatedAt?: Date;
    confirmationCode?: string;
    specialRequests?: string;
    paymentStatus?: PaymentStatus;
    contactedByCommercial?: boolean;
    cancellationReason?: string;
    invoiceId?: string;
  }
  
  export enum PaymentStatus {
    EN_ATTENTE = 'en_attente',
    PARTIEL = 'partiel',
    COMPLET = 'complet',
    REMBOURSE = 'rembourse'
  }
  
  export interface ReservationRequest {
    spaceId: string;
    startDate: Date;
    endDate: Date;
    numberOfGuests: number;
    specialRequests?: string;
  }
  
  export interface ReservationWithDetails extends Reservation {
    space?: {
      name: string;
      type: string;
      mainImage: string;
    };
    user?: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  }
  
  export interface Invoice {
    id?: string;
    reservationId: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    paidAmount: number;
    isPaid: boolean;
    items: InvoiceItem[];
  }
  
  export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }