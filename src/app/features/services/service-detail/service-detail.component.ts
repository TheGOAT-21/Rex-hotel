import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ReservationCtaComponent } from '../../../shared/components/reservation-cta/reservation-cta.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faClock, 
  faUsers, 
  faCheck, 
  faArrowLeft, 
  faUtensils, 
  faSwimmingPool, 
  faDoorOpen, 
  faBuilding,
  faCalendarAlt,
  faCar,
  faChild,
  faMountain,
  faHotel
} from '@fortawesome/free-solid-svg-icons';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbsComponent,
    GalleryComponent,
    ServiceCardComponent,
    LoadingComponent,
    ReservationCtaComponent,
    FontAwesomeModule
  ],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  serviceId: string = '';
  service: any = null;
  relatedServices: any[] = [];
  isLoading: boolean = true;
  breadcrumbs = [
    { label: 'Accueil', path: '/' },
    { label: 'Services', path: '/services' },
    { label: '', path: null }
  ];
  
  // Font Awesome icons
  faClock = faClock;
  faUsers = faUsers;
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  faUtensils = faUtensils;
  faSwimmingPool = faSwimmingPool;
  faMeetingRoom = faDoorOpen;
  faBuilding = faBuilding;
  faCalendarAlt = faCalendarAlt;
  faCar = faCar;
  faChild = faChild;
  faMountain = faMountain;
  faHotel = faHotel;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.serviceId = id;
        this.loadServiceDetails(id);
      } else {
        this.router.navigate(['/services']);
      }
    });
  }

  loadServiceDetails(id: string): void {
    this.isLoading = true;
    
    this.roomService.getHotelServiceById(id).subscribe({
      next: (service) => {
        this.service = service;
        this.breadcrumbs[2].label = service.name;
        this.loadRelatedServices(service.type);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading service details:', err);
        this.isLoading = false;
        this.router.navigate(['/services']);
      }
    });
  }

  loadRelatedServices(serviceType: string): void {
    this.roomService.getHotelServicesByType(serviceType).subscribe({
      next: (services) => {
        // Filter out the current service and limit to 3 related services
        this.relatedServices = services
          .filter(service => service.id !== this.serviceId)
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading related services:', err);
      }
    });
  }

  getServiceTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'restaurant': 'Restaurant',
      'pool': 'Piscine',
      'conference': 'Salle de conférence',
      'meeting': 'Salle de réunion',
      'event': 'Espace événementiel',
      'parking': 'Parking',
      'childcare': 'Espace enfant',
      'terrace': 'Terrasse',
    };
    
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }
}