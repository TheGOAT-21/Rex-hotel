import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUtensils, faSwimmingPool, faBuildingColumns, 
  faBriefcase, faCalendarDays, faCar, faChildren, 
  faMountain, faPlus, faClock, faUsers, faCheck,
  faArrowRight, faSpa, faWifi, faParking, faGlassMartini,
  faHotel, faConciergeBell, faDumbbell, faBed
} from '@fortawesome/free-solid-svg-icons';

interface HotelService {
  id: string;
  name: string;
  type: string;
  description: string;
  openingHours?: string;
  capacity?: number;
  images: string[];
  features: string[];
}

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent implements OnInit {
  @Input() service!: HotelService;
  @Input() showDetails: boolean = true;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  
  // Font Awesome icons
  faUtensils = faUtensils;
  faSwimmingPool = faSwimmingPool;
  faBuildingColumns = faBuildingColumns;
  faBriefcase = faBriefcase;
  faCalendarDays = faCalendarDays;
  faCar = faCar;
  faChildren = faChildren;
  faMountain = faMountain;
  faPlus = faPlus;
  faClock = faClock;
  faUsers = faUsers;
  faCheck = faCheck;
  faArrowRight = faArrowRight;
  faSpa = faSpa;
  faWifi = faWifi;
  faParking = faParking;
  faGlassMartini = faGlassMartini;
  faHotel = faHotel;
  faConciergeBell = faConciergeBell;
  faDumbbell = faDumbbell;
  faBed = faBed;
  
  constructor() { }

  ngOnInit(): void {
    // Validation des inputs
    if (!this.service) {
      console.error('Service object is required for ServiceCardComponent');
    }
  }
  
  /**
   * Retourne l'icône Font Awesome associée au type de service
   * Mise à jour avec des icônes plus élégantes et complètes pour un hôtel de luxe
   */
  getServiceIcon() {
    const iconMap: { [key: string]: any } = {
      'restaurant': this.faUtensils,
      'pool': this.faSwimmingPool,
      'conference': this.faBuildingColumns,
      'meeting': this.faBriefcase,
      'event': this.faCalendarDays,
      'parking': this.faParking,
      'childcare': this.faChildren,
      'terrace': this.faMountain,
      'spa': this.faSpa,
      'wifi': this.faWifi,
      'bar': this.faGlassMartini,
      'concierge': this.faConciergeBell,
      'gym': this.faDumbbell,
      'room_service': this.faHotel,
      'accommodation': this.faBed
    };
    
    return iconMap[this.service.type.toLowerCase()] || this.faConciergeBell;
  }
  
  /**
   * Retourne l'image principale du service
   */
  getMainImage(): string {
    return this.service.images && this.service.images.length > 0 
      ? this.service.images[0] 
      : 'assets/images/placeholder.jpg';
  }
}