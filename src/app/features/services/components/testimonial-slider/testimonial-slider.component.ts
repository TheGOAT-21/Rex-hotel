import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight, 
  faQuoteLeft,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { RatingComponent
  
 } from '../../../../shared/components';
export interface Testimonial {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  date: Date;
  photo?: string;
  position?: string;
}

@Component({
  selector: 'app-testimonial-slider',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RatingComponent
  ],
  templateUrl: './testimonial-slider.component.html',
  styleUrl: './testimonial-slider.component.css'
})
export class TestimonialSliderComponent implements OnInit, OnDestroy {
  @Input() testimonials: Testimonial[] = [];
  @Input() autoPlay: boolean = true;
  @Input() autoPlayInterval: number = 5000;
  @Input() showControls: boolean = true;
  @Input() showDots: boolean = true;
  @Input() maxDisplayed: number = 3;
  @Input() display: 'cards' | 'carousel' = 'carousel';
  @Input() animationSpeed: number = 500; // milliseconds
  
  // Font Awesome icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faQuoteLeft = faQuoteLeft;
  faUser = faUser;
  
  currentIndex: number = 0;
  displayedTestimonials: Testimonial[] = [];
  autoPlayTimer: any = null;
  isAnimating: boolean = false;
  
  constructor() {}
  
  ngOnInit(): void {
    if (this.testimonials.length === 0) {
      console.warn('No testimonials provided to TestimonialSliderComponent.');
    }
    
    this.updateDisplayedTestimonials();
    
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  ngOnDestroy(): void {
    this.stopAutoPlay();
  }
  
  startAutoPlay(): void {
    this.stopAutoPlay(); // Clear any existing timer
    this.autoPlayTimer = setInterval(() => {
      this.next();
    }, this.autoPlayInterval);
  }
  
  stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  updateDisplayedTestimonials(): void {
    if (this.display === 'carousel') {
      // For carousel mode, just show the current testimonial
      this.displayedTestimonials = [this.testimonials[this.currentIndex]];
    } else {
      // For cards mode, show multiple testimonials
      const startIdx = this.currentIndex;
      this.displayedTestimonials = [];
      
      for (let i = 0; i < this.maxDisplayed; i++) {
        const idx = (startIdx + i) % this.testimonials.length;
        this.displayedTestimonials.push(this.testimonials[idx]);
      }
    }
  }
  
  prev(): void {
    if (this.isAnimating || this.testimonials.length <= 1) return;
    
    this.isAnimating = true;
    this.stopAutoPlay();
    
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.updateDisplayedTestimonials();
    
    setTimeout(() => {
      this.isAnimating = false;
      if (this.autoPlay) {
        this.startAutoPlay();
      }
    }, this.animationSpeed);
  }
  
  next(): void {
    if (this.isAnimating || this.testimonials.length <= 1) return;
    
    this.isAnimating = true;
    this.stopAutoPlay();
    
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.updateDisplayedTestimonials();
    
    setTimeout(() => {
      this.isAnimating = false;
      if (this.autoPlay) {
        this.startAutoPlay();
      }
    }, this.animationSpeed);
  }
  
  goToSlide(index: number): void {
    if (this.isAnimating || index === this.currentIndex || index < 0 || index >= this.testimonials.length) return;
    
    this.isAnimating = true;
    this.stopAutoPlay();
    
    this.currentIndex = index;
    this.updateDisplayedTestimonials();
    
    setTimeout(() => {
      this.isAnimating = false;
      if (this.autoPlay) {
        this.startAutoPlay();
      }
    }, this.animationSpeed);
  }
  
  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }
  
  resumeAutoPlay(): void {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }
}