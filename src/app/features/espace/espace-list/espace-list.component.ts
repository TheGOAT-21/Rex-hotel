// src/app/features/espace/espace-list/espace-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  SpaceListComponent, 
  BreadcrumbsComponent,
  FilterComponent,
  LoadingComponent
} from '../../../shared/components';
import { Space, SpaceFilter } from '../../../core/models';
import { EspaceService } from '../../../core/services/espace.service';

@Component({
  selector: 'app-espace-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpaceListComponent,
    BreadcrumbsComponent,
    FilterComponent,
    LoadingComponent
  ],
  templateUrl: './espace-list.component.html',
  styleUrl: './espace-list.component.css'
})
export class EspaceListComponent implements OnInit {
  spaces: Space[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Filtres actuels
  currentFilter: SpaceFilter = {};
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;
  
  constructor(private espaceService: EspaceService) {}
  
  ngOnInit(): void {
    // Récupérer les paramètres de l'URL si nécessaire
    this.loadEspaces();
  }
  
  loadEspaces(): void {
    this.isLoading = true;
    this.error = null;
    
    const filter: SpaceFilter = {
      ...this.currentFilter,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    this.espaceService.getAllSpaces(filter).subscribe({
      next: (result) => {
        this.spaces = result.items;
        this.totalItems = result.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement des espaces.";
        this.isLoading = false;
        console.error('Erreur lors du chargement des espaces:', err);
      }
    });
  }
  
  onFilterChange(filter: SpaceFilter): void {
    this.currentFilter = filter;
    this.currentPage = 1; // Réinitialiser à la première page
    this.loadEspaces();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEspaces();
    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}