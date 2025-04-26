// src/app/features/espace/espace-filter/espace-filter.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from '../../../shared/components';
import { SpaceFilter, SpaceType, Amenity } from '../../../core/models';
import { EspaceService } from '../../../core/services/espace.service';

@Component({
  selector: 'app-espace-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterComponent
  ],
  templateUrl: './espace-filter.component.html',
  styleUrl: './espace-filter.component.css'
})
export class EspaceFilterComponent implements OnInit {
  @Input() initialFilter: SpaceFilter = {};
  @Output() filterChanged = new EventEmitter<SpaceFilter>();
  
  currentFilter: SpaceFilter = {};
  
  spaceTypes: {id: SpaceType, name: string}[] = [];
  amenities: Amenity[] = [];
  
  isLoading = true;
  
  constructor(private espaceService: EspaceService) {}
  
  ngOnInit(): void {
    this.currentFilter = { ...this.initialFilter };
    
    // Charger les types d'espaces et aménités
    this.loadFilterOptions();
  }
  
  loadFilterOptions(): void {
    this.isLoading = true;
    
    // Charger les types d'espaces
    this.espaceService.getSpaceTypes().subscribe({
      next: (types) => {
        this.spaceTypes = types.map(t => ({
          id: t.id as SpaceType,
          name: t.name
        }));
        
        this.loadAmenities();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d\'espaces:', err);
        this.isLoading = false;
      }
    });
  }
  
  loadAmenities(): void {
    this.espaceService.getAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des aménités:', err);
        this.isLoading = false;
      }
    });
  }
  
  onFilterChange(filter: SpaceFilter): void {
    this.currentFilter = filter;
    this.filterChanged.emit(filter);
  }
}