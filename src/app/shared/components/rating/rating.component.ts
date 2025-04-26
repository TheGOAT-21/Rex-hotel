import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() readonly: boolean = true;
  @Input() showValue: boolean = false;
  @Input() showReviewCount: boolean = false;
  @Input() reviewCount: number = 0;
  @Input() color: string = '';
  @Input() emptyColor: string = '';
  @Input() ratingText: string = '';
  
  @Output() ratingChange = new EventEmitter<number>();
  
  stars: any[] = [];
  hoverIndex: number = -1;
  
  ngOnInit(): void {
    this.generateStars();
  }
  
  generateStars(): void {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => ({
      index: i,
      value: i + 1,
      filled: i < Math.floor(this.rating),
      half: Math.floor(this.rating) === i && this.rating % 1 >= 0.5
    }));
  }
  
  onStarClick(index: number): void {
    if (this.readonly) return;
    
    // If already selected, toggle off
    const newRating = this.rating === index + 1 ? index : index + 1;
    this.rating = newRating;
    this.generateStars();
    this.ratingChange.emit(newRating);
  }
  
  onStarHover(index: number): void {
    if (this.readonly) return;
    this.hoverIndex = index;
  }
  
  onStarLeave(): void {
    this.hoverIndex = -1;
  }
  
  isStarActive(index: number): boolean {
    if (this.hoverIndex >= 0) {
      return index <= this.hoverIndex;
    }
    return false;
  }
  
  getRatingText(): string {
    if (this.ratingText) return this.ratingText;
    
    if (this.rating >= 4.5) return 'Exceptionnel';
    if (this.rating >= 4) return 'Excellent';
    if (this.rating >= 3.5) return 'Très bien';
    if (this.rating >= 3) return 'Bien';
    if (this.rating >= 2) return 'Moyen';
    return 'À améliorer';
  }
  
  formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
  }
}