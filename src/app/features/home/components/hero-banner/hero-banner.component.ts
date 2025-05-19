import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent {
  @Input() title = 'REX HOTEL';
  @Input() subtitle = '';
  @Input() tagline = 'ÉLÉGANCE & CONFORT';
  @Input() imageUrl = '';
  @Input() primaryButtonText = '';
  @Input() primaryButtonLink = '';
  @Input() secondaryButtonText = '';
  @Input() secondaryButtonLink = '';
  @Input() fullHeight = true;
  @Input() showScrollIndicator = true;
  
  scrollDown() {
    // Smooth scroll to the next section
    const heroHeight = document.querySelector('.hero-section')?.clientHeight || 0;
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  }
}