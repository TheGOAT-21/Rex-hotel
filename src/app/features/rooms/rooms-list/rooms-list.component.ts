// src/app/features/rooms/rooms-list/rooms-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importations directes des composants partagés
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { RoomCardComponent } from '../../../shared/components/room-card/room-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';

// Services et modèles
import { RoomService } from '../../../core/services/room.service';
import { Room, RoomFilter } from '../../../core/models';
import { ROOM_TYPES, AMENITIES, VIEW_OPTIONS } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BreadcrumbsComponent,
    RoomCardComponent,
    PaginationComponent,
    LoadingComponent,
    FilterComponent
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  // Données
  rooms: Room[] = [];
  totalRooms: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  viewMode: 'grid' | 'list' = 'grid';
  
  // États
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
  
  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Récupérer les filtres depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.filter = this.convertParamsToFilter(params);
      }
      
      // Charger les chambres avec les filtres
      this.loadRooms();
    });
  }
  
  convertParamsToFilter(params: any): RoomFilter {
    const filter: RoomFilter = {
      page: params.page ? +params.page : 1,
      limit: this.itemsPerPage
    };
    
    if (params.search) filter.search = params.search;
    if (params.types) filter.types = params.types.split(',');
    if (params.priceMax) filter.priceMax = +params.priceMax;
    if (params.capacityMin) filter.capacityMin = +params.capacityMin;
    if (params.amenities) filter.amenities = params.amenities.split(',');
    if (params.views) filter.views = params.views.split(',');
    if (params.hasBalcony === 'true') filter.hasBalcony = true;
    
    return filter;
  }
  
  convertFilterToParams(filter: RoomFilter): any {
    const params: any = {};
    
    if (filter.search) params.search = filter.search;
    if (filter.types && filter.types.length > 0) params.types = filter.types.join(',');
    if (filter.priceMax) params.priceMax = filter.priceMax;
    if (filter.capacityMin) params.capacityMin = filter.capacityMin;
    if (filter.amenities && filter.amenities.length > 0) params.amenities = filter.amenities.join(',');
    if (filter.views && filter.views.length > 0) params.views = filter.views.join(',');
    if (filter.hasBalcony) params.hasBalcony = 'true';
    if (filter.page && filter.page > 1) params.page = filter.page;
    
    return params;
  }
  
  loadRooms(): void {
    this.isLoading = true;
    this.error = null;
    
    this.roomService.getAllRooms(this.filter).subscribe({
      next: (result) => {
        this.rooms = result.items;
        this.totalRooms = result.total;
        this.currentPage = this.filter.page || 1;
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
    this.filter.page = 1;
    this.updateUrlParams();
    this.loadRooms();
  }
  
  resetFilters(): void {
    this.filter = {
      page: 1,
      limit: this.itemsPerPage
    };
    this.updateUrlParams();
    this.loadRooms();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.filter.page = page;
    this.updateUrlParams();
    this.loadRooms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  updateUrlParams(): void {
    // Mettre à jour l'URL avec les paramètres actuels
    const params = this.convertFilterToParams(this.filter);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }
  
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }
  
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
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

  // Nouveau - Ajout d'une méthode pour gérer le changement de filtre
  onFilterChange(newFilter: RoomFilter): void {
    this.filter = newFilter;
    this.updateUrlParams();
    this.loadRooms();
  }
}