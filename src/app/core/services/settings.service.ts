// src/app/core/services/settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { HotelSettings, ContactInfo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // Données mock pour les paramètres de l'hôtel
  private hotelSettingsData: HotelSettings = {
    id: '1',
    name: 'REX HOTEL',
    logo: 'assets/logos/rexhotellogo.svg',
    description: 'Situé au cœur de Yamoussoukro, REX HOTEL allie élégance et confort pour vous offrir un séjour mémorable. Notre établissement 4 étoiles vous propose des chambres modernes, un restaurant gastronomique, et des installations de premier ordre pour vos séjours professionnels et vos moments de détente.',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    currency: 'XOF',
    taxRate: 18,
    contact: {
      email: 'contact@rexhotel.com',
      phone: '+225 27 30 64 50 50',
      address: {
        street: 'Boulevard Houphouët-Boigny',
        city: 'Yamoussoukro',
        zipCode: '01 BP 1234',
        country: 'Côte d\'Ivoire'
      },
      socialMedia: {
        facebook: 'https://facebook.com/rexhotel',
        twitter: 'https://twitter.com/rexhotel',
        instagram: 'https://instagram.com/rexhotel',
        linkedin: 'https://linkedin.com/company/rexhotel'
      }
    },
    termsAndConditions: `
      <h2>Conditions Générales de Réservation - REX HOTEL</h2>
      
      <h3>1. Réservation</h3>
      <p>Toute réservation est considérée comme confirmée une fois que vous avez reçu notre confirmation écrite et que l'acompte a été encaissé.</p>
      
      <h3>2. Arrivée et départ</h3>
      <p>L'heure d'arrivée est fixée à partir de 14h00 et l'heure de départ au plus tard à 12h00. Un supplément pourra être facturé en cas de départ tardif, selon disponibilité.</p>
      
      <h3>3. Annulation et modification</h3>
      <p>Toute annulation doit être notifiée par écrit à l'hôtel au moins 48 heures avant la date d'arrivée prévue. Pour toute annulation effectuée moins de 48 heures avant l'arrivée, le montant de la première nuit sera facturé.</p>
      
      <h3>4. Paiement</h3>
      <p>Un acompte correspondant à la première nuit est demandé lors de la réservation. Le solde sera réglé sur place lors du départ.</p>
      
      <h3>5. Services</h3>
      <p>Le petit-déjeuner est servi de 6h30 à 10h00. L'accès à la piscine et à la salle de fitness est inclus dans le prix de la chambre.</p>
    `,
    privacyPolicy: `
      <h2>Politique de Confidentialité - REX HOTEL</h2>
      
      <h3>1. Collecte des données</h3>
      <p>Nous collectons uniquement les informations nécessaires à votre séjour et à l'amélioration de nos services.</p>
      
      <h3>2. Utilisation des données</h3>
      <p>Les informations recueillies sont utilisées pour gérer votre réservation, personnaliser votre séjour et vous informer de nos offres.</p>
      
      <h3>3. Protection des données</h3>
      <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles.</p>
      
      <h3>4. Droits des utilisateurs</h3>
      <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
    `,
    isMaintenanceMode: false,
    updatedAt: new Date()
  };
  
  // BehaviorSubject pour les paramètres de l'hôtel
  private hotelSettingsSubject = new BehaviorSubject<HotelSettings>(this.hotelSettingsData);
  public hotelSettings$ = this.hotelSettingsSubject.asObservable();
  
  // Paramètres d'affichage
  private displaySettings = {
    language: 'fr',
    theme: 'dark',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    timezone: 'Africa/Abidjan'
  };

  constructor() { }

  /**
   * Récupère les paramètres actuels de l'hôtel
   */
  getHotelSettings(): Observable<HotelSettings> {
    return of(this.hotelSettingsData).pipe(
      delay(300),
      tap(settings => {
        this.hotelSettingsSubject.next(settings);
      })
    );
  }

  /**
   * Met à jour les paramètres de l'hôtel (pour l'admin)
   */
  updateHotelSettings(settings: Partial<HotelSettings>): Observable<HotelSettings> {
    this.hotelSettingsData = {
      ...this.hotelSettingsData,
      ...settings,
      updatedAt: new Date()
    };
    
    this.hotelSettingsSubject.next(this.hotelSettingsData);
    
    return of(this.hotelSettingsData).pipe(delay(500));
  }

  /**
   * Récupère les informations de contact de l'hôtel
   */
  getContactInfo(): Observable<ContactInfo> {
    return of(this.hotelSettingsData.contact!).pipe(delay(300));
  }

  /**
   * Récupère les heures de check-in et check-out
   */
  getCheckInOutTimes(): Observable<{checkInTime: string, checkOutTime: string}> {
    return of({
      checkInTime: this.hotelSettingsData.checkInTime || '14:00',
      checkOutTime: this.hotelSettingsData.checkOutTime || '12:00'
    }).pipe(delay(300));
  }

  /**
   * Récupère le taux de taxe actuel
   */
  getTaxRate(): Observable<number> {
    return of(this.hotelSettingsData.taxRate || 0).pipe(delay(300));
  }

  /**
   * Met à jour les informations de contact (pour l'admin)
   */
  updateContactInfo(contactInfo: ContactInfo): Observable<ContactInfo> {
    this.hotelSettingsData.contact = contactInfo;
    this.hotelSettingsData.updatedAt = new Date();
    
    this.hotelSettingsSubject.next(this.hotelSettingsData);
    
    return of(contactInfo).pipe(delay(500));
  }

  /**
   * Récupère les conditions générales
   */
  getTermsAndConditions(): Observable<string> {
    return of(this.hotelSettingsData.termsAndConditions || '').pipe(delay(300));
  }

  /**
   * Récupère la politique de confidentialité
   */
  getPrivacyPolicy(): Observable<string> {
    return of(this.hotelSettingsData.privacyPolicy || '').pipe(delay(300));
  }

  /**
   * Met à jour les documents légaux (pour l'admin)
   */
  updateLegalDocuments(documents: {
    termsAndConditions?: string,
    privacyPolicy?: string
  }): Observable<HotelSettings> {
    if (documents.termsAndConditions) {
      this.hotelSettingsData.termsAndConditions = documents.termsAndConditions;
    }
    
    if (documents.privacyPolicy) {
      this.hotelSettingsData.privacyPolicy = documents.privacyPolicy;
    }
    
    this.hotelSettingsData.updatedAt = new Date();
    this.hotelSettingsSubject.next(this.hotelSettingsData);
    
    return of(this.hotelSettingsData).pipe(delay(500));
  }

  /**
   * Active ou désactive le mode maintenance
   */
  toggleMaintenanceMode(isEnabled: boolean): Observable<{isMaintenanceMode: boolean}> {
    this.hotelSettingsData.isMaintenanceMode = isEnabled;
    this.hotelSettingsSubject.next(this.hotelSettingsData);
    
    return of({ isMaintenanceMode: isEnabled }).pipe(delay(500));
  }

  /**
   * Récupère les paramètres d'affichage
   */
  getDisplaySettings(): Observable<any> {
    return of(this.displaySettings).pipe(delay(300));
  }

  /**
   * Met à jour les paramètres d'affichage
   */
  updateDisplaySettings(settings: Partial<{
    language: string,
    theme: string,
    dateFormat: string,
    timeFormat: string,
    timezone: string
  }>): Observable<any> {
    this.displaySettings = {
      ...this.displaySettings,
      ...settings
    };
    
    return of(this.displaySettings).pipe(delay(500));
  }

  /**
   * Formate un prix avec la devise configurée
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.hotelSettingsData.currency || 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Calcule le montant des taxes pour un prix donné
   */
  calculateTax(price: number): number {
    const taxRate = this.hotelSettingsData.taxRate || 0;
    return (price * taxRate) / 100;
  }

  /**
   * Récupère la liste des fuseaux horaires disponibles
   */
  getAvailableTimezones(): Observable<string[]> {
    const timezones = [
      'Africa/Abidjan',
      'Africa/Accra',
      'Africa/Dakar',
      'Africa/Lagos',
      'Europe/Paris',
      'Europe/London',
      'America/New_York',
      'Asia/Dubai'
    ];
    
    return of(timezones).pipe(delay(300));
  }

  /**
   * Récupère la liste des langues disponibles
   */
  getAvailableLanguages(): Observable<{code: string, name: string}[]> {
    const languages = [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];
    
    return of(languages).pipe(delay(300));
  }
}