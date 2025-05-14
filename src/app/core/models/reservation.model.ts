// src/app/core/models/reservation.model.ts
import { GuestInfo } from './guest-info.model';
import { Room } from './room.model';

export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer' | 'on_arrival';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Payment {
  method: PaymentMethod;
  amount?: number;
  currency?: string;
  status?: string;
  cardDetails?: CardDetails;
  billingAddress?: BillingAddress;
  transactionId?: string;
  paidAt?: Date;
}

export interface Reservation {
  id?: string;
  roomId: string;
  room?: Room;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  status: ReservationStatus;
  guestInfo: GuestInfo;
  specialRequests?: string;
  totalPrice?: number;
  payment?: Payment;
  checkedIn?: boolean;
  checkedOut?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReservationRequest {
  roomId: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  guestInfo: GuestInfo;
  specialRequests?: string;
  payment?: Payment;
}