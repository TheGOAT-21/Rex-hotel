import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceService } from '../../../core/services/space.service';
import { Space, SpaceFilter } from '../../../core/models';
import { SpaceCardComponent } from '../room-card/room-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadingComponent } from '../loading/loading.component';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, SpaceCardComponent, PaginationComponent, LoadingComponent, FilterComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class SpaceListComponent implements OnInit {
  @Input() title: string = 'Nos espaces';
  @Input() showFilter: boolean = true;
  @Input() initialFilter: SpaceFilter = {};
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() itemsPerPage: number = 6;
  
  @Output() filterChange = new EventEmitter<SpaceFilter>();
  
  spaces: Space[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  totalItems: number = 0;
  currentPage: number = 1;
  
  currentFilter: SpaceFilter = {};
  
  constructor(private spaceService: SpaceService) {}
  
  ngOnInit(): void {
    this.currentFilter = { ...this.initialFilter };
    this.loadSpaces();
  }
  
  loadSpaces(): void {
    this.loading = true;
    this.error = null;
    
    const filter: SpaceFilter = {
      ...this.currentFilter,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    this.spaceService.getAllSpaces(filter).subscribe({
      next: (result) => {
        this.spaces = result.items;
        this.totalItems = result.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger les espaces. Veuillez réessayer.";
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSpaces();
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  onFilterChange(filter: SpaceFilter): void {
    this.currentFilter = { ...filter };
    this.currentPage = 1; // Reset to first page
    this.loadSpaces();
    this.filterChange.emit(this.currentFilter);
  }
  
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
  
  resetFilters(): void {
    this.currentFilter = {};
    this.currentPage = 1;
    this.loadSpaces();
    this.filterChange.emit(this.currentFilter);
  }
}