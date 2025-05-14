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
import { SpaceService } from '../../../core/services/space.service';
import { Space, SpaceAvailability, SpaceType } from '../../../core/models';

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
export class DetailPageComponent implements OnInit {
  space: Space | null = null;
  isLoading = true;
  error: string | null = null;

  // For reservation
  startDate: Date | null = null;
  endDate: Date | null = null;
  guestCount = 1;

  // Availability
  availability: SpaceAvailability | null = null;
  checkingAvailability = false;

  // Related spaces
  relatedSpaces: Space[] = [];

  averageRating: number = 4.5; // Example average rating
  reviewCount: number = 12; // Example number of reviews

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spaceService: SpaceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadSpaceDetails(id);
      } else {
        this.error = "Space ID not found.";
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

  loadSpaceDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.spaceService.getSpaceById(id).subscribe({
      next: (space) => {
        this.space = space;
        this.isLoading = false;
        this.checkAvailability();
        this.loadRelatedSpaces(space.type);
      },
      error: (err) => {
        this.error = "An error occurred while loading space details.";
        this.isLoading = false;
        console.error('Error loading space details:', err);
      }
    });
  }

  loadRelatedSpaces(type: SpaceType): void {
    this.spaceService.getSpacesByType(type).subscribe({
      next: (spaces) => {
        // Filter out current space and limit to 3 related spaces
        this.relatedSpaces = spaces
          .filter(space => space.id !== this.space?.id)
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading related spaces:', err);
      }
    });
  }

  checkAvailability(): void {
    if (!this.space || !this.startDate || !this.endDate) return;

    this.checkingAvailability = true;

    this.spaceService.checkAvailability(this.space.id!, this.startDate, this.endDate).subscribe({
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
    if (!this.space || !this.startDate || !this.endDate) return;

    this.router.navigate(['/reservation/create', this.space.id], {
      queryParams: {
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString(),
        guests: this.guestCount
      }
    });
  }

  // Display methods
  getSpaceTypeLabel(type: string): string {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
    if (!this.space) return 0;
    return this.space.price * this.getNights();
  }
}