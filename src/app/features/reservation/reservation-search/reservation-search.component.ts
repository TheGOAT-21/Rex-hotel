import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  BreadcrumbsComponent, 
  AmenityCardComponent,
  FilterComponent,
  LoadingComponent
} from '../../../shared/components';
import { RoomService } from '../../../core/services/room.service';
import { RoomFilter, RoomType, Amenity } from '../../../core/models';

@Component({
  selector: 'app-reservation-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    AmenityCardComponent,
    FilterComponent,
    LoadingComponent
  ],
  templateUrl: './reservation-search.component.html',
  styleUrl: './reservation-search.component.css'
})
export class ReservationSearchComponent implements OnInit {
  isLoading: boolean = false;
  currentFilter: RoomFilter = {};
  
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

  constructor(
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    // Initialiser le filtre si nécessaire
    this.initializeFilter();
  }
  
  initializeFilter(): void {
    // Définir les valeurs par défaut du filtre si nécessaire
    this.currentFilter = {
      search: '',
      priceMin: undefined,
      priceMax: undefined,
      capacityMin: undefined,
      types: [],
      amenities: [],
      views: [],
      bedTypes: [],
      hasBalcony: undefined,
      floor: undefined
    };
  }
  
  onFilterChange(filter: RoomFilter): void {
    this.currentFilter = filter;
    this.searchRooms();
  }
  
  searchRooms(): void {
    this.isLoading = true;
    
    // Préparer les paramètres de recherche pour la navigation
    const queryParams: any = {};
    
    // Ajouter les dates si disponibles
    if (this.currentFilter.startDate && this.currentFilter.endDate) {
      queryParams.startDate = this.currentFilter.startDate.toISOString();
      queryParams.endDate = this.currentFilter.endDate.toISOString();
    }
    
    // Ajouter le nombre de personnes
    if (this.currentFilter.capacityMin) {
      queryParams.guests = this.currentFilter.capacityMin;
    }
    
    // Ajouter le type de chambre
    if (this.currentFilter.types && this.currentFilter.types.length > 0) {
      queryParams.type = this.currentFilter.types[0];
    }
    
    // Ajouter le prix maximum
    if (this.currentFilter.priceMax) {
      queryParams.maxPrice = this.currentFilter.priceMax;
    }
    
    // Ajouter le balcon
    if (this.currentFilter.hasBalcony !== undefined) {
      queryParams.balcony = this.currentFilter.hasBalcony;
    }
    
    // Ajouter les équipements
    if (this.currentFilter.amenities && this.currentFilter.amenities.length > 0) {
      queryParams.amenities = this.currentFilter.amenities.join(',');
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
}