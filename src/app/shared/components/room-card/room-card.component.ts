import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PriceDisplayComponent, AmenityBadgeComponent } from '../';
import { Room } from '../../../core/models';

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
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent implements OnInit {
  @Input() room!: Room;
  @Input() showDetails: boolean = false;
  @Input() isFeatured: boolean = false;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  
  displayedAmenities: number = 3;
  
  constructor() { }

  ngOnInit(): void {
    // Validation des inputs
    if (!this.room) {
      console.error('Room object is required for RoomCardComponent');
    }
  }
  
  /**
   * Retourne le nombre d'équipements supplémentaires non affichés
   */
  getMoreAmenitiesCount(): number {
    if (!this.room.amenities) return 0;
    return Math.max(0, this.room.amenities.length - this.displayedAmenities);
  }
  
  /**
   * Convertit les types de chambre en libellés lisibles
   */
  getRoomTypeLabel(type: string): string {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}