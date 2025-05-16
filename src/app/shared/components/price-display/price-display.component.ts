import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-display.component.html',
  styleUrl: './price-display.component.css'
})
export class PriceDisplayComponent implements OnInit {
  @Input() price: number = 0;
  @Input() currency: string = 'FCFA';
  @Input() periodicity: 'night' | 'day' | 'hour' | 'person' | 'none' = 'night';
  @Input() isDiscounted: boolean = false;
  @Input() originalPrice?: number;
  @Input() discountPercentage?: number;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showLabel: boolean = false;
  @Input() customLabel?: string;
  
  calculatedDiscount: number = 0;
  priceDisplay: string = '';
  
  ngOnInit() {
    this.calculateDisplayValues();
  }
  
  calculateDisplayValues() {
    // Format price for display
    this.priceDisplay = this.formatPrice(this.price);
    
    // Calculate discount if needed
    if (this.isDiscounted && this.originalPrice) {
      this.calculatedDiscount = Math.round(
        ((this.originalPrice - this.price) / this.originalPrice) * 100
      );
    } else if (this.discountPercentage) {
      this.calculatedDiscount = this.discountPercentage;
      
      if (!this.originalPrice) {
        // Calculate original price from discount percentage
        this.originalPrice = Math.round(
          this.price / (1 - this.discountPercentage / 100)
        );
      }
    }
  }
  
  formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  getPeriodLabel(): string {
    switch (this.periodicity) {
      case 'night':
        return '/ nuit';
      case 'day':
        return '/ jour';
      case 'hour':
        return '/ heure';
      case 'person':
        return '/ pers.';
      default:
        return '';
    }
  }
  
  getDisplayLabel(): string {
    if (this.customLabel) {
      return this.customLabel;
    }
    
    switch (this.periodicity) {
      case 'night':
        return 'par nuit';
      case 'day':
        return 'par jour';
      case 'hour':
        return 'par heure';
      case 'person':
        return 'par personne';
      default:
        return '';
    }
  }
}