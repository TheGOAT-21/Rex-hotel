import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { 
  BreadcrumbsComponent, 
  LoadingComponent 
} from '../../../shared/components';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation, ReservationWithDetails } from '../../../core/models';

@Component({
  selector: 'app-reservation-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    LoadingComponent
  ],
  templateUrl: './reservation-confirmation.component.html',
  styleUrl: './reservation-confirmation.component.css'
})
export class ReservationConfirmationComponent implements OnInit {
  reservation: ReservationWithDetails | null = null;
  isLoading = true;
  error: string | null = null;
  confirmationCode: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadReservation(id);
      } else {
        this.error = "Identifiant de réservation introuvable.";
        this.isLoading = false;
      }
    });
    
    this.route.queryParams.subscribe(params => {
      this.confirmationCode = params['code'] || '';
      if (this.confirmationCode && !this.reservation) {
        this.loadReservationByCode(this.confirmationCode);
      }
    });
  }
  
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
        console.error('Erreur lors du chargement des détails:', err);
      }
    });
  }
  
  loadReservationByCode(code: string): void {
    this.isLoading = true;
    this.error = null;
    
    // Mock implementation for demonstration
    setTimeout(() => {
      this.reservation = {
        id: 'res-' + Math.random().toString(36).substr(2, 9),
        userId: 'user-123',
        spaceId: 'space-123',
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
        numberOfGuests: 2,
        totalPrice: 180000,
        status: 'confirmee',
        confirmationCode: code,
        createdAt: new Date(),
        space: {
          name: 'Suite Executive',
          type: 'chambre_king_executive',
          mainImage: '/assets/images/rooms/chambre.jpeg'
        },
        user: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          phoneNumber: '+225 01 02 03 04'
        }
      } as ReservationWithDetails;
      
      this.isLoading = false;
    }, 1000);
  }
  
  getFormattedDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  getNights(): number {
    if (!this.reservation?.startDate || !this.reservation?.endDate) return 0;
    
    const start = new Date(this.reservation.startDate);
    const end = new Date(this.reservation.endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  viewReservationDetails(): void {
    if (!this.reservation?.id) return;
    this.router.navigate(['/reservation', this.reservation.id]);
  }
  
  downloadInvoice(): void {
    if (!this.reservation?.id) return;
    alert('Téléchargement de la facture en cours...');
  }
  
  getTaxAmount(): number {
    if (!this.reservation?.totalPrice) return 0;
    return this.reservation.totalPrice * 0.18;
  }
  
  getSpaceTypeLabel(type: string | undefined): string {
    if (!type) return '';
    
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}