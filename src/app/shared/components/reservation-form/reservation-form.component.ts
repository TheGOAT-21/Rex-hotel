import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  DatepickerComponent,
  PriceDisplayComponent,
  LoadingComponent
} from '../index';
import { 
  Space,
  SpaceAvailability,
  ReservationRequest
} from '../../../core/models';
import { SpaceService } from '../../../core/services';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatepickerComponent,
    PriceDisplayComponent,
    LoadingComponent
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit, OnChanges {
  @Input() space: Space | null = null;
  @Input() formTitle: string = 'Réservation';
  @Input() submitButtonText: string = 'Réserver maintenant';
  @Input() initialStartDate: Date | null = null;
  @Input() initialEndDate: Date | null = null;
  @Input() initialGuestCount: number = 1;
  @Input() maxGuests: number = 5;
  @Input() isEditMode: boolean = false;
  @Input() existingReservationId: string | null = null;
  @Input() showPriceSummary: boolean = true;
  @Input() showTaxes: boolean = true;
  @Input() showPaymentInfo: boolean = true;

  @Output() formSubmit = new EventEmitter<ReservationRequest>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() availabilityChange = new EventEmitter<SpaceAvailability>();

  reservationForm!: FormGroup;
  
  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date = new Date();
  disabledDates: Date[] = [];
  
  availability: SpaceAvailability | null = null;
  checkingAvailability = false;
  dateRangeInvalid = false;
  
  constructor(
    private fb: FormBuilder,
    private spaceService: SpaceService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Initialize dates
    if (this.initialStartDate) {
      this.startDate = new Date(this.initialStartDate);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.startDate = tomorrow;
    }
    
    if (this.initialEndDate) {
      this.endDate = new Date(this.initialEndDate);
    } else if (this.startDate) {
      const dayAfter = new Date(this.startDate);
      dayAfter.setDate(dayAfter.getDate() + 1);
      this.endDate = dayAfter;
    }
    
    // Check availability if space and dates are set
    if (this.space && this.startDate && this.endDate) {
      this.checkAvailability();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['space'] && !changes['space'].firstChange) {
      // Space changed, check availability
      if (this.space && this.startDate && this.endDate) {
        this.checkAvailability();
      }
    }
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      guestCount: [this.initialGuestCount, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });
  }

  checkAvailability(): void {
    if (!this.space || !this.startDate || !this.endDate) {
      this.dateRangeInvalid = true;
      return;
    }
    
    this.dateRangeInvalid = false;
    this.checkingAvailability = true;
    
    this.spaceService.checkAvailability(this.space.id!, this.startDate, this.endDate).subscribe({
      next: (availability) => {
        this.availability = availability;
        this.availabilityChange.emit(availability);
        this.checkingAvailability = false;
      },
      error: (err) => {
        console.error('Error checking availability:', err);
        this.checkingAvailability = false;
        this.availability = null;
      }
    });
  }

  onDateRangeSelected(range: {start: Date, end: Date | null}): void {
    this.startDate = range.start;
    this.endDate = range.end;
    
    if (this.startDate && this.endDate) {
      this.checkAvailability();
    } else {
      this.dateRangeInvalid = true;
    }
  }

  onSubmit(): void {
    if (this.reservationForm.invalid || !this.startDate || !this.endDate || !this.space) {
      this.dateRangeInvalid = !this.startDate || !this.endDate;
      return;
    }
    
    const formValue = this.reservationForm.value;
    
    const reservationRequest: ReservationRequest = {
      spaceId: this.space.id!,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: formValue.guestCount,
      specialRequests: formValue.specialRequests
    };
    
    this.formSubmit.emit(reservationRequest);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  // Helper methods
  getSpaceTypeLabel(type: string): string {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getGuestCountOptions(): number[] {
    const max = this.space ? Math.min(this.space.capacity, this.maxGuests) : this.maxGuests;
    return Array.from({length: max}, (_, i) => i + 1);
  }

  getNights(): number {
    if (!this.startDate || !this.endDate) return 1;
    
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getBasePrice(): number {
    return this.space ? this.space.price : 0;
  }

  calculateTaxes(): number {
    // Simulate tax calculation (e.g., 10% of base price)
    return this.getBasePrice() * this.getNights() * 0.1;
  }

  calculateTotalPrice(): number {
    const baseTotal = this.getBasePrice() * this.getNights();
    return this.showTaxes ? baseTotal + this.calculateTaxes() : baseTotal;
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}