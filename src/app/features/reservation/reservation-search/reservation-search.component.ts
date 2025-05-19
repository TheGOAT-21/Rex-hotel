import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { 
  BreadcrumbsComponent, 
  DatepickerComponent,
  PriceDisplayComponent,
  AmenityBadgeComponent,
  LoadingComponent
} from '../../../shared/components';
import { RoomService } from '../../../core/services/room.service';
import { RoomType, Amenity } from '../../../core/models';

@Component({
  selector: 'app-reservation-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbsComponent,
    DatepickerComponent,
    PriceDisplayComponent,
    AmenityBadgeComponent,
    LoadingComponent
  ],
  templateUrl: './reservation-search.component.html',
  styleUrl: './reservation-search.component.css'
})
export class ReservationSearchComponent implements OnInit {
  searchForm!: FormGroup;
  showAdvancedSearch: boolean = false;
  isLoading: boolean = false;
  
  // Dates de séjour
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Options de filtrage
  roomTypes: { id: string; name: string }[] = [];
  amenities: Amenity[] = [];
  selectedAmenities: string[] = [];
  
  // Services mis en avant
  featuredServices = [
    { 
      name: 'WiFi gratuit', 
      description: 'Connexion haut débit dans tout l\'hôtel',
      icon: 'wifi'
    },
    { 
      name: 'Petit-déjeuner', 
      description: 'Buffet continental inclus',
      icon: 'breakfast'
    },
    { 
      name: 'Piscine', 
      description: 'Ouverte de 8h à 20h tous les jours',
      icon: 'pool'
    },
    { 
      name: 'Service en chambre', 
      description: 'Disponible 24h/24 et 7j/7',
      icon: 'restaurant'
    }
  ];
  
  // FAQ
  faqs = [
    {
      question: 'Quelle est l\'heure d\'arrivée et de départ ?',
      answer: 'L\'heure d\'arrivée (check-in) est à partir de 14h00 et l\'heure de départ (check-out) est au plus tard à 12h00. Un départ tardif peut être arrangé selon disponibilité avec des frais supplémentaires.',
      isOpen: false
    },
    {
      question: 'Le petit-déjeuner est-il inclus dans le prix de la chambre ?',
      answer: 'Le petit-déjeuner est inclus dans certaines offres de chambres. Veuillez vérifier les détails de l\'offre lors de votre réservation. Si non inclus, vous pouvez ajouter le petit-déjeuner pour 15 000 XOF par personne et par jour.',
      isOpen: false
    },
    {
      question: 'Y a-t-il un parking à l\'hôtel ?',
      answer: 'Oui, l\'hôtel dispose d\'un parking souterrain sécurisé disponible pour tous les clients. Le service est gratuit pour les clients de l\'hôtel.',
      isOpen: false
    },
    {
      question: 'Puis-je annuler ma réservation ?',
      answer: 'Les conditions d\'annulation dépendent du tarif réservé. En général, les réservations peuvent être annulées sans frais jusqu\'à 48 heures avant la date d\'arrivée. Veuillez consulter les conditions spécifiques lors de votre réservation.',
      isOpen: false
    },
    {
      question: 'L\'hôtel accepte-t-il les animaux de compagnie ?',
      answer: 'Non, nous ne sommes malheureusement pas en mesure d\'accueillir les animaux de compagnie, à l\'exception des chiens guides pour les personnes malvoyantes.',
      isOpen: false
    }
  ];

  dateRange: { start: Date | null, end: Date | null } = { start: new Date(), end: null };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoomTypes();
    this.loadAmenities();
    
    // Initialiser les dates par défaut (aujourd'hui et demain)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    this.startDate = tomorrow;
    this.endDate = dayAfter;
  }
  
  initForm(): void {
    this.searchForm = this.fb.group({
      guestCount: [2, [Validators.required, Validators.min(1)]],
      roomType: [''],
      maxPrice: [null],
      hasBalcony: [false],
      breakfastIncluded: [false]
    });
  }
  
  loadRoomTypes(): void {
    this.roomService.getRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types de chambre:', err);
      }
    });
  }
  
  loadAmenities(): void {
    this.roomService.getAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des équipements:', err);
      }
    });
  }
  
  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
  
  toggleAmenity(amenityId: string): void {
    const index = this.selectedAmenities.indexOf(amenityId);
    
    if (index === -1) {
      // Ajouter l'équipement
      this.selectedAmenities.push(amenityId);
    } else {
      // Retirer l'équipement
      this.selectedAmenities.splice(index, 1);
    }
  }
  
  isAmenitySelected(amenityId: string): boolean {
    return this.selectedAmenities.includes(amenityId);
  }
  
  onDateRangeSelected(range: { start: Date | null, end: Date | null }): void {
    if (range.start) {
      this.dateRange = range;
    }
  }
  
  searchRooms(): void {
    if (this.searchForm.invalid || !this.startDate || !this.endDate) {
      return;
    }
    
    this.isLoading = true;
    
    const formValue = this.searchForm.value;
    
    // Préparer les paramètres de recherche
    const queryParams: any = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      guests: formValue.guestCount
    };
    
    // Ajouter les paramètres optionnels s'ils sont sélectionnés
    if (formValue.roomType) {
      queryParams.type = formValue.roomType;
    }
    
    if (formValue.maxPrice) {
      queryParams.maxPrice = formValue.maxPrice;
    }
    
    if (formValue.hasBalcony) {
      queryParams.balcony = true;
    }
    
    if (formValue.breakfastIncluded) {
      queryParams.breakfast = true;
    }
    
    if (this.selectedAmenities.length > 0) {
      queryParams.amenities = this.selectedAmenities.join(',');
    }
    
    // Simuler un délai de recherche
    setTimeout(() => {
      this.isLoading = false;
      // Rediriger vers la page de résultats avec les paramètres
      this.router.navigate(['/rooms'], { queryParams });
    }, 1000);
  }
  
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
  
  getRoomTypeDescription(typeId: string): string {
    switch(typeId) {
      case 'standard':
        return 'Chambre confortable avec toutes les commodités essentielles pour un séjour agréable.';
      case 'deluxe':
        return 'Espace plus généreux avec balcon privé et équipements premium.';
      case 'suite':
        return 'Suite spacieuse avec salon séparé, idéale pour les longs séjours.';
      case 'presidential':
        return 'Notre offre la plus luxueuse, avec vues imprenables et services VIP.';
      default:
        return 'Découvrez le confort et l\'élégance de nos chambres.';
    }
  }
  
  getRoomTypePrice(typeId: string): number {
    const prices: { [key: string]: number } = {
      'standard': 120000,
      'deluxe': 150000,
      'suite': 180000,
      'presidential': 350000
    };
    
    return prices[typeId] || 100000;
  }
}