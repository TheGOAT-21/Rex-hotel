import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-amenity-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amenity-badge.component.html',
  styleUrl: './amenity-badge.component.css'
})
export class AmenityBadgeComponent {
  @Input() amenity!: Amenity;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  // Font Awesome icons mapping for common amenities
  private iconMap: {[key: string]: string} = {
    'wifi': 'fa-wifi',
    'parking': 'fa-car',
    'breakfast': 'fa-coffee',
    'pool': 'fa-swimming-pool',
    'spa': 'fa-spa',
    'restaurant': 'fa-utensils',
    'tv': 'fa-tv',
    'ac': 'fa-snowflake',
    'gym': 'fa-dumbbell',
    'view': 'fa-mountain',
    'balcony': 'fa-dungeon',
    'conference': 'fa-users',
    'meeting': 'fa-handshake',
    'child': 'fa-child',
    'terrace': 'fa-umbrella-beach',
    'minibar': 'fa-glass-martini',
    'safe': 'fa-lock',
    'bathtub': 'fa-bath'
  };
  
  getIconClass(): string {
    // Check if the amenity icon is in our icon map
    if (this.amenity && this.amenity.icon && this.iconMap[this.amenity.icon.toLowerCase()]) {
      return this.iconMap[this.amenity.icon.toLowerCase()];
    }
    
    // Default icon if not found
    return 'fa-concierge-bell';
  }
}