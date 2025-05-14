import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../../core/services/settings.service';
import { HotelSettings } from '../../../core/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  hotelSettings: HotelSettings | null = null;
  currentYear = new Date().getFullYear();
  
  // État des sections de l'accordéon
  expandedSections: { [key: string]: boolean } = {
    links: false,
    services: false
  };
  
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.hotelSettings$.subscribe(settings => {
      this.hotelSettings = settings;
    });
  }
  
  /**
   * Bascule l'état d'expansion d'une section d'accordéon
   */
  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
}