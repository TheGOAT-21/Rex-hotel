// src/app/shared/components/testimonial-card/testimonial-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';
import { Testimonial } from '../../../core/models';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [
    CommonModule,
    RatingComponent
  ],
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.css'
})
export class TestimonialCardComponent {
  @Input() testimonial!: Testimonial;
  @Input() variant: 'default' | 'compact' | 'featured' = 'default';
}