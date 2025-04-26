import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceFilter, SpaceType } from '../../../core/models';
import { SpaceService } from '../../../core/services/space.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Input() currentFilter: SpaceFilter = {};
  @Output() filterChange = new EventEmitter<SpaceFilter>();
  
  isFilterOpen: boolean = false;
  isAdvancedFilterOpen: boolean = false;
  
  // Filter model for two-way binding
  filterModel: SpaceFilter = {};
  
  // Options for filter dropdowns
  spaceTypes: { id: string; name: string }[] = [];
  amenities: { id: string; name: string; icon: string }[] = [];
  
  // Price range
  minPrice: number = 0;
  maxPrice: number = 1000;
  
  // Make window accessible in template
  get windowObj(): Window {
    return window;
  }
  
  constructor(private spaceService: SpaceService) {}
  
  ngOnInit(): void {
    // Clone the input filter to avoid direct reference
    this.filterModel = { ...this.currentFilter };
    
    // Initialize arrays if they don't exist
    if (!this.filterModel.types) this.filterModel.types = [];
    if (!this.filterModel.amenities) this.filterModel.amenities = [];
    
    // Load filter options
    this.loadSpaceTypes();
    this.loadAmenities();
  }
  
  loadSpaceTypes(): void {
    this.spaceService.getSpaceTypes().subscribe({
      next: (types) => {
        this.spaceTypes = types;
      },
      error: (err) => {
        console.error('Failed to load space types', err);
      }
    });
  }
  
  loadAmenities(): void {
    this.spaceService.getAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
      },
      error: (err) => {
        console.error('Failed to load amenities', err);
      }
    });
  }
  
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }
  
  toggleAdvancedFilter(): void {
    this.isAdvancedFilterOpen = !this.isAdvancedFilterOpen;
  }
  
  toggleSpaceType(typeId: string): void {
    const index = this.filterModel.types?.indexOf(typeId as unknown as SpaceType) ?? -1;
    
    if (index === -1) {
      // Add type
      this.filterModel.types?.push(typeId as unknown as SpaceType);
    } else {
      // Remove type
      this.filterModel.types?.splice(index, 1);
    }
  }
  
  toggleAmenity(amenityId: string): void {
    const index = this.filterModel.amenities?.indexOf(amenityId) ?? -1;
    
    if (index === -1) {
      // Add amenity
      this.filterModel.amenities?.push(amenityId);
    } else {
      // Remove amenity
      this.filterModel.amenities?.splice(index, 1);
    }
  }
  
  isSpaceTypeSelected(typeId: string): boolean {
    return this.filterModel.types?.includes(typeId as unknown as SpaceType) ?? false;
  }
  
  isAmenitySelected(amenityId: string): boolean {
    return this.filterModel.amenities?.includes(amenityId) ?? false;
  }
  
  applyFilter(): void {
    this.filterChange.emit(this.filterModel);
    if (this.windowObj.innerWidth < 768) {
      this.isFilterOpen = false;
    }
  }
  
  resetFilter(): void {
    this.filterModel = {
      search: '',
      priceMin: undefined,
      priceMax: undefined,
      capacityMin: undefined,
      types: [],
      amenities: []
    };
    
    this.filterChange.emit(this.filterModel);
  }
  
  onSearchInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.filterModel.search = searchQuery;
  }
}