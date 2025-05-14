import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  GalleryComponent,
  RoomCardComponent,
  LoadingComponent,
  RatingComponent,
  AmenityBadgeComponent,
  DatepickerComponent 
} from '../../../shared/components';
import { AuthService } from '../../../core/services/auth.service';
import { SpaceService } from '../../../core/services/space.service';
import { Space, Amenity, SpaceType, ViewType } from '../../../core/models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    GalleryComponent,
    RoomCardComponent,
    LoadingComponent,
    RatingComponent,
    AmenityBadgeComponent,
    DatepickerComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  isLoading = true;
  isLoggedIn = false;
  featuredSpaces: Space[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedGuests = 1;
  
  // Testimonials data
  testimonials = [
    {
      name: 'Sophie Martin',
      rating: 4.8,
      comment: 'Un séjour inoubliable avec un service exceptionnel. La vue sur le lac depuis notre chambre était magnifique.',
      date: new Date('2025-03-15')
    },
    {
      name: 'Jean Dupont',
      rating: 5,
      comment: 'Espace incroyable, personnel attentif et cuisine délicieuse. Parfait pour notre événement d\'entreprise.',
      date: new Date('2025-03-02')
    },
    {
      name: 'Marie Laurent',
      rating: 4.7,
      comment: 'Le Rex Hotel a dépassé nos attentes. Les espaces sont élégants et le confort est au rendez-vous.',
      date: new Date('2025-02-18')
    }
  ];
  
  // Featured amenities
  hotelAmenities: Amenity[] = [
    { id: 'wifi', name: 'WiFi Gratuit', icon: 'wifi' },
    { id: 'parking', name: 'Parking 82 places', icon: 'parking' },
    { id: 'pool', name: 'Piscine', icon: 'pool' },
    { id: 'restaurant', name: '3 Restaurants', icon: 'restaurant' },
    { id: 'spa', name: 'Spa & Bien-être', icon: 'spa' },
    { id: 'gym', name: 'Salle de sport', icon: 'gym' }
  ];
  
  // Hero gallery images
  heroImages = [
    'assets/images/hotel/exterior.jpg',
    'assets/images/hotel/lobby.jpg',
    'assets/images/hotel/pool.jpg',
    'assets/images/hotel/restaurant.jpg',
    'assets/images/hotel/suite.jpg'
  ];

  constructor(
    private authService: AuthService,
    private spaceService: SpaceService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Load featured spaces
    this.loadFeaturedSpaces();
    
    // Initialize dates for the datepicker
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.startDate = tomorrow;
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    this.endDate = dayAfterTomorrow;
  }
  
  loadFeaturedSpaces(): void {
    this.isLoading = true;
    
    this.spaceService.getFeaturedSpaces().subscribe({
      next: (spaces) => {
        this.featuredSpaces = spaces;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading featured spaces:', err);
        this.isLoading = false;
        
        // Demo data in case of error
        this.featuredSpaces = [
          {
            id: '1',
            name: 'Chambre King-Size Supérieure',
            type: SpaceType.CHAMBRE_KING_SUPERIEURE,
            description: 'Une chambre spacieuse avec un très grand lit king-size, parfaite pour un séjour confortable avec une vue imprenable sur la ville.',
            shortDescription: 'Chambre élégante avec lit king-size et vue sur la ville',
            price: 75000,
            capacity: 2,
            surface: 31,
            images: ['assets/images/rooms/chambre.jpeg', 'assets/images/rooms/chambre.jpeg'],
            mainImage: 'assets/images/rooms/chambre.jpeg',
            view: [ViewType.VILLE],
            amenities: this.hotelAmenities.slice(0, 4),
            isActive: true
          },
          {
            id: '2',
            name: 'Suite de Luxe Vue Lac',
            type: SpaceType.SUITE_LUXE,
            description: 'Notre suite de luxe offre une expérience exceptionnelle avec un salon séparé, une chambre somptueuse et une vue panoramique sur le lac.',
            shortDescription: 'Suite de luxe avec vue panoramique sur le lac',
            price: 150000,
            capacity: 2,
            surface: 50,
            images: ['assets/images/rooms/chambre.jpeg', 'assets/images/rooms/chambre.jpeg'],
            mainImage: 'assets/images/rooms/chambre.jpeg',
            view: [ViewType.LAC],
            amenities: this.hotelAmenities,
            isActive: true
          },
          {
            id: '3',
            name: 'Salle de Conférence Executive',
            type: SpaceType.SALLE_CONFERENCE,
            description: 'Espace professionnel idéal pour vos événements d\'affaires, équipé des dernières technologies et pouvant accueillir jusqu\'à 200 personnes.',
            shortDescription: 'Salle de conférence moderne pour événements professionnels',
            price: 300000,
            capacity: 200,
            surface: 250,
            images: ['assets/images/rooms/conference.jpeg', 'assets/images/rooms/conference.jpeg'],
            mainImage: 'assets/images/rooms/conference.jpeg',
            amenities: this.hotelAmenities.slice(0, 3),
            isActive: true
          }
        ];
      }
    });
  }
  
  onDateRangeSelected(range: {start: Date, end: Date | null}): void {
    this.startDate = range.start;
    this.endDate = range.end;
  }
  
  updateGuestCount(count: number): void {
    this.selectedGuests = count;
  }
  
  navigateToSearch(): void {
    // In a real implementation, this would navigate to the search page with the selected parameters
    console.log('Search with:', {
      startDate: this.startDate,
      endDate: this.endDate,
      guests: this.selectedGuests
    });
  }
}