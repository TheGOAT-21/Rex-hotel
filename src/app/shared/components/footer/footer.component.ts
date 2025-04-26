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
  
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.hotelSettings$.subscribe(settings => {
      this.hotelSettings = settings;
    });
  }
}