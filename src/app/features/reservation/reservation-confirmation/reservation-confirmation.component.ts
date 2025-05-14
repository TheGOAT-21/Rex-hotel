import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { 
  BreadcrumbsComponent, 
  LoadingComponent,
  PriceDisplayComponent,
  AmenityBadgeComponent
} from '../../../shared/components';
import { ReservationService } from '../../../core/services/reservation.service';
import { SettingsService } from '../../../core/services/settings.service';
import { Reservation, Room } from '../../../core/models';

@Component({
  selector: 'app-reservation-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    LoadingComponent,
    AmenityBadgeComponent
  ],
  templateUrl: './reservation-confirmation.component.html',
  styleUrl: './reservation-confirmation.component.css'
})
export class ReservationConfirmationComponent implements OnInit {
  reservation: Reservation | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private settingsService: SettingsService
  ) {}
  
  ngOnInit(): void {
    // Get reservation ID from route parameters
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadReservation(id);
      } else {
        this.error = "Identifiant de réservation non trouvé.";
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Load reservation details from service
   */
  loadReservation(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement des détails de la réservation.";
        this.isLoading = false;
        console.error('Error loading reservation details:', err);
      }
    });
  }
  
  /**
   * Calculate number of nights
   */
  getNights(): number {
    if (!this.reservation?.startDate || !this.reservation?.endDate) return 0;
    
    const start = new Date(this.reservation.startDate);
    const end = new Date(this.reservation.endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  /**
   * Calculate taxes
   */
  calculateTaxes(): number {
    const basePrice = this.reservation?.totalPrice || 0;
    return basePrice * 0.18; // 18% tax rate
  }
  
  /**
   * Format price with hotel currency
   */
  formatPrice(price: number): string {
    return this.settingsService.formatPrice(price);
  }
  
  /**
   * Format date to locale string
   */
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  /**
   * Get room type label
   */
  getRoomTypeLabel(type: string | undefined): string {
    if (!type) return '';
    
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Print / download reservation
   */
  printReservation(): void {
    window.print();
  }
  
  /**
   * Download invoice
   */
  downloadInvoice(): void {
    // In a real application, this would call a service to generate and download an invoice
    alert('Fonctionnalité de téléchargement de facture à implémenter.');
  }
  
  /**
   * Navigate to reservation management
   */
  viewReservations(): void {
    this.router.navigate(['/user/reservations']);
  }
}