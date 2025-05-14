import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Space } from '../../../core/models/space';
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { AmenityBadgeComponent } from '../amenity-badge/amenity-badge.component';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule, PriceDisplayComponent, AmenityBadgeComponent],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class SpaceCardComponent {
  @Input() space!: Space;
  @Input() isFeatured: boolean = false;
  @Input() showDetails: boolean = true;
  @Input() maxAmenities: number = 3;
  
  // For accessibility and SEO
  getSpaceTypeLabel(type: string): string {
    // Transform snake_case or kebab-case to readable text
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Get limited amenities to show
  getVisibleAmenities() {
    if (!this.space?.amenities) return [];
    return this.space.amenities.slice(0, this.maxAmenities);
  }
  
  // Check if there are more amenities than shown
  hasMoreAmenities() {
    return this.space?.amenities && this.space.amenities.length > this.maxAmenities;
  }
  
  // Get count of additional amenities
  getAdditionalAmenitiesCount() {
    return this.space?.amenities ? this.space.amenities.length - this.maxAmenities : 0;
  }
}