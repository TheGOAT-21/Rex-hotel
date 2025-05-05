import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatepickerComponent, LoadingComponent } from '../../../shared/components';
import { ReservationService } from '../../../core/services/reservation.service';
import { SpaceService } from '../../../core/services/space.service';
import { Space, ReservationRequest } from '../../../core/models';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatepickerComponent,
    LoadingComponent
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  space: Space | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  error: string | null = null;
  success: boolean = false;
  
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  totalPrice: number = 0;
  numberOfNights: number = 1;
  
  showGuestInfo: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private spaceService: SpaceService
  ) {
    this.reservationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
      specialRequests: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }
  
  ngOnInit(): void {
    const spaceId = this.route.snapshot.paramMap.get('spaceId');
    
    const startDateParam = this.route.snapshot.queryParamMap.get('startDate');
    const endDateParam = this.route.snapshot.queryParamMap.get('endDate');
    const guestsParam = this.route.snapshot.queryParamMap.get('guests');
    
    if (startDateParam) {
      this.startDate = new Date(startDateParam);
    }
    
    if (endDateParam) {
      this.endDate = new Date(endDateParam);
    }
    
    if (guestsParam) {
      this.reservationForm.patchValue({
        numberOfGuests: parseInt(guestsParam, 10)
      });
    }
    
    if (spaceId) {
      this.loadSpaceDetails(spaceId);
    } else {
      this.isLoading = false;
      this.error = "Veuillez sélectionner un espace à réserver";
    }
    
    this.reservationForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }
  
  loadSpaceDetails(spaceId: string): void {
    this.spaceService.getSpaceById(spaceId).subscribe({
      next: (space) => {
        this.space = space;
        this.isLoading = false;
        this.calculatePrice();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = "Impossible de charger les détails de l'espace";
        console.error(err);
      }
    });
  }
  
  onDateRangeSelected(range: {start: Date, end: Date | null}): void {
    this.startDate = range.start;
    this.endDate = range.end;
    this.calculatePrice();
  }
  
  calculateNumberOfNights(): number {
    if (!this.startDate || !this.endDate) {
      return 1;
    }
    
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  calculatePrice(): void {
    if (!this.space) return;
    
    this.numberOfNights = this.calculateNumberOfNights();
    const guests = this.reservationForm.get('numberOfGuests')?.value || 1;
    
    if (this.startDate && this.endDate) {
      this.reservationService.calculatePrice(
        this.space.id!, 
        this.startDate, 
        this.endDate, 
        guests
      ).subscribe({
        next: (price) => {
          this.totalPrice = price;
        },
        error: (err) => {
          this.totalPrice = this.space!.price * this.numberOfNights;
          console.error('Error calculating price:', err);
        }
      });
    } else {
      this.totalPrice = this.space.price * this.numberOfNights;
    }
  }
  
  proceedToGuestInfo(): void {
    if (!this.startDate || !this.endDate) {
      this.error = "Veuillez sélectionner les dates de votre séjour";
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (this.startDate < today) {
      this.error = "La date d'arrivée ne peut pas être dans le passé";
      return;
    }
    
    if (this.startDate >= this.endDate) {
      this.error = "La date de départ doit être après la date d'arrivée";
      return;
    }
    
    this.error = null;
    this.showGuestInfo = true;
  }
  
  submitReservation(): void {
    if (this.reservationForm.invalid) {
      Object.keys(this.reservationForm.controls).forEach(key => {
        const control = this.reservationForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    if (!this.startDate || !this.endDate || !this.space) {
      this.error = "Informations de réservation incomplètes";
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    
    const reservationRequest: ReservationRequest = {
      spaceId: this.space.id!,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: this.reservationForm.get('numberOfGuests')!.value,
      specialRequests: this.reservationForm.get('specialRequests')!.value
    };
    
    this.reservationService.createReservation(reservationRequest).subscribe({
      next: (reservation) => {
        this.isSubmitting = false;
        this.success = true;
        
        setTimeout(() => {
          this.router.navigate(['/reservation', reservation.id, 'confirm']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = "Erreur lors de la création de la réservation. Veuillez réessayer.";
        console.error(err);
      }
    });
  }
  
  get f() { return this.reservationForm.controls; }
  
  resetForm(): void {
    this.showGuestInfo = false;
    this.error = null;
  }
}