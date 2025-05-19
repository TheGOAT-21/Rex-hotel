import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  BreadcrumbsComponent, 
  AmenityCardComponent,
  FilterComponent,
  LoadingComponent,
  RoomCardComponent
} from '../../../shared/components';
import { RoomService } from '../../../core/services/room.service';
import { RoomFilter, Room } from '../../../core/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, faUser, faBed, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-reservation-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    AmenityCardComponent,
    FilterComponent,
    LoadingComponent,
    RoomCardComponent,
    FontAwesomeModule,
    PaginationComponent
],
  templateUrl: './reservation-search.component.html',
  styleUrl: './reservation-search.component.css'
})
export class ReservationSearchComponent implements OnInit {
  isLoading: boolean = false;
  currentFilter: RoomFilter = {};
  filteredRooms: Room[] = [];
  hasSearched: boolean = false;
  totalRooms: number = 0;
  
  // Font Awesome icons
  faSearch = faSearch;
  faUser = faUser;
  faBed = faBed;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  
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
      floor: undefined,
      page: 1,
      limit: 6
    };
  }
  
  onFilterChange(filter: RoomFilter): void {
    this.currentFilter = {
      ...filter,
      page: 1, // Réinitialiser à la première page lors d'un changement de filtre
      limit: 6
    };
    this.searchRooms();
  }
  
  searchRooms(): void {
    this.isLoading = true;
    this.hasSearched = true;
    
    this.roomService.getAllRooms(this.currentFilter).subscribe({
      next: (response) => {
        this.filteredRooms = response.items;
        this.totalRooms = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des chambres:', error);
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(page: number): void {
    this.currentFilter.page = page;
    this.searchRooms();
    
    // Scroll vers les résultats
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}