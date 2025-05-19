import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  DatepickerComponent,
  PriceDisplayComponent,
  LoadingComponent
} from '../index';

// Importation directe des modèles individuels au lieu d'utiliser un barrel file
// Supposons que ces fichiers existent ou doivent être créés
import { Room } from '../../../core/models/room.model';
import { RoomAvailability } from '../../../core/models/room.model';
import { ReservationRequest } from '../../../core/models/reservation.model';
import { PaymentMethod } from '../../../core/models/reservation.model';

// Importation directe du service Room
import { RoomService } from '../../../core/services/room.service';

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
  @Input() room: Room | null = null;
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
  @Input() paymentEnabled: boolean = false;

  @Output() formSubmit = new EventEmitter<ReservationRequest>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() availabilityChange = new EventEmitter<RoomAvailability>();

  reservationForm!: FormGroup;
  paymentForm!: FormGroup;
  
  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date = new Date();
  disabledDates: Date[] = [];
  disabledDateRanges: {start: Date, end: Date}[] = [];
  
  availability: RoomAvailability | null = null;
  checkingAvailability = false;
  dateRangeInvalid = false;
  
  showPaymentSection: boolean = false;
  selectedPaymentMethod: PaymentMethod | null = null;
  
  guestTitles: {value: string, label: string}[] = [
    {value: 'mr', label: 'M.'},
    {value: 'mrs', label: 'Mme'},
    {value: 'ms', label: 'Mlle'},
    {value: 'dr', label: 'Dr'}
  ];
  
  paymentMethods: {value: PaymentMethod, label: string}[] = [
    {value: 'card', label: 'Carte bancaire'},
    {value: 'paypal', label: 'PayPal'},
    {value: 'bank_transfer', label: 'Virement bancaire'},
    {value: 'on_arrival', label: 'Paiement à l\'arrivée'}
  ];
  
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
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
    
    this.loadUnavailableDates();
    
    if (this.room && this.startDate && this.endDate) {
      this.checkAvailability();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room'] && !changes['room'].firstChange) {
      this.loadUnavailableDates();
      
      if (this.room && this.startDate && this.endDate) {
        this.checkAvailability();
      }
    }
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      title: ['mr', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]{6,20}$/)]],
      guestCount: [this.initialGuestCount, [Validators.required, Validators.min(1)]],
      specialRequests: [''],
      termsAccepted: [false, [Validators.requiredTrue]]
    });
    
    this.paymentForm = this.fb.group({
      paymentMethod: ['card', Validators.required],
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        zipCode: [''],
        country: ['']
      })
    });
    
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe((method: PaymentMethod) => {
      this.selectedPaymentMethod = method;
      
      const cardFields = ['cardholderName', 'cardNumber', 'expiryDate', 'cvv'];
      
      if (method === 'card') {
        cardFields.forEach(field => {
          this.paymentForm.get(field)?.setValidators([Validators.required]);
          this.paymentForm.get(field)?.updateValueAndValidity();
        });
      } else {
        cardFields.forEach(field => {
          this.paymentForm.get(field)?.clearValidators();
          this.paymentForm.get(field)?.updateValueAndValidity();
        });
      }
    });
  }
  
  loadUnavailableDates(): void {
    if (!this.room) return;
    
    this.roomService.getUnavailableDates(this.room.id!).subscribe({
      next: (data: {dates: Date[], ranges: {start: Date, end: Date}[]}) => {
        this.disabledDates = data.dates || [];
        this.disabledDateRanges = data.ranges || [];
      },
      error: (err: Error) => {
        console.error('Erreur lors du chargement des dates indisponibles:', err);
      }
    });
  }

  checkAvailability(): void {
    if (!this.room || !this.startDate || !this.endDate) {
      this.dateRangeInvalid = true;
      return;
    }
    
    this.dateRangeInvalid = false;
    this.checkingAvailability = true;
    
    this.roomService.checkAvailability(this.room.id!, this.startDate, this.endDate).subscribe({
      next: (availability: RoomAvailability) => {
        this.availability = availability;
        this.availabilityChange.emit(availability);
        this.checkingAvailability = false;
      },
      error: (err: Error) => {
        console.error('Error checking availability:', err);
        this.checkingAvailability = false;
        this.availability = null;
      }
    });
  }

  onDateRangeSelected(range: { start: Date | null, end: Date | null }): void {
    this.startDate = range.start;
    this.endDate = range.end;
    this.dateRangeInvalid = !range.start;
    
    if (range.start && this.room) {
      this.checkAvailability();
    }
  }

  onSubmit(): void {
    if (this.reservationForm.invalid || !this.startDate || !this.endDate || !this.room) {
      this.dateRangeInvalid = !this.startDate || !this.endDate;
      
      this.markFormGroupTouched(this.reservationForm);
      
      if (this.showPaymentSection && this.paymentEnabled) {
        this.markFormGroupTouched(this.paymentForm);
      }
      
      return;
    }
    
    const formValue = this.reservationForm.value;
    
    const reservationRequest: ReservationRequest = {
      roomId: this.room.id!,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: formValue.guestCount,
      specialRequests: formValue.specialRequests,
      guestInfo: {
        title: formValue.title,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone
      }
    };
    
    if (this.showPaymentSection && this.paymentEnabled && this.paymentForm.valid) {
      reservationRequest.payment = {
        method: this.paymentForm.value.paymentMethod,
        cardDetails: this.paymentForm.value.paymentMethod === 'card' ? {
          cardholderName: this.paymentForm.value.cardholderName,
          cardNumber: this.paymentForm.value.cardNumber,
          expiryDate: this.paymentForm.value.expiryDate,
          cvv: this.paymentForm.value.cvv
        } : undefined,
        billingAddress: this.paymentForm.value.billingAddress
      };
    }
    
    this.formSubmit.emit(reservationRequest);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  togglePaymentSection(): void {
    this.showPaymentSection = !this.showPaymentSection;
  }

  getRoomTypeLabel(type: string): string {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getGuestCountOptions(): number[] {
    const max = this.room ? Math.min(this.room.capacity, this.maxGuests) : this.maxGuests;
    return Array.from({length: max}, (_, i) => i + 1);
  }

  getNights(): number {
    if (!this.startDate || !this.endDate) return 1;
    
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getBasePrice(): number {
    return this.room ? this.room.price : 0;
  }

  calculateTaxes(): number {
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
  
  getFormControlError(controlName: string): string {
    const control = this.reservationForm.get(controlName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors?.['email']) {
        return 'Veuillez entrer une adresse email valide.';
      }
      if (control.errors?.['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères.`;
      }
      if (control.errors?.['pattern']) {
        return 'Format invalide.';
      }
      if (control.errors?.['min']) {
        return `La valeur minimale est ${control.errors['min'].min}.`;
      }
    }
    return '';
  }
  
  isFormControlInvalid(controlName: string): boolean {
    const control = this.reservationForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}