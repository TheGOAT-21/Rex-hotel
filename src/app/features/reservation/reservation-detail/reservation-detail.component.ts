// reservation-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, LoadingComponent } from '../../../shared/components';
import { 
  Reservation, 
  ReservationWithDetails, 
  ReservationStatus,
  PaymentStatus,
  Invoice
} from '../../../core/models';
import { ReservationService } from '../../../core/services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    BreadcrumbsComponent, 
    LoadingComponent
  ],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css'
})
export class ReservationDetailComponent implements OnInit {
  reservation: ReservationWithDetails | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  invoice: Invoice | null = null;
  loadingInvoice: boolean = false;
  
  // For the cancellation modal
  showCancelModal: boolean = false;
  cancellationReason: string = '';
  isProcessingCancel: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    const reservationId = this.route.snapshot.paramMap.get('id');
    if (reservationId) {
      this.loadReservationDetails(reservationId);
    }
  }
  
  loadReservationDetails(id: string | undefined): void {
    if (!id) {
      this.error = "Identifiant de réservation non trouvé.";
      this.isLoading = false;
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.isLoading = false;
        this.loadInvoice(id);
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement des détails de la réservation.";
        this.isLoading = false;
        console.error('Erreur lors du chargement des détails:', err);
      }
    });
  }
  
  reloadReservationDetails(): void {
    if (!this.reservation?.id) {
      this.error = "Impossible de recharger les détails de la réservation.";
      return;
    }
    this.loadReservationDetails(this.reservation.id);
  }
  
  loadInvoice(reservationId: string): void {
    this.loadingInvoice = true;
    
    this.reservationService.getReservationInvoice(reservationId).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loadingInvoice = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la facture:', err);
        this.loadingInvoice = false;
      }
    });
  }
  
  openCancelModal(): void {
    this.showCancelModal = true;
  }
  
  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancellationReason = '';
    this.isProcessingCancel = false;
  }
  
  cancelReservation(): void {
    if (!this.reservation) return;
    
    this.isProcessingCancel = true;
    
    this.reservationService.cancelReservation(this.reservation.id!, this.cancellationReason).subscribe({
      next: (updatedReservation) => {
        this.reservation = { ...this.reservation!, ...updatedReservation };
        this.notificationService.showSuccess('Votre réservation a été annulée avec succès');
        this.closeCancelModal();
      },
      error: (err) => {
        this.notificationService.showError("Une erreur est survenue lors de l'annulation de la réservation");
        this.isProcessingCancel = false;
        console.error('Erreur lors de l\'annulation:', err);
      }
    });
  }
  
  getStatusLabel(status: ReservationStatus | undefined): string {
    if (!status) return 'Inconnu';
    switch (status) {
      case ReservationStatus.CONFIRMEE:
        return 'Confirmée';
      case ReservationStatus.EN_ATTENTE:
        return 'En attente';
      case ReservationStatus.ANNULEE:
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  }
  
  getPaymentStatusLabel(status: PaymentStatus | undefined): string {
    if (!status) return 'Inconnu';
    switch (status) {
      case PaymentStatus.COMPLET:
        return 'Payé';
      case PaymentStatus.EN_ATTENTE:
        return 'En attente';
      case PaymentStatus.REMBOURSE:
        return 'Remboursé';
      default:
        return 'Inconnu';
    }
  }
  
  getStatusColor(status: ReservationStatus | undefined): string {
    if (!status) return 'bg-gray-700';
    switch (status) {
      case ReservationStatus.CONFIRMEE:
        return 'bg-green-900';
      case ReservationStatus.EN_ATTENTE:
        return 'bg-yellow-900';
      case ReservationStatus.ANNULEE:
        return 'bg-red-900';
      default:
        return 'bg-gray-700';
    }
  }
  
  getPaymentStatusColor(status: PaymentStatus | undefined): string {
    if (!status) return 'bg-gray-700';
    switch (status) {
      case PaymentStatus.COMPLET:
        return 'bg-green-900';
      case PaymentStatus.EN_ATTENTE:
        return 'bg-yellow-900';
      case PaymentStatus.REMBOURSE:
        return 'bg-red-900';
      default:
        return 'bg-gray-700';
    }
  }
  
  formatDate(date: Date | undefined): string {
    if (!date) return 'Date inconnue';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  getNights(): number {
    if (!this.reservation?.startDate || !this.reservation?.endDate) return 0;
    const start = new Date(this.reservation.startDate);
    const end = new Date(this.reservation.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  canCancel(): boolean {
    return this.reservation?.status === ReservationStatus.EN_ATTENTE || this.reservation?.status === ReservationStatus.CONFIRMEE;
  }
  
  downloadInvoice(): void {
    if (!this.invoice) return;
    // TODO: Implement actual invoice download
  }
}