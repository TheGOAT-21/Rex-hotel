import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  BreadcrumbsComponent,
  PaginationComponent,
  LoadingComponent,
  DatepickerComponent,
  PriceDisplayComponent
} from '../../../shared/components';
import { ReservationService } from '../../../core/services/reservation.service';
import { 
  Reservation,
  ReservationStatus, 
  ReservationWithDetails,
  ReservationFilter
} from '../../../core/models';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BreadcrumbsComponent,
    PaginationComponent,
    LoadingComponent,
    DatepickerComponent,
    PriceDisplayComponent
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservations: ReservationWithDetails[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  
  // Filtres
  statusFilter: string = 'all';
  startDateFilter: Date | null = null;
  endDateFilter: Date | null = null;
  
  constructor(private reservationService: ReservationService) {}
  
  ngOnInit(): void {
    this.loadReservations();
  }
  
  loadReservations(): void {
    this.isLoading = true;
    this.error = null;
    
    const filter: ReservationFilter = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    // Ajouter les filtres si définis
    if (this.statusFilter !== 'all') {
      filter.status = [this.statusFilter];
    }
    
    if (this.startDateFilter) {
      filter.startDateFrom = this.startDateFilter;
    }
    
    if (this.endDateFilter) {
      filter.startDateTo = this.endDateFilter;
    }
    
    this.reservationService.getUserReservations(filter).subscribe({
      next: (result) => {
        this.reservations = result.items;
        this.totalItems = result.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement de vos réservations.";
        this.isLoading = false;
        console.error('Erreur lors du chargement des réservations:', err);
      }
    });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReservations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page
    this.loadReservations();
  }
  
  resetFilters(): void {
    this.statusFilter = 'all';
    this.startDateFilter = null;
    this.endDateFilter = null;
    this.currentPage = 1;
    this.loadReservations();
  }
  
  onStartDateSelected(date: Date): void {
    this.startDateFilter = date;
    this.applyFilters();
  }
  
  onEndDateSelected(date: Date): void {
    this.endDateFilter = date;
    this.applyFilters();
  }
  
  cancelReservation(reservation: ReservationWithDetails): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.')) {
      this.reservationService.cancelReservation(reservation.id!).subscribe({
        next: () => {
          // Mettre à jour le statut localement
          reservation.status = ReservationStatus.ANNULEE;
          // Ou recharger la liste complète
          // this.loadReservations();
        },
        error: (err) => {
          console.error('Erreur lors de l\'annulation de la réservation:', err);
          alert('Impossible d\'annuler la réservation. Veuillez réessayer plus tard.');
        }
      });
    }
  }
  
  // Méthodes utilitaires
  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'confirmee': return 'Confirmée';
      case 'en_cours': return 'En cours';
      case 'terminee': return 'Terminée';
      case 'annulee': return 'Annulée';
      default: return status;
    }
  }
  
  formatDateRange(startDate: Date, endDate: Date): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    
    return `${start.toLocaleDateString('fr-FR', options)} - ${end.toLocaleDateString('fr-FR', options)}`;
  }
}