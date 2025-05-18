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
  DatepickerComponent,
  TestimonialCardComponent
} from '../../../shared/components';
import { AuthService } from '../../../core/services/auth.service';
import { RoomService } from '../../../core/services/room.service';
import { Room, Amenity, Testimonial } from '../../../core/models';
import { ROOMS, AMENITIES, TESTIMONIALS } from '../../../core/mock/mock-data';
import { QuickBookingComponent } from "../../../shared/components/quick-booking/quick-booking.component";

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
    DatepickerComponent,
    QuickBookingComponent,
    TestimonialCardComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  isLoading = true;
  isLoggedIn = false;
  featuredRooms: Room[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedGuests = 1;
  testimonials: Testimonial[] = [];

  
  // Featured amenities using mock data
  hotelAmenities: Amenity[] = AMENITIES.slice(0, 6);
  
  // Hero gallery images
  heroImages = [
    'assets/images/Exterieur/hotel-exterior.png',
    'assets/images/Exterieur/hotel-exterior (1).png',
    'assets/images/Exterieur/hotel-exterior (2).png',
    'assets/images/Exterieur/hotel-exterior (3).png',
  ];

  constructor(
    private authService: AuthService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Load featured rooms
    this.loadFeaturedRooms();

        // Load testimonials - utilise les 3 premiers témoignages
        this.testimonials = TESTIMONIALS.slice(0, 3);
    
    // Initialize dates for the datepicker
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.startDate = tomorrow;
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    this.endDate = dayAfterTomorrow;
  }
  
  loadFeaturedRooms(): void {
    this.isLoading = true;
    
    this.roomService.getFeaturedRooms().subscribe({
      next: (rooms) => {
        this.featuredRooms = rooms;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading featured rooms:', err);
        this.isLoading = false;
        
        // Use mock data in case of error
        this.featuredRooms = ROOMS.filter(room => room.isFeatured);
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