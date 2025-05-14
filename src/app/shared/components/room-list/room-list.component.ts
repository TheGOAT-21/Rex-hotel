import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  RoomCardComponent, 
  PaginationComponent,
  LoadingComponent 
} from '../';
import { RoomService } from '../../../core/services/room.service';
import { Room, RoomFilter, Amenity } from '../../../core/models';
import { ROOM_TYPES, AMENITIES, VIEW_OPTIONS } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RoomCardComponent,
    PaginationComponent,
    LoadingComponent
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit {
  @Input() title: string = '';
  @Input() showFilter: boolean = false;
  @Input() initialFilter: RoomFilter = {};
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() itemsPerPage: number = 6;
  
  @Output() filterChange = new EventEmitter<RoomFilter>();
  
  rooms: Room[] = [];
  totalRooms: number = 0;
  currentPage: number = 1;
  
  isLoading: boolean = false;
  error: string | null = null;
  
  showAdvancedFilters: boolean = false;
  
  // Filtres
  filter: RoomFilter = {
    page: 1,
    limit: this.itemsPerPage
  };
  
  // Options pour les filtres
  roomTypes = ROOM_TYPES;
  amenities = AMENITIES;
  viewOptions = VIEW_OPTIONS;
  
  constructor(private roomService: RoomService) {}
  
  ngOnInit(): void {
    // Initialiser les filtres
    this.filter = {
      ...this.filter,
      ...this.initialFilter,
      page: 1,
      limit: this.itemsPerPage
    };
    
    // Charger les chambres
    this.loadRooms();
  }
  
  loadRooms(): void {
    this.isLoading = true;
    this.error = null;
    
    this.roomService.getAllRooms(this.filter).subscribe({
      next: (result) => {
        this.rooms = result.items;
        this.totalRooms = result.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.error = "Une erreur est survenue lors du chargement des chambres.";
        this.isLoading = false;
      }
    });
  }
  
  applyFilter(): void {
    this.currentPage = 1;
    this.filter.page = 1;
    this.loadRooms();
    this.filterChange.emit(this.filter);
  }
  
  resetFilters(): void {
    this.filter = {
      page: 1,
      limit: this.itemsPerPage
    };
    this.loadRooms();
    this.filterChange.emit(this.filter);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.filter.page = page;
    this.loadRooms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }
  
  toggleAmenity(amenityId: string): void {
    if (!this.filter.amenities) {
      this.filter.amenities = [amenityId];
    } else {
      const index = this.filter.amenities.indexOf(amenityId);
      if (index === -1) {
        this.filter.amenities.push(amenityId);
      } else {
        this.filter.amenities.splice(index, 1);
      }
      
      // Si la liste est vide, supprimer la propriété
      if (this.filter.amenities.length === 0) {
        delete this.filter.amenities;
      }
    }
    
    this.applyFilter();
  }
  
  isAmenitySelected(amenityId: string): boolean {
    return this.filter.amenities?.includes(amenityId) || false;
  }
  
  toggleView(viewId: string): void {
    if (!this.filter.views) {
      this.filter.views = [viewId];
    } else {
      const index = this.filter.views.indexOf(viewId);
      if (index === -1) {
        this.filter.views.push(viewId);
      } else {
        this.filter.views.splice(index, 1);
      }
      
      // Si la liste est vide, supprimer la propriété
      if (this.filter.views.length === 0) {
        delete this.filter.views;
      }
    }
    
    this.applyFilter();
  }
  
  isViewSelected(viewId: string): boolean {
    return this.filter.views?.includes(viewId) || false;
  }
  
  toggleBalcony(): void {
    if (this.filter.hasBalcony === true) {
      delete this.filter.hasBalcony;
    } else {
      this.filter.hasBalcony = true;
    }
    
    this.applyFilter();
  }
}