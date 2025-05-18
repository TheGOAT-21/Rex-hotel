import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Amenity } from '../../../core/models';
import { AmenityBadgeComponent } from '../amenity-badge/amenity-badge.component';

@Component({
  selector: 'app-amenity-card',
  standalone: true,
  imports: [CommonModule, AmenityBadgeComponent],
  templateUrl: './amenity-card.component.html',
  styleUrl: './amenity-card.component.css'
})
export class AmenityCardComponent {
  @Input() amenity!: Amenity;
  @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
  @Input() showDescription: boolean = false;
}