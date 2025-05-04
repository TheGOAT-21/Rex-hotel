import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SpaceListComponent, BreadcrumbsComponent } from '../../../shared/components';
import { SpaceFilter } from '../../../core/models';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    SpaceListComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css'
})
export class CatalogPageComponent implements OnInit {
  initialFilter: SpaceFilter = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer les filtres depuis les données de route si disponibles
    this.route.data.subscribe(data => {
      if (data['filter']) {
        this.initialFilter = data['filter'];
      }
    });
  }

  onFilterChange(filter: SpaceFilter): void {
    // Gérer les changements de filtre si nécessaire
    console.log('Filter changed:', filter);
  }
}