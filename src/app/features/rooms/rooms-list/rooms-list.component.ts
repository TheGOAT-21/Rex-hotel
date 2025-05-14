import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoomListComponent, BreadcrumbsComponent } from '../../../shared/components';
import { RoomFilter } from '../../../core/models';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    CommonModule,
    RoomListComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  initialFilter: RoomFilter = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer les filtres depuis les données de route si disponibles
    this.route.data.subscribe(data => {
      if (data['filter']) {
        this.initialFilter = data['filter'];
      }
    });
  }

  onFilterChange(filter: RoomFilter): void {
    // Gérer les changements de filtre si nécessaire
    console.log('Filter changed:', filter);
  }
}