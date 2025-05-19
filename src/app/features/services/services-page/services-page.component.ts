import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LoadingComponent,
  BreadcrumbsComponent
} from '../../../shared/components';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { TestimonialCardComponent } from '../../../shared/components';
import { RoomService } from '../../../core/services/room.service';
import { ReservationCtaComponent } from "../../../shared/components/reservation-cta/reservation-cta.component";

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingComponent,
    BreadcrumbsComponent,
    ServiceCardComponent,
    TestimonialCardComponent,
    ReservationCtaComponent
],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent implements OnInit {
  isLoading: boolean = true;
  services: any[] = [];
  featuredServices: any[] = [];
  servicesByCategory: { [key: string]: any[] } = {};
  serviceTypes: { label: string, value: string }[] = [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Piscine & Spa', value: 'pool' },
    { label: 'Salles de Conférence', value: 'conference' },
    { label: 'Salles de Réunion', value: 'meeting' },
    { label: 'Événements', value: 'event' },
    { label: 'Autres Services', value: 'other' }
  ];

  activeCategory: string = 'all';

  // Breadcrumbs definition
  breadcrumbs = [
    { label: 'Services', path: null }
  ];

  // Testimonials
  testimonials = [
    {
      name: 'Jean Roland',
      rating: 4.8,
      comment: 'J\'ai organisé une conférence professionnelle au REX HOTEL et tout était parfait ! L\'équipement de la salle était moderne et l\'équipe technique très réactive.',
      date: new Date('2025-03-15')
    },
    {
      name: 'Marie Kouassi',
      rating: 5,
      comment: 'Le restaurant de l\'hôtel propose une cuisine raffinée avec des saveurs locales. Le service est impeccable et la vue depuis la terrasse est magnifique.',
      date: new Date('2025-04-02')
    },
    {
      name: 'Pierre Assalé',
      rating: 4.7,
      comment: 'J\'ai particulièrement apprécié la piscine et l\'espace détente. L\'environnement est calme et propice à la relaxation après une journée de travail.',
      date: new Date('2025-02-18')
    }
  ];

  // Hero section images
  heroImages = [
    'assets/images/services/service-hero-1.jpg',
    'assets/images/services/service-hero-2.jpg',
    'assets/images/services/service-hero-3.jpg'
  ];

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;

    this.roomService.getAllHotelServices().subscribe({
      next: (services) => {
        this.services = services;
        this.featuredServices = services.filter(service =>
          ['restaurant', 'pool', 'conference'].includes(service.type)
        ).slice(0, 3);

        // Group services by type
        this.groupServicesByCategory(services);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.isLoading = false;
      }
    });
  }

  groupServicesByCategory(services: any[]): void {
    this.servicesByCategory = {};

    // Initialize categories
    this.serviceTypes.forEach(type => {
      this.servicesByCategory[type.value] = [];
    });

    // Add an 'other' category for services that don't match predefined types
    this.servicesByCategory['other'] = [];

    // Group services by type
    services.forEach(service => {
      if (this.servicesByCategory[service.type]) {
        this.servicesByCategory[service.type].push(service);
      } else {
        this.servicesByCategory['other'].push(service);
      }
    });
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  getServicesByActiveCategory(): any[] {
    if (this.activeCategory === 'all') {
      return this.services;
    }

    return this.servicesByCategory[this.activeCategory] || [];
  }

  getCategoryLabel(category: string): string {
    const found = this.serviceTypes.find(type => type.value === category);
    return found ? found.label : 'Autres Services';
  }
}