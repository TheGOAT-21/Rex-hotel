import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Services
import { RoomService } from '../../../core/services/room.service';
import { ReservationService } from '../../../core/services/reservation.service';

// Composants partagés
import { 
  LoadingComponent, 
  BreadcrumbsComponent,
  DatepickerComponent,
  PriceDisplayComponent
} from '../../../shared/components';

// Composants de réservation
import { 
  GuestInfoFormComponent,
  SelectedRoomSummaryComponent
} from '../components';

// Modèles
import { 
  Room, 
  RoomAvailability, 
  ReservationRequest,
  GuestInfo,
  Payment
} from '../../../core/models';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingComponent,
    BreadcrumbsComponent,
    DatepickerComponent,
    GuestInfoFormComponent,
    SelectedRoomSummaryComponent
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {
  // États du composant
  currentStep: 'dates' | 'guest-info' | 'payment' | 'confirmation' = 'dates';
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  error: string | null = null;
  success: boolean = false;
  
  // Données de réservation
  room: Room | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  guestCount: number = 1;
  availability: RoomAvailability | null = null;
  minDate: Date = new Date(); // Date minimale (aujourd'hui)
  
  // Formulaires
  reservationForm: FormGroup;
  guestInfoForm: FormGroup;
  paymentForm: FormGroup;
  
  // Calculs de prix
  numberOfNights: number = 1;
  totalPrice: number = 0;
  taxAmount: number = 0;
  
  // Options de paiement
  paymentMethods: {value: string, label: string}[] = [
    {value: 'card', label: 'Carte bancaire'},
    {value: 'paypal', label: 'PayPal'},
    {value: 'bank_transfer', label: 'Virement bancaire'},
    {value: 'on_arrival', label: 'Paiement à l\'arrivée'}
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {
    // Initialisation des formulaires
    this.reservationForm = this.fb.group({
      dates: this.fb.group({
        startDate: [null, Validators.required],
        endDate: [null, Validators.required]
      }),
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
      termsAccepted: [false, Validators.requiredTrue]
    });
    
    this.guestInfoForm = this.fb.group({
      title: ['mr', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]{6,20}$/)]],
      address: this.fb.group({
        street: [''],
        city: [''],
        zipCode: [''],
        country: ['Côte d\'Ivoire']
      })
    });
    
    this.paymentForm = this.fb.group({
      paymentMethod: ['on_arrival', Validators.required],
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

  ngOnInit(): void {
    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      const roomId = params['roomId'];
      
      if (params['startDate']) {
        this.startDate = new Date(params['startDate']);
      }
      
      if (params['endDate']) {
        this.endDate = new Date(params['endDate']);
      }
      
      if (params['guests']) {
        this.guestCount = parseInt(params['guests'], 10);
        this.reservationForm.get('numberOfGuests')?.setValue(this.guestCount);
      }
      
      if (roomId) {
        this.loadRoomDetails(roomId);
      } else {
        this.isLoading = false;
        this.error = "Veuillez sélectionner une chambre à réserver";
      }
    });
    
    // Mise à jour des dates dans le formulaire
    if (this.startDate && this.endDate) {
      this.reservationForm.get('dates')?.patchValue({
        startDate: this.startDate,
        endDate: this.endDate
      });
      this.calculateNumberOfNights();
    }
    
    // Détecter les changements dans la méthode de paiement
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      this.updatePaymentValidators(method);
    });
  }
  
  /**
   * Charge les détails de la chambre
   */
  loadRoomDetails(roomId: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room = room;
        
        // Si pas de dates, définir des dates par défaut
        if (!this.startDate || !this.endDate) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          this.startDate = tomorrow;
          
          const dayAfter = new Date(tomorrow);
          dayAfter.setDate(dayAfter.getDate() + 1);
          this.endDate = dayAfter;
          
          this.reservationForm.get('dates')?.patchValue({
            startDate: this.startDate,
            endDate: this.endDate
          });
        }
        
        // Vérifier la disponibilité
        this.checkAvailability();
        this.calculatePrices();
      },
      error: (err) => {
        console.error('Error loading room details:', err);
        this.isLoading = false;
        this.error = "Impossible de charger les détails de la chambre.";
      }
    });
  }
  
  /**
   * Vérifie la disponibilité de la chambre pour les dates sélectionnées
   */
  checkAvailability(): void {
    if (!this.room || !this.startDate || !this.endDate) {
      this.isLoading = false;
      return;
    }
    
    this.roomService.checkAvailability(
      this.room.id!, 
      this.startDate, 
      this.endDate
    ).subscribe({
      next: (availability) => {
        this.availability = availability;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error checking availability:', err);
        this.isLoading = false;
        this.error = "Impossible de vérifier la disponibilité de la chambre.";
      }
    });
  }
  
  /**
   * Gère la sélection d'une plage de dates
   */
  onDateRangeSelected(range: {start: Date, end: Date | null}): void {
    this.startDate = range.start;
    this.endDate = range.end;
    
    if (this.startDate && this.endDate) {
      this.reservationForm.get('dates')?.patchValue({
        startDate: this.startDate,
        endDate: this.endDate
      });
      
      this.calculateNumberOfNights();
      this.calculatePrices();
      this.checkAvailability();
    }
  }
  
  /**
   * Calcule le nombre de nuits
   */
  calculateNumberOfNights(): void {
    if (this.startDate && this.endDate) {
      const timeDiff = this.endDate.getTime() - this.startDate.getTime();
      this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      this.numberOfNights = 1;
    }
  }
  
  /**
   * Calcule les différents prix
   */
  calculatePrices(): void {
    if (!this.room) return;
    
    const basePrice = this.room.discountedPrice || this.room.price;
    this.totalPrice = basePrice * this.numberOfNights;
    this.taxAmount = this.totalPrice * 0.18; // 18% de taxes
  }
  
  /**
   * Formate un prix
   */
  formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  /**
   * Met à jour les validateurs du formulaire de paiement en fonction de la méthode sélectionnée
   */
  updatePaymentValidators(method: string): void {
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
  }
  
  /**
   * Passe à l'étape suivante du processus de réservation
   */
  goToNextStep(): void {
    switch (this.currentStep) {
      case 'dates':
        if (this.reservationForm.get('dates')?.valid && 
            this.availability?.isAvailable) {
          this.currentStep = 'guest-info';
        } else {
          this.markFormGroupTouched(this.reservationForm.get('dates') as FormGroup);
        }
        break;
        
      case 'guest-info':
        if (this.guestInfoForm.valid) {
          this.currentStep = 'payment';
        } else {
          this.markFormGroupTouched(this.guestInfoForm);
        }
        break;
        
      case 'payment':
        this.submitReservation();
        break;
    }
  }
  
  /**
   * Retourne à l'étape précédente
   */
  goToPrevStep(): void {
    switch (this.currentStep) {
      case 'guest-info':
        this.currentStep = 'dates';
        break;
        
      case 'payment':
        this.currentStep = 'guest-info';
        break;
    }
  }
  
  /**
   * Gère la soumission d'informations client depuis le composant enfant
   */
  onGuestInfoSubmit(guestInfo: GuestInfo): void {
    this.guestInfoForm.patchValue(guestInfo);
    this.goToNextStep();
  }
  
  /**
   * Soumet le formulaire de réservation
   */
  submitReservation(): void {
    if (!this.room || !this.startDate || !this.endDate) {
      this.error = "Informations de réservation incomplètes";
      return;
    }
    
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    
    // Préparer les données de paiement si nécessaire
    let payment: Payment | undefined;
    
    if (this.paymentForm.get('paymentMethod')?.value === 'card') {
      payment = {
        method: 'card',
        cardDetails: {
          cardholderName: this.paymentForm.get('cardholderName')?.value,
          cardNumber: this.paymentForm.get('cardNumber')?.value,
          expiryDate: this.paymentForm.get('expiryDate')?.value,
          cvv: this.paymentForm.get('cvv')?.value
        }
      };
    } else {
      payment = {
        method: this.paymentForm.get('paymentMethod')?.value
      };
    }
    
    // Créer la demande de réservation
    const reservation: ReservationRequest = {
      roomId: this.room.id!,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: this.reservationForm.get('numberOfGuests')?.value,
      guestInfo: this.guestInfoForm.value,
      payment
    };
    
    // Envoyer la demande
    this.reservationService.createReservation(reservation).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.success = true;
        
        // Rediriger vers la page de confirmation
        setTimeout(() => {
          this.router.navigate(['/reservation/confirmation'], {
            queryParams: { id: result.id }
          });
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        this.isSubmitting = false;
        this.error = "Erreur lors de la création de la réservation. Veuillez réessayer.";
      }
    });
  }
  
  /**
   * Marque tous les champs d'un FormGroup comme touchés
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  /**
   * Vérifie si un contrôle est invalide
   */
  isInvalid(controlName: string, formGroup: FormGroup = this.reservationForm): boolean {
    const control = formGroup.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
  
  /**
   * Obtient le message d'erreur pour un contrôle
   */
  getErrorMessage(controlName: string, formGroup: FormGroup = this.reservationForm): string {
    const control = formGroup.get(controlName);
    
    if (control?.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['email']) {
        return 'Veuillez entrer un email valide';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['min']) {
        return `La valeur minimale est ${control.errors['min'].min}`;
      }
    }
    
    return '';
  }
}