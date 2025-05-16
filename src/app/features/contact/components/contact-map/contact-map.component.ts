import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-map.component.html',
  styleUrl: './contact-map.component.css'
})
export class ContactMapComponent {
  @Input() width: string = '100%';
  @Input() height: string = '450px';
  @Input() showAddress: boolean = true;
  
  mapUrl: SafeResourceUrl;
  
  constructor(private sanitizer: DomSanitizer) {
    // Sécuriser l'URL de l'iframe pour éviter les problèmes XSS
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d67234.36314088832!2d-5.272812452520444!3d6.774239264717914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb8973447dfb0f7%3A0x3183f2cbe8b45c7c!2sH%C3%B4tel%20Pr%C3%A9sident%20Yamoussoukro!5e0!3m2!1sfr!2sci!4v1747322589633!5m2!1sfr!2sci'
    );
  }
  
  getHotelAddress(): string[] {
    return [
      'Hôtel Rex',
      'Boulevard Houphouët-Boigny',
      'Yamoussoukro, Côte d\'Ivoire'
    ];
  }
}