import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../../../core/models/room.model';
import { PriceDisplayComponent } from '../../../../shared/components/price-display/price-display.component';
import { AmenityBadgeComponent } from '../../../../shared/components/amenity-badge/amenity-badge.component';

@Component({
  selector: 'app-selected-room-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AmenityBadgeComponent
  ],
  templateUrl: './selected-room-summary.component.html',
  styleUrl: './selected-room-summary.component.css'
})
export class SelectedRoomSummaryComponent implements OnInit {
  @Input() room!: Room;
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() guestCount: number = 1;
  @Input() showDetailLink: boolean = false;
  @Input() showReservationButton: boolean = false;
  @Input() showPriceDetails: boolean = true;
  @Input() showAmenities: boolean = true;
  
  numberOfNights: number = 1;
  totalPrice: number = 0;
  taxAmount: number = 0;
  selectedAmenities: any[] = [];
  
  // Taux de taxe (pourrait être récupéré depuis un service de configuration)
  taxRate: number = 18; // 18%
  
  ngOnInit(): void {
    // Vérifier si la chambre est définie
    if (!this.room) {
      console.error('Room object is required for SelectedRoomSummaryComponent');
      return;
    }
    
    // Calculer le nombre de nuits
    this.calculateNumberOfNights();
    
    // Calculer le prix total
    this.calculatePrices();
    
    // Sélectionner quelques équipements importants à afficher
    this.selectImportantAmenities();
  }
  
  // Calculer le nombre de nuits
  calculateNumberOfNights(): void {
    if (this.startDate && this.endDate) {
      const timeDiff = this.endDate.getTime() - this.startDate.getTime();
      this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      this.numberOfNights = 1;
    }
  }
  
  // Calculer le prix total et les taxes
  calculatePrices(): void {
    const basePrice = this.room.discountedPrice || this.room.price;
    this.totalPrice = basePrice * this.numberOfNights;
    this.taxAmount = this.totalPrice * (this.taxRate / 100);
  }
  
  // Sélectionner jusqu'à 3 équipements importants à afficher
  selectImportantAmenities(): void {
    if (this.room.amenities && this.room.amenities.length > 0) {
      // Définir l'ordre de priorité des équipements
      const priorityAmenities = ['wifi', 'breakfast', 'ac', 'parking', 'pool', 'restaurant'];
      
      // Filtrer les équipements par priorité
      const sortedAmenities = [...this.room.amenities].sort((a, b) => {
        const indexA = priorityAmenities.indexOf(a.id);
        const indexB = priorityAmenities.indexOf(b.id);
        
        // Si les deux équipements ne sont pas dans la liste de priorité, garder l'ordre d'origine
        if (indexA === -1 && indexB === -1) return 0;
        
        // Si a n'est pas dans la liste mais b l'est, b a la priorité
        if (indexA === -1) return 1;
        
        // Si b n'est pas dans la liste mais a l'est, a a la priorité
        if (indexB === -1) return -1;
        
        // Trier par ordre de priorité
        return indexA - indexB;
      });
      
      // Prendre les 3 premiers équipements
      this.selectedAmenities = sortedAmenities.slice(0, 3);
    }
  }
  
  // Formatter le prix
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  // Formatter la date
  formatDate(date: Date | null): string {
    if (!date) return 'Non spécifiée';
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
  
  // Obtenir le libellé du type de chambre
  getRoomTypeLabel(type: string): string {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}