import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomFilter, RoomType, Amenity } from '../../../core/models';
import { RoomService } from '../../../core/services/room.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faFilter, faSearch, faBed, faWifi, 
  faChevronDown, faChevronUp, faMountain, 
  faBuilding, faMoneyBillWave, faUsers, 
  faCheck, faTimes, faDoorOpen
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Input() currentFilter: RoomFilter = {};
  @Output() filterChange = new EventEmitter<RoomFilter>();
  
  isFilterOpen: boolean = false;
  isAdvancedFilterOpen: boolean = false;
  
  // Font Awesome icons
  faFilter = faFilter;
  faSearch = faSearch;
  faBed = faBed;
  faWifi = faWifi;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faMountain = faMountain;
  faBuilding = faBuilding;
  faMoneyBillWave = faMoneyBillWave;
  faUsers = faUsers;
  faCheck = faCheck;
  faTimes = faTimes;
  faBalcony = faDoorOpen;
  
  // Filter model for two-way binding
  filterModel: RoomFilter = {};
  
  // Options for filter dropdowns
  roomTypes: { id: string; name: string }[] = [];
  amenities: { id: string; name: string; icon: string }[] = [];
  viewOptions: { id: string; name: string }[] = [];
  bedTypes: { id: string; name: string }[] = [];
  
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
    if (!this.filterModel.views) this.filterModel.views = [];
    if (!this.filterModel.bedTypes) this.filterModel.bedTypes = [];
    
    // Load filter options
    this.loadRoomTypes();
    this.loadAmenities();
    this.loadViewOptions();
    this.loadBedTypes();
    
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
      next: (types: { id: string; name: string }[]) => {
        this.roomTypes = types;
      },
      error: (err: any) => {
        console.error('Failed to load room types', err);
      }
    });
  }
  
  loadAmenities(): void {
    this.roomService.getAmenities().subscribe({
      next: (amenities: Amenity[]) => {
        this.amenities = amenities;
      },
      error: (err: any) => {
        console.error('Failed to load amenities', err);
      }
    });
  }
  
  loadViewOptions(): void {
    this.viewOptions = [
      { id: 'sea', name: 'Vue mer' },
      { id: 'garden', name: 'Vue jardin' },
      { id: 'city', name: 'Vue ville' },
      { id: 'pool', name: 'Vue piscine' },
      { id: 'courtyard', name: 'Vue cour intérieure' }
    ];
  }
  
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
  
  toggleBalcony(hasBalcony: boolean | null): void {
    this.filterModel.hasBalcony = hasBalcony === null ? undefined : hasBalcony;
  }
  
  isRoomTypeSelected(typeId: string): boolean {
    return this.filterModel.types?.includes(typeId as unknown as RoomType) ?? false;
  }
  
  isAmenitySelected(amenityId: string): boolean {
    return this.filterModel.amenities?.includes(amenityId) ?? false;
  }
  
  isViewSelected(viewId: string): boolean {
    return this.filterModel.views?.includes(viewId) ?? false;
  }
  
  isBedTypeSelected(bedTypeId: string): boolean {
    return this.filterModel.bedTypes?.includes(bedTypeId) ?? false;
  }
  
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
      views: [],
      bedTypes: [],
      hasBalcony: undefined,
      floor: undefined
    };
    
    this.filterChange.emit(this.filterModel);
  }
  
  onSearchInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.filterModel.search = searchQuery;
  }
  
  setFloor(floor: number | null): void {
    this.filterModel.floor = floor === null ? undefined : floor;
  }
  
  getBalconyText(option: boolean | null): string {
    switch (option) {
      case true: return 'Avec balcon';
      case false: return 'Sans balcon';
      default: return 'Indifférent';
    }
  }
}