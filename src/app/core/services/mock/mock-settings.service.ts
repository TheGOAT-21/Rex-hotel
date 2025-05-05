// src/app/core/services/mock/mock-settings.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { 
  HotelSettings, 
  EmailSettings, 
  PaymentSettings, 
  SystemSettings
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class MockSettingsService {
  private hotelSettingsSubject = new BehaviorSubject<HotelSettings | null>(this.getMockHotelSettings());
  hotelSettings$ = this.hotelSettingsSubject.asObservable();
  
  constructor() {
    // Charger les paramètres au démarrage
    this.loadHotelSettings();
  }
  
  // Paramètres de l'hôtel
  getHotelSettings(): Observable<HotelSettings> {
    return of(this.getMockHotelSettings());
  }
  
  updateHotelSettings(settings: Partial<HotelSettings>): Observable<HotelSettings> {
    const currentSettings = this.getMockHotelSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    this.hotelSettingsSubject.next(updatedSettings);
    return of(updatedSettings);
  }
  
  // Paramètres d'email
  getEmailSettings(): Observable<EmailSettings> {
    return of(this.getMockEmailSettings());
  }
  
  // Paramètres de paiement
  getPaymentSettings(): Observable<PaymentSettings> {
    return of(this.getMockPaymentSettings());
  }
  
  // Paramètres système
  getSystemSettings(): Observable<SystemSettings> {
    return of(this.getMockSystemSettings());
  }
  
  // Paramètres publics
  getPublicSettings(): Observable<any> {
    return of({
      hotelName: 'REX HOTEL',
      contact: {
        phone: '+225 XX XX XX XX',
        email: 'contact@rexhotel.com'
      },
      socialMedia: {
        facebook: 'https://facebook.com/rexhotel',
        instagram: 'https://instagram.com/rexhotel'
      }
    });
  }
  
  // Méthodes privées
  private loadHotelSettings(): void {
    this.hotelSettingsSubject.next(this.getMockHotelSettings());
  }
  
  private getMockHotelSettings(): HotelSettings {
    return {
      name: 'REX HOTEL',
      address: {
        street: 'Quartier Résidentiel',
        city: 'Yamoussoukro',
        postalCode: '01 BP 1234',
        country: 'Côte d\'Ivoire'
      },
      contact: {
        phone: '+225 XX XX XX XX',
        email: 'contact@rexhotel.com',
        website: 'www.rexhotel.com'
      },
      socialMedia: {
        facebook: 'https://facebook.com/rexhotel',
        twitter: 'https://twitter.com/rexhotel',
        instagram: 'https://instagram.com/rexhotel'
      },
      seo: {
        metaTitle: 'REX HOTEL - Élégance & Confort | Yamoussoukro',
        metaDescription: 'Situé dans un quartier résidentiel à Yamoussoukro, Rex Hôtel offre une vue magnifique sur la ville.',
        keywords: ['hôtel', 'yamoussoukro', 'côte d\'ivoire', 'luxe', 'confort']
      },
      legalInfo: {
        companyName: 'REX HOTEL S.A.',
        registrationNumber: 'CI-ABJ-2020-B-12345',
        vatNumber: 'CI12345678',
        termsAndConditionsUrl: '/legal/terms',
        privacyPolicyUrl: '/legal/privacy'
      },
      checkInTime: '14:00',
      checkOutTime: '12:00',
      logo: '/assets/logos/rexhotel-icone.svg',
      amenities: ['wifi', 'parking', 'pool', 'restaurant', 'gym', 'spa'],
      featuredSpaceIds: ['room-1', 'room-2', 'room-3', 'conf-1']
    };
  }
  
  private getMockEmailSettings(): EmailSettings {
    return {
      fromEmail: 'noreply@rexhotel.com',
      fromName: 'REX HOTEL',
      templates: {
        registration: {
          subject: 'Bienvenue à REX HOTEL',
          body: 'Merci de vous être inscrit...'
        },
        reservationConfirmation: {
          subject: 'Confirmation de votre réservation',
          body: 'Votre réservation a été confirmée...'
        },
        reservationCancellation: {
          subject: 'Annulation de votre réservation',
          body: 'Votre réservation a été annulée...'
        },
        paymentConfirmation: {
          subject: 'Confirmation de paiement',
          body: 'Votre paiement a été confirmé...'
        },
        newsletter: {
          subject: 'Actualités de REX HOTEL',
          body: 'Découvrez nos nouvelles offres...'
        }
      },
      smtpSettings: {
        host: 'smtp.example.com',
        port: 587,
        secure: true,
        username: 'noreply@rexhotel.com',
        password: 'password'
      }
    };
  }
  
  private getMockPaymentSettings(): PaymentSettings {
    return {
      currency: 'XOF',
      depositPercentage: 30,
      taxRate: 20,
      cancellationPolicies: [
        { beforeDays: 7, refundPercentage: 100 },
        { beforeDays: 3, refundPercentage: 50 },
        { beforeDays: 1, refundPercentage: 0 }
      ],
      paymentMethods: ['card', 'bank_transfer', 'cash'],
      bankInfo: {
        accountName: 'REX HOTEL S.A.',
        accountNumber: '123456789',
        bankName: 'BANK OF AFRICA',
        swiftCode: 'BOAFCIAB',
        iban: 'CI012345678901234567890123'
      }
    };
  }
  
  private getMockSystemSettings(): SystemSettings {
    return {
      maintenance: {
        isInMaintenance: false,
        maintenanceMessage: 'Site en maintenance. Veuillez réessayer plus tard.'
      },
      languages: {
        available: ['fr', 'en'],
        default: 'fr'
      },
      reservationRules: {
        minStay: 1,
        maxStay: 30,
        maxGuestsPerRoom: 4,
        advanceBookingLimit: 365
      },
      admin: {
        notificationEmails: ['admin@rexhotel.com'],
        enableEmailNotifications: true,
        enableSmsNotifications: false
      }
    };
  }
}