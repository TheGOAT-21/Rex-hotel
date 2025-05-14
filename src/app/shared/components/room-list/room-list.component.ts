import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../core/services/room.service'; // Importation corrigée
import { Room, RoomFilter } from '../../../core/models'; // Importation corrigée
import { RoomCardComponent } from '../room-card/room-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadingComponent } from '../loading/loading.component';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RoomCardComponent, PaginationComponent, LoadingComponent, FilterComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit {
  @Input() title: string = 'Nos chambres'; // Modifié de 'Nos espaces'
  @Input() showFilter: boolean = true;
  @Input() initialFilter: RoomFilter = {}; // Modifié de SpaceFilter
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() itemsPerPage: number = 6;
  
  @Output() filterChange = new EventEmitter<RoomFilter>(); // Modifié de SpaceFilter
  
  rooms: Room[] = []; // Modifié de spaces
  loading: boolean = true;
  error: string | null = null;
  
  totalItems: number = 0;
  currentPage: number = 1;
  
  currentFilter: RoomFilter = {}; // Modifié de SpaceFilter
  
  constructor(private roomService: RoomService) {} // Modifié de spaceService
  
  ngOnInit(): void {
    this.currentFilter = { ...this.initialFilter };
    this.loadRooms(); // Modifié de loadSpaces
  }
  
  loadRooms(): void { // Modifié de loadSpaces
    this.loading = true;
    this.error = null;
    
    const filter: RoomFilter = { // Modifié de SpaceFilter
      ...this.currentFilter,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    this.roomService.getAllRooms(filter).subscribe({ // Modifié de spaceService.getAllSpaces
      next: (result: {items: Room[], total: number}) => { // Type explicite ajouté
        this.rooms = result.items; // Modifié de spaces
        this.totalItems = result.total;
        this.loading = false;
      },
      error: (err: any) => { // Type explicite ajouté
        this.error = "Impossible de charger les chambres. Veuillez réessayer."; // Modifié de "espaces"
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRooms(); // Modifié de loadSpaces
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  onFilterChange(filter: RoomFilter): void { // Modifié de SpaceFilter
    this.currentFilter = { ...filter };
    this.currentPage = 1; // Reset to first page
    this.loadRooms(); // Modifié de loadSpaces
    this.filterChange.emit(this.currentFilter);
  }
  
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
  
  resetFilters(): void {
    this.currentFilter = {};
    this.currentPage = 1;
    this.loadRooms(); // Modifié de loadSpaces
    this.filterChange.emit(this.currentFilter);
  }
}