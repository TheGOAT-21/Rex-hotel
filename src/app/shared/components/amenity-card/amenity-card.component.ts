import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faWifi, faCar, faCoffee, faSwimmingPool, faUtensils, faSnowflake, 
  faTv, faDungeon, faUsers, faHandshake, faChild, faUmbrellaBeach, 
  faGlassMartini, faLock, faBath, faConciergeBell 
} from '@fortawesome/free-solid-svg-icons';
import { Amenity } from '../../../core/models';
import { AmenityBadgeComponent } from '../amenity-badge/amenity-badge.component';

@Component({
  selector: 'app-amenity-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, AmenityBadgeComponent],
  templateUrl: './amenity-card.component.html',
  styleUrl: './amenity-card.component.css'
})
export class AmenityCardComponent {
  @Input() amenity!: Amenity;
  @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
  @Input() showDescription: boolean = false;
  
  // Font Awesome icons
  faWifi = faWifi;
  faCar = faCar;
  faCoffee = faCoffee;
  faSwimmingPool = faSwimmingPool;
  faUtensils = faUtensils;
  faSnowflake = faSnowflake;
  faTv = faTv;
  faDungeon = faDungeon;
  faUsers = faUsers;
  faHandshake = faHandshake;
  faChild = faChild;
  faUmbrellaBeach = faUmbrellaBeach;
  faGlassMartini = faGlassMartini;
  faLock = faLock;
  faBath = faBath;
  faConciergebell = faConciergeBell;
  
  // Font Awesome icons mapping for common amenities
  private iconMap: {[key: string]: any} = {
    'wifi': this.faWifi,
    'parking': this.faCar,
    'breakfast': this.faCoffee,
    'pool': this.faSwimmingPool,
    'restaurant': this.faUtensils,
    'ac': this.faSnowflake,
    'tv': this.faTv,
    'balcony': this.faDungeon,
    'conference': this.faUsers,
    'meeting': this.faHandshake,
    'child': this.faChild,
    'terrace': this.faUmbrellaBeach,
    'minibar': this.faGlassMartini,
    'safe': this.faLock,
    'bathtub': this.faBath
  };
  
  getIcon(): any {
    if (this.amenity && this.amenity.icon && this.iconMap[this.amenity.icon.toLowerCase()]) {
      return this.iconMap[this.amenity.icon.toLowerCase()];
    }
    
    // Default icon if not found
    return this.faConciergebell;
  }
}