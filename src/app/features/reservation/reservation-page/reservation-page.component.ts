// reservation-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BreadcrumbsComponent,
  LoadingComponent,
  DatepickerComponent,
  PriceDisplayComponent,
  RoomCardComponent
} from '../../../shared/components';
import { 
  ReservationService, 
  SpaceService, 
  AuthService, 
  NotificationService 
} from '../../../core/services';
import { Space, ReservationRequest } from '../../../core/models';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent,
    LoadingComponent,
    DatepickerComponent,
  ],
  templateUrl: 'reservation-page.component.html',
  styleUrl: 'reservation-page.component.css'
})
export class ReservationPageComponent implements OnInit {
  spaceId: string | null = null;
  space: Space | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  guestCount: number = 1;
  totalPrice: number = 0;
  
  isLoading: boolean = false;
  isCalculatingPrice: boolean = false;
  error: string | null = null;
  
  reservationForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private spaceService: SpaceService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.reservationForm = this.formBuilder.group({
      specialRequests: ['']
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.spaceId = params['spaceId'];
      if (this.spaceId) {
        this.loadSpaceDetails();
      } else {
        // Set isLoading to false when no spaceId is found
        this.isLoading = false;
      }
    });
    
    this.route.queryParams.subscribe(params => {
      if (params['startDate']) {
        this.startDate = new Date(params['startDate']);
      }
      
      if (params['endDate']) {
        this.endDate = new Date(params['endDate']);
      }
      
      if (params['guests']) {
        this.guestCount = parseInt(params['guests']);
      }
      
      if (this.spaceId && this.startDate && this.endDate && this.guestCount) {
        this.calculatePrice();
      }
    });
  }
  
  loadSpaceDetails(): void {
    if (!this.spaceId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.spaceService.getSpaceById(this.spaceId).subscribe({
      next: (space) => {
        this.space = space;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement des détails de l'espace.";
        this.isLoading = false;
        console.error('Error loading space details:', err);
      }
    });
  }

  getGuestOptions(): number[] {
    if (!this.space) return [1];
    return Array.from({length: this.space.capacity}, (_, i) => i + 1);
  }
  
  calculatePrice(): void {
    if (!this.spaceId || !this.startDate || !this.endDate || !this.guestCount) return;
    
    this.isCalculatingPrice = true;
    
    this.reservationService.calculatePrice(
      this.spaceId, 
      this.startDate, 
      this.endDate, 
      this.guestCount
    ).subscribe({
      next: (price) => {
        this.totalPrice = price;
        this.isCalculatingPrice = false;
      },
      error: (err) => {
        console.error('Error calculating price:', err);
        this.isCalculatingPrice = false;
        if (this.space) {
          const days = this.calculateNights();
          this.totalPrice = this.space.price * days;
        }
      }
    });
  }
  
  calculateNights(): number {
    if (!this.startDate || !this.endDate) return 1;
    
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  onDateRangeSelected(range: {start: Date, end: Date | null}): void {
    this.startDate = range.start;
    this.endDate = range.end;
    
    if (this.startDate && this.endDate && this.spaceId && this.guestCount) {
      this.calculatePrice();
    }
  }
  
  updateGuestCount(event: Event): void {
    this.guestCount = parseInt((event.target as HTMLSelectElement).value);
    
    if (this.startDate && this.endDate && this.spaceId && this.guestCount) {
      this.calculatePrice();
    }
  }
  
  confirmReservation(): void {
    if (!this.spaceId || !this.startDate || !this.endDate || !this.guestCount) {
      this.error = "Veuillez remplir tous les champs requis.";
      return;
    }
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: this.router.url
        }
      });
      return;
    }
    
    const reservationRequest: ReservationRequest = {
      spaceId: this.spaceId,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: this.guestCount,
      specialRequests: this.reservationForm.value.specialRequests
    };
    
    this.isLoading = true;
    
    this.reservationService.createReservation(reservationRequest).subscribe({
      next: (reservation) => {
        this.isLoading = false;
        this.notificationService.showSuccess('Votre réservation a été créée avec succès.');
        this.router.navigate(['/reservation', reservation.id, 'confirm']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message || "Une erreur est survenue lors de la création de la réservation.";
        console.error('Error creating reservation:', err);
      }
    });
  }
  
  goBack(): void {
    if (this.spaceId) {
      this.router.navigate(['/spaces', this.spaceId]);
    } else {
      this.router.navigate(['/catalog']);
    }
  }
  
  formatDate(date: Date | null): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('fr-FR', options);
  }
}