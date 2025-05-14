import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  GalleryComponent,
  PriceDisplayComponent,
  AmenityBadgeComponent,
  BreadcrumbsComponent,
  DatepickerComponent,
  LoadingComponent,
  RatingComponent
} from '../../../shared/components';
import { RoomService } from '../../../core/services/room.service';
import { Room, RoomAvailability, RoomType } from '../../../core/models';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GalleryComponent,
    PriceDisplayComponent,
    AmenityBadgeComponent,
    BreadcrumbsComponent,
    DatepickerComponent,
    LoadingComponent,
    RatingComponent
  ],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css'
})
export class RoomDetailComponent implements OnInit {
  room: Room | null = null;
  isLoading = true;
  error: string | null = null;

  // For reservation
  startDate: Date | null = null;
  endDate: Date | null = null;
  guestCount = 1;

  // Availability
  availability: RoomAvailability | null = null;
  checkingAvailability = false;

  // Related rooms
  relatedRooms: Room[] = [];

  averageRating: number = 4.5; // Example average rating
  reviewCount: number = 12; // Example number of reviews

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRoomDetails(id);
      } else {
        this.error = "Room ID not found.";
        this.isLoading = false;
      }
    });

    // Initialize dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.startDate = tomorrow;

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    this.endDate = dayAfter;
  }

  loadRoomDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.roomService.getRoomById(id).subscribe({
      next: (room) => {
        this.room = room;
        this.isLoading = false;
        this.checkAvailability();
        this.loadRelatedRooms(room.type);
      },
      error: (err) => {
        this.error = "An error occurred while loading room details.";
        this.isLoading = false;
        console.error('Error loading room details:', err);
      }
    });
  }

  loadRelatedRooms(type: string): void {
    this.roomService.getSimilarRooms(this.room?.id || '', 3).subscribe({
      next: (rooms) => {
        this.relatedRooms = rooms;
      },
      error: (err) => {
        console.error('Error loading related rooms:', err);
      }
    });
  }

  checkAvailability(): void {
    if (!this.room || !this.startDate || !this.endDate) return;

    this.checkingAvailability = true;

    this.roomService.checkAvailability(this.room.id!, this.startDate, this.endDate).subscribe({
      next: (availability) => {
        this.availability = availability;
        this.checkingAvailability = false;
      },
      error: (err) => {
        console.error('Error checking availability:', err);
        this.checkingAvailability = false;
        this.availability = null;
      }
    });
  }

  onDateRangeSelected(range: { start: Date, end: Date | null }): void {
    this.startDate = range.start;
    this.endDate = range.end;
    if (this.startDate && this.endDate) {
      this.checkAvailability();
    }
  }

  updateGuestCount(event: Event): void {
    this.guestCount = parseInt((event.target as HTMLSelectElement).value);
  }

  proceedToReservation(): void {
    if (!this.room || !this.startDate || !this.endDate) return;

    this.router.navigate(['/reservation/create', this.room.id], {
      queryParams: {
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString(),
        guests: this.guestCount
      }
    });
  }

  // Display methods
  getRoomTypeLabel(type: string): string {
    switch(type) {
      case 'standard':
        return 'Chambre Standard';
      case 'deluxe':
        return 'Chambre Deluxe';
      case 'suite':
        return 'Suite';
      case 'presidential':
        return 'Suite Présidentielle';
      default:
        return type
          .replace(/_/g, ' ')
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }

  formatDateRange(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return `${start.toLocaleDateString('fr-FR', options)} - ${end.toLocaleDateString('fr-FR', options)}`;
  }

  getNights(): number {
    if (!this.startDate || !this.endDate) return 1;

    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  calculateTotalPrice(): number {
    if (!this.room) return 0;
    return this.room.price * this.getNights();
  }
}