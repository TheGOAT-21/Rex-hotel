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
      // Text color for subtitle (text-gray-300 for contact page style)
      'text-gray-300',
      // Font size for subtitle
      'text-lg',
      // Text alignment follows the title
      this.alignment === 'center' ? 'text-center' : '',
      this.alignment === 'right' ? 'text-right' : '',
      // Animation
      this.withAnimation ? 'animated-subtitle' : ''
    ];

    return classes.filter(cls => cls).join(' ');
  }

  getHeadingClass(): string {
    switch (this.level) {
      case 'h1': return 'text-3xl font-bold';
      case 'h2': return 'text-2xl font-semibold';
      case 'h3': return 'text-xl font-medium';
      case 'h4': return 'text-lg font-medium';
      default: return 'text-3xl font-bold';
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
}