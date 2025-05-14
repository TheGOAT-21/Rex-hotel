import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  DatepickerComponent,
  PriceDisplayComponent,
  LoadingComponent
} from '../index';
import { 
  Room,
  RoomAvailability,
  ReservationRequest,
  PaymentMethod
} from '../../../core/models';
import { RoomService } from '../../../core/services';

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
  @Input() paymentEnabled: boolean = false; // Nouvelle option pour activer le paiement

  @Output() formSubmit = new EventEmitter<ReservationRequest>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() availabilityChange = new EventEmitter<RoomAvailability>();

  reservationForm!: FormGroup;
  paymentForm!: FormGroup; // Nouveau formulaire pour les détails de paiement
  
  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date = new Date();
  disabledDates: Date[] = [];
  disabledDateRanges: {start: Date, end: Date}[] = []; // Nouveau pour bloquer des plages de dates
  
  availability: RoomAvailability | null = null;
  checkingAvailability = false;
  dateRangeInvalid = false;
  
  // État d'affichage
  showPaymentSection: boolean = false; // Nouveau pour basculer l'affichage du formulaire de paiement
  selectedPaymentMethod: PaymentMethod | null = null; // Nouveau pour stocker la méthode de paiement
  
  // Options pour le formulaire
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
    
    // Charger les dates indisponibles
    this.loadUnavailableDates();
    
    // Check availability if room and dates are set
    if (this.room && this.startDate && this.endDate) {
      this.checkAvailability();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room'] && !changes['room'].firstChange) {
      // Room changed, check availability and reload unavailable dates
      this.loadUnavailableDates();
      
      if (this.room && this.startDate && this.endDate) {
        this.checkAvailability();
      }
    }
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      // Informations client
      title: ['mr', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]{6,20}$/)]],
      
      // Informations de réservation
      guestCount: [this.initialGuestCount, [Validators.required, Validators.min(1)]],
      specialRequests: [''],
      
      // Conditions
      termsAccepted: [false, [Validators.requiredTrue]]
    });
    
    // Formulaire de paiement (facultatif)
    this.paymentForm = this.fb.group({
      paymentMethod: ['card', Validators.required],
      
      // Champs pour carte bancaire
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      
      // Adresse de facturation
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        zipCode: [''],
        country: ['']
      })
    });
    
    // Activer/désactiver les validateurs en fonction de la méthode de paiement
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe((method: PaymentMethod) => {
      this.selectedPaymentMethod = method;
      
      const cardFields = ['cardholderName', 'cardNumber', 'expiryDate', 'cvv'];
      
      if (method === 'card') {
        // Ajouter les validateurs pour les champs de carte
        cardFields.forEach(field => {
          this.paymentForm.get(field)?.setValidators([Validators.required]);
          this.paymentForm.get(field)?.updateValueAndValidity();
        });
      } else {
        // Supprimer les validateurs
        cardFields.forEach(field => {
          this.paymentForm.get(field)?.clearValidators();
          this.paymentForm.get(field)?.updateValueAndValidity();
        });
      }
    });
  }
  
  // Charger les dates indisponibles pour la chambre
  loadUnavailableDates(): void {
    if (!this.room) return;
    
    this.roomService.getUnavailableDates(this.room.id!).subscribe({
      next: (data) => {
        this.disabledDates = data.dates || [];
        this.disabledDateRanges = data.ranges || [];
      },
      error: (err) => {
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
    if (this.reservationForm.invalid || !this.startDate || !this.endDate || !this.room) {
      this.dateRangeInvalid = !this.startDate || !this.endDate;
      
      // Marquer tous les champs comme touchés pour montrer les erreurs
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
      // Informations client
      guestInfo: {
        title: formValue.title,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone
      }
    };
    
    // Ajouter les informations de paiement si nécessaire
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
  
  // Marquer tous les champs d'un formulaire comme touchés pour afficher les erreurs
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Basculer entre la vue de réservation et la vue de paiement
  togglePaymentSection(): void {
    this.showPaymentSection = !this.showPaymentSection;
  }

  // Helper methods
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