import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../../core/models'; // Importation corrigée depuis le barrel file
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { AmenityBadgeComponent } from '../amenity-badge/amenity-badge.component';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule, PriceDisplayComponent, AmenityBadgeComponent],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  @Input() room!: Room; // Changé de space à room
  @Input() isFeatured: boolean = false;
  @Input() showDetails: boolean = true;
  @Input() maxAmenities: number = 3;
  
  // For accessibility and SEO
  getRoomTypeLabel(type: string): string { // Changé de getSpaceTypeLabel à getRoomTypeLabel
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
    if (!this.room?.amenities) return [];
    return this.room.amenities.slice(0, this.maxAmenities);
  }
  
  // Check if there are more amenities than shown
  hasMoreAmenities() {
    return this.room?.amenities && this.room.amenities.length > this.maxAmenities;
  }
  
  // Get count of additional amenities
  getAdditionalAmenitiesCount() {
    return this.room?.amenities ? this.room.amenities.length - this.maxAmenities : 0;
  }
}