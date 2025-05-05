import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent, BreadcrumbsComponent } from '../../../shared/components';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReservationWithDetails } from '../../../core/models';

@Component({
  selector: 'app-reservation-cancel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoadingComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './reservation-cancel.component.html',
  styleUrl: './reservation-cancel.component.css'
})
export class ReservationCancelComponent implements OnInit {
  reservation: ReservationWithDetails | null = null;
  isLoading = true;
  error: string | null = null;
  success = false;
  cancellationForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private reservationService: ReservationService
  ) {
    this.cancellationForm = this.formBuilder.group({
      reason: ['', Validators.required],
      additionalInfo: ['']
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadReservationDetails(id);
      } else {
        this.error = "Identifiant de réservation non trouvé.";
        this.isLoading = false;
      }
    });
  }
  
  loadReservationDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation as ReservationWithDetails;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement des détails de la réservation.";
        this.isLoading = false;
        console.error('Erreur lors du chargement de la réservation:', err);
      }
    });
  }
  
  onSubmit(): void {
    if (!this.reservation || this.cancellationForm.invalid) return;
    
    this.isLoading = true;
    const reason = this.cancellationForm.get('reason')?.value;
    const additionalInfo = this.cancellationForm.get('additionalInfo')?.value;
    const cancellationReason = additionalInfo ? `${reason} - ${additionalInfo}` : reason;
    
    this.reservationService.cancelReservation(this.reservation.id!, cancellationReason).subscribe({
      next: () => {
        this.success = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors de l'annulation de la réservation.";
        this.isLoading = false;
        console.error('Erreur lors de l\'annulation:', err);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/reservation', this.reservation?.id]);
  }
  
  goToReservations(): void {
    this.router.navigate(['/reservation/list']);
  }
  
  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}