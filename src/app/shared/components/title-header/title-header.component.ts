import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-header.component.html',
  styleUrl: './title-header.component.css'
})
export class TitleHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() level: 'h1' | 'h2' | 'h3' | 'h4' = 'h1';
  @Input() color: 'gold' | 'white' | 'beige' | 'black' = 'gold';
  @Input() alignment: 'left' | 'center' | 'right' = 'left';
  @Input() uppercase: boolean = false;
  @Input() tracking: 'normal' | 'wide' | 'wider' | 'widest' = 'normal';
  @Input() weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'bold';
  @Input() withDecoration: boolean = false;
  @Input() withAnimation: boolean = false;
  @Input() marginBottom: 'none' | 'small' | 'medium' | 'large' = 'medium';

  // Computed class bindings
  get titleClasses(): string {
    const classes = [
      // Text color
      this.getColorClass(),
      // Text alignment
      this.alignment === 'center' ? 'text-center' : '',
      this.alignment === 'right' ? 'text-right' : '',
      // Font weight
      this.weight === 'normal' ? 'font-normal' : '',
      this.weight === 'medium' ? 'font-medium' : '',
      this.weight === 'semibold' ? 'font-semibold' : '',
      this.weight === 'bold' ? 'font-bold' : '',
      // Text transform
      this.uppercase ? 'uppercase' : '',
      // Letter spacing
      this.tracking === 'wide' ? 'tracking-wide' : '',
      this.tracking === 'wider' ? 'tracking-wider' : '',
      this.tracking === 'widest' ? 'tracking-widest' : '',
      // Margin bottom
      this.marginBottom === 'none' ? 'mb-0' : '',
      this.marginBottom === 'small' ? 'mb-2' : '',
      this.marginBottom === 'medium' ? 'mb-4' : '',
      this.marginBottom === 'large' ? 'mb-6' : '',
      // Animation
      this.withAnimation ? 'animated-title' : ''
    ];

    return classes.filter(cls => cls).join(' ');
  }

  get subtitleClasses(): string {
    const classes = [
      // Default subtitle styling
      'mt-2',
      // Text color - subtitle uses a complementary color to the title
      this.getComplementaryColorClass(),
      // Text alignment follows the title
      this.alignment === 'center' ? 'text-center' : '',
      this.alignment === 'right' ? 'text-right' : '',
      // Font weight for subtitle is typically lighter
      'font-medium',
      // Animation
      this.withAnimation ? 'animated-subtitle' : ''
    ];

    return classes.filter(cls => cls).join(' ');
  }

  get decorationClasses(): string {
    if (!this.withDecoration) return '';
    
    const classes = [
      'relative pb-4 mb-2',
      this.alignment === 'center' ? 'decoration-center' : '',
      this.alignment === 'right' ? 'decoration-right' : ''
    ];
    
    return classes.filter(cls => cls).join(' ');
  }

  get decorationLineClasses(): string {
    if (!this.withDecoration) return '';
    
    const classes = [
      'absolute bottom-0 h-0.5 bg-gold w-20',
      this.alignment === 'center' ? 'left-1/2 -translate-x-1/2' : '',
      this.alignment === 'right' ? 'right-0' : 'left-0'
    ];
    
    return classes.filter(cls => cls).join(' ');
  }

  getHeadingClass(): string {
    switch (this.level) {
      case 'h1': return 'text-4xl md:text-5xl leading-tight';
      case 'h2': return 'text-3xl md:text-4xl leading-tight';
      case 'h3': return 'text-2xl md:text-3xl leading-tight';
      case 'h4': return 'text-xl md:text-2xl leading-tight';
      default: return 'text-4xl md:text-5xl leading-tight';
    }
  }

  private getColorClass(): string {
    switch (this.color) {
      case 'gold': return 'text-gold';
      case 'white': return 'text-white';
      case 'beige': return 'text-beige';
      case 'black': return 'text-black';
      default: return 'text-gold';
    }
  }

  private getComplementaryColorClass(): string {
    // Provide a complementary color to the title
    switch (this.color) {
      case 'gold': return 'text-white';
      case 'white': return 'text-gold';
      case 'beige': return 'text-gold';
      case 'black': return 'text-gold';
      default: return 'text-white';
    }
  }
}