import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { AmenityBadgeComponent } from '../amenity-badge/amenity-badge.component';
import { Room } from '../../../core/models/room.model';
import { 
  faBed, 
  faBath, 
  faUsers, 
  faDoorOpen, 
  faWifi, 
  faTv, 
  faSnowflake, 
  faUtensils 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PriceDisplayComponent,
    AmenityBadgeComponent
  ],
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.css']
})
export class RoomCardComponent implements OnInit {
  @Input() room!: Room;
  @Input() showDetails: boolean = true;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  
  displayedAmenities: number = 3;
  
  faBed = faBed;
  faBath = faBath;
  faUsers = faUsers;
  faBalcony = faDoorOpen;
  faWifi = faWifi;
  faTv = faTv;
  faSnowflake = faSnowflake;
  faUtensils = faUtensils;
  
  constructor() { }

  ngOnInit(): void {
    if (!this.room) {
      console.error('Room object is required for RoomCardComponent');
    }
  }
  
  /**
   * Returns the count of additional amenities not displayed
   */
  getMoreAmenitiesCount(): number {
    if (!this.room.amenities) return 0;
    return Math.max(0, this.room.amenities.length - this.displayedAmenities);
  }
  
  /**
   * Converts room type codes to readable labels
   */
  getRoomTypeLabel(type: string): string {
    if (!type) return '';
    
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}