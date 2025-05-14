import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomFilter, RoomType, Amenity } from '../../../core/models';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Input() currentFilter: RoomFilter = {};
  @Output() filterChange = new EventEmitter<RoomFilter>();
  
  isFilterOpen: boolean = false;
  isAdvancedFilterOpen: boolean = false;
  
  // Filter model for two-way binding
  filterModel: RoomFilter = {};
  
  // Options for filter dropdowns
  roomTypes: { id: string; name: string }[] = [];
  amenities: { id: string; name: string; icon: string }[] = [];
  viewOptions: { id: string; name: string }[] = []; // Nouveau
  bedTypes: { id: string; name: string }[] = []; // Nouveau
  
  // Price range
  minPrice: number = 0;
  maxPrice: number = 1000;
  
  // Room capacity
  minCapacity: number = 1;
  maxCapacity: number = 8;
  
  // Make window accessible in template
  get windowObj(): Window {
    return window;
  }
  
  constructor(private roomService: RoomService) {}
  
  ngOnInit(): void {
    // Clone the input filter to avoid direct reference
    this.filterModel = { ...this.currentFilter };
    
    // Initialize arrays if they don't exist
    if (!this.filterModel.types) this.filterModel.types = [];
    if (!this.filterModel.amenities) this.filterModel.amenities = [];
    if (!this.filterModel.views) this.filterModel.views = []; // Nouveau
    if (!this.filterModel.bedTypes) this.filterModel.bedTypes = []; // Nouveau
    
    // Load filter options
    this.loadRoomTypes();
    this.loadAmenities();
    this.loadViewOptions(); // Nouveau
    this.loadBedTypes(); // Nouveau
    
    // Determine if advanced filter should be open based on existing filters
    if ((this.filterModel.views && this.filterModel.views.length > 0) ||
        (this.filterModel.bedTypes && this.filterModel.bedTypes.length > 0) ||
        this.filterModel.floor !== undefined ||
        this.filterModel.hasBalcony !== undefined) {
      this.isAdvancedFilterOpen = true;
    }
  }
  
  loadRoomTypes(): void {
    this.roomService.getRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types;
      },
      error: (err) => {
        console.error('Failed to load room types', err);
      }
    });
  }
  
  loadAmenities(): void {
    this.roomService.getAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
      },
      error: (err) => {
        console.error('Failed to load amenities', err);
      }
    });
  }
  
  // Nouveau: Chargement des options de vue
  loadViewOptions(): void {
    this.viewOptions = [
      { id: 'sea', name: 'Vue mer' },
      { id: 'garden', name: 'Vue jardin' },
      { id: 'city', name: 'Vue ville' },
      { id: 'pool', name: 'Vue piscine' },
      { id: 'courtyard', name: 'Vue cour intérieure' }
    ];
  }
  
  // Nouveau: Chargement des types de lit
  loadBedTypes(): void {
    this.bedTypes = [
      { id: 'king', name: 'Lit King Size' },
      { id: 'queen', name: 'Lit Queen Size' },
      { id: 'double', name: 'Lit Double' },
      { id: 'twin', name: 'Lits Jumeaux' },
      { id: 'single', name: 'Lit Simple' }
    ];
  }
  
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }
  
  toggleAdvancedFilter(): void {
    this.isAdvancedFilterOpen = !this.isAdvancedFilterOpen;
  }
  
  toggleRoomType(typeId: string): void {
    const index = this.filterModel.types?.indexOf(typeId as unknown as RoomType) ?? -1;
    
    if (index === -1) {
      // Add type
      this.filterModel.types?.push(typeId as unknown as RoomType);
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
  
  // Nouveau: Basculer l'option de vue
  toggleView(viewId: string): void {
    const index = this.filterModel.views?.indexOf(viewId) ?? -1;
    
    if (index === -1) {
      // Add view
      this.filterModel.views?.push(viewId);
    } else {
      // Remove view
      this.filterModel.views?.splice(index, 1);
    }
  }
  
  // Nouveau: Basculer le type de lit
  toggleBedType(bedTypeId: string): void {
    const index = this.filterModel.bedTypes?.indexOf(bedTypeId) ?? -1;
    
    if (index === -1) {
      // Add bed type
      this.filterModel.bedTypes?.push(bedTypeId);
    } else {
      // Remove bed type
      this.filterModel.bedTypes?.splice(index, 1);
    }
  }
  
  // Nouveau: Basculer l'option de balcon
  toggleBalcony(hasBalcony: boolean | null): void {
    this.filterModel.hasBalcony = this.filterModel.hasBalcony === hasBalcony ? undefined : hasBalcony;
  }
  
  isRoomTypeSelected(typeId: string): boolean {
    return this.filterModel.types?.includes(typeId as unknown as RoomType) ?? false;
  }
  
  isAmenitySelected(amenityId: string): boolean {
    return this.filterModel.amenities?.includes(amenityId) ?? false;
  }
  
  // Nouveau: Vérifier si l'option de vue est sélectionnée
  isViewSelected(viewId: string): boolean {
    return this.filterModel.views?.includes(viewId) ?? false;
  }
  
  // Nouveau: Vérifier si le type de lit est sélectionné
  isBedTypeSelected(bedTypeId: string): boolean {
    return this.filterModel.bedTypes?.includes(bedTypeId) ?? false;
  }
  
  // Nouveau: Vérifier si une option de balcon est sélectionnée
  isBalconyOptionSelected(hasBalcony: boolean | null): boolean {
    return this.filterModel.hasBalcony === hasBalcony;
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
      amenities: [],
      views: [], // Nouveau
      bedTypes: [], // Nouveau
      hasBalcony: undefined, // Nouveau
      floor: undefined // Nouveau
    };
    
    this.filterChange.emit(this.filterModel);
  }
  
  onSearchInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.filterModel.search = searchQuery;
  }
  
  // Nouveau: Définir l'étage
  setFloor(floor: number | null): void {
    this.filterModel.floor = floor;
  }
  
  // Nouveau: Obtenir le texte pour l'option de balcon
  getBalconyText(option: boolean | null): string {
    switch (option) {
      case true: return 'Avec balcon';
      case false: return 'Sans balcon';
      default: return 'Indifférent';
    }
  }
}