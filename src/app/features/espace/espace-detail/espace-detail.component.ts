import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { 
  GalleryComponent, 
  PriceDisplayComponent,
  RatingComponent,
  AmenityBadgeComponent,
  BreadcrumbsComponent,
  DatepickerComponent,
  LoadingComponent
} from '../../../shared/components';
import { Space, SpaceAvailability } from '../../../core/models';
import { SpaceService } from '../../../core/services/space.service';

@Component({
  selector: 'app-espace-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GalleryComponent,
    PriceDisplayComponent,
    AmenityBadgeComponent,
    BreadcrumbsComponent,
    DatepickerComponent,
    LoadingComponent
  ],
  templateUrl: './espace-detail.component.html',
  styleUrl: './espace-detail.component.css'
})
export class EspaceDetailComponent implements OnInit {
  espace: Space | null = null;
  isLoading = true;
  error: string | null = null;
  
  // Pour la réservation
  startDate: Date | null = null;
  endDate: Date | null = null;
  guestCount = 1;
  
  // Disponibilité
  availability: SpaceAvailability | null = null;
  checkingAvailability = false;
  
  // Pour les avis
  averageRating: number = 4.5; // Exemple de note moyenne
  reviewCount: number = 12; // Exemple de nombre d'avis
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spaceService: SpaceService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadEspaceDetails(id);
      } else {
        this.error = "Identifiant de l'espace non trouvé.";
        this.isLoading = false;
      }
    });
    
    // Initialiser les dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.startDate = tomorrow;
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    this.endDate = dayAfter;
  }
  
  loadEspaceDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.spaceService.getSpaceById(id).subscribe({
      next: (space) => {
        this.espace = space;
        this.isLoading = false;
        this.checkAvailability();
      },
      error: (err) => {
        this.error = "Une erreur est survenue lors du chargement des détails de l'espace.";
        this.isLoading = false;
        console.error('Erreur lors du chargement des détails:', err);
      }
    });
  }
  
  checkAvailability(): void {
    if (!this.espace || !this.startDate || !this.endDate) return;
    
    this.checkingAvailability = true;
    
    this.spaceService.checkAvailability(this.espace.id!, this.startDate, this.endDate).subscribe({
      next: (availability) => {
        this.availability = availability;
        this.checkingAvailability = false;
      },
      error: (err) => {
        console.error('Erreur lors de la vérification de disponibilité:', err);
        this.checkingAvailability = false;
        this.availability = null;
      }
    });
  }
  
  onDateRangeSelected(range: {start: Date, end: Date | null}): void {
    this.startDate = range.start;
    if (range.end) {
      this.endDate = range.end;
      this.checkAvailability();
    }
  }
  
  updateGuestCount(event: Event): void {
    this.guestCount = parseInt((event.target as HTMLSelectElement).value);
  }
  
  proceedToReservation(): void {
    if (!this.espace || !this.startDate || !this.endDate) return;
    
    this.router.navigate(['/reservation/create', this.espace.id], {
      queryParams: {
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString(),
        guests: this.guestCount
      }
    });
  }
  
  // Méthodes d'affichage
  getSpaceTypeLabel(type: string): string {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  getNights(): number {
    if (!this.startDate || !this.endDate) return 1;
    
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  calculateTotalPrice(): number {
    if (!this.espace) return 0;
    return this.espace.price * this.getNights();
  }
}